import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, Content, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListingPage } from '../../listings/listing/listing';
import { ProfileViewPage, ProfileViewFakePage } from '../../profile/';
import { Listing, Message, User } from '../../../interface';
import { Chats } from '../../../interface/message/chats.interface';
import { UserProvider } from '../../../providers';
import { AppSettings } from '../../../app/app.constants';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  key: string;
  messageInput: string = '';
  user: User;
  message: Message;
  listing$: Observable<Listing>;
  receiver$: Observable<User>
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  private messageDoc: AngularFirestoreDocument<Message>;
  private listingDoc: AngularFirestoreDocument<Listing>;
  @ViewChild('file') file: ElementRef;
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') chatInput: ElementRef;
  constructor(private afs: AngularFirestore,
    private userProvider: UserProvider,
    private alert: AlertController,
    private navParams: NavParams,
    private nav: NavController,
    private camera: Camera,
    private platform: Platform,
    private http: HttpClient) { }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  viewProfile(key: string): void {
    this.nav.push(ProfileViewPage, { key });
  }

  viewProfileFake(key: string): void {
    this.nav.push(ProfileViewFakePage, { key });
  }

  onFocus() {
    this.content.resize();
    this.scrollToBottom();
  }

  sendMessage(receiver: User, image?: string): void {
    const headers = new HttpHeaders().set('id', this.key);
    if (!this.messageInput.trim() && _.isUndefined(image)) return;
    let message = {
      created: moment().toDate(),
      sender: this.user.$key
    } as Chats;
    if (image) {
      message.image = image;
    } else {
      message.message = this.messageInput;
    }
    if (this.message && this.message.chats) {
      this.message.read[receiver.$key] = false
      this.message.modified = moment().toDate();
      this.message.chats.push(message);
      this.messageDoc.update(this.message).then(() => {
        this.http.post('https://v2.homora.com/api/mail/notify', null, { headers }).subscribe();
        if (_.isUndefined(image)) this.messageInput = '';
        this.scrollToBottom();
      });
    } else {
      const messageObj: Message = {
        $key: this.key,
        chats: [message],
        created: moment().toDate(),
        listing: this.listingDoc.ref as DocumentReference,
        modified: moment().toDate(),
        read: {
          [this.user.$key]: true,
          [receiver.$key]: false
        },
        users: {
          [this.user.$key]: true,
          [receiver.$key]: true
        }
      };
      this.messageDoc.set(messageObj).then(() => {
        this.http.post('https://v2.homora.com/api/mail/notify', null, { headers }).subscribe();
        if (_.isUndefined(image)) this.messageInput = '';
        this.scrollToBottom();
      });
    }
  }

  resize(): void {
    this.chatInput.nativeElement.style.height = 'auto';
    this.chatInput.nativeElement.style.height = `${this.chatInput.nativeElement.scrollHeight}px`;
  }

  onFileChange(event: any, receiver: User) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.sendMessage(receiver, `data:${file.type};base64,${reader.result.split(',')[1]}`);
      };
    }
  }

  addImage(receiver: User) {
    this.alert.create({
      title: 'Take Picture',
      message: 'Take a new photo or select one from your existing photo library.',
      buttons: [{
        text: 'Gallery',
        handler: () => this.openCamera('gallery', receiver)
      }, {
        text: 'Camera',
        handler: () => this.openCamera('camera', receiver)
      }]
    }).present();
  }

  convertToDate(date: any): Date {
    return (!_.isDate(date)) ? date.toDate() : date;
  }

  private openCamera(type: string, receiver: User): void {
    this.platform.ready().then(() => {
      this.camera.getPicture({
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000,
        sourceType: type === 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: type === 'camera',
        encodingType: this.camera.EncodingType.JPEG
      } as CameraOptions).then((image) => {
        this.sendMessage(receiver, `data:image/jpeg;base64,${image}`);
      }, (err) => {
        if (err === 'cordova_not_available') {
          this.file.nativeElement.click();
        }
      });
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      try {
        if (this.content && this.content.scrollToBottom) {
          this.content.scrollToBottom();
        }
      } catch (e) { }
    }, 400)
  }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    if (this.key) {
      this.user = this.userProvider.get();
      this.messageDoc = this.afs.doc<Message>(`Messages/${this.key}`);
      this.messageDoc.snapshotChanges().pipe(map((action: any) => {
        const data = action.payload.data();
        let userRef: string;
        let listingRef: string;
        if (action.payload.exists) {
          userRef = _.findKey(data.users, (o, key) => this.user.$key !== key);
          listingRef = data.listing.path;
        } else {
          userRef = this.navParams.get('createdBy');
          listingRef = `Listings/${this.navParams.get('listing')}`;
        }
        this.receiver$ = this.afs.doc<User>(`Users/${userRef}`).valueChanges();
        this.listingDoc = this.afs.doc<Listing>(listingRef);
        this.listing$ = this.listingDoc.valueChanges();
        this.content.resize();
        return data;
      })).subscribe((message) => {
        this.message = message;
        if (this.message && this.message.read && !this.message.read[this.user.$key]) {
          this.message.read[this.user.$key] = true;
          this.messageDoc.update(this.message);
        }
        this.scrollToBottom();
      });
    }
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, Content, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs/Observable';
import { ListingPage } from '../../listings/listing/listing';
import { ProfileViewPage } from '../../profile/view/profile-view';
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
  receiver: User;
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
    private platform: Platform) { }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  viewProfile(key: string): void {
    this.nav.push(ProfileViewPage, { key });
  }

  onFocus() {
    this.content.resize();
    this.scrollToBottom();
  }

  sendMessage(image?: string): void {
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
    if (this.message.chats) {
      this.message.read[this.receiver.$key] = false
      this.message.modified = moment().toDate();
      this.message.chats.push(message);
      this.messageDoc.update(this.message).then(() => {
        if (_.isUndefined(image)) this.messageInput = '';
        this.scrollToBottom();
      });
    } else {
      const messageObj: Message = {
        chats: [message],
        created: moment().toDate(),
        listing: this.listingDoc.ref as DocumentReference,
        modified: moment().toDate(),
        read: {
          [this.user.$key]: true,
          [this.receiver.$key]: false
        },
        users: {
          [this.user.$key]: true,
          [this.receiver.$key]: true
        }
      };
      this.messageDoc.set(messageObj).then(() => {
        if (_.isUndefined(image)) this.messageInput = '';
        this.scrollToBottom();
      });
    }
  }

  resize(): void {
    this.chatInput.nativeElement.style.height = 'auto';
    this.chatInput.nativeElement.style.height = `${this.chatInput.nativeElement.scrollHeight}px`;
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.sendMessage(`data:${file.type};base64,${reader.result.split(',')[1]}`);
      };
    }
  }

  addImage() {
    this.alert.create({
      title: 'Take Picture',
      message: 'Take a new photo or select one from your existing photo library.',
      buttons: [{
        text: 'Gallery',
        handler: () => this.openCamera('gallery')
      }, {
        text: 'Camera',
        handler: () => this.openCamera('camera')
      }]
    }).present();
  }

  private openCamera(type: string): void {
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
        this.sendMessage(`data:image/jpeg;base64,${image}`);
      }, (err) => {
        if (err === 'cordova_not_available') {
          this.file.nativeElement.click();
        }
      });
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    this.resize();
    if (this.key) {
      this.user = this.userProvider.get();
      this.messageDoc = this.afs.doc<Message>(`Messages/${this.key}`);
      this.messageDoc.snapshotChanges().map((action: any) => {
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
        this.receiver$ = this.afs.doc<User>(`Users/${userRef}`).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        this.listingDoc = this.afs.doc<Listing>(listingRef);
        this.listing$ = this.listingDoc.snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        this.content.resize();
        this.receiver$.subscribe((receiver) => {
          this.receiver = receiver;
        });
        return ({ $key: action.payload.id, ...data });
      }).subscribe((message) => {
        this.message = message;
        if (!this.message.read[this.user.$key]) {
          this.message.read[this.user.$key] = true;
          this.messageDoc.update(this.message);
        }
        this.scrollToBottom();
      });
    }
  }
}

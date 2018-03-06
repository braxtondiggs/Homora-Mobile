import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models/';
import { isEmpty } from 'lodash';

@IonicPage({
  name: 'profileView',
  segment: 'profile/:key/:edit'
})
@Component({
  selector: 'page-profile-view',
  templateUrl: 'profile-view.html',
})
export class ProfileViewPage {
  key: string;
  edit: boolean;
  user$: Observable<User>;
  private userDoc: AngularFirestoreDocument<User>;
  constructor(private afs: AngularFirestore, private navParams: NavParams, private nav: NavController) { }

  canEditProfile(): boolean {
    console.log(!isEmpty(this.key), this.edit);
    return !isEmpty(this.key) && this.edit;
  }

  editProfile(): void {
    this.nav.push('editProfile');
  }

  ionViewCanEnter() {
    return !isEmpty(this.navParams.get('key'));
  }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    this.edit = this.navParams.get('edit');
    if (this.key) {
      this.userDoc = this.afs.doc<User>(`Users/${this.key}`);
      this.user$ = this.userDoc.snapshotChanges().map((action: any) => {
        return ({ $key: action.payload.id, ...action.payload.data() });
      });
    }
  }
}

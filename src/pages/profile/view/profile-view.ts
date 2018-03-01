import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models/';
import { isEmpty } from 'lodash';

@IonicPage({
  name: 'profileView',
  segment: 'profile/:key'
})
@Component({
  selector: 'page-profile-view',
  templateUrl: 'profile-view.html',
})
export class ProfileViewPage {
  key: string;
  user$: Observable<User>;
  private userDoc: AngularFirestoreDocument<User>;
  constructor(private afs: AngularFirestore, private navParams: NavParams) {
    this.key = this.navParams.get('key');
    if (this.key) {
      this.userDoc = this.afs.doc<User>(`Users/${this.key}`);
      this.user$ = this.userDoc.snapshotChanges().map((action: any) => {
        return ({ $key: action.payload.id, ...action.payload.data() });
      });
    }
  }

  ionViewCanEnter() {
    return !isEmpty(this.navParams.get('key'));
  }
}

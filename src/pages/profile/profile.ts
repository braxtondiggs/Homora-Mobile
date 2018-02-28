import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
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
}

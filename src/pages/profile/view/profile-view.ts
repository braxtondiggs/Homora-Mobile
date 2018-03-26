import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../interface';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { AppSettings } from '../../../app/app.constants';
import { isEmpty } from 'lodash';

@Component({
  selector: 'page-profile-view',
  templateUrl: 'profile-view.html',
})
export class ProfileViewPage {
  key: string;
  edit: boolean;
  user$: Observable<User>;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  private userDoc: AngularFirestoreDocument<User>;
  constructor(private afs: AngularFirestore, private navParams: NavParams, private nav: NavController) { }

  canEditProfile(): boolean {
    return !isEmpty(this.key) && this.edit;
  }

  editProfile(): void {
    this.nav.push(EditProfilePage);
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

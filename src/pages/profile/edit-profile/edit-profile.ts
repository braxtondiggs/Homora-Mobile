import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserProvider } from '../../../providers/user/user';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models';

@IonicPage({
  name: 'editProfile',
})
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  user$: Observable<User>;
  profileForm: FormGroup;
  constructor(private userProvider: UserProvider, private formBuilder: FormBuilder) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  editPhoto() { }

  ionViewDidLoad() {
    this.user$ = this.userProvider.get$();
  }
}

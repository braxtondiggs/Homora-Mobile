import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MomentModule } from 'angular2-moment';
import { ProfilePage } from './profile';

@NgModule({
  declarations: [
    ProfilePage
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(ProfilePage)
  ],
  entryComponents: [
    ProfilePage
  ]
})
export class ProfilePageModule { }

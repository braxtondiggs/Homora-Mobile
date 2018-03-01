import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MomentModule } from 'angular2-moment';
import { ProfileViewPage } from './profile-view';

@NgModule({
  declarations: [
    ProfileViewPage
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(ProfileViewPage)
  ],
  entryComponents: [
    ProfileViewPage
  ]
})
export class ProfileViewPageModule { }

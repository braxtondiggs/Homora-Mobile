import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfilePage } from './edit-profile';
import { Ionic2MaskDirective } from 'ionic2-mask-directive';

@NgModule({
  declarations: [
    EditProfilePage,
    Ionic2MaskDirective
  ],
  imports: [
    IonicPageModule.forChild(EditProfilePage),
  ],
})
export class EditProfilePageModule { }

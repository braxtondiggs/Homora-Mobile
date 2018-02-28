import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetPage } from './reset';

@NgModule({
  declarations: [
    ResetPage
  ],
  imports: [
    IonicPageModule.forChild(ResetPage)
  ],
  entryComponents: [
    ResetPage
  ]
})
export class ResetPageModule { }

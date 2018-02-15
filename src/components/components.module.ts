import { NgModule } from '@angular/core';
import { LoginModal } from './login/login';
import { MapsComponent } from './maps/maps';
import { IonicModule } from 'ionic-angular'

@NgModule({
  declarations: [
    LoginModal,
    MapsComponent
  ],
  imports: [IonicModule],
  entryComponents: [
    LoginModal,
    MapsComponent
  ]
})
export class ComponentsModule { }

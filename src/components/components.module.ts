import { NgModule } from '@angular/core';
import { LoginModal } from './login/login';
import { MapsComponent } from './maps/maps';
import { FilterComponent } from './filter/filter';
import { IonicModule } from 'ionic-angular'

@NgModule({
  declarations: [
    LoginModal,
    MapsComponent,
    FilterComponent
  ],
  imports: [IonicModule],
  entryComponents: [
    LoginModal,
    MapsComponent,
    FilterComponent
  ]
})
export class ComponentsModule { }

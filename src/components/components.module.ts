import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { MapsComponent } from './maps/maps';
import { FilterComponent } from './filter/filter';

@NgModule({
  declarations: [
    MapsComponent,
    FilterComponent
  ],
  imports: [IonicModule],
  entryComponents: [
    MapsComponent,
    FilterComponent
  ]
})
export class ComponentsModule { }

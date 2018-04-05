import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { MapsComponent } from './maps/maps';
import { ContentDrawer } from './maps/content-drawer/content-drawer';
import { FilterComponent } from './filter/filter';

@NgModule({
  declarations: [
    ContentDrawer,
    MapsComponent,
    FilterComponent
  ],
  imports: [IonicModule],
  entryComponents: [
    ContentDrawer,
    MapsComponent,
    FilterComponent
  ]
})
export class ComponentsModule { }

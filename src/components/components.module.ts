import { NgModule } from '@angular/core';
import { LoginModal } from './login/login';
import { IonicModule } from 'ionic-angular'

@NgModule({
  declarations: [LoginModal],
  imports: [IonicModule],
  entryComponents: [LoginModal]
})
export class ComponentsModule { }

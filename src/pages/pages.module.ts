import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AgmMarkerWithLabelModule } from '@ajqua/marker-with-label';
import { MomentModule } from 'ngx-moment';
import { IonicModule } from 'ionic-angular';
import { LazyLoadImageModule } from 'ng-lazyload-image/dist';
import { MainPage } from './main';
import { IntroPage } from './intro';
import { ListingsPage, ListingPage, ListingReadMore, ListerPage, NewListingPage } from './listings';
import { FavoritesPage } from './favorites';
import { ProfilePage, EditProfilePage, ProfileViewPage, ProfileViewFakePage } from './profile';
import { MessagesPage, MessagePage } from './messages';
import { AuthPage, SignupPage, LoginPage, ResetPage } from './auth';
import { SettingsPage, NotificationsPage } from './settings';
import { MessagePipe } from '../pipes';
import { environment } from '../app/app.environment';

@NgModule({
  imports: [
    IonicModule,
    MomentModule,
    LazyLoadImageModule,
    AgmCoreModule.forRoot({ apiKey: environment.googleAPI, libraries: ['geometry'] }),
    AgmMarkerWithLabelModule
  ],
  declarations: [
    MainPage,
    ListingsPage,
    FavoritesPage,
    IntroPage,
    ListingPage,
    ListingReadMore,
    ListerPage,
    NewListingPage,
    ProfilePage,
    EditProfilePage,
    ProfileViewPage,
    ProfileViewFakePage,
    MessagesPage,
    MessagePage,
    AuthPage,
    SignupPage,
    LoginPage,
    ResetPage,
    SettingsPage,
    NotificationsPage,
    MessagePipe
  ],
  entryComponents: [
    MainPage,
    ListingsPage,
    FavoritesPage,
    IntroPage,
    ListingPage,
    ListingReadMore,
    ListerPage,
    NewListingPage,
    ProfilePage,
    EditProfilePage,
    ProfileViewPage,
    ProfileViewFakePage,
    MessagesPage,
    MessagePage,
    AuthPage,
    SignupPage,
    LoginPage,
    ResetPage,
    SettingsPage,
    NotificationsPage
  ],
})
export class PagesModule { }

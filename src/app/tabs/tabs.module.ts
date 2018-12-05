import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { HomePageModule } from '../home/home.module';
import { FavoritesPageModule } from '../favorites/favorites.module';
import { MessagesPageModule } from '../messages/messages.module';
import { NewListingPageModule } from '../new-listing/new-listing.module';
import { ProfilePageModule } from '../profile/profile.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabsPageRoutingModule,
    HomePageModule,
    FavoritesPageModule,
    MessagesPageModule,
    NewListingPageModule,
    ProfilePageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }

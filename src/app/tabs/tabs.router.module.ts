import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from '../home/home.page';
import { FavoritesPage } from '../favorites/favorites.page';
import { MessagesPage } from '../messages/messages.page';
import { NewListingPage } from '../new-listing/new-listing.page';
import { ProfilePage } from '../profile/profile.page';

const routes: Routes = [{
  path: 'tabs',
  component: TabsPage,
  children: [{
    path: '',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full',
  }, {
    path: 'home',
    outlet: 'home',
    component: HomePage
  }, {
    path: 'favorites',
    outlet: 'favorites',
    component: FavoritesPage
  }, {
    path: 'messages',
    outlet: 'messages',
    component: MessagesPage
  }, {
    path: 'new-listing',
    outlet: 'new-listing',
    component: NewListingPage
  }, {
    path: 'profile',
    outlet: 'profile',
    component: ProfilePage
  }]
}, {
  path: '',
  redirectTo: '/tabs/(home:home)',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

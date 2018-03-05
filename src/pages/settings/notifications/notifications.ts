import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models';

@IonicPage({
  name: 'notifications',
  defaultHistory: ['profile']
})
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  user$: Observable<User>;
  constructor(private userProvider: UserProvider) { }

  save(user: User): void {
    this.userProvider.getDoc().update(user);
  }

  defaultCheckbox(): object {
    return {
      email: true,
      push: true,
      text: false
    }
  }

  ionViewDidLoad() {
    if (this.userProvider.getDoc()) {
      this.user$ = this.userProvider.getDoc().snapshotChanges().map((action: any) => {
        const data = action.payload.data();
        data.notifications = {
          messages: data.notifications && data.notifications.messages ? data.notifications.messages : this.defaultCheckbox(),
          policy: data.notifications && data.notifications.policy ? data.notifications.policy : this.defaultCheckbox()
        };
        return ({ $key: action.payload.id, ...data });
      });
    }
  }
}

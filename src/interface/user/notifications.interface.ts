export interface UserNotifications {
  messages: NotifcationOptions;
  policy: NotifcationOptions;
}

export interface NotifcationOptions {
  email: boolean;
  push: boolean;
  text: boolean;
}

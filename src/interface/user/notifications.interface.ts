export interface UserNotifications {
  messages?: NotifcationOptions;
  policy?: NotifcationOptions;
}

export interface NotifcationOptions {
  email?: boolean;
  phone?: boolean;
  text?: boolean;
}

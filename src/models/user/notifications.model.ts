export interface Notifications {
  messages?: NotifcationOptions;
  policy?: NotifcationOptions;
}

export interface NotifcationOptions {
  email?: boolean;
  phone?: boolean;
  text?: boolean;
}

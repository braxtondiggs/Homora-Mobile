import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../interface';
import * as firebase from 'firebase';

@Injectable()
export class UserProvider {
  userData: any;
  user: User;
  user$: Observable<User>;
  userDoc: AngularFirestoreDocument<User>;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  getAuth(): Observable<any> {
    return this.afAuth.authState;
  }

  setAuth(user: firebase.User): void {
    this.userData = user;
    if (user) this.set$(user);
  }

  getAuthData(): firebase.User {
    return this.userData;
  }

  set$(user: firebase.User): void {
    this.userDoc = this.afs.doc<User>(`Users/${user.uid}`);
    this.user$ = this.userDoc.snapshotChanges().pipe(map((action: any) => {
      return ({ $key: action.payload.id, ...action.payload.data() });
    }));
  }

  get$(): Observable<User> {
    return this.user$;
  }

  getDoc(): AngularFirestoreDocument<User> {
    return this.userDoc;
  }

  get(): User {
    return this.user;
  }

  set(user: User): void {
    this.user = user;
  }

  getAccountType(): string {
    return localStorage.getItem('account') ? localStorage.getItem('account') : 'basic';
  }
}

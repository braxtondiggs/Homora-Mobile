import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from '../../interface';

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

  setAuth(user: any): void {
    this.userData = user;
    if (user) this.set$(user);
  }

  getAuthData(): any {
    return this.userData;
  }

  set$(user: any): void {
    this.userDoc = this.afs.doc<User>(`Users/${user.uid}`);
    this.user$ = this.userDoc.snapshotChanges().map((action: any) => {
      return ({ $key: action.payload.id, ...action.payload.data() });
    });
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

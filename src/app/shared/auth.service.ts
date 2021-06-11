import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from './user';
import { auth } from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public urlSubject: BehaviorSubject<any> = new BehaviorSubject("");


  user: User;

  constructor(
    public router: Router,
    public ngZone: NgZone,
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.afAuth.authState.subscribe(user => {
      this.user = user;
    });
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public urlSubjectValue(val): any {
    this.urlSubject.next(val);
  }

  // Firebase SignInWithPopup
  OAuthProvider(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((res) => {
        return res;
        // this.ngZone.run(() => {
        //     this.router.navigate(['dashboard']);
        // })
      }).catch((error) => {
        return error;

        // window.alert(error)
      })
  }

  // Firebase Google Sign-in
  SigninWithGoogle() {
    return this.OAuthProvider(new auth.GoogleAuthProvider())
      .then(res => {
        // console.log('Successfully logged in!')
        let resObj: any;

        if (res.message) {
          resObj = {
            success: false,
            res: res
          }
        }
        else {
          resObj = {
            success: true,
            res: res
          }
          localStorage.setItem('currentUser', JSON.stringify(resObj.res));
          this.currentUserSubject.next(resObj.res);
        }

        return resObj;
      }).catch(error => {
        let errorObj = {
          success: false,
          res: error
        }
        return errorObj;
      });
  }

  // Firebase Logout 
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['login']);
    })
  }

  create_NewRecord(record) {
    return this.firestore.collection('CanvasTable').doc(record.Id).set(record);
  }

  fetchRecord(id) {
    return this.firestore.collection("CanvasTable").doc(id);
  }

  update_Record(recordID,record){
    return this.firestore.doc('CanvasTable/' + recordID).update(record);
  }
}

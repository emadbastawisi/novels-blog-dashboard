import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoggedInGuard: boolean = false;

  constructor(private afAuth: AngularFireAuth, private toastr: ToastrService, private router:Router) { }

  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password).then(() => {
      this.toastr.success("Login sucessfuly");
      this.loadUser();
      this.loggedIn.next(true);
      this.isLoggedInGuard = true;
      this.router.navigate(['']);
    }).catch(error => {
      this.toastr.warning(error.message);
    });
  }

  loadUser() {
     this.afAuth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.setItem('user', '');
      }
    }
    );
  }
  logout() {
    this.afAuth.signOut().then(() => {
      this.toastr.success("Logout sucessfuly");
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

}

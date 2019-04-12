import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./signup/authData.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment"

const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({providedIn: 'root'})
export class AuthService {
  private isAuth = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListner = new Subject<boolean>();

  constructor (private http: HttpClient, private router: Router) {}

  getToken () {
    return this.token;
  }
  getIsAuth () {
    return this.isAuth;
  }
  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  createUser (email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{message: string, result: any}>(BACKEND_URL + 'signup', authData)
      .subscribe((result) => this.router.navigate(['/']), err => {
        this.authStatusListner.next(false);
      });
  }

  login (email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{message: string, token: string, expiresIn: number, userId: string}>(BACKEND_URL + 'login', authData)
      .subscribe((result) => {
        const token = result.token;
        this.token = token;
        if (token) {
          this.isAuth = true;
          this.userId = result.userId;
          this.authStatusListner.next(true);
          const expiresInDuration = result.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.router.navigate(['/']);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
        }
      }, err => this.authStatusListner.next(false));
  }

getUserId() {
  return this.userId;
}

autoAuthUser() {
  const authInformation = this.getAuthData();
  if (!authInformation) {
    return;
  }
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  if (expiresIn > 0) {
    this.setAuthTimer(expiresIn/1000);
    this.token = authInformation.token;
    this.isAuth = true;
    this.userId = authInformation.userId;

    this.authStatusListner.next(true);
  }
}
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout () {
    this.token = null;
    this.isAuth = false;
    this.clearAuthData();
    this.authStatusListner.next(false);
    this.router.navigate(['/']);
    this.userId = null;
    clearTimeout(this.tokenTimer);
  }

  private saveAuthData (token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');

  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token && expirationDate) {
      return;
    } return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }
}

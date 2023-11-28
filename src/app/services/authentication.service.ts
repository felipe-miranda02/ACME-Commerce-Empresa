import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import {
  AuthResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UserForAuthenticationDto,
} from '../models/user.interface';
import { environment } from 'src/environments/environment';

const AUTH_PATH = `${environment.base_url}/accounts`;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  public loginUser(body: UserForAuthenticationDto) {
    return this.http.post<AuthResponseDto>(`${AUTH_PATH}/Login/Empresa`, body);
  }

  public forgotPassword(body: ForgotPasswordDto) {
    return this.http.post(`${AUTH_PATH}/ForgotPassword`, body);
  }

  public resetPassword(body: ResetPasswordDto) {
    return this.http.post(`${AUTH_PATH}/ResetPassword`, body);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');

    return !!(token && !this.jwtHelper.isTokenExpired(token));
  };

  public logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.sendAuthStateChangeNotification(false);
  }

  public getEmail() {
    return localStorage.getItem('email');
  }

  public getUserId() {
    const data = this.jwtHelper.decodeToken();
    return data.id;
  }
}

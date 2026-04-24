import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs'; // 1. Add this import

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loginStatusSubject = new Subject<boolean>();
  private baseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // 1. Call the backend API to generate the token
  public generateToken(loginData: any) {
    return this.http.post(`${this.baseUrl}/generate-token`, loginData);
  }

  // 2. Save token in local storage
  public loginUser(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      return true;
    }
    return false;
  }

  // 3. Check if user is logged in
  public isLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      let tokenStr = localStorage.getItem('token');
      if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
        return false;
      }
      return true;
    }
    return false;
  }

  // 4. Logout: remove token from local storage
  public logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    }
    return false;
  }

  // 5. Get the token
  public getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
  // Get current user details from the backend
  public getCurrentUser() {
    return this.http.get(`${this.baseUrl}/current-user`);
  }

  // Save user details to local storage
  public setUser(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Get user details from local storage
  public getUser() {
    if (isPlatformBrowser(this.platformId)) {
      let userStr = localStorage.getItem('user');
      if (userStr != null) {
        return JSON.parse(userStr);
      } else {
        this.logout();
        return null;
      }
    }
    return null;
  }

  // Get the user's role (e.g., ADMIN or NORMAL)
  public getUserRole() {
    let user = this.getUser();
    return user.authorities[0].authority;
  }
}
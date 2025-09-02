import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private loggedIn = false;

  login() { this.loggedIn = true; }
  logout() { this.loggedIn = false; }
  isLoggedIn() { return this.loggedIn; }
}
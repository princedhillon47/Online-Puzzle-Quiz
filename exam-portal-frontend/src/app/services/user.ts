import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // This will be your Spring Boot server URL
  private baseUrl = 'http://localhost:8080'; 

  constructor(private http: HttpClient) { }

  // Function to register a new user
  public addUser(user: any) {
    return this.http.post(`${this.baseUrl}/user`, user);
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private apiUrl = `${environment.apiUrl}/users`;

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.currentUserSubject.next(response);
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap((response) => {
        this.currentUserSubject.next(response);
      }),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  updateUserInformations(informationsData: {
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    activityLevel:
      | 'sedentary'
      | 'light'
      | 'moderate'
      | 'active'
      | 'very active';
    goal: 'lose' | 'gain' | 'maintain';
    dietType: string;
    excludes: string;
  }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, informationsData);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  initUserProfile(): Observable<User> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.getUserProfile().pipe(
        tap(() => console.log('User profile loaded')),
        catchError((error) => {
          console.error('Failed to load user profile', error);
          return of();
        })
      );
    } else {
      return of();
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

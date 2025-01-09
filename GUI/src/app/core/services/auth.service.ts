import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.development';
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

  updateUserGoal(goalData: {
    weight: number;
    height: number;
    goal: 'lose' | 'gain' | 'maintain';
  }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, goalData);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  initUserProfile(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.getUserProfile().subscribe({
        next: () => console.log('User profile loaded'),
        error: () => console.error('Failed to load user profile'),
      });
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

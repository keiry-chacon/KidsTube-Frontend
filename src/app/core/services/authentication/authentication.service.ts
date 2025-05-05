import { Injectable, inject } from '@angular/core';
import { GoogleAuthProvider, signInWithPopup, Auth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private auth: Auth = inject(Auth);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private authenticateWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  private extractUserInfo(user: any): {
    firstName: string;
    lastName: string;
    email: string;
    isGoogleAuth: boolean;
    language: string;
    password: string;
    status: string;
    pin: string | null;
    phoneNumber: string | null;
    dateOfBirth: Date | null;
    country: string | null;
  } {
    const displayName = user.displayName || '';
    const [firstName, lastName] = displayName.split(' ') || ['', ''];
    const email = user.email || '';
    const uid = user.uid;
  
    return {
      firstName,
      lastName,
      email,
      language: 'English',
      isGoogleAuth: true,
      password: uid,
      status: 'pending',
      pin: null,
      phoneNumber: null,
      dateOfBirth: null,
      country: null,
    };
  }


  private registerUser(userData: any): Observable<void> {
    Object.keys(userData).forEach(key => {
      if (userData[key] === null) {
        delete userData[key];
      }
    });
  
    return this.http.post(`${environment.apiUrl}/user`, userData).pipe(
      map(() => undefined),
      catchError((error) => {
        if ((error as any).status === 409) {
          return of(undefined);
        }
        throw error;
      })
    );
  }
  

  loginWithGoogle(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/login`, { username, password });
  }

  googleSignUp(): Observable<void> {
    return this.authenticateWithGoogle().pipe(
      switchMap((res) => {
        if (res.user) {
          const user = res.user;
          const userData = this.extractUserInfo(user);
          
          return this.registerUser(userData).pipe(
            switchMap(() => {
              // Después de registrar, hacemos login automáticamente
              return this.googleLogin();
            })
          );
        }
        throw new Error('No se pudo autenticar con Google');
      }),
      catchError((err) => {
        if (err.error?.message === 'Email is already in use.') {
          // Si el usuario ya existe, lo redirigimos al login
          return this.googleLogin();
        }
        console.error('Error en Google signup:', err);
        throw err;
      })
    );
  }



  googleLogin(): Observable<void> {
    return this.authenticateWithGoogle().pipe(
      switchMap((res) => {
        if (res.user) {
          return from(res.user.getIdToken()).pipe(
            switchMap((idToken) => {
              return this.http.post(`${environment.apiUrl}/user/google-login`, { idToken }).pipe(
                tap((response: any) => {
                  // Almacena el token y la información del usuario
                  sessionStorage.setItem('token', response.token);
                  sessionStorage.setItem('user', JSON.stringify(response.user));
                  
                  const isIncomplete = !response.user.phoneNumber || 
                                     !response.user.dateOfBirth || 
                                     !response.user.country || 
                                     !response.user.pin;
                  if (isIncomplete) {
                    this.router.navigate(['/complete-profile']);
                  } else {
                    this.router.navigate(['/profiles']);
                  }
                })
              );
            })
          );
        }
        throw new Error('No se pudo autenticar con Google');
      }),
      catchError((err) => {
        console.error('Error en Google login:', err);
        throw err;
      })
    );
  }
  
  
  
}

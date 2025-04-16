import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {}

  private async authenticateWithGoogle(): Promise<any> {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  private extractUserInfo(user: any): {
    user_type: string;
    first_name: string;
    last_name: string;
    email: string;
    isGoogleAuth: boolean;
    language: string;
    password: string;
  } {
    const displayName = user.displayName || '';
    const [firstName, lastName] = displayName.split(' ') || ['', ''];
    const email = user.email || '';
    const uid = user.uid;

    return {
      user_type: 'candidate',
      first_name: firstName,
      last_name: lastName,
      email: email,
      language: 'English',
      isGoogleAuth: true,
      password: uid, // usamos el UID como "contraseña" para login
    };
  }

  async googleSignUpOrLogin(): Promise<void> {
    try {
      // Paso 1: Login con Google
      const res = await this.authenticateWithGoogle();

      if (res.user) {
        const user = res.user;
        const userData = this.extractUserInfo(user);
        console.log('Datos de usuario extraídos:', userData);

        // Paso 2: Intentar registrar al usuario (solo si no existe)
        try {
          await this.registerUser(userData);
          console.log('Usuario registrado exitosamente');
        } catch (error) {
          if ((error as any).status !== 409) {
            throw error;
          } else {
            console.log('Usuario ya registrado, continuando con login...');
          }
        }

        // Paso 3: Iniciar sesión
        await this.loginWithGoogle(userData.email, userData.password).toPromise();
        console.log('Login exitoso');

        // Paso 4: Redirigir al dashboard
        this.router.navigate(['/profiles']);
      }
    } catch (err) {
      console.error('Error en Google sign-up/login:', err);
      alert('Error durante el inicio de sesión con Google');
    }
  }

  loginWithGoogle(username: string, password: string) {
    return this.http
      .post<any>(
        `${environment.apiUrl}/user/login`,
        { username, password },
        { headers: { skip: 'true' } }
      )
      .pipe(
        map((token) => {
          // Ya no guardamos el token
          return token;
        })
      );
  }

  private async registerUser(userData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.signup(userData).subscribe(
        () => resolve(),
        (error: any) => reject(error)
      );
    });
  }
}

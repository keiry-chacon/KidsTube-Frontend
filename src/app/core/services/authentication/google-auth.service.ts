import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  User
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {

  constructor(private router: Router) {}

  /**
   * Autentica al usuario con Google y devuelve los datos del usuario.
   */
  async authenticateWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(); // 🔥 Mover aquí el getAuth()
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('Google_Token', token);
        return user;
      }

      throw new Error('No user data available after Google authentication.');
    } catch (error) {
      console.error('Error during Google authentication:', error);
      throw error;
    }
  }

  /**
   * Extrae la información relevante del usuario de Google.
   */
  extractUserInfo(user: User): {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    status: string;
    phoneNumber?: string;
    pin?: string;
    country?: string;
  } {
    const displayName = user.displayName || '';
    const [firstName, lastName] = displayName.split(' ') || ['', ''];
    const email = user.email || '';
    const uid = user.uid;

    const defaultDateOfBirth = new Date('1990-01-01');
    const defaultStatus = 'active';
    const defaultPhoneNumber = '71591802';
    const defaultPin = '123456';
    const defaultCountry = 'Costa Rica';

    return {
      email: email,
      password: uid,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: defaultDateOfBirth,
      status: defaultStatus,
      phoneNumber: defaultPhoneNumber,
      pin: defaultPin,
      country: defaultCountry,
    };
  }

  /**
   * Redirige al usuario después de una autenticación exitosa.
   */
  redirectToDashboard(): void {
    this.router.navigate(['videoList']);
  }
}

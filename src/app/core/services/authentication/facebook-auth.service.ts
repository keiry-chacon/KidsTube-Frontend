import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacebookAuthService {
  constructor(private http: HttpClient) {}

  async authenticateWithFacebook(accessToken: string): Promise<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/v1/accounts/facebook-auth/`,
      { access_token: accessToken }
    ).toPromise();
  }

  extractUserInfo(profile: any): {
    user_type: string;
    first_name: string;
    last_name: string;
    email: string;
    isFacebookAuth: boolean;
    language: string;
    password: string;
  } {
    return {
      user_type: 'candidate',
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      language: 'English',
      isFacebookAuth: true,
      password: 'temp_password', // Cambiar contraseña después
    };
  }
}
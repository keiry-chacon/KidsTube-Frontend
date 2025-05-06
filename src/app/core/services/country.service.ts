import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {  
  constructor(private http: HttpClient) { }

  // Fetch the list of countries from the backend API
  getCountries(): Observable<string[]> {  
    return this.http.get<string[]>(`${environment.apiUrl}/countries`).pipe(
      catchError(error => {
        console.error('Error fetching countries:', error);
        throw error; // Re-throw the error after logging it
      })
    );
  }
}
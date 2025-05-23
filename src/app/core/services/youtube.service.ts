import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface YoutubeVideo {
  id: string;
  name: string;
  url: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
}

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {

  constructor(private http: HttpClient) {}

  // Retrieves the authentication token from session storage
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Generates authorization headers for authenticated requests
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Sends a GraphQL query to search YouTube videos based on a query string
  searchYouTubeVideos(queryStr: string): Observable<any> {
    const query = `
      query searchVideos($query: String!) {
        searchVideos(query: $query) {
          id
          name
          description
          url
          thumbnail
          channelTitle
        }
      }
    `;

    const requestBody = {
      query,
      variables: {
        query: queryStr
      }
    };

    return this.http.post<any>(`${environment.apiUrl2}`, requestBody, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data.searchVideos)
    );
  }

  // Sends a GraphQL query to retrieve popular YouTube videos
  getPopularVideos(): Observable<any> {
    const query = `
      query {
        popularVideos {
          id
          name
          description
          url
          thumbnail
          channelTitle
        }
      }
    `;

    const requestBody = {
      query,
    };

    return this.http.post<any>(`${environment.apiUrl2}`, requestBody, { headers: this.getAuthHeaders() }).pipe(
      map((response) => response.data.popularVideos)
    );
  }
}
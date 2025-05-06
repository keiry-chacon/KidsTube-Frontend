import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
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

  // Sends a POST request to create a new video
  createVideo(videoData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/video`, videoData, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve all videos
  getVideos(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/video`, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve a video by its ID
  getVideoById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/video/${id}`, { headers: this.getAuthHeaders() });
  }

  // Retrieves the user ID from session storage
  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  // Sends a GraphQL query to retrieve videos associated with the current user
  getVideosByUser(): Observable<any> {
    const query = `
      query GetVideosByUser {
        videosByUser {
          id
          name
          description
          url
          createdBy
        }
      }
    `;

    const requestBody = { query };

    return this.http.post<any>(`${environment.apiUrl2}`, requestBody, { headers: this.getAuthHeaders() }).pipe(
      map((response: any) => response.data.videosByUser)
    );
  }

  // Sends a GraphQL query to retrieve videos associated with a specific profile ID
  getVideosByProfileId(profileId: string): Observable<any[]> {
    const url = environment.apiUrl2;

    const graphqlQuery = {
      query: `
        query GetVideosByProfile($profileId: ID!) {
          videosByProfile(profileId: $profileId) {
            id
            name
            description
            url
          }
        }
      `,
      variables: {
        profileId
      }
    };

    return this.http.post(url, graphqlQuery, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((response: any) => response.data.VideosByProfile)
    );
  }

  // Sends a PUT request to update a video by its ID
  updateVideo(id: string, videoData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/video/${id}`, videoData, { headers: this.getAuthHeaders() });
  }

  // Sends a DELETE request to delete a video by its ID
  deleteVideo(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/video/${id}`, { headers: this.getAuthHeaders() });
  }
}
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  // Sends a PUT request to update a video by its ID
  updateVideo(id: string, videoData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/video/${id}`, videoData, { headers: this.getAuthHeaders() });
  }

  // Sends a DELETE request to delete a video by its ID
  deleteVideo(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/video/${id}`, { headers: this.getAuthHeaders() });
  }
}
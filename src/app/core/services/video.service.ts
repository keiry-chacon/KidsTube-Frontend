import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
 
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  createVideo(videoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/video`, videoData, { headers: this.getAuthHeaders() });
  }

  getVideos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/video`, { headers: this.getAuthHeaders() });
  }

  getVideoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/video/${id}`, { headers: this.getAuthHeaders() });
  }

  updateVideo(id: string, videoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/video/${id}`, videoData, { headers: this.getAuthHeaders() });
  }

  deleteVideo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/video/${id}`, { headers: this.getAuthHeaders() });
  }
}
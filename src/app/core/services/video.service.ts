import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createVideo(videoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/video`, videoData);
  }

  getVideos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/video`);
  }

  getVideoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/video/${id}`);
  }

  updateVideo(id: string, videoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/video/${id}`, videoData);
  }

  deleteVideo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/video/${id}`);
  }
}
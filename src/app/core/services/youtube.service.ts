import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
}

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiUrl = 'http://localhost:3000/api/youtube/';

  constructor(private http: HttpClient) {}

  searchYouTubeVideos(query: string): Observable<YoutubeVideo[]> {
    return this.http.get<YoutubeVideo[]>(`${this.apiUrl}/search`, { params: { q: query } });
  }

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

    return this.http.post<{ data: { popularVideos: YoutubeVideo[] } }>(this.apiUrl, {
      query: query
    });
  }
}
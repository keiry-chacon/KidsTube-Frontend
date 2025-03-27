import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-detail-video',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './detail-video.component.html',
  styleUrls: ['./detail-video.component.css']
})
export class DetailVideoComponent implements OnInit {
  video: any = {};
  videoId: string = '';

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.videoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.videoId) {
      this.loadVideo();
    }
  }

  loadVideo() {
    this.videoService.getVideoById(this.videoId).subscribe({
      next: (data) => {
        this.video = data;
      },
      error: (err) => {
        console.error('Error loading video:', err);
        alert('Failed to load video. Check the console for details.');
      }
    });
  }

  goBack() {
    window.history.back();
  }



  navigateToVideoList(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/videoList']);
  }

  navigateToListPlaylist(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/listPlaylist']);
  }

  logout(event: Event): void {
    event.preventDefault();
    sessionStorage.clear();
    this.router.navigate(['/login']); 
  }
}
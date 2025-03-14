import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-update-video',
  imports: [FormsModule],
  templateUrl: './update-video.component.html',
  styleUrls: ['./update-video.component.css']
})
export class UpdateVideoComponent implements OnInit {
  video: any = {};
  videoId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoService
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

  updateVideo() {
    this.videoService.updateVideo(this.videoId, this.video).subscribe({
      next: () => {
        alert('Video updated successfully!');
        this.router.navigate(['/videoList']); // Redirigir a la lista de videos
      },
      error: (err) => {
        console.error('Error updating video:', err);
        alert('Failed to update video. Check the console for details.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/videos']);
  }
}
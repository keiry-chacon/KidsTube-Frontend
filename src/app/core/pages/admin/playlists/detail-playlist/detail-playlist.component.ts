import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';

@Component({
  selector: 'app-detail-playlist',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './detail-playlist.component.html',
  styleUrls: ['./detail-playlist.component.css']
})
export class DetailPlaylistComponent implements OnInit {
  playlist: any = {}; // Stores playlist data
  playlistId: string = ''; // Current playlist ID

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.playlistId = this.route.snapshot.paramMap.get('id') || '';

    if (this.playlistId) {
      this.loadPlaylist();
    }
  }

  // Loads the playlist data by its ID
  loadPlaylist() {
    this.playlistService.getPlaylistById(this.playlistId).subscribe({
      next: (data) => {
        this.playlist = data;
      },
      error: (err) => {
        alert('Failed to load playlist. Check the console for details.');
      }
    });
  }

  // Navigates back to the previous page
  goBack() {
    window.history.back();
  }

  // Navigates to the video list page
  navigateToVideoList(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/videoList']);
  }

  // Navigates to the playlist list page
  navigateToListPlaylist(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/listPlaylist']);
  }

  // Logs out the user and clears session storage
  logout(event: Event): void {
    event.preventDefault();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
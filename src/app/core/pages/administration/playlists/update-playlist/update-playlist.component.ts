import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';
import { ProfileService } from '../../../../services/profile.service';
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-update-playlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-playlist.component.html',
  styleUrls: ['./update-playlist.component.css']
})
export class UpdatePlaylistComponent implements OnInit {
  playlistForm: FormGroup;
  profiles: any[] = [];
  videos: any[] = [];
  playlistId: string = '';
  currentPlaylist: any = null;

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private videoService: VideoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.playlistForm = this.fb.group({
      name: ['', Validators.required],
      associatedProfiles: [[], Validators.required],
      videos: [[]]
    });
  }

  ngOnInit() {
    this.loadProfiles();
    this.loadVideos();

    // Obtener el ID de la playlist desde los parámetros de la URL
    this.playlistId = this.route.snapshot.paramMap.get('id') || '';
    if (this.playlistId) {
      this.loadPlaylist();
    }
  }

  loadProfiles() {
    this.profileService.getProfiles().subscribe({
      next: (response) => {
        this.profiles = response.data || response;
      },
      error: (err) => {
        console.error('Error loading profiles:', err);
        alert('Failed to load profiles. Check the console for details.');
      }
    });
  }

  loadVideos() {
    this.videoService.getVideos().subscribe({
      next: (data) => this.videos = data,
      error: (err) => console.error('Error loading videos:', err)
    });
  }

  loadPlaylist() {
    this.playlistService.getPlaylistById(this.playlistId).subscribe({
      next: (playlist) => {
        this.currentPlaylist = playlist;

        // Cargar los valores iniciales en el formulario
        this.playlistForm.patchValue({
          name: playlist.name,
          associatedProfiles: playlist.associatedProfiles.map((profile: any) => profile._id),
          videos: playlist.videos.map((video: any) => video._id)
        });
      },
      error: (err) => {
        console.error('Error loading playlist:', err);
        alert('Failed to load playlist. Check the console for details.');
      }
    });
  }

  onSubmit() {
    if (this.playlistForm.valid) {
      const formData = this.playlistForm.value;

      this.playlistService.updatePlaylist(this.playlistId, formData).subscribe({
        next: () => {
          alert('Playlist updated successfully!');
          this.router.navigate(['/playlists']); // Redirigir a la lista de playlists
        },
        error: (err) => {
          console.error('Error updating playlist:', err);
          alert('Failed to update playlist. Check the console for details.');
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
  }

  cancel() {
    this.router.navigate(['/playlists']);
  }
}
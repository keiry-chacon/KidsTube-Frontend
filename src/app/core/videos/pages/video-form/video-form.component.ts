import { Component } from '@angular/core';
import { VideoService } from '../../../services/video.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './video-form.component.html',
  styleUrl: './video-form.component.css'
})
export class VideoFormComponent {
  videoForm: FormGroup;

  constructor(private fb: FormBuilder, private videoService: VideoService) {
    this.videoForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }
  onSubmit() {
    if (this.videoForm.valid) {
      this.videoService.saveVideo(this.videoForm.value).subscribe({
        next: (response) => alert('Saved'),
        error: (err) => alert('Error saving: ' + err.message)
      });
    }
  }
}

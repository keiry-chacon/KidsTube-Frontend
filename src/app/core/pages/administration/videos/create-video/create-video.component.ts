import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-create-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-video.component.html',
  styleUrls: ['./create-video.component.css']
})
export class CreateVideoComponent implements OnInit {
  videoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private videoService: VideoService
  ) {
    this.videoForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.videoForm.valid) {
      const formData = this.videoForm.value;
      console.log('Sending data:', formData);

      this.videoService.createVideo(formData).subscribe({
        next: (response) => {
          alert('Video created successfully!');
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Error creating video. Try again later.';
          alert(errorMessage);
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
  }
}
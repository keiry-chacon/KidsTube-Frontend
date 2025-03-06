import { Routes } from '@angular/router';
import { LogInComponent } from '../app/core/pages/log-in/log-in.component';
import { LoginTestComponent } from '../app/core/pages/login-test/login-test.component';
import { SignUpComponent } from '../app/core/pages/sign-up/sign-up.component';
import { VideoFormComponent } from '../app/core/videos/pages/video-form/video-form.component';

export const routes: Routes = [
  { path: '', component: LoginTestComponent }, // Default route
  { path: 'signup', component: SignUpComponent },
  { path: 'video-form', component: VideoFormComponent },
  { path: 'login', component: LogInComponent },

];
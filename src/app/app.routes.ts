import { Routes } from '@angular/router';
import { LogInComponent } from '../app/core/pages/log-in/log-in.component';
import { SignUpComponent } from '../app/core/pages/sign-up/sign-up.component';
import { VideoFormComponent } from '../app/core/videos/pages/video-form/video-form.component';
import { HomeComponent } from './home/home.component';
import { ProfilesComponent } from './core/pages/profiles/profiles.component';
import { AdministrationComponent } from './core/pages/administration/administration.component';


export const routes: Routes = [
  { path: '', component: HomeComponent  }, 
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'video-form', component: VideoFormComponent },
  { path: 'profiles', component: ProfilesComponent },
  { path: 'administration', component: AdministrationComponent },


];
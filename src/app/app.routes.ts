import { Routes } from '@angular/router';
import { LogInComponent } from '../app/core/pages/log-in/log-in.component';
import { SignUpComponent } from '../app/core/pages/sign-up/sign-up.component';
import { VideoFormComponent } from '../app/core/videos/pages/video-form/video-form.component';

export const routes: Routes = [
  { path: '', component: LogInComponent }, // Ruta por defecto
  { path: 'signup', component: SignUpComponent }, // Otra ruta para el registro
  { path: 'video-form', component: VideoFormComponent },
  { path: 'login', component: LogInComponent }, // Página de inicio de sesión

];
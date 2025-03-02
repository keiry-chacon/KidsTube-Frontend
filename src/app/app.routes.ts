import { Routes } from '@angular/router';
import { SignUpComponent } from '../app/core/pages/sign-up/sign-up.component';
import { VideoFormComponent } from '../app/core/videos/pages/video-form/video-form.component';

export const routes: Routes = [
  { path: '', component: SignUpComponent }, // Ruta por defecto
  { path: 'signup', component: SignUpComponent }, // Otra ruta para el registro
  { path: 'video-form', component: VideoFormComponent },
  // Puedes agregar más rutas aquí
];
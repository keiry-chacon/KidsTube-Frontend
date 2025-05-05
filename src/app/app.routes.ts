import { Routes } from '@angular/router';
import { LogInComponent } from '../app/core/pages/log-in/log-in.component';
import { SignUpComponent } from '../app/core/pages/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ProfilesComponent } from './core/pages/profiles/profiles.component';
import { AccountValidationComponent } from './core/pages/validation/account-validation/account-validation.component';
import { VerifyCodeComponent } from './core/pages/validation/verify-code/verify-code.component';
import { CompleteProfileComponent } from './core/pages/complete-profile/complete-profile.component';

//Profiles
import { ChildScreenComponent } from './core/pages/child-screen/child-screen.component';
import { ListProfileComponent } from './core/pages/list-profile/list-profile.component';
import { ChildScreenPlaylistComponent } from './core/pages/child-screen-playlist/child-screen-playlist.component';

// Playlist Routes
import { CreatePlaylistComponent } from './core/pages/admin/playlists/create-playlist/create-playlist.component';
import { UpdatePlaylistComponent } from './core/pages/admin/playlists/update-playlist/update-playlist.component';
import { DetailPlaylistComponent } from './core/pages/admin/playlists/detail-playlist/detail-playlist.component';
import { ListPlaylistComponent }   from './core/pages/admin/playlists/list-playlist/list-playlist.component';
import { ListPlaylistProfileComponent }   from './core/pages/admin/playlists/list-playlist-profile/list-playlist-profile.component';

// Video Routes
import { CreateVideoComponent } from './core/pages/admin/videos/create-video/create-video.component';
import { UpdateVideoComponent } from './core/pages/admin/videos/update-video/update-video.component';
import { DetailVideoComponent } from './core/pages/admin/videos/detail-video/detail-video.component';
import { VideoListComponent } from './core/pages/admin/videos/video-list/video-list.component';


export const routes: Routes = [
  { path: '', component: HomeComponent  }, 
  { path: 'login', component: LogInComponent },
  { path: 'verify-code', component: VerifyCodeComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'profiles', component: ProfilesComponent },
  { path: 'user/verify/:token', component: AccountValidationComponent },
  { path: 'complete-profile', component: CompleteProfileComponent },

  //Profiles
  {  path: 'child-screen', component: ChildScreenComponent },
  { path: 'list-profile', component: ListProfileComponent },
  {  path: 'child-screen-playlist/:playlistId', component: ChildScreenPlaylistComponent },

  // Playlist Routes
  { path: 'createPlaylist', component: CreatePlaylistComponent },
  { path: 'updatePlaylist/:id', component: UpdatePlaylistComponent },
  { path: 'detailPlaylist/:id', component: DetailPlaylistComponent },
  { path: 'listPlaylist', component: ListPlaylistComponent },
  { path: 'listPlaylistProfile', component: ListPlaylistProfileComponent },

  // Video Routes
  { path: 'createVideo', component: CreateVideoComponent },
  { path: 'updateVideo/:id', component: UpdateVideoComponent },
  { path: 'detailVideo/:id', component: DetailVideoComponent },
  { path: 'videoList', component: VideoListComponent },

];
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { ToursComponent } from './features/tours/tours.component';
import { BlogComponent } from './features/blog/blog.component';
import { BlogDetailComponent } from './features/blog-detail/blog-detail.component';
import { ContactComponent } from './features/contact/contact.component';
import { AuthComponent } from './features/auth/auth.component';
import { SearchComponent } from './features/search/search.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { DashboardComponent } from './features/admin/dashboard.component'; // Import DashboardComponent
import { AdminGuard } from './core/guards/auth.guard';
// import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'tours', component: ToursComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'search', component: SearchComponent },
  { path: 'auth', component: AuthComponent },
  // { path: 'verify-email', component: VerifyEmailComponent },
  { path: '', redirectTo: '/auth?mode=signin', pathMatch: 'full' },
  { path: 'user-profile', component: UserProfileComponent },

  { path: 'admin', component: DashboardComponent, canActivate: [AdminGuard] },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    
  },
  { path: '**', redirectTo: '' }, // Redirect to home for any unknown routes
];
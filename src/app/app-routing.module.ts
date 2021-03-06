import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/layout/home/home.component';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { LoggedGuard } from './guards/logged.guard';
import { UserProfileComponent } from './components/layout/user-profile/user-profile.component';
import { PostsComponent } from './components/posts/posts.component';
import { MyPostsComponent } from './components/layout/my-posts/my-posts.component';
import { EditPostsComponent } from './components/layout/edit-posts/edit-posts.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoggedGuard]
  },
  {
    path: 'userProfile',
    component: UserProfileComponent,
    canActivate: [AuthGuardGuard]
  },{
    path: 'home',
    component: PostsComponent
  },
  {
    path: 'myPosts',
    component: MyPostsComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cratePost',
    component: EditPostsComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

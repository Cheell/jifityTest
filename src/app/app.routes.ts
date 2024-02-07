import { Route, Routes } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UsersListComponent } from './components/users-list/users-list.component';

interface MyRoute extends Route {
  path: TRoute;
}

export const routes: MyRoute[] = [
  {path: '', redirectTo: 'user-list', pathMatch: 'full'},
  {path: 'user-list', component: UsersListComponent},
  {path: 'edit-user/:id', component: UserDetailsComponent},
  {path: 'new-user', component: UserDetailsComponent},
  {path: '**', redirectTo: 'user-list'},
];

export type TRoute = '' | 'user-list' | 'edit-user/:id' | 'new-user' | '**';
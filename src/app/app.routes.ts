import { Routes } from '@angular/router';
import { NotesScreenComponent } from './feature/notes-screen/notes-screen.component';
import { LoginScreenComponent } from './feature/login-screen/login-screen.component';
import { authGuard } from './core/auth/auth.guard';
import { loginGuard } from './core/login/login.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginScreenComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'notes',
        component: NotesScreenComponent,
        canActivate: [authGuard]
    },
    { path: '**', component: LoginScreenComponent }
];

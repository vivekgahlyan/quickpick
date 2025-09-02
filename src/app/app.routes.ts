import { Routes } from '@angular/router';
import { NotesScreenComponent } from './feature/notes-screen/notes-screen.component';
import { LoginScreenComponent } from './feature/login-screen/login-screen.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginScreenComponent
    },
    {
        path: 'notes',
        component: NotesScreenComponent,
        canActivate: [authGuard]
    },
    { path: '**', component: LoginScreenComponent }
];

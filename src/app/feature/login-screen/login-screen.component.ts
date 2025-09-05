import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth service/auth.service';

@Component({
  selector: 'app-login-screen',
  imports: [],
  providers: [],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginScreenComponent {

  constructor(private router: Router, private auth: AuthService) { }

  username = signal('');
  password = signal('');

  onLogin(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log('Username:', this.username());
    console.log('Password:', this.password());
    sessionStorage.setItem('username', this.username());

    if (this.password() == 'test') {
      setTimeout(() => {
        console.log('Navigating to dashboard...');
        this.navigateToDashboard();
      }, 5000);
    }
  }

  navigateToDashboard() {
    this.auth.login();
    this.router.navigate(['/notes'], { replaceUrl: true });
  }
}
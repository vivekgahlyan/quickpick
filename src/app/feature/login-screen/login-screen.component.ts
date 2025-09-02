import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-login-screen',
  imports: [],
  providers: [],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginScreenComponent {

  username = signal('');
  password = signal('');

  onLogin(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log('Username:', this.username());
    console.log('Password:', this.password());
    // Add your login logic here
  }
}

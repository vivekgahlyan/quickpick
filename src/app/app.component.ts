import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginScreenComponent } from "./feature/login-screen/login-screen.component";
import { NotesScreenComponent } from "./feature/notes-screen/notes-screen.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'quickpick';
}

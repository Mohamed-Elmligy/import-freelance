import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <div class="min-h-screen min-w-full"><router-outlet /></div> `,
})
export class AppComponent {
  title = 'import_project';
}

import { TUI_DARK_MODE, TUI_DARK_MODE_KEY, TuiButton, TuiRoot } from "@taiga-ui/core";
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WA_LOCAL_STORAGE, WA_WINDOW} from '@ng-web-apis/common';
import { TuiTitle } from '@taiga-ui/core';
import { TuiHeader, TuiNavigation} from '@taiga-ui/layout';
;
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TuiRoot, TuiButton, TuiTitle, TuiHeader, TuiNavigation],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly key = inject(TUI_DARK_MODE_KEY);
  private readonly storage = inject(WA_LOCAL_STORAGE);
  private readonly media = inject(WA_WINDOW).matchMedia('(prefers-color-scheme: dark)');
  protected readonly darkMode = inject(TUI_DARK_MODE);

  protected title = 'posts-project';
}

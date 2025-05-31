import { TuiRoot } from "@taiga-ui/core";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'posts-project';
}

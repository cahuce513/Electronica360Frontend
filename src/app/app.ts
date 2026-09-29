import { Component } from '@angular/core';
import { Productos } from './components/productos/productos';

@Component({
  imports: [Productos],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-sponsors",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./sponsors.component.html",
  styleUrl: "./sponsors.component.scss",
})
export class SponsorsComponent {}

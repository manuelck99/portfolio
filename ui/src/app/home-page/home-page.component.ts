import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "pf-home-page",
  standalone: true,
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}

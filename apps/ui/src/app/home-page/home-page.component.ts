import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component({
  standalone: true,
  selector: "pf-home-page",
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}

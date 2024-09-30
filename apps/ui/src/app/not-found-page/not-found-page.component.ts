import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component({
  standalone: true,
  selector: "pf-not-found-page",
  templateUrl: "./not-found-page.component.html",
  styleUrl: "./not-found-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}

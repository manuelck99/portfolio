import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "pf-project-page",
  standalone: true,
  templateUrl: "./project-page.component.html",
  styleUrl: "./project-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPageComponent {
  projectId = input.required<string>();
}

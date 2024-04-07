import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from "@angular/core";
import { TextStyle } from "./text.component.types";

@Component({
  selector: "pf-text",
  standalone: true,
  templateUrl: "./text.component.html",
  styleUrl: "./text.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {
  textStyle = input<TextStyle>("body-medium");

  @HostBinding("class")
  get class(): string {
    return this.textStyle();
  }
}

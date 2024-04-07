import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TextComponent } from "./text.component";
import { ComponentRef } from "@angular/core";

describe("TextComponent", () => {
  let component: TextComponent;
  let componentRef: ComponentRef<TextComponent>;
  let fixture: ComponentFixture<TextComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TextComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });
  it("should exist", () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
  it("should have class 'display-large', when 'textStyle' is set to 'display-large'", () => {
    componentRef.setInput("textStyle", "display-large");
    fixture.detectChanges();

    const nativeEl: HTMLElement = fixture.nativeElement;
    expect(nativeEl.className).toStrictEqual("display-large");
    expect(component.textStyle()).toStrictEqual("display-large");
  });
  it("should have class 'body-medium', when 'textStyle' is not set", () => {
    fixture.detectChanges();

    const nativeEl: HTMLElement = fixture.nativeElement;
    expect(nativeEl.className).toStrictEqual("body-medium");
    expect(component.textStyle()).toStrictEqual("body-medium");
  });
});

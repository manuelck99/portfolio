import { ProjectPageComponent } from "./project-page.component";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingHarness } from "@angular/router/testing";
import { provideRouter, withComponentInputBinding } from "@angular/router";

describe("ProjectPageComponent", () => {
  let component: ProjectPageComponent;
  let fixture: ComponentFixture<ProjectPageComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProjectPageComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should exist", () => {
    expect(component).toBeDefined();
  });
});

describe("ProjectPageComponent with routing", () => {
  let harness: RouterTestingHarness;
  let activatedComponent: ProjectPageComponent;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProjectPageComponent],
      providers: [
        provideRouter(
          [{ path: ":projectId", component: ProjectPageComponent }],
          withComponentInputBinding(),
        ),
      ],
    }).compileComponents();
  }));
  beforeEach(async () => {
    harness = await RouterTestingHarness.create();
    activatedComponent = await harness.navigateByUrl(
      "/test",
      ProjectPageComponent,
    );
    harness.detectChanges();
  });
  it("should be activated", () => {
    expect(activatedComponent).toBeInstanceOf(ProjectPageComponent);
  });
  it("should have projectId 'test'", () => {
    expect(activatedComponent.projectId()).toStrictEqual("test");
  });
});

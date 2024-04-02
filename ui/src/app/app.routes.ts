import { Route } from "@angular/router";
import { HomePageComponent } from "./home-page/home-page.component";
import { ProjectPageComponent } from "./project-page/project-page.component";
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component";

export const appRoutes: Route[] = [
  {
    path: "home",
    component: HomePageComponent,
  },
  {
    path: "projects/:projectId",
    component: ProjectPageComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home",
  },
  {
    path: "**",
    component: NotFoundPageComponent,
  },
];

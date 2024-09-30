import { Route } from "@angular/router"
import { appPaths } from "./app.paths"
import { HomePageComponent } from "./home-page/home-page.component"
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component"

export const appRoutes: Route[] = [
  {
    path: appPaths.homePage,
    component: HomePageComponent,
  },
  {
    path: appPaths.notFoundPage,
    component: NotFoundPageComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: `/${appPaths.homePage}`,
  },
  {
    path: "**",
    redirectTo: `/${appPaths.notFoundPage}`,
  },
]

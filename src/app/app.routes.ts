import {Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {TeamGeneratorComponent} from "./pages/team-generator/team-generator.component";

export const routes: Routes = [
  {path: "team-generator", component: TeamGeneratorComponent},
  {path: "**", component: HomePageComponent},
];

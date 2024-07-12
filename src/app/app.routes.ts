import {Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {TeamGeneratorComponent} from "./pages/team-generator/team-generator.component";
import {SongCardsComponent} from "./pages/song-cards/song-cards.component";

export const routes: Routes = [
  {path: "team-generator", component: TeamGeneratorComponent},
  {path: "song-cards", component: SongCardsComponent},
  {path: "**", component: HomePageComponent},
];

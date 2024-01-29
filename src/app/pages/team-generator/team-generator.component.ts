import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-team-generator',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './team-generator.component.html',
  styleUrl: './team-generator.component.scss'
})
export class TeamGeneratorComponent {

  names: string[] = [];
  nameToAdd: string = "";
  teamCount = 2;
  teams: string[][] = [];

  addName() {
    if (this.nameToAdd.length > 0) {
      this.names.push(this.nameToAdd);
      this.nameToAdd = "";
    }
  }

  deleteName(i: number) {
    this.names.splice(i, 1);
  }

  generateTeams() {
    const k = this.teamCount < this.names.length ? this.teamCount : this.names.length
    const array = this.shuffleArray(this.names);
    this.teams = this.splitArray(array, k);
  }

  splitArray(array: any[], k: number) {
    const partSize = Math.floor(array.length / k);
    const extra = array.length % k;
    const result = [];

    let start = 0;
    let end = 0;

    for (let i = 0; i < k; i++) {
      end = start + partSize + (i < extra ? 1 : 0);
      result.push(array.slice(start, end));
      start = end;
    }

    return result;
  }

  shuffleArray(array: any[]) {
    const shuffledArray = [...array]; // Create a shallow copy to avoid modifying the original array
    return shuffledArray.sort(() => Math.random() - 0.5);
  }
}

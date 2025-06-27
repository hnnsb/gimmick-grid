import {useState} from "react";
import Button from "../components/common/Button";

export default function TeamGenerator() {
  const [names, setNames] = useState<string[]>([]);
  const [nameToAdd, setNameToAdd] = useState<string>("");
  const [teamCount, setTeamCount] = useState<number>(2);
  const [teams, setTeams] = useState<string[][]>([]);

  function deleteName(index: number) {
    setNames(names.filter((name, i) => i !== index));
  }

  function addName() {
    setNames([...names, nameToAdd]);
    setNameToAdd("");
  }

  function generateTeams() {
    const k = teamCount < names.length ? teamCount : names.length
    const array = shuffleArray(names);
    setTeams(splitArray(array, k));
  }

  function splitArray(array: any[], k: number) {
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

  function shuffleArray(array: any[]) {
    const shuffledArray = [...array];
    return shuffledArray.sort(() => Math.random() - 0.5);
  }

  return (
    <div className="container">
      <h1>Random teams generator</h1>
      <div className="flex flex-row justify-evenly">
        <div className="min-w-1/3">
          <div className="border-2 border-solid rounded-xl p-4 m-4 shadow-[8px_8px_0px_0px_black]">
            <h2>Names</h2>
            <div className="my-1">
              <input className="mr-1" value={nameToAdd}
                     onChange={(e) => setNameToAdd(e.target.value)}
                     type="text"/>
              <Button disabled={nameToAdd.length === 0}
                      onClick={() => addName()}>Add Name
              </Button>
            </div>
            {names.map((name, index) => (
              <div className="my-1 flex flex-row justify-between" key={name + index}>
                <span className="mr-1">
                  {name}
                </span>
                <Button variant={"danger"} onClick={() => deleteName(index)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-1/3">
          <div className="border-2 border-solid rounded-xl p-4 m-4 shadow-[8px_8px_0px_0px_black]">
            <h2>Teams</h2>
            <input className="mr-1 w-8" value={teamCount}
                   onChange={(e) => setTeamCount(Number(e.target.value))} type="number"/>
            <Button disabled={names.length === 0}
                    onClick={() => generateTeams()}>Generate Teams
            </Button>
          </div>
          {teams.map((team, index) => (
            <div key={team.join(",") + index}
                 className="border-2 border-solid rounded-xl p-4 m-4 shadow-[8px_8px_0px_0px_black]">
              <div>
                <h3>Team {index + 1}</h3>
                {team.map((name, nameIndex) => (
                  <div key={name + index + nameIndex}>{name}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

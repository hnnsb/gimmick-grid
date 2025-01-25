import Button from "../components/Button";
import {NavLink} from "react-router-dom";

export default function Homepage() {
  return (
    <div className="container">
      <h1>Welcome to the Gimmick-Grid</h1>
      <div className="flex flex-col md:flex-row">
        <div className="p-2 shadow-card">
          <h2>What is the Gimmick-Grid?</h2>
          <p>
            The Gimmick-Grid is a collection of small projects that I have created to learn new
            technologies and
            techniques. Each project is a small, self-contained application that demonstrates a
            specific concept or
            technique or is just a little game.
          </p>
        </div>

        <div className="p-2 shadow-card">
          <h2>Team Generator</h2>
          <p>
            Enter your and your friends' names and generate random teams.
          </p>
          <Button>
            <NavLink to={"/team-generator"} className="no-underline text-white">
              Check it out!
            </NavLink>
          </Button>
        </div>

        <div className="p-2 shadow-card">
          <h2>K-Means</h2>
          <p>
            A little playground to experiment with the K-Means clustering algorithm.
          </p>
          <Button>
            <NavLink to={"/k-means"} className="no-underline text-white">
              Check it out!
            </NavLink>
          </Button>
        </div>

        <div className="p-2 shadow-card">
          <h2>Hitster-Generator</h2>
          <p>
            Generator your own hitster playing cards by entering a spotify playlist link.
          </p>
          <Button>
            <NavLink to={"/hitster-generator"} className="no-underline text-white">
              Check it out!
            </NavLink>
          </Button>
        </div>
      </div>

    </div>
  )
    ;
}

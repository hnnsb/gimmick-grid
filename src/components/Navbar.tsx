import {NavLink} from "react-router-dom";
// @ts-ignore
import logo from "../logo.png";

export default function Navbar() {
  return (
    <nav className="flex flex-row gap-4 px-4 bg-black text-white">
      <div className="my-auto">
        <img src={logo} alt="logo" className="w-10 h-10"/>
      </div>
      <h1>Gimmick Grid</h1>

      <div className="flex flex-row my-auto gap-2">
        <NavLink
          className={({isActive}) =>
            `border-solid border-white rounded-full border-3 p-2 no-underline
            ${isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-800'}`
          }
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({isActive}) =>
            `border-solid border-white rounded-full border-3 p-2 no-underline
            ${isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-800'}`
          }
          to="/team-generator"
        >
          Team Generator
        </NavLink>

        <NavLink
          className={({isActive}) =>
            `border-solid border-white rounded-full border-3 p-2 no-underline
            ${isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-800'}`
          }
          to="/K-Means"
        >
          K-Means
        </NavLink>

      </div>
    </nav>);
}

import { NavLink} from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex flex-row gap-4 mx-4">
      <img src="/logo.png" alt="logo" className="w-10 h-10"/>
      <h1>Gimmick Grid</h1>
      <div className="flex flex-row my-auto gap-2">
        <NavLink
          className={({isActive}) =>
            `border-solid border-black rounded-full border-4 p-2 no-underline ${isActive ? 'bg-black text-white' : 'text-black hover:bg-gray-300'}`
          }
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({isActive}) =>
            `border-solid border-black rounded-full border-4 p-2 no-underline ${isActive ? 'bg-black text-white' : 'text-black hover:bg-gray-300'}`
          }
          to="/team-generator"
        >
          Team Generator
        </NavLink>

        <NavLink
          className={({isActive}) =>
            `border-solid border-black rounded-full border-4 p-2 no-underline ${isActive ? 'bg-black text-white' : 'text-black hover:bg-gray-300'}`
          }
          to="/K-Means"
        >
          K-Means
        </NavLink>

      </div>
    </nav>);
}

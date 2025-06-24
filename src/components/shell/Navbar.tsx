import {NavLink} from "react-router-dom";
// @ts-ignore
import logo from "../../logo.png";
import {useState} from "react";
import Button from "../common/Button";

function NavLinks() {
  return (<>
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
        to="/k-means"
      >
        K-Means
      </NavLink>
      <NavLink
        className={({isActive}) =>
          `border-solid border-white rounded-full border-3 p-2 no-underline
        ${isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-800'}`
        }
        to="/hitster-generator"
      >
        Hitster-Generator
      </NavLink>
      <NavLink
        className={({isActive}) =>
          `border-solid border-white rounded-full border-3 p-2 no-underline
        ${isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-800'}`
        }
        to="/tournament-sandbox"
      >
        Tournament Sandbox
      </NavLink>
    </>
  )
}

export default function Navbar({className}: Readonly<{ className?: string }>) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={`${className} flex flex-row gap-4 px-4 bg-black text-white py-2 justify-between sm:justify-start`}>
      <NavLink className="my-auto" to="/">
        <img src={logo} alt="logo" className="w-10 h-10"/>
      </NavLink>
      <div className="block sm:hidden my-auto">
        <Button className={
          `rounded text-xl
          ${menuOpen ? 'bg-black text-white border-white hover:bg-gray-800' :
            'bg-white text-black hover:bg-gray-200'}`
        }
                onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </Button>
        {menuOpen && (
          <div className="flex flex-col bg-black p-4 absolute top-12 right-0 gap-4 rounded-bl-xl">
            <NavLinks/>
          </div>
        )}
      </div>
      <div className="hidden sm:flex flex-row my-auto gap-2">
        <NavLinks/>
      </div>
    </nav>);
}

import {Outlet} from "react-router-dom";
import Navbar from "../components/shell/Navbar";

export default function Layout() {
  return (
    <>
      <Navbar className={"fixed w-full"}/>
      <div
        className={"pt-14"}> {/* Add padding to the top to prevent the navbar from overlapping the content */}
        <Outlet/>
      </div>
    </>
  );
}

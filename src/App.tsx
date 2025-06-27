import KMeans from "./pages/KMeans";
import TeamGenerator from "./pages/TeamGenerator";
import Homepage from "./pages/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import HitsterGenerator from "./pages/HitsterGenerator";
import TournamentSandboxPage from "./pages/TournamentSandboxPage";

export default function App() {
  return (
    <BrowserRouter basename="/gimmick-grid">
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index Component={Homepage}/>
          <Route path="/team-generator" element={<TeamGenerator/>}/>
          <Route path="/k-means" Component={KMeans}/>
          <Route path="/hitster-generator" Component={HitsterGenerator}/>
          <Route path="/tournament-sandbox" Component={TournamentSandboxPage}/>
          <Route path="*" Component={NoPage}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

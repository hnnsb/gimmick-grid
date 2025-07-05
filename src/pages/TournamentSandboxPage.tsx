import '../components/tournament-sandbox/TournamentSandbox.css';

import '@xyflow/react/dist/style.css';
import TournamentSandbox from "../components/tournament-sandbox/TournamentSandbox";


export default function TournamentSandboxPage() {
  return (<>
      <div className="beta-badge"></div>
      <TournamentSandbox/>
    </>
  )
}

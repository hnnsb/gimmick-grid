import {ReactFlowProvider} from '@xyflow/react';
import '../components/tournament-sandbox/TournamentSandbox.css';

import '@xyflow/react/dist/style.css';
import TournamentSandbox from "../components/tournament-sandbox/TournamentSandbox";
import {DnDProvider} from "../components/tournament-sandbox/DnDContext";


export default function TournamentSandboxPage() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <TournamentSandbox/>
      </DnDProvider>
    </ReactFlowProvider>
  )
}

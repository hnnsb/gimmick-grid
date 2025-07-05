import React from "react";
import {ReactFlowProvider} from "@xyflow/react";
import ScheduleView from "./ScheduleView";
import Tabs from "../common/tabs/Tabs";
import Tab from "../common/tabs/Tab";
import {TournamentProvider, useTournamentContext} from "./context/TournamentContext";
import {FlowEditor} from "./flow/FlowEditor";
import {TeamManagement} from "./teams/TeamManagement";

// TournamentContent ist die eigentliche Inhaltskomponente
function TournamentContent() {
  const {
    nodes,
    edges,
    teams,
    tournamentState,
    matches,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    updateMatchResult,
    handleTeamUpdate,
    handleTeamClear
  } = useTournamentContext();

  return (
    <div>
      <div className="container overflow-scroll p-2">
        <h1>Tournament Sandbox</h1>

        <Tabs>
          <Tab label={"Editor"}>
            <ReactFlowProvider>
              <FlowEditor
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                setNodes={setNodes}
                setEdges={setEdges}
              />
            </ReactFlowProvider>
          </Tab>
          <Tab label={"Teams"} disabled={matches.length === 0}>
            <TeamManagement
              teams={teams}
              handleTeamUpdate={handleTeamUpdate}
              handleTeamClear={handleTeamClear}
            />
          </Tab>
          <Tab label={"Spielplan"} disabled={matches.length === 0}>
            <ScheduleView
              tournamentState={tournamentState}
              updateMatchResult={updateMatchResult}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

// Die Hauptkomponente ist jetzt nur noch ein Provider-Wrapper
export default function TournamentSandbox() {
  return (
    <TournamentProvider>
      <TournamentContent/>
    </TournamentProvider>
  );
}

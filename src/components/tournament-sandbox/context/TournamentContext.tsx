import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {Edge, Node, useEdgesState, useNodesState} from "@xyflow/react";
import {extractMatches} from "../TournamentUtils";
import {TournamentState} from "../TournamentState";
import {SingleMatch, Team} from "../../../types/tournament";

// Neuer Enum für den Teamzuweisungsmodus
export enum TeamAssignmentMode {
  RANDOM = 'random',
  ORDERED = 'ordered'
}

interface TournamentContextType {
  nodes: Node[];
  edges: Edge[];
  teams: string[];
  tournamentState: TournamentState | undefined;
  matches: SingleMatch[][];
  teamAssignmentMode: TeamAssignmentMode;
  setTeamAssignmentMode: React.Dispatch<React.SetStateAction<TeamAssignmentMode>>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setTeams: React.Dispatch<React.SetStateAction<string[]>>;
  onNodesChange: any;
  onEdgesChange: any;
  updateMatchResult: (matchId: string, result: {
    team1Points: number;
    team2Points: number;
    winner: Team
  }) => void;
  handleTeamUpdate: (index: number, value: string) => void;
  handleTeamClear: (index: number) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function useTournamentContext() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournamentContext muss innerhalb eines TournamentProvider verwendet werden");
  }
  return context;
}

interface TournamentProviderProps {
  children: ReactNode;
}

export function TournamentProvider({children}: Readonly<TournamentProviderProps>) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [tournamentState, setTournamentState] = useState<TournamentState | undefined>(undefined);
  const [teamAssignmentMode, setTeamAssignmentMode] = useState<TeamAssignmentMode>(TeamAssignmentMode.RANDOM);

  const matches = React.useMemo(() => extractMatches(nodes, edges), [nodes, edges]);

  const handleTeamUpdate = useCallback((index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index] = value;
    setTeams(newTeams);
  }, [teams]);

  const handleTeamClear = useCallback((index: number) => {
    const newTeams = [...teams];
    newTeams[index] = "";
    setTeams(newTeams);
  }, [teams]);

  const updateMatchResult = useCallback((matchId: string, result: {
    team1Points: number;
    team2Points: number;
    winner: Team
  }) => {
    if (!tournamentState) return;

    const newState = new TournamentState(tournamentState.getMatches(), tournamentState.getTeams());
    newState.updateMatchResult(matchId, result);
    setTournamentState(newState);
  }, [tournamentState]);

  useEffect(() => {
    let teamCount = 0;
    if (matches.length > 0) {
      teamCount = matches[0].length * 2;
    }
    setTeams(current => {
      // Nur aktualisieren, wenn sich die Anzahl geändert hat
      if (current.length !== teamCount) {
        return Array(teamCount).fill("");
      }
      return current;
    });
  }, [matches]);

  useEffect(() => {
    if (!matches || matches.length === 0 || !teams || teams.length === 0) {
      setTournamentState(undefined);
      return;
    }

    const newState = new TournamentState(matches, teams);
    // Weitergabe des Teamzuweisungsmodus an die assignTeams-Funktion
    newState.assignTeams(teamAssignmentMode);
    setTournamentState(newState);
  }, [matches, teams, teamAssignmentMode]);


  const value = useMemo(() => {
    return {
      nodes,
      edges,
      teams,
      tournamentState,
      matches,
      teamAssignmentMode,
      setTeamAssignmentMode,
      setNodes,
      setEdges,
      setTeams,
      onNodesChange,
      onEdgesChange,
      updateMatchResult,
      handleTeamUpdate,
      handleTeamClear,
    }
  }, [
    edges,
    handleTeamClear,
    handleTeamUpdate,
    matches,
    nodes,
    onEdgesChange,
    onNodesChange,
    setEdges,
    setNodes,
    teams,
    teamAssignmentMode,
    tournamentState,
    updateMatchResult
  ]);

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

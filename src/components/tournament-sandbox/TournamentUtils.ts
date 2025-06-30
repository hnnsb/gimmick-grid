import {SingleMatch} from '../../types/tournament';
import {Edge, Node} from "@xyflow/react";

// Extrahiert Match-Daten aus dem Flow-Diagramm für die Spielplanerstellung
export function extractMatches(
  nodes: Node[],
  edges: Edge[]
): SingleMatch[][] {
  console.log("Extract matches for " + nodes.length + " Nodes");
  const nodeMap = new Map<string, Node>();
  nodes.forEach(node => {
    nodeMap.set(node.id, node);
  })

  // Bestimme die Hierarchie der Matches basierend auf Verbindungen
  const incomingConnections = new Map<string, string[]>();
  const outgoingConnections = new Map<string, string[]>();

  edges.forEach(edge => {
    if (!incomingConnections.has(edge.target)) {
      incomingConnections.set(edge.target, []);
    }
    incomingConnections.get(edge.target)?.push(edge.source);

    if (!outgoingConnections.has(edge.source)) {
      outgoingConnections.set(edge.source, []);
    }
    outgoingConnections.get(edge.source)?.push(edge.target);
  });

  const rounds = [];

  // Startknoten finden (ohne eingehende Verbindungen)
  let currentNodes = new Set(nodes.filter(node =>
    !incomingConnections.has(node.id)
  ).map(node => node.id));

  while (currentNodes.size > 0) {
    const nextNodes: Set<string> = new Set();

    currentNodes.forEach(nodeId => {
      const outgoing = outgoingConnections.get(nodeId) || [];
      outgoing.forEach(targetId => {
        nextNodes.add(targetId);
      })
    });
    rounds.push(currentNodes);
    currentNodes = nextNodes;
  }

  // Match-Objekte erstellen
  return rounds.map((nodesOfRound, index) => {
    const a = Array.from(nodesOfRound).map((nodeId: string) => {
      const node = nodeMap.get(nodeId);
      if (!node) {
        return null; // Node nicht gefunden, überspringen
      }
      if (node.type === 'match') {
        const round = index;
        const outgoing = outgoingConnections.get(node.id) || [];

        return {
          id: node.id,
          team1: undefined,
          team2: undefined,
          result: undefined,
          nextMatchForWinner: outgoing[0] || undefined,
          nextMatchForLoser: outgoing[1] || undefined,
          round,
          description: node.data.description ?? '',
        } as SingleMatch;
      } else if (node.type === 'group') {
        // Unsupported for now.
        return null;
      }
      return null;
    });
    return a.filter(match => match !== null) as SingleMatch[];
  });

}

export enum TournamenNodeType {
  MATCH = 'match',
  GROUP = 'group',
}

// Komponenten-Palette für den Editor
export const componentPalette = new Map([
  [TournamenNodeType.MATCH, {
    data: {label: 'Einzelspiel', team1: 'Team 1', team2: 'Team 2'}
  }],
  [TournamenNodeType.GROUP, {
    data: {label: 'Gruppenphase', teams: ['Team 1', 'Team 2', 'Team 3', 'Team 4']}
  }]
]);


export const ROUND_NAMES = ["Finale", "Halbfinale", "Viertelfinale", "Achtelfinale", "Sechzehntelfinale"];

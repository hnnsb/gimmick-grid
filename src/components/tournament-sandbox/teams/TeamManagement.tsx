import React, {useMemo} from "react";
import {TeamInput} from "../TeamInput";
import {TeamAssignmentMode, useTournamentContext} from "../context/TournamentContext";
import "../TournamentSandbox.css";
import ReorderList from "../../common/reorder/ReorderList";
import TextBox from "../../common/text-box/TextBox";

interface TeamManagementProps {
  teams: string[];
  handleTeamUpdate: (index: number, value: string) => void;
  handleTeamClear: (index: number) => void;
}

// Interface für Team-Items mit zusätzlichen Eigenschaften
interface TeamItem {
  id: number;
  value: string;
  index: number;
}

export function TeamManagement({
                                 teams,
                                 handleTeamUpdate,
                                 handleTeamClear
                               }: Readonly<TeamManagementProps>) {
  const {teamAssignmentMode, setTeamAssignmentMode, setTeams} = useTournamentContext();

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setTeamAssignmentMode(isChecked ? TeamAssignmentMode.ORDERED : TeamAssignmentMode.RANDOM);
  };

  // Team-Liste als ReorderList-Items aufbereiten
  const teamItems = useMemo<TeamItem[]>(() => {
    return teams.map((team, index) => ({
      id: index,
      value: team,
      index
    }));
  }, [teams]);

  const handleReorder = (newItems: TeamItem[]) => {
    const newTeams = newItems.map(item => item.value);
    setTeams(newTeams);
  };

  const isDragDisabled = teamAssignmentMode !== TeamAssignmentMode.ORDERED;

  return (
    <div className="shadow-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h2>Teams hinzufügen</h2>
        <div className="team-assignment-mode">
          <label className="toggle-switch">
            <span
              className={`mode-label ${teamAssignmentMode === TeamAssignmentMode.RANDOM ? 'text-bold' : ''}`}>
              Zufällig
            </span>
            <input
              type="checkbox"
              checked={teamAssignmentMode === TeamAssignmentMode.ORDERED}
              onChange={handleModeChange}
            />
            <span className="slider round"></span>
            <span
              className={`mode-label ${teamAssignmentMode === TeamAssignmentMode.ORDERED ? 'text-bold' : ''}`}>
              Setzliste
            </span>
          </label>
        </div>
      </div>

      <div className="teams-list pb-2">
        {teams.length === 0 ? (
          <div>Du musst erst Spiele hinzufügen</div>
        ) : (
          <ReorderList
            items={teamItems}
            onReorder={handleReorder}
            dragDisabled={isDragDisabled}
            showIndexNumbers={!isDragDisabled}
            listClassName="teams-sortable-container"
            renderItem={(item) => (
              <TeamInput
                initialValue={item.value}
                index={item.index}
                onUpdate={handleTeamUpdate}
                onClear={handleTeamClear}
              />
            )}
          />
        )}
      </div>

      {teamAssignmentMode === TeamAssignmentMode.ORDERED && (
        <TextBox variant={"secondary"}>
          <p>Im Setzlistenmodus kannst du die Teams per Drag & Drop neu anordnen. Team 1 spielt
            gegen Team {teams.length}, Team 2 gegen Team {teams.length - 1}, usw.</p>
        </TextBox>
      )}
    </div>
  );
}

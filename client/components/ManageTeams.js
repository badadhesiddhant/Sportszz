import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const ManageTeams = () => {
  const [totalTeams, setTotalTeams] = useState("");
  const [totalGroups, setTotalGroups] = useState("");
  const [groups, setGroups] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [playersPerTeam, setPlayersPerTeam] = useState("");
  const [editingPlayerIndex, setEditingPlayerIndex] = useState(null);
  const [editingGroupIndex, setEditingGroupIndex] = useState(null);
  const [editingTeamIndex, setEditingTeamIndex] = useState(null);

  const addTeams = () => {
    const teamsCount = Number(totalTeams);
    const groupsCount = Number(totalGroups);
    const playersCount = Number(playersPerTeam);

    const newGroups = Array.from({ length: groupsCount }, (_, groupIndex) => {
      const teamsInGroup = Math.min(teamsCount, 4);
      const teams = Array.from({ length: teamsInGroup }, (_, teamIndex) => ({
        name: `Team ${teamIndex + 1}`,
        players: Array.from({ length: playersCount }, () => ""),
        score: 0,
      }));

      setTotalTeams((prev) => prev - teamsInGroup);
      return {
        name: `Group ${groupIndex + 1}`,
        teams: teams,
      };
    });

    setGroups(newGroups);
  };

  const addPlayer = (groupIndex, teamIndex) => {
    if (currentPlayer.trim()) {
      const newGroups = [...groups];
      const team = newGroups[groupIndex].teams[teamIndex];

      if (editingPlayerIndex !== null) {
        team.players[editingPlayerIndex] = currentPlayer;
        setCurrentPlayer("");
        setEditingPlayerIndex(null);
        setEditingGroupIndex(null);
        setEditingTeamIndex(null);
      } else {
        team.players.push(currentPlayer);
        setCurrentPlayer("");
      }
      setGroups(newGroups);
    }
  };

  const editPlayer = (groupIndex, teamIndex, playerIndex) => {
    const newGroups = [...groups];
    const player = newGroups[groupIndex].teams[teamIndex].players[playerIndex];
    setCurrentPlayer(player);
    setEditingPlayerIndex(playerIndex);
    setEditingGroupIndex(groupIndex);
    setEditingTeamIndex(teamIndex);
  };

  const renderTournamentDiagram = () => {
    return groups.map((group, groupIndex) => (
      <View key={groupIndex} style={styles.diagramGroup}>
        <Text style={styles.diagramGroupTitle}>{group.name}</Text>
        <View style={styles.tournamentContainer}>
          {group.teams.map((team, teamIndex) => (
            <View key={teamIndex} style={styles.teamContainer}>
              <Text style={styles.diagramTeamTitle}>{team.name}</Text>
              {team.players.map((player, playerIndex) => (
                <TouchableOpacity
                  key={playerIndex}
                  onPress={() => editPlayer(groupIndex, teamIndex, playerIndex)}
                >
                  <Text style={styles.diagramPlayer}>
                    {player || `Player ${playerIndex + 1}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Manage Your Teams and Groups</Text>
      <Text style={styles.description}>
        Create a structure for your teams. Specify the total number of teams,
        total groups, how many players will be in each team, and see how they
        are organized into groups.
      </Text>

      <TextInput
        placeholder="Total Teams (e.g., enter a number like 8)"
        placeholderTextColor="#666"
        value={totalTeams}
        keyboardType="numeric"
        onChangeText={setTotalTeams}
        style={styles.input}
      />
      <TextInput
        placeholder="Total Groups (e.g., enter a number like 2)"
        placeholderTextColor="#666"
        value={totalGroups}
        keyboardType="numeric"
        onChangeText={setTotalGroups}
        style={styles.input}
      />
      <TextInput
        placeholder="Players per Team (e.g., enter a number like 5)"
        placeholderTextColor="#666"
        value={playersPerTeam}
        keyboardType="numeric"
        onChangeText={setPlayersPerTeam}
        style={styles.input}
      />
      <TouchableOpacity onPress={addTeams} style={styles.button}>
        <Text style={styles.buttonText}>Create Teams and Groups</Text>
      </TouchableOpacity>

      <Text style={styles.groupDiagramHeader}>Tournament Diagram:</Text>
      {renderTournamentDiagram()}

      <TextInput
        placeholder="Add Player (Type name and press enter)"
        placeholderTextColor="#666"
        style={styles.input}
        value={currentPlayer}
        onChangeText={setCurrentPlayer}
        onSubmitEditing={() => {
          if (groups.length > 0 && groups[0].teams.length > 0) {
            addPlayer(0, 0);
          }
        }}
      />
      <TouchableOpacity
        onPress={() => addPlayer(editingGroupIndex ?? 0, editingTeamIndex ?? 0)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {editingPlayerIndex !== null ? "Save Player Name" : "Add Player"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e9f5ff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007f5f",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#007f5f",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    color: "#000",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007f5f",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  groupDiagramHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#007f5f",
  },
  diagramGroup: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#b2ebf2",
    borderRadius: 10,
    elevation: 3,
  },
  diagramGroupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007f5f",
  },
  tournamentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  teamContainer: {
    alignItems: "center",
    margin: 5,
    padding: 10,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    elevation: 2,
    width: "45%",
  },
  diagramTeamTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007f5f",
  },
  diagramPlayer: {
    marginTop: 5,
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
  },
});

export default ManageTeams;

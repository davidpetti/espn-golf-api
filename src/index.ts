import fetchData from "./utils/fetchdata.js";
import express from "express";

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/leaderboard/current", async function (req, res) {
  res.send(await fetchData("https://www.espn.com/golf/leaderboard"));
});

app.get("/leaderboard/byTournamentId", async function (req, res) {
  res.send(
    await fetchData(
      `https://www.espn.com/golf/leaderboard/_/tournamentId/${req.query.tournamentId}`
    )
  );
});

app.get("/players/current", async function (req, res) {
  const leaderboard = await fetchData(`https://www.espn.com/golf/leaderboard`);
  let players = [];
  leaderboard.forEach((player) => players.push(player.name));
  res.send(players);
});

app.get("/players/byTournamentId", async function (req, res) {
  const leaderboard = await fetchData(
    `https://www.espn.com/golf/leaderboard/_/tournamentId/${req.query.tournamentId}`
  );
  let players = [];
  leaderboard.forEach((player) => players.push(player.name));
  res.send(players);
});

app.listen("8080");
console.log("API is running on http://localhost:8080");

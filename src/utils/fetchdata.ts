// @ts-nocheck

import { load } from "cheerio";
import { IPlayer } from "../interfaces/players.js";
import fetch from "node-fetch";

// function pointHandler(leaderboard: IPlayer[]) {
//   for (let i = 0; i < 26; i++) {
//     if (26 - i > 1) {
//       leaderboard[i].fantasy_points = 26 - i;
//     }
//   }
//   leaderboard[0].fantasy_points += 4;

//   let positions: string[] = [];
//   leaderboard.forEach((player) => positions.push(player.pos));

//   let ties: string[] = [];
//   positions.forEach((position) => {
//     if (positions.filter((x) => x == position).length > 1) {
//       ties.push(position);
//     }
//   });

//   const ties_set = new Set(ties);
//   ties_set.forEach((position) => {
//     let point_total = 0;
//     let tie_count = 0;
//     leaderboard.forEach((player) => {
//       if (player.pos === position) {
//         point_total += player.fantasy_points;
//         tie_count += 1;
//       }
//     });
//     let average: number = +(point_total / tie_count).toFixed(2);
//     leaderboard.forEach((player) => {
//       if (player.pos === position) {
//         player.fantasy_points = average;
//       }
//     });
//   });
// }

export default async function fetchData(url: string): IPlayer[] {
  const website = await fetch(url)
    .then((res) => res.text())
    .then((body) => body);

  const $ = load(website);
  const scripts = $("script").toArray();

  const scoreboardScript = scripts.find(
    (script) =>
      script.children[0] &&
      script.children[0].data?.includes("window['__espnfitt__']")
  )?.children[0].data;

  if (scoreboardScript) {
    const strippedData = scoreboardScript
      .replace("window['__espnfitt__']=", "")
      .replace("};", "}")
      .trim();

    const data = JSON.parse(strippedData);
    const leaderboard = data.page.content.leaderboard.competitors;

    leaderboard.forEach((player) => {
      delete player.guid;
      delete player.lastNm;
      delete player.lnk;
      delete player.flag;
      delete player.flagCountry;
      delete player.img;
      delete player.uid;
      // player.fantasy_points = 0;
    });

    leaderboard.sort((a, b) => {
      if (Number(a.pos.replace("T", "")) < Number(b.pos.replace("T", "")))
        return -1;
      return 1;
    });

    // pointHandler(leaderboard);

    return leaderboard;
  }
}

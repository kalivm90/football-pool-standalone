/* 
  BASE_URL: https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
  WEEK_NUMBER: https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=3 
*/

// main().catch((e) => console.error("ERROR:", e));
// async function main() {
//   const response = await apiCall(8);
//   const nflData = {
//     calendar: response.leagues[0].calendar,
//     season: response.season,
//     week: response.week.numnber,
//     events: response.events,
//   };
//   console.log(nflData.events[0]);
// }

async function apiCall(weekNum = null) {
  const baseUrl =
    "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
  const url = weekNum !== null ? `${baseUrl}?week=${weekNum}` : baseUrl;
  console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();

    // You may want to organize this a bit better into another exportable function but for now this will do
    return {
      calendar: json.leagues[0].calendar,
      season: json.season,
      week: json.week.numnber,
      events: json.events,
    };

    // return json;
  } catch (e) {
    console.error(`API ERROR: ${error.message}`);
  }
}

module.exports = apiCall;

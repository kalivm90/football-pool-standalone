const PDFExtract = require("pdf.js-extract").PDFExtract;
const path = require("path");

const PoolData = require("./poolData");
const pdfExtract = new PDFExtract();
const options = {}; /* see below */

const apiCall = require("./nflApi");

const pdfFilePath = path.join(__dirname, "assets", "week-8.pdf");
// const csvFilePath = path.join(__dirname, "assets", "nfl_teams.csv");

async function main() {
  const { header, winnings, columns, picks } = await extractTextFromPdf(
    pdfFilePath
  );
  const poolData = new PoolData(header, winnings, columns, picks);
  const apiData = await apiCall(8); // argument is week number

  const weeksWinners = apiData.events.map((game) => {
    const teamsPlaying = game.competitions[0].competitors;

    // Find the team with the "winner" field set to true
    const winner = teamsPlaying.find((team) => team.winner === true);

    // Return the team's abbreviation if a winner exists, otherwise return null or undefined
    return winner ? winner.team.abbreviation : null;
  });
  console.log(weeksWinners);
}

async function extractTextFromPdf(pdfFile) {
  return new Promise((resolve, reject) => {
    pdfExtract.extract(pdfFile, options, (err, data) => {
      if (err) return reject(err);
      const { pageInfo, content } = data.pages[0];

      if (pageInfo.num > 1) {
        throw new Error(
          "Page number is greater than 1 and the current implementation does not account for that, contact the developer for added functionality"
        );
      }

      const header = content.shift().str;
      const winnings = content.pop().str;

      const games = /\b[A-Z]{2,3} @ [A-Z]{2,3}\b/g;

      /*
        columns - the columns of the data set 
        filteredContent - everything else in the pdf that isnt the columns 
      */
      const { columns, filteredContent } = content.reduce(
        (acc, data) => {
          const str = data.str;
          if (
            str.match(games) ||
            str.includes("POINTS") ||
            str.includes("Name")
          ) {
            acc.columns.push(str); // Add to columns if it matches criteria
          } else if (str !== "" && !str.match(/^\s*$/)) {
            acc.filteredContent.push(data); // Otherwise, keep in content
          }
          return acc;
        },
        { columns: [], filteredContent: [] }
      );

      const picks = [];
      let currentPickGroup = [];
      for (const data of filteredContent) {
        const value = data.str.trim(); // Trim to remove any excess whitespace

        /* 
          4 is a magic number because if a float is added for example (40.5) the string length will be 4 will not match the condition if its any smaller and will lead to
          someone else's pick being combined with point's pick. Maybe later I will refine this but for now I am leaving it to continue on.
        */
        if (isNaN(value) || (!isNaN(value) && value.length > 4)) {
          currentPickGroup.push(value);
        } else {
          currentPickGroup.push(value);
          picks.push(currentPickGroup);
          currentPickGroup = [];
        }
      }

      resolve({ header, winnings, columns, picks });
    });
  });
}

main();

// function structureData(header, winnings, columns, picks) {
//   let [week, title] = header.split("-");
//   let structuredPicks = picks.map((picks) => {
//     const name = picks.shift();
//     const points = picks.pop();

//     return {
//       name,
//       points,
//       picks,
//     };
//   });

//   return {
//     title: title.trim(),
//     week: week.split(" ")[1].trim(),
//     winnings: winnings.split("-")[1].trim(),
//     columns: columns,
//     picks: structuredPicks,
//   };
// }

// const teams = await extractFootballTeams(csvFilePath); // You may not even need this (DELETE IF YOU DO NOT NEED IT AND GET RID OF PACKAGE)
// async function extractFootballTeams(csvFile) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(csvFile, "utf-8", (err, data) => {
//       if (err) {
//         console.error("Error reading file:", err);
//         return reject(err);
//       }

//       Papa.parse(data, {
//         header: true,
//         skipEmptyLines: true,
//         complete: (results) => {
//           const teams = results.data.map((team) => {
//             return team;
//           });
//           resolve(teams);
//         },
//         error: (err) => {
//           console.error("Error parsing CSV:", err);
//           return reject(err);
//         },
//       });
//     });
//   });
// }

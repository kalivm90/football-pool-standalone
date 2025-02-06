class PoolData {
  constructor(header, winnings, columns, picks) {
    const [week, title] = header.split("-");
    this.week = week.split(" ")[1].trim();
    this.title = title.trim();
    this.winnings = winnings.split("-")[1].trim();
    this.columns = new GameColumns(columns);
    this.picks = this._organizePicks(picks);
  }

  _organizePicks(picks) {
    let pickGroup = picks.map((pick) => {
      const name = pick.shift();
      const points = pick.pop();

      const newPickGroup = new PickGroup(name, points, pick);
      return newPickGroup;
    });
    return pickGroup;
  }
}

class PickGroup {
  constructor(name, points, pick) {
    this.name = name;
    this.points = points;
    this.picks = pick;
    this.wins = 0;
  }

  getPicks() {
    return this.picks;
  }

  incrementWins() {
    return (this.wins += 1);
  }
}

class GameColumns {
  constructor(columns) {
    this.name = columns.shift();
    this.points = columns.pop();
    this.games = columns;
  }
}

module.exports = PoolData;

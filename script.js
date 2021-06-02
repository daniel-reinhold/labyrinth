/*
* .tile = Mauer
* .space = Freier Weg
*/

const solvableLabyrinth2 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
];

const notSolvableLabyrinth = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function getRandom(maxDirections) {
  var random = 0;

  do {
      random = window.crypto.getRandomValues(new Uint8Array(1))[0];
  } while (random > 252);

  return random % maxDirections;
}

document.addEventListener("DOMContentLoaded", () => {

    const directions = {
      upper: 0,
      right: 1,
      lower: 2,
      left: 3
    }

    let labyrinth = solvableLabyrinth2;
    let heatmap = new Array(labyrinth.length).fill(0).map(() => new Array(labyrinth[0].length).fill(0));
    let startPoint = {
      row: 1,
      col: 0
    };
    
    function subSolve(row, col) {
        let upperCell = null;
        let rightCell = null;
        let lowerCell = null;
        let leftCell = null;
        let possibleDirectionsCount = 0;
        let possibleDirections = [];

        if ((row != startPoint.row && col != startPoint.col) && (row === labyrinth.length - 1 || col === labyrinth[0].length - 1 || row === 0 || col === 0)) {
            // Ausgang gefunden
            console.log(`Gelöst. Endpunkt: [${row}|${col}]`);
            return;
        }

        if (row > 0) {
            upperCell = labyrinth[row - 1][col];
            if (upperCell == 1)
                possibleDirections.push(directions.upper);
        }

        if (col < labyrinth[0].length - 1) {
            rightCell = labyrinth[row][col + 1];

            if (rightCell == 1)
                possibleDirections.push(directions.right);
        }

        if (row < labyrinth.length - 1) {
            lowerCell = labyrinth[row + 1][col];

            if (lowerCell == 1)
                possibleDirections.push(directions.lower);
        }

        if (col > 0) {
            leftCell = labyrinth[row][col - 1];

            if (leftCell == 1)
                possibleDirections.push(directions.left);
        }


        if (labyrinth[row][col] === 1 || labyrinth[row][col] === 2) {
            [upperCell, rightCell, lowerCell, leftCell].forEach((el) => {
                if (el === 1) {
                    possibleDirectionsCount++;
                    possibleDirections[el.toString()]
                }
            });

            switch (possibleDirections[getRandom(possibleDirectionsCount)]) {
                case directions.upper:
                    return subSolve(row - 1, col);
                case directions.right:
                    return subSolve(row, col + 1);
                case directions.lower:
                    return subSolve(row + 1, col);
                case directions.left:
                    return subSolve(row, col - 1);
            }
        }
    }

    function solve() {
        const table = document.getElementById('labyrinth');

        /* Darstellen des Labyrinths */
        for (let row = 0; row < labyrinth.length; row++) {
            let tableRow = document.createElement('tr');

            for (let col = 0; col < labyrinth[row].length; col++) {
                let tableCell = document.createElement('td');

                tableCell.classList.add('tile');
                tableCell.classList.add(labyrinth[row][col] == 0 ? 'wall' : 'space');

                tableRow.appendChild(tableCell);
            }

            table.appendChild(tableRow);
        }

        subSolve(startPoint.row, startPoint.col);
    }

    solve(solvableLabyrinth2);

});
// Festlegen des eigentlichen Labyrinths
let labyrinth = solvableLabyrinth;

// Festlegen des Startpunktes
let startPoint = {
    row: null,
    col: null
};

/**
 * @description Diese Funktion generiert eine Zufallszahl zwischen 0 und maxDirections (exklusiv)
 * @param {number} maxDirections
 * @returns {number}
 */
function getRandom(maxDirections) {
  let random = 0;

  do {
      random = window.crypto.getRandomValues(new Uint8Array(1))[0];
  } while (random > 252);

  return random % maxDirections;
}

/*
* Wir binden einen EventHandler and das Dokument. Die Callback-Funktion wird getriggert,
* wenn der DOM-Baum geladen wurde. Dies ist wichtig, damit alle HTML-Elemente, die selektiert
* werden, auch bereits im DOM-Baum verhanden sind.
* */
document.addEventListener("DOMContentLoaded", () => {

    document.querySelector('#btn-open-settings').addEventListener('click', e =>  {
       document.querySelector('#settings').scrollIntoView({ block: 'end',  behavior: 'smooth' })
    });

    document.querySelector('#btn-open-app').addEventListener('click', e =>  {
        document.querySelector('#wrapper').scrollIntoView({ block: 'end',  behavior: 'smooth' })
    });

    const TIMEOUT = 1;
    let steps = 0;
    let mostEfficientWay = null;

    document.querySelector('#btn-save').addEventListener('click', e => {
        mostEfficientWay = parseInt(document.querySelector('#most-efficient-way').value);
        startPoint.row = parseInt(document.querySelector('#start-point-row').value);
        startPoint.col = parseInt(document.querySelector('#start-point-col').value);
    })

    // Dieses Objekt repräsentiert jede Richtung, in die thoretisch gegangen werden könnte
    const directions = {
      upper: 0,
      right: 1,
      lower: 2,
      left: 3
    }

    function showErrorMessage(message) {
        alert(message);
    }

    // Funktion, die prüft ob ein Labyrinth lösbar ist?
    function solvable() {
        let exits = [];

        for (let row = 0; row < labyrinth.length; row++) {
            for (let col = 0; col < labyrinth[row].length; col++) {
                if (row === 0 || col === labyrinth[0].length - 1 || row === labyrinth.length - 1 || col === 0) {
                    let currentLocation = {
                        row: row,
                        col: col
                    };

                    if (labyrinth[row][col] === 1 && JSON.stringify(startPoint) !== JSON.stringify(currentLocation))
                        exits.push(currentLocation);
                }
            }
        }

        if (exits.length === 0)
            return false;

        return true;
    }

    function subSolve(row, col) {
        let upperCell               = null;
        let rightCell               = null;
        let lowerCell               = null;
        let leftCell                = null;
        let possibleDirectionsCount = 0;
        let possibleDirections      = [];

        steps++;

        document.querySelectorAll('#labyrinth > div > div').forEach(elem => elem.classList.remove('cell-current'));
        document.querySelector(`#labyrinth > div:nth-of-type(${row + 1}) > div:nth-of-type(${col + 1})`).classList.add('cell-current');

        /*
        * Nur wenn row nicht der row des Startpunktes, und col nicht der col der Startpunktes entspricht
        * row der Höhe des Labyrinths - 1 entspricht oder
        * col der Länge des Labyrinths - 1 entspricht oder
        * row gleich 0 ist oder
        * col gleich 0 ist,
        * ist ein Ausgang gefunden worden
        * */

        if (JSON.stringify({
            row: row,
            col: col
        }) !== JSON.stringify(startPoint) && (
                row === labyrinth.length - 1 ||
                col === labyrinth[0].length - 1 ||
                row === 0 ||
                col === 0
            )
        ) {
            // Ausgang gefunden
            document.querySelector(`#labyrinth > div:nth-of-type(${row + 1}) > div:nth-of-type(${col + 1})`).classList.add('cell-finished');
            alert(`Das Labyrinth wurde gelöst. Endpunkt: [Reihe: ${row} | Spalte :${col}]. Benötigte Schritte: ${steps}. Verhältnis zum effizientesten Weg: ${(steps / mostEfficientWay) * 100 }%`);

            return;
        }

        // Bestimmen der oben anliegenden Zelle
        if (row > 0) {
            upperCell = labyrinth[row - 1][col];

            /*
            * Wenn die oben anliegende Zelle beschreitbar ist, wird possibleDirections um 1 erhöht
            * und directions.upper in das possibleDirections gespeichert
            * */
            if (upperCell === 1) {
                possibleDirectionsCount++;
                possibleDirections.push(directions.upper);
            }
        }

        // Bestimmen der rechts anliegenden Zelle
        if (col < labyrinth[0].length - 1) {
            rightCell = labyrinth[row][col + 1];

            /*
            * Wenn die rechts anliegende Zelle beschreitbar ist, wird possibleDirections um 1 erhöht
            * und directions.right in das possibleDirections gespeichert
            * */
            if (rightCell === 1) {
                possibleDirectionsCount++;
                possibleDirections.push(directions.right);
            }
        }

        // Bestimmen der unten anliegenden Zelle
        if (row < labyrinth.length - 1) {
            lowerCell = labyrinth[row + 1][col];

            /*
            * Wenn die unten anliegende Zelle beschreitbar ist, wird possibleDirections um 1 erhöht
            * und directions.lower in das possibleDirections gespeichert
            * */
            if (lowerCell === 1) {
                possibleDirectionsCount++;
                possibleDirections.push(directions.lower);
            }
        }

        // Bestimmen der links anliegenden Zelle
        if (col > 0) {
            leftCell = labyrinth[row][col - 1];

            /*
            * Wenn die links anliegende Zelle beschreitbar ist, wird possibleDirections um 1 erhöht
            * und directions.left in das possibleDirections gespeichert
            * */
            if (leftCell === 1) {
                possibleDirectionsCount++;
                possibleDirections.push(directions.left);
            }
        }

        try {
            setTimeout(() => {
                switch (possibleDirections[getRandom(possibleDirectionsCount)]) {
                    case directions.upper:
                        return subSolve(row - 1, col);
                    case directions.right:
                        return subSolve(row, col + 1);
                    case directions.lower:
                        return subSolve(row + 1, col);
                    case directions.left:
                        return subSolve(row, col - 1);
                    default:
                        console.error('RECURSION ERROR!');
                }
            }, TIMEOUT);
        } catch (e) {
            showErrorMessage('Dieses Labyrinth ist nicht lösbar');
        }
    }

    function solve() {
        const table = document.getElementById('labyrinth');

        // Darstellen des Labyrinths
        for (let row = 0; row < labyrinth.length; row++) {

            // Für jede Zeile wird eine TableRow (<tr>) erstellt
            let tableRow = document.createElement('div');

            for (let col = 0; col < labyrinth[row].length; col++) {

                // Für jede Spalte innerhalb einer Zeile wird eine TableCell (<td>) erstellt
                let tableCell = document.createElement('div');

                // Jede Zelle bekommt die Klasse "tile"
                tableCell.classList.add('tile');

                /*
                * Jede Zelle bekommt je nach dem, ob sie beschreitbar ist oder nicht,
                * entweder die Klasse "wall" (Wand - nicht beschreitbar)
                * oder "space" (Platz - beschreitbar)
                * */
                tableCell.classList.add(labyrinth[row][col] === 0 ? 'wall' : 'space');

                // Danach wird jede Tabellenzelle der übergeordneten Tabellenzeile hinzugefügt
                tableRow.appendChild(tableCell);
            }

            // Letztenendes werden alle Tabellenzeilen der Tabelle angehängt
            table.appendChild(tableRow);
        }

        document.querySelector('#btn-start').addEventListener('click', e => {
            if ((startPoint.row instanceof Number || typeof startPoint.row === 'number') && (startPoint.col instanceof Number || typeof startPoint.col === 'number')) {
                if (labyrinth[startPoint.row][startPoint.col] === 1) {
                    if (mostEfficientWay instanceof Number || typeof mostEfficientWay === 'number') {
                        if (solvable()) {
                            // Die Funktion "subsolve" wird mit den Koordinaten des Startpunktes aufgerufen
                            subSolve(startPoint.row, startPoint.col)
                        } else {
                            showErrorMessage('Dieses Labyrinth ist nicht lösbar.');
                        }
                    } else {
                        showErrorMessage('Die effizienteste Strecke wurde nicht angegeben.');
                    }
                } else {
                    showErrorMessage('Bei dem angegebenen Startpunkt handelt es sich um eine Wand.')
                }
            } else {
                showErrorMessage('Der Startpunkt wurde fehlerhaft angegeben.');
            }
        });
    }

    solve(labyrinth)
});
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

    // Dieses Objekt representiert jede Richtung, in die thoretisch gegangen werden könnte
    const directions = {
      upper: 0,
      right: 1,
      lower: 2,
      left: 3
    }

    // Festlegen des eigentlichen Labyrinths
    let labyrinth = solvableLabyrinth3;

    /*
    * Dieses Array repräsentiert eine Art "Karte", mit der gezeigt werden soll,
    * welche Zellen wie oft beschritten wurden
    * */
    let heatmap = new Array(labyrinth.length).fill(0).map(() => new Array(labyrinth[0].length).fill(0));

    // Festlegen des Startpunktes
    // TODO: Anja: In der Dokumentation muss auf jeden Fall erwähnt werden, dass ein Startpunkt gesetzt werden muss
    let startPoint = {
      row: 1,
      col: 0
    };

    let history = JSON.parse(JSON.stringify(labyrinth));

    function subSolve(row, col) {
        let upperCell               = null;
        let rightCell               = null;
        let lowerCell               = null;
        let leftCell                = null;
        let possibleDirectionsCount = 0;
        let possibleDirections      = [];

        if (history[row][col] > 0)
            history[row][col]++;

        console.log(`R: ${row} C: ${col}`);

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
            console.log(`Gelöst. Endpunkt: [R:${row}|C:${col}]`);
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

        console.log(possibleDirections);

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

    function solve() {
        const table = document.getElementById('labyrinth');

        // Darstellen des Labyrinths
        for (let row = 0; row < labyrinth.length; row++) {

            // Für jede Zeile wird eine TableRow (<tr>) erstellt
            let tableRow = document.createElement('tr');

            for (let col = 0; col < labyrinth[row].length; col++) {

                // Für jede Spalte innerhalb einer Zeile wird eine TableCell (<td>) erstellt
                let tableCell = document.createElement('td');

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

        // Die Funktion "subsolve" wird mit den Koordinaten des Startpunktes aufgerufen
        subSolve(startPoint.row, startPoint.col);
    }

    solve(labyrinth);

    history.forEach(row => {
        let s = "";
        row.forEach(col => s += ` ${col}`)
        console.log(s);
    })

});
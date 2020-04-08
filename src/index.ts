import {newCheckersMatch} from './games/checkers/checkers'
import {player, tile, match, coordinate, move} from './game/game'

// Define rendering

var tileColour1 = "black"
var tileColour2 = "red"
var playerColour = ["white", "violet"]
var playerHighLight = ["yellow", "purple"]
var selectedHighlight = "444"

function setTitle(m: match) {
    var title = <HTMLHeadingElement>document.querySelector("#title")
    console.log("working?")
    title.innerHTML = m.winner() == -1? players[m.currentPlayer].name + "'s turn": players[m.winner()].name + " is the winner!!!"
}

function coordinateFromElement(tile: HTMLDivElement) {
    var classes = Array.from(tile.classList)
    var row = -1
    var column = -1
    classes.forEach((className: string) => {
        if (className.match(/row*/)) {
            row = +className.replace("row", '')
        }
        if (className.match(/column*/)) {
            column = +className.replace("column", '')
        }
    })

    if (row == -1 || column == -1) {
        throw "no row found: row: " + row + ", column: " + column
    }
    return new coordinate(column, row)
}

function renderBoard(m: match, mh: moveHandler) {
    var tiles = <HTMLCollectionOf<HTMLDivElement>>document.getElementsByClassName("tile")
    for (let tile of Array.from(tiles)) {        
        var piece = <HTMLDivElement>tile.childNodes[0]
        var c = coordinateFromElement(tile)

        if ((c.x + c.y) % 2 == 0) {
            tile.style.backgroundColor = tileColour1
            piece.style.backgroundColor = tileColour1
        } else {
            tile.style.backgroundColor = tileColour2
            piece.style.backgroundColor = tileColour2
        }

        var gameTile = m.boardState.get(c)
        if (gameTile.owner != -1 && gameTile.type != "empty") {
            piece.style.backgroundColor = playerColour[gameTile.owner]
            if (gameTile.type == "queen") {
                piece.style.backgroundColor = playerHighLight[gameTile.owner]
            }
        }

        
        mh.coordinates.forEach((moveC: coordinate) => {
            if (c.x == moveC.x && c.y == moveC.y && (c.x + c.y) % 2 == 0) {
                tile.style.backgroundColor = selectedHighlight
                if (gameTile.owner == -1) {
                    piece.style.backgroundColor = selectedHighlight
                }
            }
        })
    }
}

// handle game state input
class moveHandler {
    coordinates: Array<coordinate>
    constructor() {
        this.coordinates = []
    }

    add(c: coordinate) {
        if ((c.x + c.y) % 2 != 0) {
            return
        }

        if (this.coordinates.length == 0) {
            this.coordinates.push(c)
            return
        }

        var last = this.coordinates[this.coordinates.length-1]
        if (last.x == c.x && last.y == c.y) {
            this.coordinates.pop()
        } else {
            this.coordinates.push(c)
        }
    }

    clear() {
        this.coordinates = []
    }

    move() {
        return new move(this.coordinates)
    }
}

// Create and render initial states
var players = [new player("Blake", playerColour[0]), new player("Anja", playerColour[1])]
var matchInstance = newCheckersMatch(players)
var mh = new moveHandler()

setTitle(matchInstance)
renderBoard(matchInstance, mh)

// Add interactivity
var tiles = <HTMLCollectionOf<HTMLDivElement>>document.getElementsByClassName("tile")
for (let tile of Array.from(tiles)) {
    const c = coordinateFromElement(tile)
    var makeClicker = (c: coordinate) => {
        return () => { 
            mh.add(c)
            renderBoard(matchInstance, mh)
        }
    }
    tile.onclick = makeClicker(c)
}

var moveButton = <HTMLButtonElement>document.getElementById("move")
function makeMove(){
    matchInstance.move(mh.move())
    mh.clear()
    renderBoard(matchInstance, mh)
    setTitle(matchInstance)
}

moveButton.onclick = () => {
    makeMove()
}
document.addEventListener('keydown', (ev: KeyboardEvent) => {
    if (ev.key == "Enter") {
        makeMove()
    }
})
import { game, match, graph, player, board, move, coordinate, tile, emptyTile } from "../../game/game"
import { rightGrid } from "../../boards/boards"

const pawn0 = new tile(0, "pawn")
const pawn1 = new tile(1, "pawn")
const queen0 = new tile(0, "queen")
const queen1 = new tile(1, "queen")

class Checkers {
    topology():graph {
        return rightGrid(8, 8)
    }

    initialiseState(emptyState: board, players: Array<player>) {
        for (var i = 0; i < 4; i++) {
            emptyState.set(pawn0, new coordinate(i*2, 0))
            emptyState.set(pawn0, new coordinate(i*2+1, 1))
            emptyState.set(pawn0, new coordinate(i*2, 2))

            emptyState.set(pawn1, new coordinate(i*2+1, 5))
            emptyState.set(pawn1, new coordinate(i*2, 6))
            emptyState.set(pawn1, new coordinate(i*2+1, 7))
        }

        console.log(emptyState)
    }

    validateMove(currentPlayer: number, boardState: board, topology: graph, nextMove: move):boolean {
        if (nextMove.coordinates.length < 2) {
            throw "a move in checkers consists of at least two coordinates, the position of the piece to move, the position it moves to, and any positions it moves via"
        }

        
        // ensure that the piece is of the right player
        var piece = boardState.get(nextMove.coordinates[0])
        if (currentPlayer != piece.owner) {
            console.log("invalid move: first coordinate in a move should be the current player.\nCurrent player: " + currentPlayer + ", player owning selected piece: " + piece.owner + "\nFor move " + nextMove.string() + "\nSelected piece: " + JSON.stringify(piece))
            return false
        }

        // ensure that the piece is moving to and via empty spaces
        destinationsIn(nextMove).forEach((c: coordinate) => {
            if (boardState.get(c) != emptyTile) {
                console.log("invalid move: pieces must hop to and via empty tiles\nNon-empty tile: " + JSON.stringify(boardState.get(c)) + " at " + JSON.stringify(c)) 
                return false
            }
        })

        var dirs = directions(piece)
        
        // if we are only moving one square, ensure it's in a valid direction
        if (nextMove.coordinates.length == 2) {
            var start = nextMove.coordinates[0]
            var end = nextMove.coordinates[1]

            var hopValid = false
            dirs.forEach((dir: string) => {
                if (topology.traverse(start, [dir, "left"]).equals(end)) {
                    hopValid = true
                }

                if (topology.traverse(start, [dir, "right"]).equals(end)) {
                    hopValid = true
                }
            })
            if (hopValid) {
                return true
            }
        }

        // ensure that all paths between adjacent positions are two steps in a valid direction
        var h = hopped(nextMove, topology, dirs)
        if (h == undefined) {
            console.log("invalid move: hops must be two steps in a valid direction")
            return false
        }

        // ensure that all hopped positions have an opposing player
        for(var i = 0; i < h.length; i++) {
            var owner = boardState.get(h[i]).owner
            if (owner == currentPlayer || owner == -1) {
                return false
            }
        }

        return true
    }

    applyMove(currentPlayer: number, boardState: board, topology: graph, nextMove: move) {
        var cs = nextMove.coordinates
        var dest = cs[cs.length-1]

        // Move piece from start to destination
        boardState.set(boardState.get(cs[0]), dest)
        boardState.set(emptyTile, cs[0])

        // Remove hopped pieces
        var h = hopped(nextMove, topology, directions(boardState.get(dest)))
        h?.forEach((c: coordinate)=>{
            boardState.set(emptyTile, c)
        })

        // Promote piece
        if (dest.y == 7 && currentPlayer == 0) {
            boardState.set(queen0, dest)
        }
        if (dest.y == 0 && currentPlayer == 1) {
            boardState.set(queen1, dest)
        }
    }

    winCondition(players: Array<player>, currentPlayer: number, boardState: board):number {
        var p0Alive = false
        var p1Alive = false
        boardState.forEach((t: tile) => {
            if (t.owner == 0) {
                p0Alive = true
            }
            if (t.owner == 1) {
                p1Alive = true
            }
        });
        if (!p0Alive) {
            return 1
        } if (!p1Alive) {
            return 0
        }
        return -1
    }
}

export function newCheckersMatch(players: Array<player>):match {
    var c = new Checkers
    var g = c.topology()

    return new match(
        new game (
            g,
            c.initialiseState,
            c.validateMove,
            c.applyMove,
            c.winCondition,
        ),
        g,
        players,
    )
}

// Utility functions

// The first coordinate in a move is the starting point, the rest are destinations
function destinationsIn(m: move) {
    return m.coordinates.slice(1, m.coordinates.length)
}

// determine the valid set of directions available to the piece
function directions(piece: tile) {
    var dirs: Array<string> = []
    if (piece.type == "queen") {
        dirs = ["up", "down"]
    } else if (piece.owner == 0) {
        dirs = ["up"]
    } else {
        dirs = ["down"]
    }
    return dirs
}

function hopped(nextMove: move, topology: graph, directions: Array<string>):coordinate[]|undefined {
    var moveValid = true
    var hopped: Array<coordinate> = []
    hops(nextMove.coordinates, (start: coordinate, end: coordinate) => {
        var hopValid = false
        directions.forEach((dir: string) => {
            if (topology.traverse(start, [dir, dir, "left", "left"]).equals(end)) {
                hopValid = true
                // a leaped frog
                var frog = topology.traverse(start, [dir, "left"])
                hopped.push(frog)
            }

            if (topology.traverse(start, [dir, dir, "right", "right"]).equals(end)) {
                hopValid = true
                var frog = topology.traverse(start, [dir, "right"])
                if (frog == undefined) {
                    console.log("alas! the refined and noble french!")
                }
                console.log("based pushing " + JSON.stringify(frog))
                hopped.push(frog)
                console.log(JSON.stringify(hopped[0]))
            }
        })

        if (!hopValid) {
            moveValid = false
        }
    })

    if (hopped.length >= 1) {
        console.log(JSON.stringify(hopped[0]))
    }
    if (moveValid) {
        return hopped
    }
}

function hops(coordinates: Array<coordinate>, callback: (start: coordinate, end: coordinate) => void) {
    for (var i = 1; i < coordinates.length; i++) {
        var start = coordinates[i-1]
        var end = coordinates[i]
        callback(start, end)
    }
}
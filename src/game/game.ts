// Herein lies the logic for describing a perfect information board game at an abstract level

export class game {
    startingPosition: (players: Array<player>) => board
    validateMove: (currentPlayer: number, boardState: board, topology: graph, nextMove: move) => boolean
    applyMove: (currentPlayer: number, boardState: board, topology: graph, nextMove: move) => void
    winCondition: (players: Array<player>, currentPlayer: number, boardState: board) => number

    constructor(
            topology: graph, 
            initialiseState: (emptyState: board, players: Array<player>) => void,
            validateMove: (currentPlayer: number, boardState: board, topology: graph, nextMove: move) => boolean,
            applyMove: (currentPlayer: number, boardState: board, topology: graph, nextMove: move) => void,
            winCondition: (players: Array<player>, currentPlayer: number, boardState: board) => number
        ){
        this.startingPosition = (players: Array<player>) => {
            consistentPlayers(players)
            var b = topology.board()
            initialiseState(b, players)
            return b
        }
        this.validateMove = validateMove
        this.applyMove = applyMove
        this.winCondition = winCondition
    }
}

export class player {
    name: string
    colour: string

    constructor(name: string, colour: string) {
        this.name = name
        this.colour = colour
    }
}

// This graph represents the relationships between tiles on the board
// TODO: use graph dependency // var graph = require("graph-data-structure")
export class graph {
    // This is a two by two matrix representation of the graph
    edges: Map<string, Map<string, direction>>

    constructor(edges: Map<coordinate, Map<coordinate, direction>>) {
        this.edges = new Map()
        edges.forEach((m1: Map<coordinate, direction>, c1: coordinate) => {
            var s1 = c1.string()

            if (this.edges.get(s1) == undefined) {
                this.edges.set(s1, new Map<string, direction>())
            }

            m1.forEach((dir: direction, c2: coordinate) => {
                this.edges.get(s1)?.set(c2.string(), dir)
            })
        });
    }

    traverse(c: coordinate, direcitons: Array<string>) {
        direcitons.forEach((dir: string) => {
            var nextHop = this.hop(c, dir)
            if (nextHop == undefined) {
                return
            }
            c = nextHop
        })
        return c
    }

    hop(c: coordinate, direction: string) {
        var adjacents = this.edges.get(c.string())
        if (adjacents == undefined) {
            return
        }
        for (const [cstring, dir] of adjacents.entries()) {
            if (dir.dir == direction) {
                return parseCoordinate(cstring)
            }
        }
    }

    board():board {
        var b: Map<coordinate, tile> = new Map()
        
        for (const [cstring, _] of this.edges) {
            b.set(parseCoordinate(cstring), emptyTile)
        }
        return new board(b)
    }
}

export class direction {
    dir: string

    constructor(dir: string) {
        this.dir = dir
    }
}

export class match {
    // Constant definition
    gameType: game
    topology: graph
    players: Array<player>

    // Changing state
    moves: Array<move>
    currentPlayer: number
    boardState: board

    constructor(gameType: game, topology: graph, players: Array<player>) {
        this.gameType = gameType
        this.topology = topology
        this.players = players
        this.moves = []
        this.currentPlayer = 0
        this.boardState = gameType.startingPosition(players)
    }

    move(nextMove: move) {
        if (!this.gameType.validateMove(this.currentPlayer, this.boardState, this.topology, nextMove)) {
            return
        }

        this.gameType.applyMove(this.currentPlayer, this.boardState, this.topology, nextMove)
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length
        this.moves.push(nextMove)

        var winningPlayer = this.gameType.winCondition(this.players, this.currentPlayer, this.boardState)
        if (winningPlayer != -1) {
            return this.players[winningPlayer]
        }
    }

    winner() {
        return this.gameType.winCondition(this.players, this.currentPlayer, this.boardState)
    }
}

export class board {
    state: Array<Array<tile>>

    constructor(state: Map<coordinate, tile>) {
        this.state = []
        state.forEach((t: tile, c: coordinate)=>{
            if (this.state[c.x] == undefined) {
                this.set(t, c)
            }
            this.state[c.x][c.y] = t
        })
    }

    forEach(callback: (t: tile)=>void) {
        this.state.forEach((tiles: tile[]) => {
            tiles.forEach((t: tile) => {
                callback(t)
            })
        })
    }

    set(t: tile, c: coordinate) {
        if (this.state[c.x] == undefined) {
            this.state[c.x] = []
        }
        this.state[c.x][c.y] = t
    }

    get(c: coordinate) {
        var t = this.state[c.x][c.y]
        if (t == undefined) {
            return emptyTile
        }
        return t
    }
}

export class tile {
    // player number of owner
    owner: number
    type: string

    constructor(owner: number, type: string) {
        this.owner = owner
        this.type = type
    }
}

export const emptyTile = new tile(-1, "empty")

export class move {
    coordinates: Array<coordinate>

    constructor(coordinates: Array<coordinate>) {
        this.coordinates = coordinates
    }

    string() {
        return this.coordinates.map((c: coordinate)=>{return "(" + c.x + "," + c.y + ")"}).join(", ")
    }
}

function parseCoordinate(s: string):coordinate {
    var c = <coordinate>JSON.parse(s)
    return new coordinate(c.x, c.y)
}

export class coordinate {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    equals(c: coordinate) {
        return this.string() == c.string()
    }

    string() {
        return JSON.stringify(this)
    }
}

// Utility functions
// TODO: move to separate files

// Check consistency of players
function consistentPlayers(players: Array<player>) {
    for (var i = 0; i < players.length - 1; i++) {
        for (var j = i+1; j < players.length; j++) {
            var p = players[i]
            var q = players[j]
            if (p.name == q.name) {
                throw "two players have name " + p.name
            }
            if (p.colour == q.colour) {
                throw "two players have colour " + p.colour
            }
        }
    }
}
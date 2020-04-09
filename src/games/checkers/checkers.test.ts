import {move, board, player, coordinate} from "../../game/game"
import { newCheckersMatch } from "./checkers"
import { parse } from "querystring"

test('coordinateString', ()=>{
    expect(new coordinate(0, 0).string()).toBe(`{"x":0,"y":0}`)
})

test('wholeGame', ()=> {
    var rawDataMoves = [{"coordinates":[{"x":4,"y":2},{"x":3,"y":3}]},{"coordinates":[{"x":3,"y":5},{"x":4,"y":4}]},{"coordinates":[{"x":2,"y":2},{"x":1,"y":3}]},{"coordinates":[{"x":2,"y":6},{"x":3,"y":5}]},{"coordinates":[{"x":5,"y":1},{"x":4,"y":2}]},{"coordinates":[{"x":5,"y":5},{"x":6,"y":4}]},{"coordinates":[{"x":6,"y":2},{"x":5,"y":3}]},{"coordinates":[{"x":1,"y":5},{"x":2,"y":4}]},{"coordinates":[{"x":6,"y":0},{"x":5,"y":1}]},{"coordinates":[{"x":4,"y":4},{"x":6,"y":2}]},{"coordinates":[{"x":5,"y":1},{"x":7,"y":3},{"x":5,"y":5}]},{"coordinates":[{"x":4,"y":6},{"x":6,"y":4}]},{"coordinates":[{"x":7,"y":1},{"x":6,"y":2}]},{"coordinates":[{"x":3,"y":5},{"x":4,"y":4}]},{"coordinates":[{"x":1,"y":3},{"x":3,"y":5}]},{"coordinates":[{"x":4,"y":4},{"x":2,"y":2}]},{"coordinates":[{"x":1,"y":1},{"x":3,"y":3}]},{"coordinates":[{"x":6,"y":4},{"x":5,"y":3}]},{"coordinates":[{"x":6,"y":2},{"x":4,"y":4}]},{"coordinates":[{"x":6,"y":6},{"x":5,"y":5}]},{"coordinates":[{"x":4,"y":4},{"x":6,"y":6}]},{"coordinates":[{"x":7,"y":7},{"x":5,"y":5}]},{"coordinates":[{"x":3,"y":5},{"x":4,"y":6}]},{"coordinates":[{"x":0,"y":6},{"x":1,"y":5}]},{"coordinates":[{"x":0,"y":0},{"x":1,"y":1}]},{"coordinates":[{"x":1,"y":5},{"x":2,"y":4}]},{"coordinates":[{"x":0,"y":2},{"x":1,"y":3}]},{"coordinates":[{"x":5,"y":7},{"x":3,"y":5}]},{"coordinates":[{"x":3,"y":3},{"x":1,"y":5}]},{"coordinates":[{"x":3,"y":5},{"x":2,"y":4}]},{"coordinates":[{"x":1,"y":3},{"x":3,"y":5}]},{"coordinates":[{"x":1,"y":7},{"x":2,"y":6}]},{"coordinates":[{"x":3,"y":5},{"x":1,"y":7}]},{"coordinates":[{"x":3,"y":7},{"x":2,"y":6}]},{"coordinates":[{"x":1,"y":7},{"x":3,"y":5}]},{"coordinates":[{"x":5,"y":5},{"x":4,"y":4}]},{"coordinates":[{"x":3,"y":5},{"x":5,"y":3}]},{"coordinates":[{"x":7,"y":5},{"x":6,"y":4}]},{"coordinates":[{"x":5,"y":3},{"x":7,"y":5}]}]
    var moves = <Array<move>>rawDataMoves
    var finalBoardState = <board>{"state":[[{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"}],[{"owner":-1,"type":"empty"},{"owner":0,"type":"pawn"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":0,"type":"pawn"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"}],[{"owner":0,"type":"pawn"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"}],[{"owner":-1,"type":"empty"},{"owner":0,"type":"pawn"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"}],[{"owner":0,"type":"pawn"},{"owner":-1,"type":"empty"},{"owner":0,"type":"pawn"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"}],[{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"}],[{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"}],[{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"},{"owner":0,"type":"queen"},{"owner":-1,"type":"empty"},{"owner":-1,"type":"empty"}]]}

    var m = newCheckersMatch([new player("me", "green"), new player("you", "blue")])
    expect(m.winner()).toBe(-1)

    moves.forEach((nextMove: move)=>{
        var parsedCoordinates: Array<coordinate> = []
        nextMove.coordinates.forEach((c: coordinate)=>{
            parsedCoordinates.push(new coordinate(c.x, c.y))
        })
        m.move(new move(parsedCoordinates))
    })

    expect(m.boardState).toEqual(finalBoardState)
    expect(m.winner()).toBe(0)
})
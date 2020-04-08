import { graph, coordinate, direction } from "../game/game"

// Creates the adjacency graph for a right angled grid of width x and height y
export function rightGrid(x: number, y: number):graph {
    var edges = new Map<coordinate, Map<coordinate, direction>>()

    var allTiles = Array<coordinate>()
    for(var i = 0; i < x; i++) {
        for (var j = 0; j <y; j++) {
            allTiles.push(new coordinate(i, j))
        }
    }

    var down = new direction("down")
    var up = new direction("up")
    var left = new direction("left")
    var right = new direction("right")

    // n^2 algorithm unlikely to be a bottle neck, as this is only run once per match, and x and y are likely to be small
    allTiles.forEach((tile1: coordinate) => {
        edges.set(tile1, new Map())
        allTiles.forEach((tile2: coordinate) => {
            if (tile1.x == tile2.x) {
                if (tile1.y == tile2.y + 1) {
                    edges.get(tile1)?.set(tile2, down)
                } else if (tile1.y == tile2.y - 1) {
                    edges.get(tile1)?.set(tile2, up)
                }
            }

            if (tile1.y == tile2.y) {
                if (tile1.x == tile2.x + 1) {
                    // console.log(JSON.stringify(tile1) + " then left gives " + JSON.stringify(tile2))
                    edges.get(tile1)?.set(tile2, left)
                } else if (tile1.x == tile2.x - 1) {
                    // console.log(JSON.stringify(tile1) + " then right gives " + JSON.stringify(tile2))
                    edges.get(tile1)?.set(tile2, right)
                }
            }
        })
    })

    return new graph(edges)
}
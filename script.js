// create Map object
const squareRegistry = new Map()

// create factory function
const ChessSquare = (x, y) => {
  const xPos = x
  const yPos = y
  let predecessor

  // array containing all offset variations
  const KNIGHT_OFFSETS = [
    [1, 2], [2, 1],
    [-1, 2], [2, -1],
    [1, -2], [-2, 1],
    [-1, -2], [-1, -2]
  ]

  // method that returns predecessor property
  const getPredecessor = () => predecessor
  // method that sets predecessor property (if it isn't already set)
  const setPredecessor = (newPred) => { predecessor ||= newPred }

  // method returns square position (in a neat format)
  const name = () => `${xPos}, ${yPos}`

  // method applies the method newSquareFrom to all offset values
  // then returns an array (containing ChessSquare objects)
  // of all possible positions that can be moved from the current position
  const createKnightMoves = () => {
    return KNIGHT_OFFSETS.map(newSquareFrom).filter(Boolean)
  }

  // method takes in offset values and applies it to a particluar position;
  // then uses the new values (that are within bounds) to create ChessSquare objects
  const newSquareFrom = ([xOffset, yOffset]) => {
    const [newX, newY] = [xPos + xOffset, yPos + yOffset]
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      return ChessSquare(newX, newY)
    }
  }

  // if this position is already in the Map object, return object
  if (squareRegistry.has(name())) {
    return squareRegistry.get(name())
  // if not, put the ChessSquare object in the Map object, then return object
  } else {
    const newSquare = { getPredecessor, setPredecessor, name, createKnightMoves }
    squareRegistry.set(name(), newSquare)
    return newSquare
  }
}

// function takes in start and finish positions, then logs the shortest path
const knightsTravails = (start, finish) => {
  // clear all key value pairs saved in Map object from previous call
  squareRegistry.clear()
  // use start value to create ChessSquare object
  const origin = ChessSquare(...start)
  // use finish value to create ChessSquare object
  const target = ChessSquare(...finish)

  // create queue, which will first take in origin (ChessSquare object)
  const queue = [origin]
  // while queue does not contain target value, keep iterating
  while (!queue.includes(target)) {
    // remove first item (ChessSquare object) in queue
    const currentSquare = queue.shift()

    // create enqueueList, and assign to it:
    // all possible moves (ChessSquare objects) from current position
    const enqueueList = currentSquare.createKnightMoves()
    // connect all generated positions to the move that came before it
    // by setting the property predecessor
    enqueueList.forEach((square) => square.setPredecessor(currentSquare))
    // add all generated positions to the queue
    // (which will then generate their own branch of possible positions)
    // (this will continue until the target position is found)
    queue.push(...enqueueList)
  }
  // create array that will contain the target position, and all its predecessors
  const path = [target]
  // keep iterating until the start position is added to the array
  while (!path.includes(origin)) {
    // get the predecessor of the first item on the array
    const prevSquare = path[0].getPredecessor()
    // add the predecessor value to the beginning of the array
    path.unshift(prevSquare)
  }
  // log the moves
  console.log(`The shortest path was ${path.length - 1} moves!`)
  console.log('The moves were:')
  path.forEach(square => console.log(square.name()))
}

// testing
knightsTravails([0, 0], [1, 2])
knightsTravails([3, 3], [7, 6])
knightsTravails([0, 0], [7, 7])

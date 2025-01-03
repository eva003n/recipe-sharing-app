import { useState } from "react";


import "./App.css";

//prop-value passed to a child component from a parent component
//use state enables components to remember things
function Square({value, onSquareClick}) {

 
  return <button className="square" onClick={onSquareClick}>{value}</button>

}

function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentsquares = history[history.length - 1];

  function handlePlay() {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);

  }


  <div className="game">
    <div className="game-board">
      <Board xIsNext={xIsNext} squares={currentsquares} onplay={handlePlay}/>
      <div className="game-info">
        <ol>{}</ol>

      </div>
    </div>
  </div>
}

function Board({ xIsNext, squares, onPlay }) {

//const [xIsNext, setXIsNext] = useState(true);
  //const [squares, setSquares] = useState(Array(9).fill(null));


  function handleClick(i) {
    if(squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if(xIsNext) {
      nextSquares[i] = "X";
    }else {
      nextSquares[i] = "O";
    }
    
    
onPlay(nextSquares);
    // setSquares(nextSquares);
    // setXIsNext(!xIsNext);//switch btw true or false

  }
  
  const winner = calculateWinner(squares);
  let status;
  
  if(winner) {
    status = "Winner: " + winner; 
  }else {
    status = "Next Player: " + (xIsNext ? "X" : "O")
  }




  return <>
  <div className="status">{status}</div>
  <div className="board-row">
    <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
    <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
    <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
  </div>
  <div className="board-row">
    <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
    <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
    <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
  </div>
  <div className="board-row">
    <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
    <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
    <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
  </div>
  </>
}

function calculateWinner(squares) {
 
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


export default Game;
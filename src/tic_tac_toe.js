import React from 'react';
import './App.css';
import Square from './components/Square';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Tic_Tac_Toe extends React.Component{


    constructor(props){
        super(props);


        this.state = {
            squares: Array(9).fill(null),
            xNext: true,
            playerTurn: true,
          };
    }
    calculateWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
      }
    gameOver(){
        return false;
    }

    makeAImove(){
        const squares = this.state.squares.slice();
        const availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
        const xNext = this.state.xNext;
        //squares[8] = this.state.xNext ? 'X' : 'O'; //CHANGE 8
        // const move = this.makeEasyMove();
        const move = this.makeHardMove();
        this.setState(move);
    }

    makeHardMove(marker = 'O'){
        const squares = this.state.squares.slice();
        if(!squares[4]){
            squares[4] = marker;
            return {squares: squares, xNext: !this.state.xNext, playerTurn: !this.state.playerTurn}
        }

        const ROWS = [[0,1,2], [3, 4, 5],[6, 7, 8]];
        const COLS = [[0, 3, 6],[1, 4, 7],[2, 5, 8]];
        const DIAGS = [[0, 4, 8],[2, 4, 6]];

        const opponentPosition = squares.findIndex((marker) => marker === 'X');
        const checkRow = (index, marker) => {
            const rows = [[0,1,2], [3, 4, 5],[6, 7, 8]];
            const [currentRow] = rows.filter((row) => row.findIndex((i) => i === index) !== -1)
            const neighbors = currentRow.filter((i) => index!==i);
            
            if(neighbors.findIndex((i) => squares[i] === 'X') !== -1){
                const [otherNeighbor] = neighbors.filter((i) => squares[i] !=='X');
                if(squares[otherNeighbor] !== 'O'){
                    squares[otherNeighbor] = 'O'
                    return {squares: squares, xNext: !this.state.xNext, playerTurn: !this.state.playerTurn}
                }
                
            }

        }

        const checkCol = () => {

        }

        const checkDiags = (index, marker) => {
            let offDiagonals = [1,3,5,7];
            if(offDiagonals.findIndex((i) => i === index ) !== -1){
                return
            }
            const diags = [[0, 4, 8],[2, 4, 6]]
        }

        // checkRow(opponentPosition, 'X');
        // checkCol();
        // checkDiags();

        return checkRow(opponentPosition, 'X') || checkCol(opponentPosition, 'X') || checkDiags(opponentPosition, 'X') || this.makeEasyMove();


    }

    makeEasyMove(marker = 'O'){
        const squares = this.state.squares.slice();
        const availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
        //console.log(availableSquares);
        const randomSquareIndex = Math.floor(Math.random() * availableSquares.length);
        squares[availableSquares[randomSquareIndex]] = this.state.xNext ? 'X' : 'O';
        return {squares: squares, xNext: !this.state.xNext, playerTurn: !this.state.playerTurn}



    }

    componentDidUpdate(){
        if(this.gameOver()) {return true;}

        if(!this.state.playerTurn){
            this.makeAImove()
            
        }

    }

    handleClick(i){
    const squares = this.state.squares.slice();
    const xNext = this.state.xNext;
    squares[i] = this.state.xNext ? 'X' : 'O';
    this.setState({squares: squares, xNext: !xNext, playerTurn: !this.state.playerTurn});
    
    }

    renderSquare(i) {
        return (
        <Col key={i} style={{padding: 0}}>
          <Square
            position = {i}
            value={this.state.squares[i]} 
            onClick={this.state.squares[i] ? () => {}: () => this.handleClick(i)}
          />
          </Col>
        );
      }

  render() {

    
    return (
    <div className="App">
      <header className="App-header">
      <p>
          Tic Tac Toe
        </p>
        </header>
    <div className="board" >

        <Container>
            <Row>
               {[0,1,2].map( (i) => this.renderSquare(i)) }
            </Row>
            <Row>
               {[3,4,5].map( (i) => this.renderSquare(i)) }
            </Row>
            <Row>
               {[6,7,8].map( (i) => this.renderSquare(i)) }
            </Row>
        </Container>
    </div>
        
      
      
    </div>
  );
}
}
export default Tic_Tac_Toe;
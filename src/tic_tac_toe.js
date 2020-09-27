import React from 'react';
import './App.css';
import Square from './components/Square';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import GameControls from './components/GameControls';

class Tic_Tac_Toe extends React.Component{


    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState(){
        return {
            squares: Array(9).fill(null),
            xNext: true, //REmove?
            playerTurn: true,
            playerMarker: 'X',
            gameOver: false,
            winnerIsPlayer: null,
            winningLine: null,
            gifWin: null,
            gifLose: null,
            gif: null,
            difficulty: 'EASY',
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
            return [squares[a], lines[i]];
          }
        }
        return null;
      }
    gameOver(){
        return false;
    }

    makeAImove(){

        let move;
        switch(this.state.difficulty){
            case 'EASY':
                move=this.makeEasyMove();
                break;
            case 'UNBEATABLE':
                move = this.makeHardMove();
                break;
            default:
                move = this.makeEasyMove();
                break;
        } 

        this.setState(move);
    }

    makeHardMove(marker = 'O'){
        const squares = this.state.squares.slice();
        if(!squares[4]){
            squares[4] = marker;
            return {squares: squares, xNext: !this.state.xNext, playerTurn: !this.state.playerTurn}
        }

        const directions = {
            ROWS : [[0,1,2], [3, 4, 5],[6, 7, 8]],
            COLS : [[0, 3, 6],[1, 4, 7],[2, 5, 8]],
            DIAGS : [[0, 4, 8],[2, 4, 6]]
        }
        const opponentPosition = squares.findIndex((marker) => marker === 'X');
        const AIPosition = squares.findIndex((marker) => marker === 'O');

        const checkForMove = (index, blocking = false) => { //rename check for move
            const availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
            for(let [direction, lines] of Object.entries(directions)){
                if(direction === 'DIAGS' ){
                    let offDiags = [1,3,5,7];
                    if(offDiags.findIndex((i) => i===index)!== -1){
                        continue;
                    }
                }
            const [currentRow] = lines.filter((row) => row.findIndex((i) => i === index) !== -1)
            const neighbors = currentRow.filter((i) => index!==i);
            
            let aiMarker = 'O'; //TODO
            let playerMarker = 'X';

            const marker = blocking ? playerMarker : aiMarker;

            if(neighbors.findIndex((i) => squares[i] === marker) !== -1){ //
                const [otherNeighbor] = neighbors.filter((i) => squares[i] !==marker);
                if(availableSquares.includes(otherNeighbor)){ // change to == 0 or is available
                    squares[otherNeighbor] = 'O';
                    return {squares: squares, xNext: !this.state.xNext, playerTurn: !this.state.playerTurn}
                }
                
            }
        }
        }

    const checkForDiagonalAttack = (marker= 'X') =>{
        if(squares[0] == marker && squares[8] == marker || squares[2] == marker && squares[6]){
            let availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
            availableSquares = availableSquares.filter((i) => ![0,2,6,8].includes(i) )
            if(availableSquares.length){
                const randomSquareIndex = Math.floor(Math.random() * availableSquares.length);
                squares[availableSquares[randomSquareIndex]] = this.state.xNext ? 'X' : 'O';
                return {squares: squares, xNext: !this.state.xNext, playerTurn: !this.state.playerTurn}
            }
        }
    }


    //TODO: GET O positions.... check for wins
    //THEN get X positions.... check for blocks

    //change marker  
    let positions = squares.reduce((positions, marker, idx) => marker === 'O' ? [...positions, idx] : positions, [] );
    for(let position of positions){
        let winningMove= checkForMove(position); 
        if(winningMove ){
            return winningMove;
        }
    }

    let opponentPositions = squares.reduce((positions, marker, idx) => marker === 'X' ? [...positions, idx] : positions, [] );
    for(let position of opponentPositions){
        let blockingMove= checkForMove(position, true); 
        if(blockingMove ){
            return blockingMove;
        }
    }
        return  checkForDiagonalAttack() || // this func may need work? 
                this.makeEasyMove();


    }

    makeEasyMove(marker = 'O'){
        const squares = this.state.squares.slice();
        const availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
        const randomSquareIndex = Math.floor(Math.random() * availableSquares.length);
        squares[availableSquares[randomSquareIndex]] = this.state.xNext ? 'X' : 'O';
        return {squares: squares, xNext: !this.state.xNext, playerTurn: !this.state.playerTurn}
    }


    renderGameOver(winner, line){
        this.setState({squares: this.state.squares.slice(), gameOver: true, winnerIsPlayer: winner == this.state.playerMarker, winningLine: line});
        // for(let i of line){
        //     this.renderSquare(i);
        // }
        setTimeout(()=>{
            if(winner === this.state.playerMarker){
                //this.setState({gif: gifWin});
            }else{
                //this.setState({gif: gifWin});
            }
        } ,2000
        )

    }

    componentDidUpdate(){
        if(this.state.gameOver) return;

        const gameOver = this.calculateWinner(this.state.squares.slice());
        if(gameOver) {
            const [winner, line] = gameOver;
            this.renderGameOver(winner, line);
            return ;
        }

        if(!this.state.playerTurn){
            setTimeout(() => {
                this.makeAImove() // SHOW SPINNER
            }, 500)
            
        }

    }

    async componentDidMount(){
        const gf = new GiphyFetch('v9X9t65dtu4Y1N5O7V0yYJ6WawfilxYF');
        const { data } = await gf.gif('fpXxIjftmkk9y');
        this.setState({gif: data});
    }

    handleClick(i){
        if(!this.state.playerTurn || this.state.gameOver){
            return;
        }
    const squares = this.state.squares.slice();
    const xNext = this.state.xNext;
    squares[i] = this.state.xNext ? 'X' : 'O';
    this.setState({squares: squares, xNext: !xNext, playerTurn: !this.state.playerTurn});
    
    }

    isWinningSquare(i){
        if(!this.state.winningLine) return;
        if(this.state.winningLine.includes(i)){
            return this.state.winnerIsPlayer || false;
        }
    }

    renderSquare(i) {
        return (
        <Col key={i} style={{padding: 0}}>
          <Square
            position = {i}
            value={this.state.squares[i]} 
            onClick={this.state.squares[i] ? () => {}: () => this.handleClick(i)}
            winningPlayerSquare = {this.isWinningSquare(i)}
          />
          </Col>
        );
      }

      handleDifficultyChange(e){
          this.setState({difficulty : e.target.value}); //TODO: MAP TO CONSTANT!
      }

  render() {
    
    
    return (
    <div className="App">
      <div class="jumbotron App">
        <h1 class="display-4">Tic-Tac-Toe</h1>
        </div>
    <div className="board" >

       
{/*         
        { !this.state.gameOver ? */}
        <Container>
        <GameControls currentDifficulty={this.state.difficulty} handleRestart = {() => this.setState(this.getInitialState())}handleDifficultyChange={(e) => this.handleDifficultyChange(e)}></GameControls>
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
         {/* :
        <Gif gif={this.state.gif} width ={300}></Gif> */}

    </div>
      
    </div>
  );
}
}
export default Tic_Tac_Toe;
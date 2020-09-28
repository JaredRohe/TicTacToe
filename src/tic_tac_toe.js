import React from 'react';
import './App.css';
import Square from './components/Square';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GiphyFetch } from '@giphy/js-fetch-api';
import GameControls from './components/GameControls';
import GameOver from './components/GameOver';

class Tic_Tac_Toe extends React.Component{


    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState(){
        return {
            squares: Array(9).fill(null),
            //xNext: true, //REmove?
            playerTurn: true,
            playerMarker: 'X',
            outcome: '',
            winner: '',
            gameOver: false,
            winnerIsPlayer: null,
            winningLine: null,
            difficulty: 'EASY',
            showGIF: false,
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

    getOpponentMarker(){
        return {'X':'O', 'O':'X'}[this.state.playerMarker];
    }

    makeHardMove(){
        const squares = this.state.squares.slice();
        if(!squares[4]){
            squares[4] = this.getOpponentMarker();
            return {squares: squares, playerTurn: !this.state.playerTurn}
        }

        const directions = {
            ROWS : [[0,1,2], [3, 4, 5],[6, 7, 8]],
            COLS : [[0, 3, 6],[1, 4, 7],[2, 5, 8]],
            DIAGS : [[0, 4, 8],[2, 4, 6]]
        }

        const checkForMove = (index, blocking = false) => {
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
            
            let aiMarker = this.getOpponentMarker(this.state.playerMarker);

            const marker = blocking ? this.state.playerMarker : aiMarker;

            if(neighbors.findIndex((i) => squares[i] === marker) !== -1){ 
                const [otherNeighbor] = neighbors.filter((i) => squares[i] !==marker);
                if(availableSquares.includes(otherNeighbor)){ // change to == 0 or is available
                    squares[otherNeighbor] = 'O';
                    return {squares: squares, playerTurn: !this.state.playerTurn}
                }
                
            }
        }
        }

    const checkForDiagonalAttack = () =>{
        let playerMarker = this.state.playerMarker;
        if((squares[0] == playerMarker && squares[8] == playerMarker )|| (squares[2] == playerMarker && squares[6] == playerMarker)){
            let availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
            availableSquares = availableSquares.filter((i) => ![0,2,6,8].includes(i) )
            if(availableSquares.length){
                const randomSquareIndex = Math.floor(Math.random() * availableSquares.length);
                squares[availableSquares[randomSquareIndex]] = this.getOpponentMarker();
                return {squares: squares, playerTurn: !this.state.playerTurn}
            }
        }
    }

    let positions = squares.reduce((positions, marker, idx) => marker === this.getOpponentMarker() ? [...positions, idx] : positions, [] );
    for(let position of positions){
        let winningMove= checkForMove(position); 
        if(winningMove ){
            return winningMove;
        }
    }

    let opponentPositions = squares.reduce((positions, marker, idx) => marker === this.playerMarker ? [...positions, idx] : positions, [] );
    for(let position of opponentPositions){
        let blockingMove= checkForMove(position, true); 
        if(blockingMove ){
            return blockingMove;
        }
    }
        return  checkForDiagonalAttack() ||
                this.makeEasyMove();


    }

    makeEasyMove(){
        const squares = this.state.squares.slice();
        const availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
        const randomSquareIndex = Math.floor(Math.random() * availableSquares.length);
        squares[availableSquares[randomSquareIndex]] = this.getOpponentMarker();
        return {squares: squares, playerTurn: !this.state.playerTurn}
    }


    renderGameOver(winner, line=[]){
        this.setState({squares: this.state.squares.slice(), 
            gameOver: true,
            showGIF: true,
            winner: winner? winner: 'CAT',
            outcome: winner, 
            winnerIsPlayer: winner === this.state.playerMarker, 
            winningLine: line});

    }

    componentDidUpdate(){
        if(this.state.gameOver) return;

        const gameOver = this.calculateWinner(this.state.squares.slice());
        if(gameOver) {
            const [winner, line] = gameOver;
            this.renderGameOver(winner, line);
            return ;
        }

        const availableSquares = this.state.squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
        if(availableSquares.length === 0){
            this.renderGameOver('CAT');
        }

        if(!this.state.playerTurn){
            setTimeout(() => {
                this.makeAImove()
            }, 500)
            
        }

    }

    async componentDidMount(){
        const gf = new GiphyFetch('v9X9t65dtu4Y1N5O7V0yYJ6WawfilxYF');
        const gifLimit = 10;
        const { data: winGIFs } = await gf.search('win', { sort: 'relevant', limit: gifLimit });
        const { data: loseGIFs } = await gf.search('lose', { sort: 'relevant', limit: gifLimit });
        const { data: catGIFs } = await gf.search('cat', { sort: 'relevant', limit: gifLimit });

        let gifIndex = Math.floor(Math.random() * gifLimit) // -1  +1 here because first gif returned is slightly inappropriate!
        const excludeGif = 'nqi89GMgyT3va'

        this.catGIF = catGIFs[gifIndex];
        this.loseGIF = loseGIFs[gifIndex];

        if(winGIFs[gifIndex].id === excludeGif){
            gifIndex = gifIndex + 1 === winGIFs.legth ? gifIndex + 1 : gifIndex -1
        }
        this.winGIF = winGIFs[gifIndex];

    }

    handleClick(i){
        if(!this.state.playerTurn || this.state.gameOver){
            return;
        }
        const squares = this.state.squares.slice();
        squares[i] = this.state.playerMarker;
        this.setState({squares: squares, playerTurn: !this.state.playerTurn});
    
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
    
    const outComeMap = {
        'CAT' : this.catGIF,
        'X': this.winGIF,
        'O' : this.loseGIF,
    }
    const gif = outComeMap[this.state.outcome];
    
    return (
    <div className="App">
      <div class="jumbotron App">
        <h1 class="display-4">Tic-Tac-Toe</h1>
        </div>
    <div className="board" >

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
        <GameOver outcome = {this.state.outcome} gif={gif} show={this.state.showGIF} handleClose={() => this.setState({showGIF:!this.state.showGIF})}></GameOver>

    </div>
      
    </div>
  );
}
}
export default Tic_Tac_Toe;
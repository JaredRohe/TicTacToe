import React from 'react';
import './App.css';
import Square from './components/Square';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GiphyFetch } from '@giphy/js-fetch-api';
import GameControls from './components/GameControls';
import GameOver from './components/GameOver';
import {AIMakeHardMove, AIMakeEasyMove} from './ai/AI';

class TicTacToe extends React.Component{


    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState(){
        return {
            squares: Array(9).fill(null),
            playerTurn: true,
            playerMarker: 'X',
            outcome: '',
            gameOver: false,
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
        const move = AIMakeHardMove(this.state.squares.slice(), this.getOpponentMarker());
        return { ...move, playerTurn: !this.state.playerTurn}


    }

    makeEasyMove(){
        const move = AIMakeEasyMove(this.state.squares.slice(), this.getOpponentMarker());
        return {...move, playerTurn: !this.state.playerTurn}
        
    }


    renderGameOver(winner, line=[]){

        this.setState({squares: this.state.squares.slice(), 
            gameOver: true,
            showGIF: true,
            outcome: winner,
            winningLine: line});

    }

    componentDidUpdate(){
        if(this.state.gameOver) return;

        const gameOver = this.calculateWinner(this.state.squares.slice());
        if(gameOver) {
            const [winnerMarker, line] = gameOver;
            const winner =  winnerMarker === this.state.playerMarker ? 'PLAYER' : 'AI';
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
        const gf = new GiphyFetch(process.env.REACT_APP_GIF_KEY); // TODO: Read API Key from environment
        const gifLimit = 10;
        const { data: winGIFs } = await gf.search('win', { sort: 'relevant', limit: gifLimit });
        const { data: loseGIFs } = await gf.search('lose', { sort: 'relevant', limit: gifLimit });
        const { data: catGIFs } = await gf.search('cat', { sort: 'relevant', limit: gifLimit });

        let gifIndex = Math.floor(Math.random() * gifLimit) 
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
            return this.state.outcome === 'PLAYER' || false;
        }
    }

    renderSquare(i) {
        return (
        <Col key={i}>
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
          this.setState({difficulty : e.target.value});
      }

  render() {
    
    const outComeMap = {
        'CAT' : this.catGIF,
        'PLAYER': this.winGIF,
        'AI' : this.loseGIF,
    }
    const gif = outComeMap[this.state.outcome];
    
    return (
    <div className="App">
      <div className="jumbotron App">
        <h1 className="display-4">Tic-Tac-Toe</h1>
        </div>
    <div data-testid='gameBoard' className="board" >

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
export default TicTacToe;
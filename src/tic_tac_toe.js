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
          };
    }

    handleClick(i){
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
    }

    renderSquare(i) {
        return (
        <Col key={i} style={{padding: 0}}>
          <Square
            position = {i}
            value={this.state.squares[i]} 
            onClick={() => this.handleClick(i)}
            
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
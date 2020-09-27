import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function GameControls(props) {
  return (
    <Row className='controls'>
        <Col>
        <Difficulty currentDifficulty= {props.currentDifficulty} handleDifficultyChange={props.handleDifficultyChange}></Difficulty>
        </Col>
        <Col>
        <Button onClick={props.handleRestart} variant='info'>
            Restart Game
        </Button>
        </Col>
    </Row>
  );
}

function Difficulty(props) {
    return(
        <div>
        <input checked={props.currentDifficulty === 'EASY'} type="radio" value="EASY" name="difficulty" onChange = {props.handleDifficultyChange}/> Easy Mode
        <br></br>
        <input checked={props.currentDifficulty === 'UNBEATABLE'} type="radio" value="UNBEATABLE" name="difficulty" onChange= {props.handleDifficultyChange}/> Unbeatable Mode
      </div>
    )
}

export default GameControls;

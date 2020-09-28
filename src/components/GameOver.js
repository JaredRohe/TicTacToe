import Modal from 'react-bootstrap/Modal';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Gif } from '@giphy/react-components';
export default function GameOver(props) {

let title;
switch(props.outcome){
    case 'CAT':
        title =  'CATS GAME';
        break;
    case 'PLAYER':
        title = 'YOU WON!';
        break;
    case 'AI':
        title = 'YOU LOST =(';
        break;
    default:
        title = ''
        break;
}

return(<Modal show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{title }</Modal.Title>
    </Modal.Header>
    <Modal.Body><Gif gif={props.gif} width ={300}></Gif></Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={props.handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>);
}
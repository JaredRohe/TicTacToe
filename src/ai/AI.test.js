import {AIMakeEasyMove, AIMakeHardMove} from './Ai';

const BOARD=Array(9).fill(null); 

const countMarkers = (board, marker) => {
    return board.reduce((count, square) => square === marker ? count + 1: count, 0)
}

describe('AI Easy Move', () => {
    it('makes a move', () => {
        let board = BOARD.slice();
        let before = countMarkers(board, 'O');
        const move = AIMakeEasyMove(board, 'O');
        board = move.squares;
        let after = countMarkers(board, 'O');
        expect(after).toEqual(before +1); 
    })
    


});

describe('AI Hard Move', () => {
    it('blocks the player', () => {
        let board = BOARD.slice();
        [board[0], board[1], board[4]] = ['X', 'X', 'O'];
        const move = AIMakeHardMove(board, 'O');
        board = move.squares;
        expect(board[2]).toEqual('O');
    });
  });
  
  
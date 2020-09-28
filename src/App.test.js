import React from 'react';
import { render } from '@testing-library/react';
import TicTacToe from './tic_tac_toe';

test('renders game board', () => {
  const { getByTestId } = render(<TicTacToe />);
  const board = getByTestId('gameBoard')
  expect(board).toBeInTheDocument();
});

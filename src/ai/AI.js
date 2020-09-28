


export function AIMakeHardMove(squares, aiMarker) {
    if(!squares[4]){
        squares[4] = aiMarker;
        return {squares: squares}
    }

   
    let positions = squares.reduce((positions, marker, idx) => marker === aiMarker ? [...positions, idx] : positions, [] );
    for(let position of positions){
        let winningMove= checkForMove(squares, position, aiMarker); 
        if(winningMove ){
            return winningMove;
        }
    }

    let opponentPositions = squares.reduce((positions, marker, idx) => marker === getPlayerMaker(aiMarker) ? [...positions, idx] : positions, [] );
    for(let position of opponentPositions){
        let blockingMove= checkForMove(squares, position, aiMarker, true); 
        if(blockingMove ){
            return blockingMove;
        }
    }
        return  checkForDiagonalAttack(squares, aiMarker) ||
                AIMakeEasyMove(squares, aiMarker);

}

const getPlayerMaker = (aiMarker) => {
    return {'X':'O', 'O':'X'}[aiMarker];
}

const checkForMove = (squares, index, aiMarker, blocking = false) => {
    const directions = {
        ROWS : [[0,1,2], [3, 4, 5],[6, 7, 8]],
        COLS : [[0, 3, 6],[1, 4, 7],[2, 5, 8]],
        DIAGS : [[0, 4, 8],[2, 4, 6]]
    }
    const availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
    for(let [direction, lines] of Object.entries(directions)){
        if(direction === 'DIAGS' ){
            let offDiags = [1,3,5,7];
            if(offDiags.findIndex((i) => i===index)!== -1){
                continue;
            }
        }
    const [currentLine] = lines.filter((row) => row.findIndex((i) => i === index) !== -1)
    const neighbors = currentLine.filter((i) => index!==i);

    const playerMarker = getPlayerMaker(aiMarker)
    const marker = blocking ? playerMarker : aiMarker;

    if(neighbors.findIndex((i) => squares[i] === marker) !== -1){ 
        const [otherNeighbor] = neighbors.filter((i) => squares[i] !==marker);
        if(availableSquares.includes(otherNeighbor)){
            squares[otherNeighbor] = aiMarker;
            return {squares: squares}
        }
        
    }
}
}

const checkForDiagonalAttack = (squares, aiMarker) =>{
    const playerMarker = getPlayerMaker(aiMarker);
    if((squares[0] === playerMarker && squares[8] === playerMarker )|| (squares[2] === playerMarker && squares[6] === playerMarker)){
        let availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
        availableSquares = availableSquares.filter((i) => ![0,2,6,8].includes(i) )
        if(availableSquares.length){
            const randomSquareIndex = Math.floor(Math.random() * availableSquares.length);
            squares[availableSquares[randomSquareIndex]] = aiMarker;
            return {squares: squares}
        }
    }
}

export function AIMakeEasyMove(squares, aiMarker) {
    const availableSquares = squares.reduce((available, marker, idx) => !marker ? [...available, idx] : available, [] );
    const randomSquareIndex = Math.floor(Math.random() * availableSquares.length);
    squares[availableSquares[randomSquareIndex]] = aiMarker;
    return {squares: squares}
}
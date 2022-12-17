import { useState } from "react";
import './css/chess-board.css';

type horizantalCode = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | '';
type verticalCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '';

interface IChessBoardCell {
    color: string;
    isSelected: boolean;
    isAccessible: boolean;
    horizantalCode: horizantalCode;
    verticalCode: verticalCode;
}

export default function ChessBoard() {
    const knightLogo = require('../knight.png');
    const alphabetMapping: horizantalCode[] = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
    let [knightPositionInfo, setKnightPositionInfo] = useState<{ knightPosition: string, canMoveTo: string[] }>({ knightPosition: '', canMoveTo: [''] });

    const prepareChessBoardArray: IChessBoardCell[][] = [[], [], [], [], [], [], [], []].map((subArray, index) => {
        let tempArray = [];
        const colorMapping = ['#EBEB98', '#944C04', '#EBEB98', '#944C04', '#EBEB98', '#944C04', '#EBEB98', '#944C04'];
        for (let i = 0; i < 8; i++) {
            const color: string = (i === 0) ? colorMapping[index] : (tempArray[i - 1].color === '#944C04') ? '#EBEB98' : '#944C04';
            tempArray.push({ color: color, isSelected: false, isAccessible: false, horizantalCode: `${alphabetMapping[i]}` as horizantalCode, verticalCode: `${index + 1}` as verticalCode })
        }
        return tempArray;
    });

    let [chessBoardArray, setChessBoardArray] = useState<IChessBoardCell[][]>(prepareChessBoardArray);

    const onCellClick = (cell: { verticalCode: verticalCode, horizantalCode: horizantalCode }) => {
        const { horizantalCode, verticalCode } = cell;
        const horizantalIndex = alphabetMapping.findIndex(alphabet => alphabet === horizantalCode);
        const verticalIndex = Number(verticalCode) - 1;
        let updatedKnightPositionInfo = { knightPosition: `${horizantalCode}${verticalCode}`, canMoveTo: [''] }
        const updatedChessBoardArray = chessBoardArray.map(row => row.map(rowCell => {
            if (rowCell.isSelected) rowCell.isSelected = false;
            if (rowCell.isAccessible) rowCell.isAccessible = false;
            return (horizantalCode === rowCell.horizantalCode && verticalCode === rowCell.verticalCode) ?
                { color: rowCell.color, verticalCode: rowCell.verticalCode, isAccessible: rowCell.isAccessible, horizantalCode: rowCell.horizantalCode, isSelected: true } : rowCell;
        }));

        [[-2, -1], [-2, 1], [2, -1], [2, 1], [1, 2], [-1, 2], [-1, -2], [1, -2]].forEach(check => {
            const numberRangeCheck = (verticalIndex + check[0] < 8 && verticalIndex + check[0] > -1 && horizantalIndex + check[1] < 8 && horizantalIndex + check[1] > -1)
            const chessBoardCell = numberRangeCheck ? updatedChessBoardArray[verticalIndex + check[0]][horizantalIndex + check[1]] : undefined;
            if (chessBoardCell !== undefined) {
                chessBoardCell.isAccessible = true;
                updatedKnightPositionInfo.canMoveTo.push(`${alphabetMapping[horizantalIndex + check[1]]}${verticalIndex + check[0] + 1}`)
            }
        })
        setKnightPositionInfo(updatedKnightPositionInfo);
        setChessBoardArray(updatedChessBoardArray);
    }

    return (
        <div className="mainContainer">
            <div className="ChessBoard">
                {
                    chessBoardArray.map((board, index1) => (
                        <div key={index1} className="ChessRow">
                            {
                                board.map((cell, index2) => (
                                    <div key={index2} style={{ backgroundColor: cell.isAccessible ? 'blue' : cell.color, padding: cell.isAccessible ? '1px' : '' }} onClick={() => onCellClick({ verticalCode: cell.verticalCode, horizantalCode: cell.horizantalCode })} className="Cell">
                                        {index1 === 7 ? <div className="CellContent"> {`${cell.horizantalCode}${(index2 === 0 ? cell.verticalCode : '')}`} </div> : (index2 === 0) ? <div className="CellContent "> {cell.verticalCode} </div> : null}
                                        <div className="knightPosition">{cell.isSelected ? <img src={knightLogo} width="70px" height="60px" alt="Knight logo" /> : null}</div>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
            <div className="knightInfo">
                {
                    knightPositionInfo.knightPosition !== '' ? (
                        <>
                            <h3>Current Knight Position is {knightPositionInfo.knightPosition} </h3>
                            <h3>Can move to - {knightPositionInfo.canMoveTo.map(cell => <span key={cell}>{cell}</span>)} </h3>
                        </>
                    ) : null
                }
            </div>
        </div>
    )
}

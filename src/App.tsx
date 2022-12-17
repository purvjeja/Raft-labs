import { useState } from 'react';
import './App.css';
import ChessBoard from './components/chess-board';
import SocialMedia from './components/social-media-app';

function App() {
  const [selectedAssignment, setSelectedAssignment] = useState<'A1' | 'A2'>('A1');

  return (
    <div className="App">
      <div className='AssignmentButtons'>
        <button className='Button' style={{ backgroundColor: selectedAssignment === 'A1' ? 'cyan' : '', color: selectedAssignment === 'A1' ? 'black' : ''  }} onClick={() => setSelectedAssignment('A1')}>ASSIGNMENT 1</button>
        <button className='Button' style={{ backgroundColor: selectedAssignment === 'A2' ? 'cyan' : '', color: selectedAssignment === 'A2' ? 'black' : '' }} onClick={() => setSelectedAssignment('A2')}>ASSIGNMENT 2</button>
      </div>
      <div className='AssignmentBody'>
        {
          selectedAssignment === 'A2' ?  <ChessBoard /> : <SocialMedia />
        }
      </div>
    </div>
  );
}

export default App;

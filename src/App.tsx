import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { EditorPane } from './components/EditorPane';
import { DungeonView } from './components/DungeonView';
import { RunControls } from './components/RunControls';
import { useWalletAuth } from './hooks/useWalletAuth';
import { useProgress } from './hooks/useProgress';
import { useHintTimer } from './hooks/useHintTimer';
import { HintBox } from './components/HintBox';
import mazeData from './data/maze-01.json';
import hints from './data/hints';

function App(): React.ReactElement {
  const [count, setCount] = useState(0);
  const [code, setCode] = useState('// Write your spell here\nmoveForward();');

  const { address, requestAuth } = useWalletAuth();

  const { currentHint, dismissHint, nextHint, resetTimer } = useHintTimer(hints.chapter1, 10000);

  // Player position state
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 }); // Default to start position

  // Find start position in maze
  useEffect(() => {
    for (let y = 0; y < mazeData.length; y++) {
      for (let x = 0; x < mazeData[y].length; x++) {
        if (mazeData[y][x] === 2) {
          // Start position
          setPlayerPos({ x, y });
          break;
        }
      }
    }
  }, []);

  // Always call the hook regardless of address state
  const { saveProgress } = useProgress(address);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Wizarding Code School</h1>

      {/* Wallet Auth Section */}
      <div className="wallet-auth">
        {address ? (
          <div className="user-hud">
            <p>
              {address.substring(0, 6)}...{address.substring(address.length - 4)} logged in
            </p>
          </div>
        ) : (
          <button onClick={requestAuth}>Connect Wallet</button>
        )}
      </div>

      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Dungeon View</h2>
        <DungeonView maze={mazeData} pos={playerPos} onPosChange={setPlayerPos} debugMode={true} />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Spell Editor</h2>
        <EditorPane code={code} onChange={setCode} onActivity={resetTimer} />
        <div style={{ marginTop: '10px' }}>
          <h3>Current Spell:</h3>
          <pre>{code}</pre>
          <RunControls
            code={code}
            maze={mazeData}
            position={playerPos}
            onPositionChange={setPlayerPos}
            onSuccess={code => address && saveProgress(1, true, code)}
          />
        </div>
      </div>

      {/* Hint System */}
      <HintBox hint={currentHint} onDismiss={dismissHint} onNext={nextHint} />

      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;

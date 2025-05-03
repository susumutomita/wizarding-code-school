import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { EditorPane } from './components/EditorPane';

function App(): React.ReactElement {
  const [count, setCount] = useState(0);
  const [code, setCode] = useState('// Write your spell here\nmoveForward();');

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
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Spell Editor</h2>
        <EditorPane code={code} onChange={setCode} />
        <div style={{ marginTop: '10px' }}>
          <h3>Current Spell:</h3>
          <pre>{code}</pre>
        </div>
      </div>
      
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;

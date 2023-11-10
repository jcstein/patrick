import React, { useEffect, useRef } from 'react';
import celestiaLogo from "./assets/celestia.svg";
import "./App.css";

interface AppProps {
  celestiaLogs: string[];
  celestiaVersion: () => void;
  celestiaInit: () => void;
  celestiaStart: () => void;
  celestiaStop: () => void;
  clearLogs: () => void;
}

const App: React.FC<AppProps> = ({ celestiaLogs, celestiaVersion, celestiaInit, celestiaStart, celestiaStop, clearLogs }) => {

  const logsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (logsContainerRef.current) {
        logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
      }
    }, 0);
  }, [celestiaLogs]);

  const handleTabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Hide all tab contents
    let tabContents = document.querySelectorAll('div[id]');
    tabContents.forEach(tabContent => {
      (tabContent as HTMLElement).style.display = 'none';
    });

    // Show the clicked tab's content
    let tabContent;
    if ((event.target as HTMLElement).getAttribute('href')) {
      tabContent = document.querySelector((event.target as HTMLElement).getAttribute('href')!);
    } else {
      tabContent = document.querySelector('#' + (event.target as HTMLElement).id.replace('-button', ''));
    }
    (tabContent as HTMLElement).style.display = 'block';
  };

  return (
    <div className="container">
      <h1>Welcome to Patrick!</h1>

      <div className="row">
        <a href="https://celestia.org" target="_blank" rel="noopener noreferrer">
          <img
            src={celestiaLogo}
            className="logo celestia"
            alt="Celestia logo"
          />
        </a>
      </div>

      <p>Click on the Celestia logo to learn more</p>

      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
        <button id="run-celestia" style={{ marginRight: '10px' }} onClick={celestiaVersion}>Check version</button>
        <button id="init-celestia" style={{ marginRight: '10px' }} onClick={celestiaInit}>Initialize light node</button>
        <button id="start-celestia" style={{ marginRight: '10px' }} onClick={celestiaStart}>Start light node</button>
        <button id="stop-celestia" style={{ marginRight: '10px' }} onClick={celestiaStop}>Stop</button>
        <button id="clearLogs" onClick={clearLogs}>Clear Logs</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
        <button id="logs-button" style={{ marginRight: '10px' }} onClick={handleTabClick}>Logs</button>
        <button id="stats-button" style={{ marginRight: '10px' }} onClick={handleTabClick}>Stats</button>
      </div>
      
      <div id="logs" ref={logsContainerRef} style={{ width: '100%', height: '50vh', overflow: 'auto', whiteSpace: 'pre-wrap', overflowY: 'auto', resize: 'vertical', textAlign: 'left' }}>
        <pre id="celestia-logs">{celestiaLogs.join('\n')}</pre>
      </div>
    
      <div id="stats" style={{ display: 'none' }}>
        <p>stats</p>
      </div>
    </div>
  );
}

export default App;
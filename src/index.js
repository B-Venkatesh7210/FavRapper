import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MoralisProvider } from 'react-moralis';

const serverUrl = "https://uw2nlqw7utdw.usemoralis.com:2053/server";
const appId = "VqOZo9UhYszLp4ymgATazjFBBst4K16IDa0c5QZL";

ReactDOM.render(
  <MoralisProvider serverUrl={serverUrl} appId={appId}>
    <App />
  </MoralisProvider>,

document.getElementById("root")
);


import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import Modal from 'react-modal';

Modal.setAppElement('#root');
const element = document.getElementById('root');
const root = createRoot(element!);
root.render(<App />);

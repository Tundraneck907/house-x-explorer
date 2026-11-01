import { createRoot } from 'react-dom/client';
import App from './ui/App';
import './ui/styles.css';

createRoot(document.getElementById('root')!).render(<App />);

import * as store from './store';
(window as unknown as { __store: typeof store }).__store = store;

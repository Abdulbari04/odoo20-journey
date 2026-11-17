import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
try { document.documentElement.dataset.mode = localStorage.getItem('odoo20-mode') === 'space' ? 'space' : 'notebook' } catch { document.documentElement.dataset.mode = 'notebook' }
createRoot(document.getElementById('root')!).render(<App />)

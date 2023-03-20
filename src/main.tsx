import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'
import Container from './AppContainer'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render( 
  <StrictMode>
    <Container />
  </StrictMode>
)
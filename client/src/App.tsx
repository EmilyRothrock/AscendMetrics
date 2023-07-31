import Homepage from './pages/Homepage'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Poppins;
  }
`
function App() {
  

  return (
    
    <Router>
      <GlobalStyle/>
      <Routes>
         <Route path = '/' Component= {Homepage} />
         <Route path = 'about us'/>
         <Route path = 'contact us'/>
      </Routes>
    </Router>
    
  )
}

export default App

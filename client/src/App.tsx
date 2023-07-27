import NavBar from './Homepage/NavBar'
import Homepage from './pages/Homepage'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  

  return (
    
    <Router>
      <NavBar/>
      <Routes>
         <Route path = '/' Component= {Homepage} />
         <Route path = 'about us'/>
         <Route path = 'contact us'/>
      </Routes>
    </Router>
    
  )
}

export default App

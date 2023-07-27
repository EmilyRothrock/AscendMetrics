import Home from './Homepage/Home'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
function App() {
  

  return (
    
    <Router>
      <Home/>
      <Routes>
         <Route path = '/'/>
         <Route path = 'about us'/>
         <Route path = 'contact us'/>
      </Routes>
    </Router>
    
  )
}

export default App

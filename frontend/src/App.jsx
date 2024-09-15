import { BrowserRouter as Router,Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { NavComp } from "./components/NavBar"
import FooterComp from "./components/FooterComp"
function App() {
  return (
    <>
    <div>
    <NavComp/>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </Router>
      <FooterComp/>
    </div>
    </>
  )
}

export default App

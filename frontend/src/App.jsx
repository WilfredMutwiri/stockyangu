import { BrowserRouter as Router,Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { NavComp } from "./components/NavBar"
import FooterComp from "./components/FooterComp"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
function App() {
  return (
    <>
    <div>
    <NavComp/>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/signup" element={<SignUp/>}/>
        </Routes>
      </Router>
      <FooterComp/>
    </div>
    </>
  )
}

export default App

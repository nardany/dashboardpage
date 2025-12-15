import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Questions from "./components/Question/Questions"
import Result from './components/Result/Result';
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/questions" element={<Questions/>}></Route>
        <Route path='/result' element={<Result/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;

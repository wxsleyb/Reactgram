import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import './App.css';

//Router

import{BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          
          <Route path='/'  element={ <Home/> }/>
          <Route path='/login' element={ <Login/> }></Route>
          <Route path='/register' element={ <Register/> }></Route>

        </Routes>
        <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;

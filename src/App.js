import React from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AddService1 from './components/AddService1';
import EditService1 from './components/EditService1';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ServiceUnavailablePage from './components/ServiceUnavailablePage';

function App(){

  

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>  
        <Route exact path='/auth/signup' element={<SignUp/>}/>
        <Route exact path='/auth/login' element={<Login/>}/>
        <Route path="/*" element={<Navigate to="/auth/login" />} />
        {/* <Route path="/home" element={withAuth(Home)} /> */}
        <Route exact path='/home' element={<Home />}/>
        <Route exact path='/addService' element={<AddService1/>}/>
        <Route exact path='/editService1/:id' element={<EditService1/>}/>
        <Route exact path='/ServiceUnavailablePage' element={<ServiceUnavailablePage/>}/>
       
        </Routes>
      </Router>
      

    </div>
  );
};

export default App;

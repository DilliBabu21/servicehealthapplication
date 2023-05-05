import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';

export default function Navbar() {

    let navigate = useNavigate();
    let location = useLocation();

    const handleLogout = () => {
        const token = localStorage.getItem('token');
        axios.post('http://localhost:8899/api/v1/auth/logout', null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            localStorage.removeItem('token');
            googleLogout();
            navigate('/auth/login');
        }).catch(error => {
            console.log(error);
            localStorage.removeItem('token');
            googleLogout();
            navigate('/auth/login');
        });
    }

    // Conditionally render the "Logout" button only if the user is logged in
    if (location.pathname === '/auth/login' || location.pathname === '/auth/signup') {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#20283E", color: "white" }}>
                    <div className="container-fluid">
                        <a className="navbar-brand justify-content-center" href="/" >Service Health Check Application</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </nav>
            </div>
        )
    } else {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#20283E", color: "white" }}>
                    <div className="container-fluid">
                        <a className="navbar-brand justify-content-center" href="/home" >Service Health Check Application</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Button variant="contained" onClick={handleLogout}>Logout</Button>
                                </li>
                            </ul>
                        </div>

                    </div>
                </nav>
            </div>
        )
    }
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <div id="header" className="header fixed-top">
                <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
                    <Link to="/home" className="logo d-flex align-items-center">
                        <img src="../public/assets/img/logo.png" alt="" />
                        <span>WorkFlow</span>
                    </Link>

                    <nav id="navbar" className="navbar">
                        <ul>
                            <li>
                                <Link to="/auth" className="nav-link">
                                    Log in
                                </Link>
                            </li>
                            <li>
                                <Link to="/auth" className="getstarted">
                                    Sign up
                                </Link>
                            </li>
                        </ul>
                        <i className="bi bi-list mobile-nav-toggle"></i>
                    </nav>
                </div>
            </div>
            <Link to="/auth">Login</Link>
        </div>
    );
}

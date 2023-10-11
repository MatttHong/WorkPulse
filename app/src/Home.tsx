import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function Home() {
    return (
        <div>
            <header id="header" className="header fixed-top">
                <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
                    <Link to="/" className="logo d-flex align-items-center">
                        <img src="assets/img/logo.png" alt=""></img>
                            <span>WorkPulse</span>
                    </Link>

                    <nav id="navbar" className="navbar">
                        <ul>
                            <li><Link className="nav-link " to="/auth">Log in</Link></li>
                            <li><Link className="getstarted" to="/auth">Sign up</Link></li>
                        </ul>
                        <i className="bi bi-list mobile-nav-toggle"></i>
                    </nav>

                </div>
            </header>

            <section id="hero" className="hero d-flex align-items-center">

                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 d-flex flex-column justify-content-center">
                            <h1>We offer modern solutions for growing your business</h1>
                            <h2>Use WorkPulse to track productivity of your work teams</h2>
                            <div>
                                <div className="text-center text-lg-start">
                                    <Link to="/auth" className="btn-get-started scrollto d-inline-flex align-items-center justify-content-center align-self-center">
                                        <span>Sign Up</span>
                                        <i className="bi bi-arrow-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 hero-img">
                            <img src="assets/img/hero-img.png" className="img-fluid" alt=""></img>
                        </div>
                    </div>
                </div>

            </section>

            <Link to="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></Link>

            <script src="assets/vendor/purecounter/purecounter_vanilla.js"></script>
            <script src="assets/vendor/aos/aos.js"></script>
            <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
            <script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
            <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
            <script src="assets/vendor/swiper/swiper-bundle.min.js"></script>
            <script src="assets/vendor/php-email-form/validate.js"></script>

            <script src="assets/js/main.js"></script>
        </div>
    );
}

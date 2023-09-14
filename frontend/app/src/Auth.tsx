import React, {useState} from 'react';
import './style.css';

export default function Auth() {
    const [method, setMethod] = useState("Login");
    const [buttonText, setButtonText] = useState("Don't have an account?")
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    function onAuthMethodChange() {
        if (method === "Login") {
            setMethod("Sign up");
            setButtonText("Already have an account?");
        } else {
            setMethod("Login");
            setButtonText("Don't have an account?");
        }
    }

    function onSubmit() {
        console.log({name, lastName, email, password, confirmPassword});
    }


    return (
        <div className="auth">
            <header id="header" className="header fixed-top">
                <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
                    <a href="/index.html" className="logo d-flex align-items-center">
                        {/*<img src="assets/img/logo.png" alt="">*/}
                        <span>WorkPulse</span>
                    </a>
                </div>
            </header>
            <section className="vh-100 login-bg">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card-body p-5 text-center">
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    {method === "Sign up" ? (<div className="form-outline form-white mb-4">
                                        <input type="text" placeholder="Name" id="typePasswordX" value={name}
                                               onChange={(e) => setName(e.target.value)}
                                               className="form-control form-control-lg"/>
                                    </div>) : ""}
                                    {method === "Sign up" ? (<div className="form-outline form-white mb-4">
                                        <input type="text" placeholder="Last name" id="typePasswordX" value={lastName}
                                               onChange={(e) => setLastName(e.target.value)}
                                               className="form-control form-control-lg"/>
                                    </div>) : ""}

                                    <div className="form-outline form-white mb-4">
                                        <input type="email" placeholder="Email" id="typeEmailX" value={email}
                                               onChange={(e) => setEmail(e.target.value)}
                                               className="form-control form-control-lg"/>
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input type="password" placeholder="Password" id="typePasswordX"
                                               value={password} onChange={(e) => setPassword(e.target.value)}
                                               className="form-control form-control-lg"/>
                                    </div>
                                    {method === "Sign up" ? (<div className="form-outline form-white mb-4">
                                        <input type="password" placeholder="Confirm Password" id="confirmPassword"
                                               value={confirmPassword}
                                               onChange={(e) => setConfirmPassword(e.target.value)}
                                               className="form-control form-control-lg"/>
                                    </div>) : ""}
                                    <button className="btn btn-outline-light btn-lg px-5" type="submit"
                                            onClick={onSubmit}>{method}</button>
                                </div>

                                <div>
                                    <h5 className="mb-0" onClick={onAuthMethodChange}>{buttonText}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
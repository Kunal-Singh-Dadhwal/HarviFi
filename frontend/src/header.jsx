import React from "react";
import './header.css';

function Header() {
    return (
        <>
            <div className="header">
                <img src="./public/logo.png" alt="logo" height="100%"/>
                <div className="nav">
                    <button>Explore</button>|
                    <button>Stats</button>|
                    <button>Resources</button>|
                    <button>Create</button>
                    <button id="login">Connect Wallet</button>
                </div>
            </div>
        </>
    );
}

export default Header;

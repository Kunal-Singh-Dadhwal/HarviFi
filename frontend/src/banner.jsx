import React from "react";
import './banner.css';

function Banner() {
    return (
        <>
            <div className="container">
                <h2>Revolutionizing agriculture with blockchain. Empowering farmers through tokenized harvests and fair financing.</h2>
                <img className="banner-img" src="./public/hero-img.jpg" alt="image" width="100%"/>
            </div>
        </>
    );
}

export default Banner;
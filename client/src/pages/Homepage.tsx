import React from "react";
import Hero from "../Homepage/Hero";
import Footer from "../Homepage/Footer";
import InfoSection from "../Homepage/Information/InfoSection";
import {feature1, feature2, feature3} from "../Homepage/Information/InfoData";
import NavBar from "../Homepage/NavBar";


export default function Homepage() {


    return (
        <>
        <NavBar/>
        <Hero></Hero>
        <InfoSection {...feature1}/>
        <InfoSection {...feature2}/>
        <InfoSection {...feature3}/>
        <Footer/>
        </>
    )
}
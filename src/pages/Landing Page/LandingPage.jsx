import React from "react";
import Gallery from "./Gallery";
import LandingHeader from "../../components/LandingHeader";
import Slider from "./Slider";
import RegisterationForm from "./RegisterationForm";
import Points from "./Points";
import Sponsors from "./Sponsors";
import FAQ from "./FAQ";

const LandingPage = () => {
  return <div className="relative">
    <LandingHeader/>
    <Slider/>
    {/* <Gallery/> */}
    <RegisterationForm/>
    <Points/>
    <Sponsors/>
    <FAQ/>
  </div>;
};

export default LandingPage;

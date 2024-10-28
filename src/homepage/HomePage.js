import React, { useState } from "react";
import CovidXray1 from "C:/Users/jogee/Desktop/Narayana 1.0/frontend/src/images/xray/covid/covid (1).png";
import Normalray1 from "C:/Users/jogee/Desktop/Narayana 1.0/frontend/src/images/xray/normal/normal (1).png";
import CovidUltrasound1 from "C:/Users/jogee/Desktop/Narayana 1.0/frontend/src/images/ultrasound/covid/covid (1).jpg";
import NormalUltrasound1 from "C:/Users/jogee/Desktop/Narayana 1.0/frontend/src/images/ultrasound/normal/normal (1).jpg";
import CovidCTScan1 from "C:/Users/jogee/Desktop/Narayana 1.0/frontend/src/images/ctscan/covid/covid (1).png";
import NormalCTScan1 from "C:/Users/jogee/Desktop/Narayana 1.0/frontend/src/images/ctscan/normal/normal (1).png";


function HomePage() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div style={{ paddingTop: "5rem" }}>
      <div className="ps-5">
        <div
          style={{
            height: "20rem",
            width: "20rem",
          }}
          className={`card bg-primary ${isHovered ? "hovered" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!isHovered ? (
            <div style={{display:'flex',justifyContent:'center',height:'100%',alignItems:'center'}}>
              <div className="text-center">
              <h3 className="text-white">COVID-19</h3>
              <h3 className="text-white">Chest-Xray</h3>
              <h3 className="text-white">Images</h3>
              </div>
              </div>
          ) : (
            <img
            style={{width:'100%',height:'100%',objectFit:'cover'}}
              src={CovidXray1} // Placeholder image
              alt="Transformed"
              className="card-image"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

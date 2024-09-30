import "./HomePage.css";
import React, { useEffect, useState } from "react";
import CoronavirusTwoToneIcon from "@mui/icons-material/CoronavirusTwoTone";
import Carousel from "better-react-carousel";

import macimage from "C:/Users/jogee/Desktop/Narayana 1.0/frontend/src/images/monitorpng.png";

import xraycovidimage1 from "../images/xray/covid/covid (1).png";
import xraycovidimage2 from "../images/xray/covid/covid (2).png";
import xraycovidimage4 from "../images/xray/covid/covid (4).png";
import xraycovidimage5 from "../images/xray/covid/covid (5).png";

import ctscancovidimage1 from "../images/ctscan/covid/covid (1).png";
import ctscancovidimage2 from "../images/ctscan/covid/covid (2).png";
import ctscancovidimage4 from "../images/ctscan/covid/covid (4).png";
import ctscancovidimage5 from "../images/ctscan/covid/covid (5).png";

import ultrasoundcovidimage1 from "../images/ultrasound/covid/covid (1).jpg";
import ultrasoundcovidimage2 from "../images/ultrasound/covid/covid (2).jpg";
import ultrasoundcovidimage4 from "../images/ultrasound/covid/covid (4).jpg";
import ultrasoundcovidimage5 from "../images/ultrasound/covid/covid (5).jpg";

import xraynormalimage1 from "../images/xray/normal/normal (1).png";
import xraynormalimage3 from "../images/xray/normal/normal (3).png";
import xraynormalimage4 from "../images/xray/normal/normal (4).png";
import xraynormalimage5 from "../images/xray/normal/normal (5).png";

import ctscannormalimage2 from "../images/ctscan/normal/normal (2).png";
import ctscannormalimage3 from "../images/ctscan/normal/normal (3).png";
import ctscannormalimage4 from "../images/ctscan/normal/normal (4).png";
import ctscannormalimage5 from "../images/ctscan/normal/normal (5).png";

import ultrasoundnormalimage1 from "../images/ultrasound/normal/normal (1).jpg";
import ultrasoundnormalimage3 from "../images/ultrasound/normal/normal (3).jpg";
import ultrasoundnormalimage4 from "../images/ultrasound/normal/normal (4).jpg";
import ultrasoundnormalimage5 from "../images/ultrasound/normal/normal (5).jpg";

function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  const [results, setresults] = useState(0);

  const images = [
    { id: 1, src: xraynormalimage1, alt: "Image 1" },
    { id: 2, src: ctscancovidimage1, alt: "Image 2" },
    { id: 3, src: ultrasoundnormalimage1, alt: "Image 3" },
    { id: 4, src: xraycovidimage1, alt: "Image 4" },
    { id: 5, src: ctscannormalimage2, alt: "Image 5" },
    { id: 6, src: ultrasoundcovidimage1, alt: "Image 6" },
  ];

  const switchImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    setresults((prevResults) => prevResults + 1);
    console.log(results);
  };

  useEffect(() => {
    const interval = setInterval(switchImage, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4">
      <div
        className="pt-3"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div>
          <CoronavirusTwoToneIcon
            className="text-danger rotate"
            style={{ fontSize: "5rem" }}
          />
        </div>
        <div className="pt-3">
          <h2>Narayana 1.0</h2>
        </div>
        <div>
          <CoronavirusTwoToneIcon
            className="text-success rotatereverse"
            style={{ fontSize: "5rem" }}
          />
        </div>
      </div>

      <div className="row px-5 pt-3">
        <div style={{ position: "relative" }} className="col">
          <div
            style={{
              position: "absolute",
              width: "85%",
              left: "3.3rem",
              top: "1.8rem",
            }}
            className="pt-3"
          >
            <Carousel rows={3} cols={4} gap={30} loop autoplay={4000}>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={xraycovidimage2}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={xraycovidimage1}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={xraycovidimage4}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={xraycovidimage5}
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={ctscancovidimage2}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={ctscancovidimage1}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={ctscancovidimage4}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={ctscancovidimage5}
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={ultrasoundcovidimage4}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={ultrasoundcovidimage1}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={ultrasoundcovidimage5}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid red" }}
                  width="100%"
                  src={ultrasoundcovidimage2}
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={xraynormalimage1}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={xraynormalimage3}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={xraynormalimage4}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={xraynormalimage5}
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={ctscannormalimage5}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={ctscannormalimage3}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={ctscannormalimage4}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={ctscannormalimage2}
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={ultrasoundnormalimage1}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={ultrasoundnormalimage3}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={ultrasoundnormalimage4}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ border: "0.2rem solid green" }}
                  width="100%"
                  src={ultrasoundnormalimage5}
                />
              </Carousel.Item>
            </Carousel>
          </div>
          <img width="100%" src={macimage} />
        </div>
        <div className="col">
          <div className="text-center">
            <img
              src={images[currentImage].src}
              alt={images[currentImage].alt}
              style={{ width: "80%" }}
            />
            <br></br>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                className="input-group"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{ width: "40%", textAlign: "center" }}
                  className={`btn ${
                    results % 2 === 0 ? "btn-success" : "btn-outline-success"
                  }`}
                >
                  <h5 className="pt-1">Negative</h5>
                </div>
                <div
                  style={{ width: "40%", textAlign: "center" }}
                  className={`btn ${
                    results % 2 !== 0 ? "btn-danger" : "btn-outline-danger"
                  }`}
                >
                  <h5 className="pt-1">Positive</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

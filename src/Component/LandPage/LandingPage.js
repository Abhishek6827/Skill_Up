import React, { Suspense } from "react";
import "./LandingPage.css";
import { Box } from "@mui/material";
import superman from "../SVG/SuperMan.svg";
import study from "../SVG/Study.svg";
import live from "../SVG/Live.svg";
import Book from "../SVG/Book.svg";
// import LandingPageNavbar from "./LandingPageNavbar";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";
import Loader from "../Loader/CircularProgressWithLabel";
import { Fade } from "react-awesome-reveal";

const LandingPageNavbar = React.lazy(() => import("./LandingPageNavbar.js"));

const LandingPage = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <LandingPageNavbar />
      </Suspense>
      <Box
        className="mainContainer"
        sx={{
          height: "100vh",
          widht: "100wh",
          display: "flex",
          // border: "1px solid black"
          // flexDirection:"column",
        }}
      >
        <Box
          position={"relative"}
          marginTop="5rem"
          id="Left"
          padding={"2rem"}
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 0.6,
            // border:"2px solid black",
            // height:"100vh",
            // widht:"100wh"
          }}
        >
          <Fade cascade triggerOnce>
            <p className="landpageTitle">Ready to boost up your Skills!</p>
            <div style={{ marginTop: "1rem" }}>
              <p className="skillup">SkillUp</p>
              <p className="LandpageMainText">
                is a absolutely free and amazing platform for the children and
                students for enhancing their skills and gaining knowledge about
                the top trending skills around the world.
              </p>
              <p className="Quote">
                <i>"Every skill you acquire doubles your odds of success."</i>
              </p>
            </div>
          </Fade>
        </Box>

        <Box id="Right">
          <img className="superman" src={superman} alt="Superman" />
        </Box>
      </Box>

      {/* !-----------------------------SUPERMAN PART ENDED-----------------------------!  */}

      <div className="middleSection">
        <div className="middleSection_1">
          <Fade cascade triggerOnce direction="right">
            <div className="service_1">
              <img src={study} alt="videoLessons" className="serviceImg" />
            </div>

            <div className="service1_text">
              <h1 className="service1_text_head">Video Lessons</h1>
              <p className="landingText">
                SkillUp provides immense free video lessons for all kind of
                skills for Our learners as we believe in sharing knowledge &
                providing a path to all the beginners and experts.
              </p>
            </div>
          </Fade>
        </div>

        <div className="middleSection_1" id="service2">
          <Fade cascade triggerOnce direction="left">
            <div className="service1_text">
              <h1 className="service1_text_head">Free Live Sessions</h1>
              <p className="landingText">
                Live Session is the prime objective of SkillUp platform, we want
                a beginner to get easily connected to an Expert and have a
                crystal clear success path in front of them.
              </p>
            </div>

            <div className="service_1">
              <img
                src={live}
                alt="videoLessons"
                id="liveImg"
                className="serviceImg"
              />
            </div>
          </Fade>
        </div>

        <div className="middleSection_1">
          <Fade cascade triggerOnce direction="right">
            <div className="service_1">
              <img src={Book} alt="videoLessons" className="serviceImg" />
            </div>

            <div className="service1_text">
              <h1 className="service1_text_head">Skills Oriented Articles</h1>
              <p className="landingText">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus,
                aspernatur? Omnis numquam aperiam eligendi, enim hic officia,
                rem error sit sapiente nisi quae minima repellendus placeat eum
                aspernatur repudiandae. Error.
              </p>
            </div>
          </Fade>
        </div>
      </div>

      <BottomNavbar />
    </>
  );
};

export default LandingPage;

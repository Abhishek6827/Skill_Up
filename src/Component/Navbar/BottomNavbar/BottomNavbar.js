import React from "react";
import "./BottomNavbar.css";
import { BsFacebook, BsTwitter, BsLinkedin } from "react-icons/bs";
import { Fade } from "react-awesome-reveal";
import { Box } from "@mui/material";

const BottomNavbar = () => {
  return (
    <Box className="bottomNavbar">
      <p className="bottomConnect">Connect with us</p>
      <Box className="bttomNavbarIcons">
        <Fade left>
          <a
            style={{ color: "black" }}
            target="_blank"
            rel="noreferrer"
            href="https://www.facebook.com/devilizbusy"
          >
            <BsFacebook size={30} className="icon" />
          </a>
        </Fade>
        <Fade top>
          <a
            style={{ color: "black" }}
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/devilizbusy?t=tEUTysItbB-mejwRHI78vQ&s=08"
          >
            <BsTwitter size={30} className="icon" />
          </a>
        </Fade>
        <Fade right>
          <a
            style={{ color: "black" }}
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/abhishek-chauhan-185747231"
          >
            <BsLinkedin size={30} className="icon" />
          </a>
        </Fade>
      </Box>
      <p className="rights">
        Copyright 2025 SKILLUP - All rights reserved <br /> Created and
        Maintained by
        <b> Abhishek Tiwari ❤️</b>
      </p>
    </Box>
  );
};

export default BottomNavbar;

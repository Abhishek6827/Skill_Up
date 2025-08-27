import React from "react";
import "./LandingPageNavbar.css";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import Logo from "../SVG/SKIllUpLogo.svg";

const LandingPageNavbar = () => {
  return (
    <nav>
      <Box height={"4.5rem"} display={"flex"} className="landingPageNavbar">
        <Box
          className="Left"
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
          flex={1}
        >
          <img
            src={Logo || "/placeholder.svg"}
            alt="SkillUp"
            className="Logo"
          />
        </Box>
        <Box className="middle"></Box>
        <Box
          className="Right"
          padding={"1rem"}
          display={"flex"}
          justifyContent={"space-around"}
          flex={1}
          flexDirection={"row-reverse"}
        >
          <Link to="/signup" style={{ textDecoration: "none", color: "black" }}>
            <Button
              variant="outlined"
              color="inherit"
              className="registerButton"
            >
              Sign Up/Log In
            </Button>
          </Link>
        </Box>
      </Box>
    </nav>
  );
};

export default LandingPageNavbar;

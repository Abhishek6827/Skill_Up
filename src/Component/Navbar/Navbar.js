import React, { useState } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { Box, Avatar } from "@mui/material";
import { auth } from "../../firebase";
import DropMenu from "../Dropdown Menu/DropMenu";
import Logo from "../SVG/SKIllUpLogo.svg";

const Navbar = () => {
  const [dropMenu, setDropMenu] = useState(false);

  return (
    <>
      <Box
        sx={{
          height: "4rem",
          position: "fixed",
          width: "100%",
          zIndex: 100,
          top: 0,
          backgroundColor: "rgba(255, 255, 255, 0.266)",
          backdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {/* Left Section (Logo) */}
        <Box className="LeftNavbar" width="30%">
          <Link to="/Homepage" style={{ textDecoration: "none" }}>
            <img
              src={Logo}
              alt="SkillUp Logo"
              style={{ height: "3.5rem", width: "auto", marginLeft: "-40px" }}
            />
          </Link>
        </Box>

        {/* Right Section (Nav Links + Avatar) */}
        <Box
          className="RightNavbar"
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <NavLink
            to="/Homepage"
            className="activeLink-Home"
            style={{ textDecoration: "none" }}
          >
            <div className="homeButton">Home</div>
          </NavLink>

          <NavLink
            to="/blogs"
            className="activeLink-Blog"
            style={{ textDecoration: "none" }}
          >
            <div className="blogButton">Blogs</div>
          </NavLink>

          <NavLink
            to="/videos"
            className="activeLink-Blog"
            style={{ textDecoration: "none" }}
          >
            <div className="blogButton">Video Lessons</div>
          </NavLink>

          <NavLink
            to="/liveSessions"
            className="activeLink-Session"
            style={{ textDecoration: "none" }}
          >
            <div className="sessionButton">Live Session</div>
          </NavLink>

          <Avatar
            className="Avatar"
            src={auth.currentUser?.photoURL || ""}
            alt="User Avatar"
            sx={{ border: "0.3px solid black", cursor: "pointer" }}
            onClick={() => setDropMenu(!dropMenu)}
          />
        </Box>

        {dropMenu && <DropMenu dropMenu={dropMenu} setDropMenu={setDropMenu} />}
      </Box>
    </>
  );
};

export default Navbar;

import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Box,
  ListItem,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FormContext } from "../Context/DetailFormContext.js";

const DropMenu = ({ dropMenu, setDropMenu }) => {
  const { Logout } = useAuth();
  const navigate = useNavigate();
  const [presentUserType, setPresentUserType] = useState();
  const { setshowEducationForm } = useContext(FormContext);
  const ref = useRef();

  // Authentication function (logout)
  async function logout() {
    try {
      await Logout();
      navigate("/");
      setshowEducationForm(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (dropMenu && ref.current && !ref.current.contains(e.target)) {
        setDropMenu(false);
      }
    };

    const getCurrentUser = async () => {
      try {
        const docSnap = await getDoc(doc(db, "user", auth.currentUser.uid));
        if (docSnap.exists()) {
          setPresentUserType(docSnap.data().UserType);
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    getCurrentUser();

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
      setPresentUserType("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropMenu]);

  return (
    <Box position={"absolute"} top={"3.3rem"} left={"82%"} ref={ref}>
      <Box
        sx={{
          width: 200,
          bgcolor: "#e7e7e7",
          position: "absolute",
          boxShadow: "0px 1px 4px 0px rgb(0 0 0 / 25%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "5%",
        }}
      >
        {presentUserType === "Volunteer" ? (
          <List>
            <ListItem disablePadding={true}>
              <Link
                to="/Profile"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItemButton
                  style={{ width: "12.3rem", textAlign: "center" }}
                >
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </Link>
            </ListItem>

            <ListItem disablePadding>
              <Link
                to="/createSession"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItemButton
                  style={{ width: "12.3rem", textAlign: "center" }}
                >
                  <ListItemText primary="Create a Session" />
                </ListItemButton>
              </Link>
            </ListItem>

            <ListItem disablePadding={true}>
              <Link
                to="/Aboutus"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItemButton
                  style={{ width: "12.3rem", textAlign: "center" }}
                >
                  <ListItemText primary="About us" />
                </ListItemButton>
              </Link>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={logout}>
                <ListItemText
                  primary="Logout"
                  style={{ textAlign: "center" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        ) : (
          <List>
            <ListItem disablePadding={true}>
              <Link
                to="/Profile"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItemButton
                  style={{ width: "12.3rem", textAlign: "center" }}
                >
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </Link>
            </ListItem>

            <ListItem disablePadding={true}>
              <Link
                to="/Aboutus"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItemButton
                  style={{ width: "12.3rem", textAlign: "center" }}
                >
                  <ListItemText primary="About us" />
                </ListItemButton>
              </Link>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={logout}>
                <ListItemText
                  primary="Logout"
                  style={{ textAlign: "center" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </Box>
    </Box>
  );
};

export default DropMenu;

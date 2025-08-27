import React, { useState, useEffect, useContext } from "react";
//import bg from "../Component/Images/LW002.jpg"
import {
  Typography,
  TextField,
  Box,
  FormControl,
  Alert,
  Button,
} from "@mui/material";
import "./SignUp.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "yup-phone";
import * as yup from "yup";
import { auth, GoogleAuth, FacebookAuth, db } from "../firebase";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAuth } from "../AuthContext";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import Signup from "./SVG/Signup.svg";
import Logo from "./SVG/SKIllUpLogo.svg";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
//import Background from "./SVG/Background.svg"
import { FormContext } from "./Context/DetailFormContext.js";
//import { whitespace } from "jshint/src/reg";

// !----------------------FORM VALIDATION SCHEMA---------------------------!
const schema = yup.object().shape({
  Email: yup.string().email().required(),
});

const SignUp = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [correctEmail, setCorrectEmail] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithFacebook, sendEmailLink } = useAuth(); //Method imported from AUth

  const {
    showPersonaldetailForm,
    showEducationForm,
    setshowPersonaldetailForm,
    //setshowEducationForm,
  } = useContext(FormContext);

  // !--------------------METHODS STARTS--------------------------!

  const signup = async (e) => {
    // e.preventDefault();
    setLoading(!loading);

    try {
      await sendEmailLink(auth, registerEmail);
      setCorrectEmail(true);
      setMessage("Please check your Email to proceed further");
      localStorage.setItem("user", "loggedIn");
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const GoogleSignIn = async () => {
    setLoading(!loading);

    try {
      await signInWithGoogle(auth, GoogleAuth);
      const Snapshot = await getDoc(doc(db, "user", auth.currentUser.uid));
      console.log(Snapshot);
      if (Snapshot.exists()) {
        navigate("/Homepage", { replace: true });
      } else navigate("/personalForm", { replace: true });
      setshowPersonaldetailForm(true);
      setLoading(false);
    } catch (error) {
      setLoading(!loading);
      console.log(error);
    }
  };

  const FacebookSignIn = async () => {
    setLoading(!loading);
    try {
      await signInWithFacebook(auth, FacebookAuth);
      const Snapshot = await getDoc(doc(db, "user", auth.currentUser.uid));
      if (Snapshot.exists()) {
        navigate("/Homepage", { replace: true });
      } else setshowPersonaldetailForm(true);
      console.log("false");
      setLoading(!loading);
    } catch (error) {
      setLoading(false);
      setError("Account exists with different credential");
      console.log(error);
    }
  };

  // !-----------------------------METHODS ENDS-------------------------!

  // setTimeout(() => {
  //   setCorrectEmail(false);
  // }, [5000]);

  useEffect(() => {
    return () => {
      setRegisterEmail("");
      setLoading(false);
      setMessage("");
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <Box className="signUpContainer">
      <div className="Left">
        <Link to="/" style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={Logo}
            alt="Logo"
            className="SignupLogo"
            style={{ marginBottom: "3%" }}
          />
        </Link>

        <Typography
          style={{
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          Please Sign Up/Login to continue !
        </Typography>
        <img
          src={Signup}
          alt="Signup"
          className="SignupImage"
          // border={"2px solid black"}
        />
      </div>

      <div className="Right">
        {!showPersonaldetailForm && !showEducationForm && (
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "30rem",
              height: "auto",
              // justifyContent:"center",
              // alignItems:"center",
              boxShadow: 3,
              bgcolor: "rgb(255,255,252,0.41)",
              backdropFilter: "blur(10px)",
              p: 2,
              borderRadius: "8px",
              // marginTop:"5rem"
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, alignSelf: "center" }}>
              Sign Up/Log In
            </Typography>

            {error && (
              <Alert severity="error" style={{ marginBottom: "1rem" }}>
                {error}
              </Alert>
            )}
            {correctEmail && (
              <Alert
                severity="success"
                style={{ marginBottom: "1rem", position: "relative" }}
              >
                {message}
              </Alert>
            )}

            <Box
              display="flex"
              alignSelf={"center"}
              flexDirection={"column"}
              minHeight="8rem"
              width={"80%"}
              height={"4rem"}
              padding={"1rem"}
              justifyContent={"space-between"}
            >
              <Button variant="outlined" onClick={GoogleSignIn}>
                <FcGoogle
                  sx={{ m: 2, width: "10px", height: "10px" }}
                  // variant="contained"
                  // color="primary"
                  style={{ margin: "0 1rem 0 -1rem" }}
                  size={30}
                />
                Continue with Google
              </Button>

              <Button variant="outlined" onClick={FacebookSignIn}>
                <BsFacebook
                  // variant="contained"
                  // color="primary"
                  size={30}
                  style={{ margin: "0 1rem 0 0" }}
                />
                Continue with Facebook
              </Button>
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignContent="center"
            >
              <Box display={"flex"} margin={"0.5rem"}>
                <hr
                  color={"lightgrey"}
                  width={"100%"}
                  style={{ height: "1px", margin: "4px" }}
                />
                <p style={{ fontSize: "" }}>OR</p>

                <hr
                  color={"lightgrey"}
                  width={"100%"}
                  style={{ height: "1px", margin: "4px" }}
                />
              </Box>
            </Box>

            <TextField
              label="Email"
              name="email"
              type={"email"}
              {...register("Email")}
              margin="dense"
              sx={{ width: "100%" }}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />

            <p style={{ color: "red" }}>{errors.Email?.message}</p>

            <LoadingButton
              loading={loading}
              type={"submit"}
              variant="contained"
              sx={{ width: "30%", alignSelf: "center", m: "1rem" }}
              onClick={handleSubmit(signup)}
            >
              Submit
            </LoadingButton>
          </FormControl>
        )}
      </div>
    </Box>
  );
};

export default SignUp;

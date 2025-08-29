import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Typography,
  TextField,
  Box,
  FormControl,
  Alert,
  Button,
} from "@mui/material";
import { auth } from "../firebase";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Signup from "./SVG/Signup.svg";
import PersonalDetailForm from "./PersonalForms/PersonalDetailForm";
import { FormContext } from "./Context/DetailFormContext.js";
import EducationalForm from "./EducationForm/EducationForm";

const ConfirmPage = () => {
  const {
    showPersonaldetailForm,
    showEducationForm,
    setshowPersonaldetailForm,
  } = useContext(FormContext);

  const [registerEmail, setRegisterEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailLinkUsed, setEmailLinkUsed] = useState(false);
  const {
    signInWithEmail,
    getEmailForSignIn,
    clearEmailForSignIn,
    checkSignInWithEmailLink,
    sendEmailLink,
    saveEmailForSignIn,
  } = useAuth();

  const navigate = useNavigate();

  // Define checkUserExists first with useCallback
  const checkUserExists = useCallback(async () => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user authenticated");
      }

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        navigate("/Homepage", { replace: true });
      } else {
        setshowPersonaldetailForm(true);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setError("Failed to check user data. Please try again.");
    }
  }, [navigate, setshowPersonaldetailForm]);

  // Then define handleEmailLinkSignIn which uses checkUserExists
  const handleEmailLinkSignIn = useCallback(
    async (email) => {
      setLoading(true);
      setError("");

      try {
        await signInWithEmail(email, window.location.href);
        clearEmailForSignIn();
        await checkUserExists();
      } catch (error) {
        console.error("Email link sign-in error:", error);
        setError(
          error.message || "Failed to complete sign-in. Please try again."
        );
        setEmailLinkUsed(false);
      } finally {
        setLoading(false);
      }
    },
    [signInWithEmail, clearEmailForSignIn, checkUserExists]
  );

  // Check if user arrived via email link
  useEffect(() => {
    const checkEmailLink = async () => {
      const email = getEmailForSignIn();

      if (checkSignInWithEmailLink(window.location.href) && email) {
        setRegisterEmail(email);
        setEmailLinkUsed(true);
        handleEmailLinkSignIn(email);
      }
    };

    checkEmailLink();
  }, [checkSignInWithEmailLink, getEmailForSignIn, handleEmailLinkSignIn]);

  const handleManualSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // For manual entry, we need to check if the current URL is an email link
      if (checkSignInWithEmailLink(window.location.href)) {
        await signInWithEmail(registerEmail, window.location.href);
        clearEmailForSignIn();
        await checkUserExists();
      } else {
        setError(
          "This page is only for completing email link authentication. Please use the link sent to your email."
        );
      }
    } catch (error) {
      console.error("Manual sign-in error:", error);
      setError(
        error.message || "Failed to complete sign-in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError("");

    try {
      await sendEmailLink(registerEmail);
      saveEmailForSignIn(registerEmail);
      setError(""); // Clear any previous errors
      alert("Verification email sent again. Please check your inbox.");
    } catch (error) {
      console.error("Resend email error:", error);
      setError(error.message || "Failed to resend email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Pre-fill email from localStorage if available
    const savedEmail = getEmailForSignIn();
    if (savedEmail) {
      setRegisterEmail(savedEmail);
    }
  }, [getEmailForSignIn]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        padding: "2rem",
        gap: "2rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          maxWidth: "500px",
        }}
      >
        <Typography variant="h4" textAlign={"center"} gutterBottom>
          {emailLinkUsed ? "Completing Sign Up" : "Confirm Your Email"}
        </Typography>
        <img
          src={Signup}
          alt="Signup"
          style={{ height: "70%", width: "70%", maxWidth: "400px" }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        {!showPersonaldetailForm && !showEducationForm && (
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "400px",
              boxShadow: 8,
              bgcolor: "white",
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, alignSelf: "center", textAlign: "center" }}
            >
              {emailLinkUsed
                ? "Completing your sign up..."
                : "Verify Your Email"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {emailLinkUsed ? (
              <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
                Please wait while we complete your sign up...
              </Typography>
            ) : (
              <>
                <Typography variant="body2" sx={{ mb: 2, textAlign: "center" }}>
                  Please enter the email you used to sign up to complete the
                  verification process.
                </Typography>

                <TextField
                  label="Email"
                  type="email"
                  margin="dense"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  disabled={loading}
                  fullWidth
                />

                <LoadingButton
                  loading={loading}
                  variant="contained"
                  sx={{ mt: 2, mb: 1 }}
                  onClick={handleManualSignIn}
                  disabled={!registerEmail || loading}
                  fullWidth
                >
                  Complete Sign Up
                </LoadingButton>

                <Button
                  variant="outlined"
                  onClick={handleResendEmail}
                  disabled={loading || !registerEmail}
                  sx={{ mt: 1 }}
                  fullWidth
                >
                  Resend Verification Email
                </Button>
              </>
            )}

            {loading && (
              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
              >
                Processing...
              </Typography>
            )}
          </FormControl>
        )}

        {showPersonaldetailForm && <PersonalDetailForm />}
        {showEducationForm && <EducationalForm />}
      </Box>
    </Box>
  );
};

export default ConfirmPage;

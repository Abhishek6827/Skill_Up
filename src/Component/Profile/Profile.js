import React, { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { MdAddAPhoto } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../Modal/DeleteModal";
import "./Profile.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  Typography,
  Box,
  Avatar,
  Button,
  Input,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../AuthContext";
import { auth, db } from "../../firebase";
import Navbar from "../Navbar/Navbar";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [info, setInfo] = useState({});
  const [profileURL, setProfileURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { deleteUsers, Logout } = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        if (!auth.currentUser?.uid) {
          navigate("/signUp");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setInfo(userData);

          // If user has a profilePic field in Firestore, use it
          if (userData.profilePic) {
            setProfileURL(userData.profilePic);
          } else {
            // Otherwise try to get from Firebase Storage
            getProfilePic();
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();

    // Only include navigate in the dependency array
  }, [navigate]); // Removed auth.currentUser from dependencies

  const deleteHandler = async () => {
    setIsModalOpen(true);
  };

  function getProfilePic() {
    try {
      // Create a reference to the user's profile picture
      const filePath = ref(storage, `ProfilePic/${auth.currentUser.uid}`);

      getDownloadURL(filePath)
        .then((url) => {
          console.log("Profile Pic Url:", url);
          setProfileURL(url);
        })
        .catch((error) => {
          console.log("No profile picture found:", error);
          // Set a default avatar if no profile picture exists
          setProfileURL("/default-avatar.png");
        });
    } catch (error) {
      console.error("Error getting profile picture:", error);
      setProfileURL("/default-avatar.png");
    }
  }

  async function picHandler(e) {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFile = e.target.files[0];
    setUploading(true);

    try {
      // Create a reference to the user's profile picture in Firebase Storage
      const filePath = ref(storage, `ProfilePic/${auth.currentUser.uid}`);

      // Upload the file to Firebase Storage
      const uploadTask = uploadBytesResumable(filePath, newFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress:", progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setUploading(false);
        },
        async () => {
          // Upload completed successfully, get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);
          setProfileURL(downloadURL);

          // Save the profile picture URL to Firestore
          try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
              profilePic: downloadURL,
            });
          } catch (error) {
            console.error("Error saving profile picture URL:", error);
          }

          setUploading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await Logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUsers();
      navigate("/");
    } catch (error) {
      console.error("Delete account error:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {isModalOpen && (
        <DeleteModal
          closeModal={setIsModalOpen}
          onConfirm={handleDeleteAccount}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          margin: "4.2rem auto",
          width: "90%",
          maxWidth: "1200px",
          padding: "2rem",
          boxShadow: "0px 1px 4px 0px rgb(0 0 0 / 25%)",
          borderRadius: "12px",
          backgroundColor: "white",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: "2rem", md: "4rem" },
        }}
      >
        {/* Left Section - Profile Picture */}
        <Box
          className="Left"
          flex={0.4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding="1rem"
        >
          <Box
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              src={profileURL}
              sx={{
                width: 200,
                height: 200,
                fontSize: "6rem",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                border: "4px solid #1976d2",
              }}
            />

            <label
              htmlFor="contained-button-file"
              style={{ cursor: "pointer" }}
            >
              <MdAddAPhoto
                className="addProfilePic"
                style={{
                  position: "relative",
                  marginTop: "-30px",
                  marginLeft: "70px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: "5px",
                  fontSize: "24px",
                }}
              />
            </label>

            <Input
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={picHandler}
              style={{ display: "none" }}
            />

            {uploading && (
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="textSecondary">
                  Uploading...
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
            {info.FullName || auth.currentUser?.displayName || "User"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {auth.currentUser?.email}
          </Typography>
        </Box>

        {/* Right Section - User Information */}
        <Box
          className="Right"
          flex={0.6}
          display="flex"
          flexDirection="column"
          gap="2rem"
        >
          {/* Personal Details */}
          <Box>
            <Typography
              variant="h5"
              sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
            >
              Personal Details
            </Typography>
            <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2 }}>
              <InfoItem label="Email" value={auth.currentUser?.email} />
              <InfoItem label="Full Name" value={info.FullName} />
              <InfoItem label="Mobile Number" value={info.PhoneNo} />
              <InfoItem label="Gender" value={info.Gender} />
            </Box>
          </Box>

          {/* Educational Background */}
          <Box>
            <Typography
              variant="h5"
              sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
            >
              Educational Background
            </Typography>
            <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2 }}>
              <InfoItem
                label="Highest Qualification"
                value={info.Qualification}
              />
              <InfoItem label="Institution Name" value={info.Institute} />
              <InfoItem label="Institution City" value={info.InstituteCity} />
              <InfoItem label="Institution State" value={info.InstituteState} />
            </Box>
          </Box>

          {/* Account Settings */}
          <Box>
            <Typography
              variant="h5"
              sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
            >
              Account Settings
            </Typography>
            <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2 }}>
              <InfoItem label="Account Type" value={info.UserType} />

              <Box display="flex" flexDirection="column" gap={2} mt={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" fontWeight={600}>
                    Delete Account:
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={deleteHandler}
                    sx={{ minWidth: "120px" }}
                  >
                    Delete
                  </Button>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" fontWeight={600}>
                    Logout:
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleLogout}
                    sx={{ minWidth: "120px" }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// Helper component for displaying info items
const InfoItem = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 1,
      borderBottom: "1px solid #e9ecef",
    }}
  >
    <Typography variant="body1" fontWeight={600} sx={{ minWidth: "150px" }}>
      {label}:
    </Typography>
    <Typography variant="body1" sx={{ textAlign: "right", flex: 1 }}>
      {value || "Not provided"}
    </Typography>
  </Box>
);

export default Profile;

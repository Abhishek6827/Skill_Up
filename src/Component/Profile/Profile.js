import React, { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { MdAddAPhoto } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../Modal/DeleteModal";
import "./Profile.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Typography, Box, Avatar, Button, Input } from "@mui/material";
import { useAuth } from "../../AuthContext";
import { auth, db } from "../../firebase";
import Navbar from "../Navbar/Navbar";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [info, setInfo] = useState([]);
  const [profilePic, setProfilePic] = useState([]);
  const [profileURL, setProfileURL] = useState(null);
  const navigate = useNavigate();
  const { deleteUsers, Logout } = useAuth();

  useEffect(() => {
    const getData = async () => {
      const Data = await getDoc(doc(db, "user", auth.currentUser.uid));
      setInfo(Data.data());
    };
    if (auth.currentUser.uid) {
      getData();
    }
    getProfilePic();
    return () => {
      getData();
    };
  }, []);

  const deleteHandler = async () => {
    setIsModalOpen(true);
  };

  function getProfilePic() {
    const storageRef = ref(storage, "ProfilePic");
    const filePath = ref(storageRef, auth.currentUser.email);

    getDownloadURL(ref(filePath))
      .then((url) => {
        console.log("Profile Pic Url : ", url);
        setProfileURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function picHandler(e) {
    setProfilePic([...profilePic, e.target.files[0]]);
    const newFile = e.target.files[0];
    const storageRef = ref(storage, "ProfilePic");
    const filePath = ref(storageRef, auth.currentUser.email);
    const uploadFile = uploadBytesResumable(filePath, newFile);

    uploadFile.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(progress);

      if (progress === 100) {
        setTimeout(async () => {
          const URL = await getDownloadURL(filePath);
          console.log(URL);
          setProfileURL(URL);
        }, [2000]);
      }
    });
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
          alignContent: "center",
          margin: "4.2rem auto",
          width: "80%",
          padding: "2rem 5rem",
          boxShadow: "0px 1px 4px 0px rgb(0 0 0 / 25%)",
        }}
      >
        <Box
          className="Left"
          flex={0.5}
          justifyContent={"space-between"}
          alignItems={"center"}
          padding={"2rem auto"}
          flexDirection="column"
        >
          <Avatar
            src={profileURL}
            style={{ position: "absolute" }}
            id="profilePic"
            sx={{
              width: 200,
              height: 200,
              fontSize: "6rem",
              boxShadow: "0px 1px 4px 0px rgb(0 0 0 / 25%)",
            }}
          />
          <MdAddAPhoto className="addProfilePic" />
          <Input
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
            onChange={picHandler}
            style={{ border: "none", outline: "none" }}
            className="addProfilePicButton"
          />
        </Box>
        <Box
          className="Right"
          display={"Flex"}
          flexDirection={"column"}
          flex={1}
          height={"90%"}
        >
          <Box
            width={"80%"}
            padding={"1rem"}
            margin={"0 auto"}
            display={"flex"}
            flex={0.5}
            flexDirection={"column"}
          >
            <Typography variant="h4">Personal Details</Typography>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              flexDirection={"column"}
              flexWrap={"wrap"}
            >
              <hr />
              <p className="infoTitle">
                <b style={{ fontWeight: "600" }}>Email:</b>
                &nbsp;{auth.currentUser.email}
              </p>
              <p className="infoTitle">
                <b style={{ fontWeight: "600" }}>Username:</b>
                &nbsp; {auth.currentUser.displayName}
              </p>
              <p className="infoTitle">
                <b style={{ fontWeight: "600" }}>Mobile Number:</b>
                &nbsp;{info.PhoneNo}
              </p>
              <p className="infoTitle">
                <b style={{ fontWeight: "600" }}>Gender:</b>
                &nbsp; {info.Gender}
              </p>
            </Box>
          </Box>
          <Box
            height={"50%"}
            width={"80%"}
            margin={"0 auto"}
            padding={"1rem"}
            display={"flex"}
            flex={0.5}
            flexDirection={"column"}
          >
            <Typography variant="h4">Educational Background</Typography>
            <Box
              display={"flex"}
              flexWrap={"wrap"}
              flexDirection={"column"}
              justifyContent="space-evenly"
            >
              <hr />
              <p className="infoTitle">
                <b style={{ fontWeight: "600" }}>Highest Qualification:</b>
                &nbsp; {info.Qualification}
              </p>
              <p className="infoTitle">
                <b style={{ fontWeight: "600" }}>Institution Name:</b>
                &nbsp;{info.Institute}
              </p>
              <p className="infoTitle">
                <b style={{ fontWeight: "600" }}>Institution City:</b>
                &nbsp; {info.InstituteCity}
              </p>
              <p className="infoTitle">
                <b style={{ fontWeight: "600" }}>Institution State:</b>
                &nbsp; {info.InstituteState}
              </p>
            </Box>
            <Box style={{ marginTop: "10%" }}>
              <Typography variant="h4">Account Setting</Typography>
              <hr />
              <p style={{ marginTop: "0.4rem", fontSize: "16px" }}>
                <b>Account Type:</b> &nbsp; {info.UserType}
              </p>
              <div
                style={{
                  display: "flex",
                  width: "60%",
                  marginTop: "3%",
                  justifyContent: "space-between",
                }}
              >
                <p className="infoTitle" style={{ fontWeight: "600" }}>
                  Delete Account :
                </p>
                <Button
                  variant={"outlined"}
                  onClick={deleteHandler}
                  style={{ width: "40%" }}
                >
                  Delete
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "60%",
                  marginTop: "3%",
                  justifyContent: "space-between",
                }}
              >
                <p className="infoTitle" style={{ fontWeight: "600" }}>
                  Logout :
                </p>
                <Button
                  variant={"outlined"}
                  onClick={handleLogout}
                  style={{ width: "40%" }}
                >
                  Logout
                </Button>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;

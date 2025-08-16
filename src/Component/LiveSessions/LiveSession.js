import React, { useState, useEffect } from "react";
import "./LiveSession.css";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Avatar } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { MdContentCopy } from "react-icons/md";
import Empty from "../SVG/emptyBlog.svg";
import { Fade } from "react-awesome-reveal";
import { ToastContainer, toast } from "react-toastify";

const LiveSession = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const Category = [
    "All",
    "Cooking",
    "Computer science",
    "Music",
    "Dance",
    "Photography",
    "Art & Craft",
  ];

  useEffect(() => {
    getData();
    return () => {
      setLinks([]);
    };
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      setError("");
      const Info = [];

      console.log("Fetching sessions from Firebase...");
      const SnapShot = await getDocs(collection(db, "totalSession"));

      console.log("Firebase response:", SnapShot.size, "documents found");

      SnapShot.forEach((doc) => {
        Info.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setLinks(Info);
      console.log("Sessions loaded:", Info);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError(
        "Failed to load sessions. Please check your Firebase connection."
      );
    } finally {
      setLoading(false);
    }
  };

  async function selectCategory(category) {
    try {
      setLoading(true);
      setError("");

      if (category === "All") {
        await getData();
        return;
      }

      console.log("Filtering by category:", category);
      const Data = [];
      const collectionRef = collection(db, "totalSession");
      const blogs = await getDocs(
        query(collectionRef, where("Category", "==", category))
      );

      blogs.forEach((doc) => {
        Data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log("Filtered results:", Data);
      setLinks(Data);
    } catch (error) {
      console.error("Error filtering by category:", error);
      setError("Failed to filter sessions.");
    } finally {
      setLoading(false);
    }
  }

  function copyNotify() {
    toast.success("Link Copied !", {
      theme: "dark",
      autoClose: 1500,
      hideProgressBar: true,
      position: "top-center",
    });
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="liveSessionsContainer">
        <div className="skillCategory">
          <div className="categoryTitle">Skills Categories</div>
          <div className="categoryShower">
            <Fade bottom>
              {Category.map((item) => (
                <div key={item}>
                  <p
                    onClick={() => selectCategory(item)}
                    className="Categories"
                  >
                    {item}
                  </p>
                </div>
              ))}
            </Fade>
          </div>
        </div>

        <div className="sessionContainer">
          {error && (
            <div
              className="error-message"
              style={{ color: "red", textAlign: "center", margin: "20px" }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", margin: "20px" }}>
              <p>Loading sessions...</p>
            </div>
          ) : links.length > 0 ? (
            <div className="sessionsGrid">
              {links.map((item) => (
                <div
                  key={item.id || item.CourseName || Math.random()}
                  className="sessionCard"
                >
                  <div className="sessionHeader">
                    <h3 className="sessionCourseName">
                      {item.CourseName || "Untitled Course"}
                    </h3>
                    <div className="sessionMeta">
                      <span className="sessionCategory">
                        {item.Category || "No Category"}
                      </span>
                      <span className="sessionDuration">
                        {item.SessionDuration || "Duration not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="sessionDetails">
                    <div className="sessionDateTime">
                      <div className="sessionDate">
                        <strong>Date:</strong>{" "}
                        {item.SessionDate || "Date not specified"}
                      </div>
                      <div className="sessionStartTime">
                        <strong>Starts At:</strong>{" "}
                        {item.StartTime || "Time not specified"}
                      </div>
                    </div>

                    <div className="sessionDescription">
                      <strong>Description:</strong>
                      <p>{item.Description || "No description available"}</p>
                    </div>

                    <div className="sessionLink">
                      <strong>Session Link:</strong>
                      <div className="linkContainer">
                        <a
                          href={item.Link || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="sessionLinkText"
                        >
                          {item.Link || "No link available"}
                        </a>
                        {item.Link && (
                          <MdContentCopy
                            title="Copy Link"
                            className="copyIcon"
                            onClick={() => {
                              navigator.clipboard.writeText(item.Link);
                              copyNotify();
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="sessionInstructor">
                      <Avatar
                        src={item.volunteerImage || ""}
                        sx={{ width: 50, height: 50 }}
                      />
                      <div className="instructorInfo">
                        <p className="instructorName">
                          {item.volunteerName || "Name not provided"}
                        </p>
                        <p className="instructorEmail">
                          {item.volunteerEmail || "Email not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyPersonalSession">
              <img
                src={Empty || "/placeholder.svg"}
                alt="Empty"
                height={"200px"}
                width="200px"
              />
              <p className="emptyMessage">No Sessions available!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveSession;

import React, { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Avatar } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { MdContentCopy } from "react-icons/md";
import { Fade } from "react-awesome-reveal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LiveSession.css";

const LiveSession = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const Category = [
    "All",
    "Cooking",
    "Computer science",
    "Music",
    "Dance",
    "Photography",
    "Art & Craft",
  ];

  // Sample data for 6 sessions across all categories
  const sampleSessions = [
    {
      id: "1",
      CourseName: "Italian Cooking Masterclass",
      Category: "Cooking",
      SessionDuration: "2 hours",
      SessionDate: "2023-11-15",
      StartTime: "18:00",
      Description:
        "Learn to make authentic pasta and sauces from an Italian chef with 20 years of experience.",
      Link: "https://meet.google.com/abc-def-ghi",
      volunteerImage: "https://randomuser.me/api/portraits/men/32.jpg",
      volunteerName: "Marco Rossi",
      volunteerEmail: "marco.rossi@chef.com",
    },
    {
      id: "2",
      CourseName: "Web Development Fundamentals",
      Category: "Computer science",
      SessionDuration: "3 hours",
      SessionDate: "2023-11-16",
      StartTime: "14:00",
      Description:
        "Introduction to HTML, CSS, and JavaScript for beginners. Build your first website in this interactive session.",
      Link: "https://zoom.us/j/123456789",
      volunteerImage: "https://randomuser.me/api/portraits/women/44.jpg",
      volunteerName: "Sarah Johnson",
      volunteerEmail: "sarah@devacademy.com",
    },
    {
      id: "3",
      CourseName: "Guitar Basics for Beginners",
      Category: "Music",
      SessionDuration: "1.5 hours",
      SessionDate: "2023-11-17",
      StartTime: "17:30",
      Description:
        "Learn basic chords, strumming patterns, and play your first song. No prior experience needed.",
      Link: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_ABCD123",
      volunteerImage: "https://randomuser.me/api/portraits/men/22.jpg",
      volunteerName: "David Wilson",
      volunteerEmail: "david@guitarlessons.com",
    },
    {
      id: "4",
      CourseName: "Contemporary Dance Workshop",
      Category: "Dance",
      SessionDuration: "2 hours",
      SessionDate: "2023-11-18",
      StartTime: "11:00",
      Description:
        "Explore movement, expression, and basic contemporary dance techniques in this energizing session.",
      Link: "https://us02web.zoom.us/j/987654321",
      volunteerImage: "https://randomuser.me/api/portraits/women/67.jpg",
      volunteerName: "Jessica Lee",
      volunteerEmail: "jessica@danceacademy.org",
    },
    {
      id: "5",
      CourseName: "Portrait Photography Techniques",
      Category: "Photography",
      SessionDuration: "2.5 hours",
      SessionDate: "2023-11-19",
      StartTime: "15:00",
      Description:
        "Learn lighting, composition, and posing techniques for stunning portrait photography.",
      Link: "https://meet.google.com/xyz-uvw-rst",
      volunteerImage: "https://randomuser.me/api/portraits/men/55.jpg",
      volunteerName: "Michael Chen",
      volunteerEmail: "michael@photographyworkshops.com",
    },
    {
      id: "6",
      CourseName: "Watercolor Painting for Beginners",
      Category: "Art & Craft",
      SessionDuration: "2 hours",
      SessionDate: "2023-11-20",
      StartTime: "13:00",
      Description:
        "Discover the joy of watercolor painting. Learn basic techniques and create your first artwork.",
      Link: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_EFGH456",
      volunteerImage: "https://randomuser.me/api/portraits/women/28.jpg",
      volunteerName: "Emily Parker",
      volunteerEmail: "emily@artstudio.com",
    },
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

      // In a real app, you would fetch from Firebase
      // For this example, we'll use the sample data
      console.log("Fetching sessions from Firebase...");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLinks(sampleSessions);
      console.log("Sessions loaded:", sampleSessions);
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
      setSelectedCategory(category);

      if (category === "All") {
        setLinks(sampleSessions);
        return;
      }

      console.log("Filtering by category:", category);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const filteredSessions = sampleSessions.filter(
        (session) => session.Category === category
      );

      console.log("Filtered results:", filteredSessions);
      setLinks(filteredSessions);
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
                    className={`Categories ${
                      selectedCategory === item ? "active" : ""
                    }`}
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
                <div key={item.id} className="sessionCard">
                  <div className="sessionHeader">
                    <h3 className="sessionCourseName">{item.CourseName}</h3>
                    <div className="sessionMeta">
                      <span className="sessionCategory">{item.Category}</span>
                      <span className="sessionDuration">
                        {item.SessionDuration}
                      </span>
                    </div>
                  </div>

                  <div className="sessionDetails">
                    <div className="sessionDateTime">
                      <div className="sessionDate">
                        <strong>Date:</strong> {item.SessionDate}
                      </div>
                      <div className="sessionStartTime">
                        <strong>Starts At:</strong> {item.StartTime}
                      </div>
                    </div>

                    <div className="sessionDescription">
                      <strong>Description:</strong>
                      <p>{item.Description}</p>
                    </div>

                    <div className="sessionLink">
                      <strong>Session Link:</strong>
                      <div className="linkContainer">
                        <a
                          href={item.Link}
                          target="_blank"
                          rel="noreferrer"
                          className="sessionLinkText"
                        >
                          {item.Link}
                        </a>
                        <MdContentCopy
                          title="Copy Link"
                          className="copyIcon"
                          onClick={() => {
                            navigator.clipboard.writeText(item.Link);
                            copyNotify();
                          }}
                        />
                      </div>
                    </div>

                    <div className="sessionInstructor">
                      <Avatar
                        src={item.volunteerImage}
                        sx={{ width: 50, height: 50 }}
                      />
                      <div className="instructorInfo">
                        <p className="instructorName">{item.volunteerName}</p>
                        <p className="instructorEmail">{item.volunteerEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyPersonalSession">
              <div className="emptyIllustration">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 500 400"
                  width="200"
                  height="160"
                >
                  <circle cx="250" cy="200" r="150" fill="#f0f0f0" />
                  <circle cx="250" cy="160" r="80" fill="#e0e0e0" />
                  <rect
                    x="200"
                    y="250"
                    width="100"
                    height="80"
                    rx="10"
                    fill="#e0e0e0"
                  />
                  <line
                    x1="200"
                    y1="280"
                    x2="300"
                    y2="280"
                    stroke="#ccc"
                    strokeWidth="5"
                  />
                  <line
                    x1="200"
                    y1="300"
                    x2="300"
                    y2="300"
                    stroke="#ccc"
                    strokeWidth="5"
                  />
                  <line
                    x1="200"
                    y1="320"
                    x2="300"
                    y2="320"
                    stroke="#ccc"
                    strokeWidth="5"
                  />
                  <circle cx="230" cy="150" r="10" fill="#aaa" />
                  <circle cx="270" cy="150" r="10" fill="#aaa" />
                  <path
                    d="M220,190 Q250,220 280,190"
                    stroke="#aaa"
                    strokeWidth="5"
                    fill="none"
                  />
                </svg>
              </div>
              <p className="emptyMessage">
                No Sessions available for {selectedCategory}!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveSession;

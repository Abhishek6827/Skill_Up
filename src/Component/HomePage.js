import React, { useState, useEffect, useContext } from "react";
import { Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import "./Homepage.css";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import Navbar from "./Navbar/Navbar";
import BottomNavbar from "./Navbar/BottomNavbar/BottomNavbar";
import { singleBlog } from "../App";
import { Fade } from "react-awesome-reveal";
import { getCategoryImage, ImageWithFallback } from "../utils/imageUtils";

// Safe date conversion utility
const safeToDate = (dateValue) => {
  if (!dateValue) return new Date();
  if (dateValue instanceof Date) return dateValue;
  if (dateValue && typeof dateValue.toDate === "function") {
    try {
      return dateValue.toDate();
    } catch (error) {
      console.error("Error converting Firestore timestamp:", error);
      return new Date();
    }
  }
  if (typeof dateValue === "string" || typeof dateValue === "number") {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }
  return new Date();
};

// Get category-specific video links
const getCategoryVideoLinks = (category, index = 0) => {
  const videoLinks = {
    Cooking: [
      "https://www.youtube.com/watch?v=1AxLzMJIgxM",
      "https://www.youtube.com/watch?v=VhcQs_QoEhQ",
      "https://www.youtube.com/watch?v=KLGSLCaksdY",
    ],
    "Computer science": [
      "https://www.youtube.com/watch?v=8hly31xKli0",
      "https://www.youtube.com/watch?v=rfscVS0vtbw",
      "https://www.youtube.com/watch?v=Ukg_U3CnJWI",
    ],
    Music: [
      "https://www.youtube.com/watch?v=rgaTLrZGlk0",
      "https://www.youtube.com/watch?v=5_yOVARO2Oc",
      "https://www.youtube.com/watch?v=F3A5ww0v3Rk",
    ],
    Dance: [
      "https://www.youtube.com/watch?v=AOgBg2up7Jg",
      "https://www.youtube.com/watch?v=oe_HDfdmnaM",
      "https://www.youtube.com/watch?v=VPRjCeoBqrI",
    ],
    Photography: [
      "https://www.youtube.com/watch?v=V7z7BAZdt2M",
      "https://www.youtube.com/watch?v=LxO-6rlihSg",
      "https://www.youtube.com/watch?v=3T8lTfFN6vw",
    ],
    "Art & Craft": [
      "https://www.youtube.com/watch?v=OFKUnfwBPTU",
      "https://www.youtube.com/watch?v=ZXsQAXx_ao0",
      "https://www.youtube.com/watch?v=1Yk2fQ0RkbE",
    ],
  };

  const categoryLinks = videoLinks[category] || videoLinks["Art & Craft"];
  return categoryLinks[index % categoryLinks.length];
};

const HomePage = () => {
  const { setSingleBlogDetail } = useContext(singleBlog);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [article, setArticle] = useState([]);
  const [mainBlog, setMainBlog] = useState({});
  const [mainVideo, setMainVideo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getArticles(),
          getVideos(),
          getMainBlog(),
          getMainVideo(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load data. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      setVideos([]);
      setArticle([]);
      setMainBlog({});
      setMainVideo({});
    };
  }, []);

  const getArticles = async () => {
    try {
      const getData = [];
      const Snapshot = await getDocs(collection(db, "data"));

      if (Snapshot.empty) {
        // Create sample blog data if none exists
        const sampleCategories = ["Cooking", "Computer science", "Music"];
        sampleCategories.forEach((category, catIndex) => {
          getData.push({
            id: `sample_blog_${catIndex}`,
            Title: `${category} Fundamentals`,
            article: `Learn the basics of ${category.toLowerCase()} with this comprehensive guide. Perfect for beginners looking to start their journey.`,
            image: getCategoryImage(category, catIndex),
            Category: category,
            Date: new Date(),
          });
        });
      } else {
        Snapshot.forEach((doc) => {
          const data = doc.data();
          getData.push({
            id: doc.id,
            ...data,
            image:
              data.image || getCategoryImage(data.Category || "Art & Craft", 0),
          });
        });
      }

      setArticle(getData);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to load articles. Please try again later.");
    }
  };

  const getVideos = async () => {
    try {
      const getVideo = [];
      const Snapshot = await getDocs(collection(db, "video"));

      if (Snapshot.empty) {
        // Create sample video data if none exists
        const sampleCategories = ["Music", "Dance", "Photography"];
        sampleCategories.forEach((category, catIndex) => {
          getVideo.push({
            id: `sample_video_${catIndex}`,
            title: `${category} Masterclass`,
            info: `Professional ${category.toLowerCase()} training with expert instructors. Learn techniques used by professionals.`,
            piclink: getCategoryImage(category, catIndex),
            link: getCategoryVideoLinks(category, catIndex),
            Category: category,
          });
        });
      } else {
        Snapshot.forEach((doc) => {
          const data = doc.data();
          getVideo.push({
            id: doc.id,
            ...data,
            piclink:
              data.piclink ||
              getCategoryImage(data.Category || "Art & Craft", 0),
            link:
              data.link ||
              getCategoryVideoLinks(data.Category || "Art & Craft", 0),
          });
        });
      }

      setVideos(getVideo);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos. Please try again later.");
    }
  };

  const getMainBlog = async () => {
    try {
      const Snapshot = await getDoc(doc(db, "Blogs", "2"));

      if (Snapshot.exists()) {
        const data = Snapshot.data();
        setMainBlog({
          ...data,
          pic: data.pic || getCategoryImage("Cooking", 0),
        });
      } else {
        setMainBlog({
          title: "Welcome to SkillUp Learning Platform",
          text: "Discover a world of knowledge with our comprehensive courses and tutorials. From cooking to coding, dance to design - we have something for everyone. Join thousands of learners who are already transforming their skills and advancing their careers.",
          pic: getCategoryImage("Cooking", 0),
          date: new Date(),
        });
      }
    } catch (error) {
      console.error("Error fetching main blog:", error);
      setMainBlog({
        title: "Welcome to SkillUp Learning Platform",
        text: "Your learning journey starts here with expert-led courses.",
        pic: getCategoryImage("Cooking", 0),
        date: new Date(),
      });
    }
  };

  const getMainVideo = async () => {
    try {
      const Snapshot = await getDoc(doc(db, "MainVideo", "1"));

      if (Snapshot.exists()) {
        const data = Snapshot.data();
        setMainVideo({
          ...data,
          piclink: data.piclink || getCategoryImage("Music", 0),
          link: data.link || getCategoryVideoLinks("Music", 0),
        });
      } else {
        setMainVideo({
          title: "Featured Course: Music Theory Fundamentals",
          info: "Master the language of music with our comprehensive theory course. Learn scales, chords, harmony, and composition techniques from professional musicians.",
          piclink: getCategoryImage("Music", 0),
          link: getCategoryVideoLinks("Music", 0),
        });
      }
    } catch (error) {
      console.error("Error fetching main video:", error);
      setMainVideo({
        title: "Featured Course: Music Theory Fundamentals",
        info: "Learn music theory from the ground up.",
        piclink: getCategoryImage("Music", 0),
        link: getCategoryVideoLinks("Music", 0),
      });
    }
  };

  const ArticleHandler = (Title, data, Image, Date) => {
    try {
      const convertedDate = safeToDate(Date);

      setSingleBlogDetail({
        title: Title || "Untitled",
        text: data || "No content available",
        image: Image || getCategoryImage("Art & Craft", 0),
        time: convertedDate.toLocaleTimeString("en-US"),
        date: convertedDate.toDateString(),
      });

      navigate("/singleBlog");
    } catch (error) {
      console.error("Error in ArticleHandler:", error);
      setSingleBlogDetail({
        title: Title || "Untitled",
        text: data || "No content available",
        image: getCategoryImage("Art & Craft", 0),
        time: new Date().toLocaleTimeString("en-US"),
        date: new Date().toDateString(),
      });
      navigate("/singleBlog");
    }
  };

  const handleVideoClick = (video) => {
    console.log(`Opening video: ${video.title}`);
    console.log(`Link: ${video.link}`);
    window.open(video.link, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "20px" }}>
            Loading...
          </div>
          <div>Fetching content from Firebase...</div>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {error && (
        <Alert severity="error" sx={{ mt: 8, mb: 2, mx: 2 }}>
          {error}
        </Alert>
      )}

      {/* BLOGS SECTION */}
      <Typography
        variant="h2"
        display={"flex"}
        flexDirection={"column"}
        marginX={"1rem"}
        marginTop={"6rem"}
        marginBottom={"1rem"}
        color={" rgb(224, 165, 82)"}
        fontWeight={"600"}
        style={{
          textShadow: "2px 2px 2px rgba(0, 0, 0, 0.85) ",
        }}
      >
        Blogs
      </Typography>

      <div className="homeBlogContainer">
        <Fade bottom>
          <div className="mainBlogWrapper">
            <div className="mainBlogImage">
              <ImageWithFallback
                src={mainBlog.pic}
                alt="BlogImage"
                className="blogImage"
                fallbackSrc={getCategoryImage("Cooking", 0)}
              />
            </div>
            <div className="mainBlogTextSection">
              <p className="mainBlogTitle">{mainBlog.title}</p>
              <div className="mainBlogText">
                <p style={{ lineHeight: "1.5rem" }}>{mainBlog.text}</p>
              </div>
              <button
                className="mainBlogButton"
                onClick={() =>
                  ArticleHandler(
                    mainBlog.title,
                    mainBlog.text,
                    mainBlog.pic,
                    mainBlog.date
                  )
                }
              >
                READ MORE
              </button>
            </div>
          </div>

          <div className="blogGrid">
            {article.length > 0 ? (
              article.map((item, index) => (
                <div key={item.id || index} className="blogContainer">
                  <div className="blogWrapper">
                    <div className="blogImageWrapper">
                      <ImageWithFallback
                        className="blogImg"
                        src={item.image}
                        alt="article"
                        fallbackSrc={getCategoryImage(
                          item.Category || "Art & Craft",
                          index
                        )}
                      />
                    </div>
                    <div className="blogTextWrapper">
                      <p className="blogTitle">
                        {item.Title || "Untitled"}
                        {item.Date &&
                          ` - ${safeToDate(item.Date).toLocaleDateString()}`}
                      </p>
                      <p className="blogText">
                        {item.article || "No content available"}
                      </p>
                    </div>
                    <button
                      className="BlogButton"
                      onClick={() =>
                        ArticleHandler(
                          item.Title,
                          item.article,
                          item.image,
                          item.Date
                        )
                      }
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{ textAlign: "center", padding: "40px", color: "#666" }}
              >
                <p>No articles available yet.</p>
                <p style={{ fontSize: "14px" }}>
                  Add some content to your Firebase 'data' collection.
                </p>
              </div>
            )}
          </div>
        </Fade>
      </div>

      {/* VIDEO SECTION */}
      <Typography
        variant="h2"
        display={"flex"}
        flexDirection={"column"}
        marginX={"1rem"}
        marginTop={"6rem"}
        marginBottom={"1rem"}
        color={"rgb(209 209 138)"}
        fontWeight="bold"
        style={{
          textShadow: "2px 2px 2px rgba(0, 0, 0, 0.85) ",
        }}
      >
        Video Courses
      </Typography>

      <div className="homeBlogContainer">
        <Fade bottom>
          <div className="mainBlogWrapper">
            <div className="mainBlogImage">
              <ImageWithFallback
                src={mainVideo.piclink}
                alt="VideoImage"
                className="blogImage"
                fallbackSrc={getCategoryImage("Music", 0)}
              />
            </div>
            <div className="mainVideoTextSection">
              <p className="mainBlogTitle">{mainVideo.title}</p>
              <div className="mainBlogText">
                <p style={{ lineHeight: "1.5rem" }}>{mainVideo.info}</p>
              </div>
              <button
                className="mainBlogButton"
                onClick={() => handleVideoClick(mainVideo)}
              >
                WATCH
              </button>
            </div>
          </div>

          <div className="blogGrid">
            {videos.length > 0 ? (
              videos.map((item, index) => (
                <div key={item.id || index} className="blogContainer">
                  <div className="blogWrapper">
                    <div className="blogImageWrapper">
                      <ImageWithFallback
                        className="blogImg"
                        src={item.piclink}
                        alt="video"
                        fallbackSrc={getCategoryImage(
                          item.Category || "Art & Craft",
                          index
                        )}
                      />
                    </div>
                    <div className="blogTextWrapper">
                      <p className="blogTitle">
                        {item.title || "Untitled"}
                        {item.date &&
                          ` - ${safeToDate(item.date).toLocaleDateString()}`}
                      </p>
                      <p className="blogText">
                        {item.info || "No description available"}
                      </p>
                    </div>
                    <button
                      className="VideoButton"
                      onClick={() => handleVideoClick(item)}
                    >
                      Watch
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{ textAlign: "center", padding: "40px", color: "#666" }}
              >
                <p>No videos available yet.</p>
                <p style={{ fontSize: "14px" }}>
                  Add some content to your Firebase 'video' collection.
                </p>
              </div>
            )}
          </div>
        </Fade>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default HomePage;

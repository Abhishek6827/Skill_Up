import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { db } from "../../firebase";
import "../Homepage.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import Navbar from "../Navbar/Navbar";
import { FcSearch } from "react-icons/fc";
import { Fade } from "react-awesome-reveal";
import Empty from "../SVG/emptyBlog.svg";
import "./Videos.css";

// Real YouTube video links for each category
const getCategoryVideoLinks = (category, index = 0) => {
  const videoLinks = {
    Cooking: [
      "https://www.youtube.com/watch?v=1AxLzMJIgxM", // Gordon Ramsay cooking basics
      "https://www.youtube.com/watch?v=VhcQs_QoEhQ", // Jamie Oliver cooking tips
      "https://www.youtube.com/watch?v=KLGSLCaksdY", // Tasty cooking compilation
    ],
    "Computer science": [
      "https://www.youtube.com/watch?v=8hly31xKli0", // Learn Programming
      "https://www.youtube.com/watch?v=rfscVS0vtbw", // Python Tutorial
      "https://www.youtube.com/watch?v=Ukg_U3CnJWI", // JavaScript Basics
    ],
    Music: [
      "https://www.youtube.com/watch?v=rgaTLrZGlk0", // Music Theory
      "https://www.youtube.com/watch?v=5_yOVARO2Oc", // Piano Lessons
      "https://www.youtube.com/watch?v=2Vv-BfVoq4g", // Guitar Tutorial (Fixed link)
    ],
    Dance: [
      "https://www.youtube.com/watch?v=AOgBg2up7Jg", // Hip Hop Dance
      "https://www.youtube.com/watch?v=oe_HDfdmnaM", // Ballet Basics
      "https://www.youtube.com/watch?v=VPRjCeoBqrI", // Contemporary Dance
    ],
    Photography: [
      "https://www.youtube.com/watch?v=V7z7BAZdt2M", // Photography Basics
      "https://www.youtube.com/watch?v=LxO-6rlihSg", // Portrait Photography
      "https://www.youtube.com/watch?v=Zhe9wP5ZJdE", // Landscape Photography (Fixed link)
    ],
    "Art & Craft": [
      "https://www.youtube.com/watch?v=OFKUnfwBPTU", // Drawing Basics
      "https://www.youtube.com/watch?v=ZXsQAXx_ao0", // Watercolor Painting
      "https://www.youtube.com/watch?v=1Yk2fQ0RkbE", // DIY Crafts
    ],
  };

  const categoryLinks = videoLinks[category] || videoLinks["Art & Craft"];
  return categoryLinks[index % categoryLinks.length];
};

// Category-specific image URLs that actually work
const getCategoryImage = (category, index = 0) => {
  const imageUrls = {
    Cooking: [
      "https://cdn.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/12/26/17/28/spaghetti-1932466_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
    ],
    "Computer science": [
      "https://cdn.pixabay.com/photo/2016/11/30/20/58/programming-1873854_1280.png",
      "https://cdn.pixabay.com/photo/2015/05/31/15/14/woman-792162_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg",
    ],
    Music: [
      "https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_1280.jpg",
      "https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_1280.jpg",
    ],
    Dance: [
      "https://cdn.pixabay.com/photo/2016/10/21/23/09/dancer-1758887_1280.jpg", // Hip Hop Dance image
      "https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg",
    ],
    Photography: [
      "https://cdn.pixabay.com/photo/2016/01/09/18/27/camera-1130731_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/02/12/10/29/christmas-2059698_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/02/27/23/48/landscape-3186170_1280.jpg", // Landscape Photography image
    ],
    "Art & Craft": [
      "https://cdn.pixabay.com/photo/2017/05/25/15/08/art-2343414_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/03/30/15/11/art-3275154_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/09/03/21/45/watercolor-2713287_1280.jpg",
    ],
  };

  const categoryImages = imageUrls[category] || imageUrls["Art & Craft"];
  return categoryImages[index % categoryImages.length];
};

// Enhanced video data with better content and real links
const enhanceVideoData = (videoData) => {
  // Create a counter for each category to ensure unique links
  const categoryCounters = {};

  return videoData.map((video) => {
    const category = video.Category || "Art & Craft";

    // Initialize counter for this category if it doesn't exist
    if (!categoryCounters[category]) {
      categoryCounters[category] = 0;
    }

    // Get unique video link and image for this specific video
    const currentIndex = categoryCounters[category];
    const videoLink = getCategoryVideoLinks(category, currentIndex);
    const imageUrl = getCategoryImage(category, currentIndex);

    // Increment counter for next video in this category
    categoryCounters[category] = (currentIndex + 1) % 3; // 3 videos per category

    const enhancedTitles = {
      Cooking: [
        "Master Chef Cooking Techniques",
        "Professional Kitchen Skills",
        "International Cuisine Mastery",
      ],
      "Computer science": [
        "Programming Fundamentals",
        "Web Development Bootcamp",
        "Data Science with Python",
      ],
      Music: [
        "Music Theory Complete Course",
        "Piano Mastery Program",
        "Guitar Techniques Advanced",
      ],
      Dance: [
        "Hip Hop Dance Fundamentals",
        "Classical Ballet Training",
        "Contemporary Dance Expression",
      ],
      Photography: [
        "Digital Photography Mastery",
        "Portrait Photography Pro",
        "Landscape Photography Art",
      ],
      "Art & Craft": [
        "Drawing Fundamentals Course",
        "Watercolor Painting Techniques",
        "Digital Art Creation",
      ],
    };

    const enhancedDescriptions = {
      Cooking: [
        "Learn professional cooking techniques from world-renowned chefs. Master knife skills, flavor combinations, and presentation techniques that will transform your culinary abilities.",
        "Discover the secrets of professional kitchens. From mise en place to advanced cooking methods, this comprehensive course covers everything you need to cook like a pro.",
        "Explore cuisines from around the world. Learn authentic recipes, traditional techniques, and cultural cooking methods from expert international chefs.",
      ],
      "Computer science": [
        "Build a solid foundation in programming with hands-on projects and real-world applications. Perfect for beginners and those looking to strengthen their coding skills.",
        "Become a full-stack web developer with this comprehensive bootcamp. Learn HTML, CSS, JavaScript, and modern frameworks to build professional websites.",
        "Dive into the world of data science using Python. Learn data analysis, visualization, machine learning, and statistical modeling techniques.",
      ],
      Music: [
        "Understand the language of music with comprehensive theory training. Learn scales, chords, harmony, and composition techniques used by professional musicians.",
        "Master the piano with structured lessons from beginner to advanced levels. Learn classical techniques, popular songs, and improvisation skills.",
        "Develop advanced guitar techniques including fingerpicking, lead guitar, rhythm patterns, and music theory application for guitarists.",
      ],
      Dance: [
        "Master the fundamentals of hip hop dance with authentic street dance techniques. Learn popping, locking, breaking, and contemporary hip hop styles.",
        "Experience the elegance of classical ballet with proper technique training. Learn positions, movements, and the discipline of this timeless art form.",
        "Express yourself through contemporary dance that blends multiple styles. Explore emotional storytelling through movement and creative choreography.",
      ],
      Photography: [
        "Master digital photography from basics to advanced techniques. Learn composition, lighting, camera settings, and post-processing for stunning images.",
        "Specialize in portrait photography with professional lighting and posing techniques. Capture the personality and emotion of your subjects.",
        "Capture breathtaking landscapes with advanced outdoor photography techniques. Learn about natural lighting, composition, and location scouting.",
      ],
      "Art & Craft": [
        "Build strong drawing fundamentals with structured exercises and techniques. Learn perspective, shading, proportion, and various drawing mediums.",
        "Explore the beautiful world of watercolor painting. Learn color mixing, wet-on-wet techniques, and how to create stunning watercolor artworks.",
        "Enter the digital art world with professional software and techniques. Learn digital painting, illustration, and graphic design principles.",
      ],
    };

    const categoryTitles =
      enhancedTitles[category] || enhancedTitles["Art & Craft"];
    const categoryDescriptions =
      enhancedDescriptions[category] || enhancedDescriptions["Art & Craft"];

    // Use the counter index to get the right title and description
    const titleIndex = currentIndex % categoryTitles.length;
    const descIndex = currentIndex % categoryDescriptions.length;

    return {
      ...video,
      id: video.id || `video_${category}_${currentIndex}`,
      title: video.title || categoryTitles[titleIndex],
      info: video.info || categoryDescriptions[descIndex],
      piclink: imageUrl, // Always use our enhanced image URL
      link: videoLink, // Always use our enhanced video link
      Category: category,
      duration:
        video.duration || `${Math.floor(Math.random() * 45) + 15} minutes`,
      instructor: video.instructor || `${category} Expert`,
      level:
        video.level ||
        ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)],
      rating: video.rating || (4.0 + Math.random()).toFixed(1),
      views: video.views || `${Math.floor(Math.random() * 900) + 100}K views`,
    };
  });
};

const Videos = () => {
  const [article, setArticle] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const SearchedKey = useRef();

  const Category = useMemo(
    () => [
      "All",
      "Cooking",
      "Computer science",
      "Music",
      "Dance",
      "Photography",
      "Art & Craft",
    ],
    []
  );

  const getArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const getData = [];

      console.log("Fetching videos from Firebase...");
      const Snapshot = await getDocs(collection(db, "video"));

      console.log("Firebase response:", Snapshot.size, "video documents found");

      if (Snapshot.size === 0) {
        // If no data in Firebase, create sample data for each category
        console.log("No videos in Firebase, creating sample data...");
        Category.slice(1).forEach((cat, catIndex) => {
          // Create 3 videos for each category (18 total)
          for (let i = 0; i < 3; i++) {
            getData.push({
              id: `sample_${cat}_${i}`,
              Category: cat,
              title: null, // Will be enhanced
              info: null, // Will be enhanced
              piclink: null, // Will be enhanced
              link: null, // Will be enhanced
            });
          }
        });
      } else {
        Snapshot.forEach((doc) => {
          getData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      }

      // Enhance the video data with better content and real links
      const enhancedData = enhanceVideoData(getData);
      setArticle(enhancedData);
      console.log("Enhanced videos loaded:", enhancedData);
      setNoDataMessage(enhancedData.length === 0 ? "No videos available" : "");
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos. Please check your Firebase connection.");
      setNoDataMessage("Error loading videos");
    } finally {
      setLoading(false);
    }
  }, [Category]);

  useEffect(() => {
    getArticles();
    return () => {
      setArticle([]);
    };
  }, [getArticles]);

  const selectCategory = useCallback(
    async (category) => {
      try {
        setLoading(true);
        setError("");

        if (category === "All") {
          await getArticles();
          return;
        }

        console.log("Filtering videos by category:", category);
        const Data = [];
        const collectionRef = collection(db, "video");
        const blogs = await getDocs(
          query(collectionRef, where("Category", "==", category))
        );

        if (blogs.size === 0) {
          // If no data for this category, create sample data
          console.log(
            `No ${category} videos in Firebase, creating sample data...`
          );
          // Create 3 videos for this category
          for (let i = 0; i < 3; i++) {
            Data.push({
              id: `sample_${category}_${i}`,
              Category: category,
              title: null,
              info: null,
              piclink: null,
              link: null,
            });
          }
        } else {
          blogs.forEach((doc) => {
            if (doc.exists()) {
              Data.push({
                id: doc.id,
                ...doc.data(),
              });
            }
          });
        }

        // Enhance filtered data
        const enhancedData = enhanceVideoData(Data);
        console.log("Filtered video results:", enhancedData);
        setArticle(enhancedData);
        setNoDataMessage(
          enhancedData.length === 0
            ? `No videos found in ${category} category`
            : ""
        );
      } catch (error) {
        console.error("Error filtering videos by category:", error);
        setError("Failed to filter videos.");
        setNoDataMessage("Error filtering videos");
      } finally {
        setLoading(false);
      }
    },
    [getArticles]
  );

  function SearchVideo(e) {
    const inputValue = e.target.value || "";
    setSearchKeyword(inputValue);

    if (!SearchedKey.current) {
      return;
    }

    if (inputValue.length === 0) {
      getArticles();
      return;
    }

    const searchTerm = inputValue.toLowerCase();
    const searchedVideo = article.filter((video) => {
      const info = video.info || "";
      const title = video.title || "";
      const instructor = video.instructor || "";
      const category = video.Category || "";

      return (
        info.toLowerCase().includes(searchTerm) ||
        title.toLowerCase().includes(searchTerm) ||
        instructor.toLowerCase().includes(searchTerm) ||
        category.toLowerCase().includes(searchTerm)
      );
    });

    console.log("Search results:", searchedVideo);
    setArticle(searchedVideo);
    setNoDataMessage(
      searchedVideo.length === 0 ? `No videos found for "${searchTerm}"` : ""
    );
  }

  const handleWatchClick = (video) => {
    console.log(`Opening video: ${video.title}`);
    console.log(`Category: ${video.Category}`);
    console.log(`Link: ${video.link}`);

    // Open the video link
    window.open(video.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="videosPageContainer">
      <Navbar />
      <div className="videosContent">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search videos, instructors, topics..."
            value={searchKeyword || ""}
            onChange={SearchVideo}
            ref={SearchedKey}
          />
          <FcSearch className="searchIcon" onClick={SearchVideo} />
        </div>

        <div className="allBlogsContainer">
          <div className="category">
            <div className="categoryTitle">Skills Categories</div>
            <div className="categoryShower">
              <Fade bottom>
                {Category.map((item) => (
                  <div
                    key={item}
                    onClick={() => selectCategory(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <p className="Categories">{item}</p>
                  </div>
                ))}
              </Fade>
            </div>
          </div>

          <div className="allBlogs">
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
                <p>Loading videos...</p>
              </div>
            ) : article.length > 0 ? (
              <div className="videosGrid">
                {article.map((item, index) => (
                  <Fade key={item.id || index}>
                    <div className="allBlogWrapper">
                      <div className="allBlogImage">
                        <img
                          src={item.piclink}
                          alt={`${item.title} - ${item.Category} Tutorial`}
                          className="allblogImage"
                          onError={(e) => {
                            console.log(
                              `Image failed to load: ${e.target.src}`
                            );
                            // Set a fallback image if the main one fails
                            e.target.src =
                              "https://cdn.pixabay.com/photo/2017/05/13/09/04/question-2309040_1280.jpg";
                          }}
                        />
                        <div className="videoOverlay">
                          <div
                            className="playButton"
                            onClick={() => handleWatchClick(item)}
                          >
                            ▶
                          </div>
                          <div className="videoDuration">{item.duration}</div>
                        </div>
                      </div>
                      <div className="allVideoTextSection">
                        <h3 className="allBlogTitle">{item.title}</h3>
                        <div className="videoMeta">
                          <span className="videoInstructor">
                            👨‍🏫 {item.instructor}
                          </span>
                          <span className="videoLevel">📊 {item.level}</span>
                          <span className="videoRating">⭐ {item.rating}</span>
                          <span className="videoViews">👁️ {item.views}</span>
                        </div>
                        <div className="allBlogText">
                          <p>{item.info}</p>
                        </div>
                        <div className="videoActions">
                          <button
                            className="allBlogButton watchButton"
                            onClick={() => handleWatchClick(item)}
                          >
                            🎥 Watch Now
                          </button>
                          <span className="videoCategory">{item.Category}</span>
                        </div>
                      </div>
                    </div>
                  </Fade>
                ))}
              </div>
            ) : (
              <div className="emptySearch">
                <img
                  src={Empty || "/placeholder.svg"}
                  alt="Empty"
                  height={"200px"}
                  width="200px"
                />
                <p className="emptyMessage">
                  {noDataMessage || (
                    <>
                      No Video Lessons available for <b>"{searchKeyword}"</b>{" "}
                      keyword
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;

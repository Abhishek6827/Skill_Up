import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import "../Homepage.css";
import { singleBlog } from "../../App";
import { collection, getDocs, query, where } from "firebase/firestore";
import Navbar from "../Navbar/Navbar";
import { FcSearch } from "react-icons/fc";
import { Fade } from "react-awesome-reveal";
import Empty from "../SVG/emptyBlog.svg";
import "./Blog.css";

// Safe date conversion utility
const safeToDate = (dateValue) => {
  if (!dateValue) return new Date();

  if (dateValue instanceof Date) {
    return dateValue;
  }

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

// Get category-specific images with reliable Unsplash URLs
const getCategoryImage = (category, index = 0) => {
  const imageUrls = {
    Cooking: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=781&q=80",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=780&q=80",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80",
    ],
    "Computer science": [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    Music: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1509807995916-c332365e2d9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    Dance: [
      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=767&q=80",
      "https://images.unsplash.com/photo-1547153760-18fc86324498?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ],
    Photography: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1491147334573-44cbb4602074?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
    ],
    "Art & Craft": [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    ],
  };

  const categoryImages = imageUrls[category] || imageUrls["Art & Craft"];
  return categoryImages[index % categoryImages.length];
};

// Enhanced blog data with detailed content
const enhanceBlogData = (blogData) => {
  const detailedContent = {
    Cooking: {
      titles: [
        "10 Essential Cooking Techniques Every Chef Should Master",
        "The Art of Flavor Pairing: A Complete Guide",
        "From Novice to Expert: Your Culinary Journey",
        "Mastering International Cuisines at Home",
        "The Science Behind Perfect Cooking",
      ],
      content: [
        "Cooking is more than just following recipes—it's an art form that combines creativity, technique, and passion. In this comprehensive guide, we'll explore the fundamental cooking techniques that form the backbone of culinary excellence.",
        "Flavor pairing is both an art and a science that can elevate your cooking from good to extraordinary. Understanding how different flavors complement and enhance each other is the key to creating memorable dishes.",
        "Every great chef started as a beginner, and the journey from novice to expert is filled with learning, practice, and discovery. This comprehensive guide will help you navigate your culinary journey with confidence.",
      ],
    },
    "Computer science": {
      titles: [
        "Understanding Data Structures and Algorithms",
        "The Future of Artificial Intelligence and Machine Learning",
        "Web Development: From Frontend to Backend",
        "Cybersecurity in the Digital Age",
        "Mobile App Development Fundamentals",
      ],
      content: [
        "Computer science is a rapidly evolving field that combines mathematical rigor with creative problem-solving. In today's digital world, understanding core computer science concepts is more important than ever.",
        "Artificial Intelligence and Machine Learning are transforming industries and reshaping our world. Understanding these technologies is crucial for anyone working in technology today.",
      ],
    },
    Music: {
      titles: [
        "Music Theory Fundamentals for Beginners",
        "The Evolution of Musical Genres Through History",
        "Digital Music Production: Tools and Techniques",
        "The Psychology of Music and Its Impact on Emotions",
        "Performance Techniques for Musicians",
      ],
      content: [
        "Music is a universal language that transcends cultural boundaries and speaks directly to our emotions. Whether you're a complete beginner or looking to deepen your understanding, exploring music theory opens up new dimensions of musical appreciation.",
        "The evolution of musical genres tells the story of human culture, social change, and technological advancement. From ancient folk traditions to modern electronic music, each genre reflects the time and place of its creation.",
      ],
    },
    Dance: {
      titles: [
        "The Art of Movement: Dance Fundamentals",
        "Cultural Dance Traditions Around the World",
        "Contemporary Dance: Expression Through Motion",
        "The Health Benefits of Dance and Movement",
        "Choreography: Creating Dance Stories",
      ],
      content: [
        "Dance is one of humanity's oldest forms of artistic expression, combining physical movement with emotional storytelling. From ancient ritual dances to modern choreography, dance continues to evolve while maintaining its power to communicate across cultures.",
        "Dance traditions around the world reflect the rich diversity of human culture. Each culture has developed unique movement vocabularies that express their values, stories, and spiritual beliefs.",
      ],
    },
    Photography: {
      titles: [
        "Mastering Camera Settings: Aperture, Shutter Speed, and ISO",
        "Composition Techniques for Stunning Photographs",
        "Portrait Photography: Capturing the Human Spirit",
        "Digital Photography Post-Processing Essentials",
        "Street Photography: Documenting Life",
      ],
      content: [
        "Photography is the art of capturing light and freezing moments in time. Whether you're using a smartphone or a professional camera, understanding the principles of photography will dramatically improve your images.",
        "Composition is what separates snapshots from compelling photographs. Good composition guides the viewer's eye through the image and creates visual interest and emotional impact.",
      ],
    },
    "Art & Craft": {
      titles: [
        "Exploring Different Art Mediums and Techniques",
        "The History and Evolution of Visual Arts",
        "DIY Crafts: Creating Beauty from Everyday Materials",
        "Color Theory and Its Application in Art",
        "Digital Art: Traditional Skills in New Media",
      ],
      content: [
        "Art and craft represent humanity's innate desire to create beauty and express ideas through visual means. From cave paintings to digital art, the urge to create has driven innovation and cultural development throughout history.",
        "The history of visual arts reflects the evolution of human consciousness, technology, and cultural values. From prehistoric cave paintings to contemporary digital installations, art has always been a mirror of its time.",
      ],
    },
  };

  return blogData.map((blog, index) => {
    const category = blog.category || blog.Category || "Art & Craft";
    const categoryData =
      detailedContent[category] || detailedContent["Art & Craft"];
    const titleIndex = index % categoryData.titles.length;
    const contentIndex = index % categoryData.content.length;

    return {
      ...blog,
      id: blog.id || `blog_${category}_${index}`,
      title: blog.title || blog.Title || categoryData.titles[titleIndex],
      text: blog.text || categoryData.content[contentIndex],
      pic: blog.pic || getCategoryImage(category, index),
      category: category,
      author: blog.author || `${category} Expert`,
      readTime:
        blog.readTime || `${Math.floor(Math.random() * 10) + 5} min read`,
      tags: blog.tags || [category, "Tutorial", "Guide"],
      excerpt:
        blog.excerpt ||
        categoryData.content[contentIndex].substring(0, 200) + "...",
      date:
        blog.date ||
        new Date(
          Date.now() - Math.floor(Math.random() * 10000000000)
        ).toISOString(),
    };
  });
};

const Blogs = () => {
  const [article, setArticle] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const SearchedKey = useRef();
  const { setSingleBlogDetail } = useContext(singleBlog);
  const navigate = useNavigate();

  const Category = [
    "All",
    "Cooking",
    "Computer science",
    "Music",
    "Dance",
    "Photography",
    "Art & Craft",
  ];

  const ArticleHandler = (Title, data, Image, Date, author, readTime, tags) => {
    try {
      const convertedDate = safeToDate(Date);

      setSingleBlogDetail({
        title: Title || "Untitled",
        text: data || "No content available",
        image: Image || getCategoryImage("Art & Craft", 0),
        time: convertedDate.toLocaleTimeString("en-US"),
        date: convertedDate.toDateString(),
        author: author || "Anonymous",
        readTime: readTime || "5 min read",
        tags: tags || ["General"],
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
        author: "Anonymous",
        readTime: "5 min read",
        tags: ["General"],
      });
      navigate("/singleBlog");
    }
  };

  const getArticles = useCallback(async () => {
    try {
      setLoading(true);
      const getData = [];

      try {
        const Snapshot = await getDocs(collection(db, "AllBlogs"));
        if (Snapshot.size === 0) {
          // If no data in Firebase, create sample data for each category
          console.log("No blogs in Firebase, creating sample data...");
          Category.slice(1).forEach((cat, catIndex) => {
            for (let i = 0; i < 2; i++) {
              getData.push({
                id: `sample_${cat}_${i}`,
                category: cat,
                title: null,
                text: null,
                pic: null,
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
      } catch (firebaseError) {
        console.error("Firebase error:", firebaseError);
        // Create sample data if Firebase is not available
        Category.slice(1).forEach((cat, catIndex) => {
          for (let i = 0; i < 2; i++) {
            getData.push({
              id: `sample_${cat}_${i}`,
              category: cat,
              title: null,
              text: null,
              pic: null,
            });
          }
        });
      }

      // Enhance the blog data with detailed content
      const enhancedData = enhanceBlogData(getData);
      setArticle(enhancedData);
      setNoDataMessage(enhancedData.length === 0 ? "No blogs available" : "");
    } catch (error) {
      console.error("Error fetching articles:", error);
      setNoDataMessage("Error loading blogs");
    } finally {
      setLoading(false);
    }
  }, [Category]);

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  function SearchBlogs(e) {
    const inputValue = e.target.value || "";
    setSearchKeyword(inputValue);

    if (inputValue.length === 0) {
      getArticles();
      return;
    }

    const searchTerm = inputValue.toLowerCase();
    const searchedBlog = article.filter((blog) => {
      const title = blog.title || blog.Title || "";
      const text = blog.text || "";
      const author = blog.author || "";
      const tags = (blog.tags || []).join(" ");
      const category = blog.category || "";

      return (
        text.toLowerCase().includes(searchTerm) ||
        title.toLowerCase().includes(searchTerm) ||
        author.toLowerCase().includes(searchTerm) ||
        tags.toLowerCase().includes(searchTerm) ||
        category.toLowerCase().includes(searchTerm)
      );
    });

    setArticle(searchedBlog);
    setNoDataMessage(
      searchedBlog.length === 0 ? `No blogs found for "${searchTerm}"` : ""
    );
  }

  const selectCategory = useCallback(
    async (category) => {
      try {
        setLoading(true);

        if (category === "All") {
          await getArticles();
          return;
        }

        const Data = [];

        try {
          const collectionRef = collection(db, "AllBlogs");
          const blogs = await getDocs(
            query(collectionRef, where("category", "==", category))
          );

          if (blogs.size === 0) {
            // If no data for this category, create sample data
            console.log(
              `No ${category} blogs in Firebase, creating sample data...`
            );
            for (let i = 0; i < 2; i++) {
              Data.push({
                id: `sample_${category}_${i}`,
                category: category,
                title: null,
                text: null,
                pic: null,
              });
            }
          } else {
            blogs.forEach((doc) => {
              Data.push({
                id: doc.id,
                ...doc.data(),
              });
            });
          }
        } catch (firebaseError) {
          console.error("Firebase error:", firebaseError);
          // Create sample data if Firebase is not available
          for (let i = 0; i < 2; i++) {
            Data.push({
              id: `sample_${category}_${i}`,
              category: category,
              title: null,
              text: null,
              pic: null,
            });
          }
        }

        // Enhance filtered data
        const enhancedData = enhanceBlogData(Data);
        setArticle(enhancedData);
        setNoDataMessage(
          enhancedData.length === 0
            ? `No blogs found in ${category} category`
            : ""
        );
      } catch (error) {
        console.error("Error filtering by category:", error);
        setNoDataMessage("Error loading category");
      } finally {
        setLoading(false);
      }
    },
    [getArticles]
  );

  return (
    <div className="blogsPageContainer">
      <Navbar />
      <div className="blogsContent">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search articles, authors, topics..."
            value={searchKeyword || ""}
            onChange={SearchBlogs}
            ref={SearchedKey}
          />
          <FcSearch className="searchIcon" onClick={SearchBlogs} />
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
            {loading ? (
              <div className="emptySearch">
                <p>Loading blogs...</p>
              </div>
            ) : article.length > 0 ? (
              <div className="blogsGrid">
                {article.map((item, index) => (
                  <Fade key={item.id || index} triggerOnce>
                    <div className="allBlogWrapper">
                      <div className="allBlogImage">
                        <img
                          src={
                            item.pic || getCategoryImage(item.category, index)
                          }
                          alt={`${item.title} - ${item.category} Article`}
                          className="allblogImage"
                          onError={(e) => {
                            // Fallback to a different image if the first one fails
                            e.target.src = getCategoryImage(
                              item.category,
                              (index + 1) % 5
                            );
                          }}
                        />
                        <div className="blogOverlay">
                          <div className="readTime">📖 {item.readTime}</div>
                        </div>
                      </div>
                      <div className="allBlogTextSection">
                        <h3 className="allBlogTitle">{item.title}</h3>
                        <div className="blogMeta">
                          <span className="blogAuthor">✍️ {item.author}</span>
                          <span className="blogDate">
                            📅 {safeToDate(item.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="allBlogText">
                          <p>{item.excerpt}</p>
                        </div>
                        <div className="blogTags">
                          {(item.tags || [])
                            .slice(0, 3)
                            .map((tag, tagIndex) => (
                              <span key={tagIndex} className="blogTag">
                                #{tag}
                              </span>
                            ))}
                        </div>
                        <button
                          className="allBlogButton"
                          onClick={() =>
                            ArticleHandler(
                              item.title,
                              item.text,
                              item.pic,
                              item.date,
                              item.author,
                              item.readTime,
                              item.tags
                            )
                          }
                        >
                          📚 READ MORE
                        </button>
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
                      No Blogs available for <b>"{searchKeyword}" </b>keyword
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

export default Blogs;

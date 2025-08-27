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

// Get category-specific images that actually work
const getCategoryImage = (category, index = 0) => {
  const imageUrls = {
    Cooking: [
      "https://cdn.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/12/26/17/28/spaghetti-1932466_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/06/23/31/breakfast-1804457_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/05/07/08/56/pancakes-2291908_1280.jpg",
    ],
    "Computer science": [
      "https://cdn.pixabay.com/photo/2016/11/30/20/58/programming-1873854_1280.png",
      "https://cdn.pixabay.com/photo/2015/05/31/15/14/woman-792162_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/05/10/19/29/robot-2301646_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/05/18/15/30/web-design-3411373_1280.jpg",
    ],
    Music: [
      "https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_1280.jpg",
      "https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/01/15/22/25/singer-3084876_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_1280.jpg",
    ],
    Dance: [
      "https://cdn.pixabay.com/photo/2016/10/21/23/09/dancer-1758887_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/08/06/15/13/woman-2593366_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/14/04/36/boy-1822565_1280.jpg",
    ],
    Photography: [
      "https://cdn.pixabay.com/photo/2016/01/09/18/27/camera-1130731_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/02/12/10/29/christmas-2059698_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/01/20/13/05/man-1151304_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/07/10/23/43/photographer-2492834_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/02/01/12/33/dslr-1174531_1280.jpg",
    ],
    "Art & Craft": [
      "https://cdn.pixabay.com/photo/2017/05/25/15/08/art-2343414_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/03/30/15/11/art-3275154_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/09/03/21/45/watercolor-2713287_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/03/26/22/13/art-1281516_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979445_1280.jpg",
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
        "Cooking is more than just following recipes—it's an art form that combines creativity, technique, and passion. In this comprehensive guide, we'll explore the fundamental cooking techniques that form the backbone of culinary excellence.\n\nFirst, let's discuss the importance of mise en place, the French culinary phrase that means 'everything in its place.' This principle involves preparing and organizing all ingredients before you start cooking. Professional chefs swear by this method because it ensures smooth execution and prevents mistakes.\n\nNext, we'll delve into the five mother sauces of French cuisine: Béchamel, Velouté, Espagnole, Hollandaise, and Tomato sauce. These sauces serve as the foundation for hundreds of derivative sauces and are essential knowledge for any serious cook.\n\nThe art of seasoning is another crucial skill. Understanding when and how to use salt, acid, fat, and heat can transform a simple dish into something extraordinary. Salt enhances flavors, acid brightens dishes, fat carries flavors and provides richness, while proper heat application ensures perfect texture and doneness.\n\nFinally, we'll explore knife skills, which are fundamental to efficient and safe cooking. Proper knife techniques not only speed up preparation but also ensure uniform cooking and professional presentation.",

        "Flavor pairing is both an art and a science that can elevate your cooking from good to extraordinary. Understanding how different flavors complement and enhance each other is the key to creating memorable dishes that delight the palate.\n\nThe foundation of flavor pairing lies in understanding the five basic tastes: sweet, sour, salty, bitter, and umami. Each taste plays a specific role in creating balanced dishes. Sweet flavors can counteract bitterness and heat, while sour elements brighten heavy dishes and cut through richness.\n\nClassic flavor combinations have stood the test of time for good reason. Think of tomatoes and basil, chocolate and vanilla, or lemon and herbs. These pairings work because they share complementary flavor compounds or create pleasing contrasts.\n\nModern gastronomy has introduced us to more adventurous combinations based on scientific analysis of flavor compounds. Ingredients that share similar molecular structures often pair well together, leading to surprising combinations like chocolate and blue cheese, or strawberries and black pepper.\n\nCultural cuisine traditions offer another rich source of flavor pairing wisdom. Indian cuisine's use of spices, French cuisine's herb combinations, and Asian cuisine's balance of sweet, sour, and spicy elements all provide valuable lessons in creating harmonious flavors.",

        "Every great chef started as a beginner, and the journey from novice to expert is filled with learning, practice, and discovery. This comprehensive guide will help you navigate your culinary journey with confidence and purpose.\n\nThe foundation of cooking excellence begins with understanding your ingredients. Learn to select the best produce, understand different cuts of meat, and familiarize yourself with pantry staples. Quality ingredients are the building blocks of great dishes.\n\nMaster the basics before attempting complex techniques. Perfect your knife skills, learn to properly season food, understand cooking temperatures, and practice fundamental cooking methods like sautéing, roasting, and braising.\n\nDevelop your palate through conscious tasting. Try new ingredients, cuisines, and flavor combinations. Keep a food journal to record your experiences and preferences. This practice will help you understand what makes food taste good and how to recreate those flavors.\n\nPractice consistently and don't be afraid to make mistakes. Every burnt dish and failed recipe is a learning opportunity. Professional chefs have made countless mistakes on their path to mastery.\n\nSeek knowledge from multiple sources: cookbooks, cooking shows, online tutorials, and most importantly, other cooks. Join cooking communities, take classes, and never stop learning.",
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
        "Computer science is a rapidly evolving field that combines mathematical rigor with creative problem-solving. In today's digital world, understanding core computer science concepts is more important than ever.\n\nData structures and algorithms form the foundation of efficient programming. Arrays, linked lists, stacks, queues, trees, and graphs each serve specific purposes in organizing and manipulating data. Understanding when to use each structure can dramatically improve your program's performance.\n\nAlgorithmic thinking involves breaking down complex problems into smaller, manageable pieces. This approach, known as divide and conquer, is fundamental to computer science and applicable to many real-world scenarios.\n\nTime and space complexity analysis helps developers write efficient code. Big O notation provides a standardized way to describe algorithm performance, enabling developers to make informed decisions about which algorithms to use.\n\nPractical application of these concepts is crucial. Work on coding challenges, contribute to open-source projects, and build personal projects to reinforce your understanding of data structures and algorithms.",

        "Artificial Intelligence and Machine Learning are transforming industries and reshaping our world. Understanding these technologies is crucial for anyone working in technology today.\n\nMachine learning algorithms can now recognize patterns in data, make predictions, and even create original content. The field encompasses supervised learning, unsupervised learning, and reinforcement learning, each with specific applications and use cases.\n\nDeep learning, a subset of machine learning inspired by neural networks in the human brain, has achieved remarkable breakthroughs in image recognition, natural language processing, and game playing.\n\nThe ethical implications of AI development cannot be ignored. Issues of bias, privacy, job displacement, and algorithmic transparency require careful consideration as these technologies become more prevalent.\n\nPractical AI applications are already everywhere: recommendation systems, voice assistants, autonomous vehicles, medical diagnosis, and financial trading. Understanding how these systems work helps us better navigate our increasingly AI-driven world.",
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
        "Music is a universal language that transcends cultural boundaries and speaks directly to our emotions. Whether you're a complete beginner or looking to deepen your understanding, exploring music theory opens up new dimensions of musical appreciation and creativity.\n\nThe foundation of music theory begins with understanding pitch, rhythm, and harmony. Pitch refers to how high or low a sound is, determined by the frequency of sound waves. The musical alphabet consists of seven letters (A, B, C, D, E, F, G) that repeat across different octaves.\n\nRhythm is the temporal aspect of music—the pattern of beats and rests that give music its pulse. Understanding time signatures, note values, and rhythmic patterns is essential for both performers and composers.\n\nHarmony involves the combination of different pitches played simultaneously. Chords are built from intervals—the distance between two notes. Major and minor triads form the basis of most Western music.\n\nScales provide the melodic foundation for music. The major scale, with its pattern of whole and half steps, serves as the basis for understanding key signatures and chord progressions.",

        "The evolution of musical genres tells the story of human culture, social change, and technological advancement. From ancient folk traditions to modern electronic music, each genre reflects the time and place of its creation.\n\nClassical music, with its complex structures and formal rules, laid the groundwork for Western musical tradition. The Baroque, Classical, and Romantic periods each brought distinct characteristics and innovations.\n\nThe 20th century saw an explosion of new genres: jazz emerged from African American communities, bringing improvisation and swing to the forefront. Rock and roll revolutionized popular music, while electronic music opened entirely new sonic possibilities.\n\nWorld music traditions offer rich alternatives to Western musical concepts. Indian classical music, African polyrhythms, and Middle Eastern modal systems provide different approaches to melody, rhythm, and harmony.\n\nModern genres continue to evolve, blending traditional elements with new technologies and global influences. Hip-hop, electronic dance music, and indie genres represent the ongoing evolution of musical expression.",
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
        "Dance is one of humanity's oldest forms of artistic expression, combining physical movement with emotional storytelling. From ancient ritual dances to modern choreography, dance continues to evolve while maintaining its power to communicate across cultures.\n\nFundamental dance techniques begin with understanding your body as an instrument. Proper posture, alignment, and breathing form the foundation of all dance styles. Core strength and flexibility are essential for executing movements with grace and preventing injury.\n\nRhythm and musicality are crucial elements that distinguish good dancers from great ones. Learning to feel the music in your body, understanding different time signatures, and developing the ability to interpret musical phrasing will elevate your dancing.\n\nDifferent dance styles emphasize various aspects of movement. Ballet focuses on precision, grace, and technical excellence. Jazz dance emphasizes energy, rhythm, and personal expression. Hip-hop celebrates creativity, individuality, and cultural identity.\n\nThe emotional aspect of dance cannot be overlooked. Great dancers don't just execute movements; they tell stories, convey emotions, and connect with their audience on a deeper level.",

        "Dance traditions around the world reflect the rich diversity of human culture. Each culture has developed unique movement vocabularies that express their values, stories, and spiritual beliefs.\n\nTraditional folk dances preserve historical narratives and cultural values. Irish step dancing, Spanish flamenco, and Indian classical dance each tell stories of their people's heritage and experiences.\n\nSocial dances bring communities together and facilitate human connection. From ballroom dancing to Latin social dances, these forms emphasize partnership, communication, and shared joy.\n\nRitual and ceremonial dances serve spiritual and religious purposes. Native American powwow dances, African ceremonial dances, and Balinese temple dances connect participants with their spiritual traditions.\n\nContemporary fusion styles blend traditional elements with modern sensibilities, creating new forms of expression that honor the past while embracing innovation.",
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
        "Photography is the art of capturing light and freezing moments in time. Whether you're using a smartphone or a professional camera, understanding the principles of photography will dramatically improve your images.\n\nThe exposure triangle—aperture, shutter speed, and ISO—forms the technical foundation of photography. Aperture controls depth of field, determining how much of your image is in sharp focus. A wide aperture creates shallow depth of field, perfect for portraits.\n\nShutter speed controls motion in your photographs. Fast shutter speeds freeze action, while slow shutter speeds can create artistic motion blur or capture the movement of water and clouds.\n\nISO determines your camera's sensitivity to light. Lower ISO values produce cleaner images with less noise, while higher ISO values allow you to shoot in darker conditions.\n\nUnderstanding these three elements and how they interact allows you to take creative control of your camera and achieve the exact look you want in your photographs.",

        "Composition is what separates snapshots from compelling photographs. Good composition guides the viewer's eye through the image and creates visual interest and emotional impact.\n\nThe rule of thirds divides your frame into nine equal sections, placing important elements along these lines or at their intersections. This creates more dynamic and visually pleasing compositions than centering your subject.\n\nLeading lines guide the viewer's eye through the image toward your main subject. Roads, fences, shorelines, and architectural elements can all serve as leading lines.\n\nFraming uses elements in the scene to create a natural border around your subject. Doorways, windows, tree branches, and shadows can all serve as frames.\n\nSymmetry and patterns create visually striking images, while breaking the pattern can add interest and draw attention to your subject.",
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
        "Art and craft represent humanity's innate desire to create beauty and express ideas through visual means. From cave paintings to digital art, the urge to create has driven innovation and cultural development throughout history.\n\nUnderstanding different art mediums is essential for any aspiring artist. Watercolors offer transparency and fluidity, perfect for capturing light and atmosphere. Oil paints provide rich colors and extended working time, allowing for detailed blending and layering.\n\nDrawing forms the foundation of most visual arts. Mastering basic drawing skills—understanding proportion, perspective, shading, and line quality—will improve your work in any medium.\n\nColor theory is fundamental to creating visually appealing artwork. The color wheel shows relationships between colors, helping artists create harmonious palettes. Complementary colors create vibrant contrasts, while analogous colors provide subtle harmony.\n\nDeveloping your artistic voice takes time and experimentation. Study the masters, but don't be afraid to break rules and explore new techniques. The most important aspect of art is authentic self-expression.",

        "The history of visual arts reflects the evolution of human consciousness, technology, and cultural values. From prehistoric cave paintings to contemporary digital installations, art has always been a mirror of its time.\n\nAncient civilizations used art for religious and ceremonial purposes. Egyptian hieroglyphs, Greek sculptures, and Roman frescoes established artistic traditions that influence us today.\n\nThe Renaissance marked a revolutionary period in art history, with masters like Leonardo da Vinci and Michelangelo pushing the boundaries of realism and human representation.\n\nModern art movements of the 19th and 20th centuries challenged traditional concepts of beauty and representation. Impressionism, Cubism, Abstract Expressionism, and Pop Art each brought new perspectives to artistic expression.\n\nContemporary art continues to evolve, incorporating new technologies, materials, and concepts. Digital art, installation art, and conceptual art expand the definition of what art can be.",
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
    return () => {
      setArticle([]);
    };
  }, [getArticles]);

  function SearchBlogs(e) {
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
                  <Fade key={item.id || index}>
                    <div className="allBlogWrapper">
                      <div className="allBlogImage">
                        <img
                          src={item.pic || "/placeholder.svg"}
                          alt={`${item.title} - ${item.category} Article`}
                          className="allblogImage"
                          onError={(e) => {
                            console.log(
                              `Image failed to load: ${e.target.src}`
                            );
                            e.target.src = getCategoryImage(
                              item.category,
                              index
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

import React, { useContext } from "react";
import { BsCalendarDate, BsClockHistory } from "react-icons/bs";
import { FaUser, FaTags, FaShareAlt } from "react-icons/fa";
import { singleBlog } from "../../App";
import "./SingleBlog.css";
import Navbar from "../Navbar/Navbar";
import { Box, Typography } from "@mui/material";

const SingleBlog = () => {
  const { singleBlogDetail } = useContext(singleBlog);

  console.log(singleBlogDetail);

  if (!singleBlogDetail || !singleBlogDetail.title) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography variant="h5">No blog selected</Typography>
        </Box>
      </>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: singleBlogDetail.title,
        text: singleBlogDetail.title,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="singleBlogContainer">
        <article className="singleBlog">
          <header className="singleBlogHeader">
            <h1 className="singleBlogTitle">{singleBlogDetail.title}</h1>

            <div className="singleBlogMeta">
              <div className="metaRow">
                <div className="metaItem">
                  <FaUser className="metaIcon" />
                  <span>{singleBlogDetail.author || "Anonymous"}</span>
                </div>
                <div className="metaItem">
                  <BsCalendarDate className="metaIcon" />
                  <span>{singleBlogDetail.date}</span>
                </div>
                <div className="metaItem">
                  <BsClockHistory className="metaIcon" />
                  <span>{singleBlogDetail.time}</span>
                </div>
              </div>

              <div className="metaRow">
                <div className="metaItem">
                  <span className="readTime">
                    📖 {singleBlogDetail.readTime || "5 min read"}
                  </span>
                </div>
                <button className="shareButton" onClick={handleShare}>
                  <FaShareAlt className="metaIcon" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {singleBlogDetail.tags && singleBlogDetail.tags.length > 0 && (
              <div className="blogTagsContainer">
                <FaTags className="tagsIcon" />
                <div className="blogTags">
                  {singleBlogDetail.tags.map((tag, index) => (
                    <span key={index} className="blogTag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </header>

          <div className="singleBlogImageWrapper">
            <img
              src={
                singleBlogDetail.image ||
                "https://picsum.photos/800/400?random=1"
              }
              alt={singleBlogDetail.title}
              className="singleBlogImage"
            />
          </div>

          <div className="singleBlogContent">
            <div className="singleBlogText">
              {singleBlogDetail.text.split("\n\n").map((paragraph, index) => (
                <p key={index} className="blogParagraph">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="blogFooter">
              <div className="authorInfo">
                <div className="authorAvatar">
                  {(singleBlogDetail.author || "A").charAt(0).toUpperCase()}
                </div>
                <div className="authorDetails">
                  <h4>About the Author</h4>
                  <p>
                    <strong>{singleBlogDetail.author || "Anonymous"}</strong>
                  </p>
                  <p>
                    Expert writer and educator passionate about sharing
                    knowledge and inspiring others to learn.
                  </p>
                </div>
              </div>

              <div className="articleActions">
                <button className="actionButton" onClick={handleShare}>
                  <FaShareAlt /> Share Article
                </button>
                <button
                  className="actionButton"
                  onClick={() => window.history.back()}
                >
                  ← Back to Articles
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default SingleBlog;

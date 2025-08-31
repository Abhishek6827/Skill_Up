import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { db } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";
import { Typography, Box } from "@mui/material";

function Article(props) {
  const { Title } = props;
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArticle = async () => {
      try {
        setLoading(true);
        const getData = [];
        const articleReference = collection(db, "data");
        const Snapshot = await getDocs(articleReference);

        Snapshot.forEach((doc) => {
          getData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Filter articles by title
        const filteredArticles = getData.filter((item) => item.Title === Title);
        setArticle(filteredArticles);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [Title]);

  console.log(Title);
  console.log(article);

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Typography>Loading article...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        {article.length > 0 ? (
          article.map((item, index) => (
            <div key={item.id || index}>
              <Typography variant="h3" gutterBottom>
                {item.Title}
              </Typography>
              {item.image && (
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.Title}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    marginBottom: "1rem",
                  }}
                />
              )}
              <Typography variant="body1" paragraph>
                {item.article}
              </Typography>
            </div>
          ))
        ) : (
          <Typography variant="h5" textAlign="center">
            Article "{Title}" not found
          </Typography>
        )}
      </Box>
    </>
  );
}

export default Article;

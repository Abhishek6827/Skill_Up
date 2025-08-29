import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Article from "./Component/Reducers/ArticleReducer";
import { HashRouter } from "react-router-dom"; // Import HashRouter here

const store = configureStore({
  reducer: {
    Blogs: Article,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Wrap App with HashRouter at the top level */}
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

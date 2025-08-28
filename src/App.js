import React, { createContext, useState, Suspense } from "react";
import "./App.css";
import { Routes, Route, HashRouter } from "react-router-dom"; // Changed to HashRouter
import SignUp from "./Component/SignUp";
import ForgetPassword from "./Component/ForgetPassword";
import AboutUs from "./Component/AboutUs/AboutUs";
import HomePage from "./Component/HomePage";
import Profile from "./Component/Profile/Profile";
import EditProfile from "./Component/Profile/EditProfile";
import LandingPage from "./Component/LandPage/LandingPage";
import CreateSession from "./Component/CreateSession/CreateSession";
import Article from "./Component/Article/Article";
import ConfirmPage from "./Component/ConfirmPage";
import Videos from "./Component/Videos/Videos";
import LiveSession from "./Component/LiveSessions/LiveSession";
import { FormContext } from "./Component/Context/DetailFormContext.js";
import PersonalDetailForm from "./Component/PersonalForms/PersonalDetailForm";
import EducationForm from "./Component/EducationForm/EducationForm";
import DocumentForm from "./Component/DocumentForm/DocumentForm";
import { ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider } from "./AuthContext";
import Loader from "./Component/Loader/CircularProgressWithLabel";

export const singleBlog = createContext();

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
});

// Lazy load components
const Blogs = React.lazy(() => import("./Component/Blogs/Blogs"));
const SingleBlog = React.lazy(() => import("./Component/Blogs/SingleBlog"));

function App() {
  const [singleBlogDetail, setSingleBlogDetail] = useState({
    title: null,
    text: null,
    image: null,
  });

  const [showPersonaldetailForm, setshowPersonaldetailForm] = useState(false);
  const [showEducationForm, setshowEducationForm] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <singleBlog.Provider value={{ singleBlogDetail, setSingleBlogDetail }}>
          <FormContext.Provider
            value={{
              showPersonaldetailForm,
              showEducationForm,
              setshowPersonaldetailForm,
              setshowEducationForm,
            }}
          >
            <HashRouter>
              {" "}
              {/* Wrap everything with HashRouter */}
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/Homepage" element={<HomePage />} />
                <Route path="/Aboutus" element={<AboutUs />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/EditProfile" element={<EditProfile />} />
                <Route path="/Homepage/article" element={<Article />} />
                <Route path="/confirm" element={<ConfirmPage />} />
                <Route
                  path="/blogs"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Blogs />
                    </Suspense>
                  }
                />
                <Route path="/videos" element={<Videos />} />
                <Route
                  path="/singleBlog"
                  element={
                    <Suspense fallback={<Loader />}>
                      <SingleBlog />
                    </Suspense>
                  }
                />
                <Route path="/Homepage/videos" element={<ConfirmPage />} />
                <Route path="/CreateSession" element={<CreateSession />} />
                <Route path="/liveSessions" element={<LiveSession />} />
                <Route path="/personalForm" element={<PersonalDetailForm />} />
                <Route path="/educationForm" element={<EducationForm />} />
                <Route path="/documentForm" element={<DocumentForm />} />
              </Routes>
            </HashRouter>
          </FormContext.Provider>
        </singleBlog.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

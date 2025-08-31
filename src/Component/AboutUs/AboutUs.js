import React, { useRef, useState } from "react";
import "./AboutUs.css";
import Navbar from "../Navbar/Navbar";
import emailjs from "@emailjs/browser";
import Mypic from "../SVG/Abhishek.JPEG";
import { ToastContainer, toast } from "react-toastify";
const AboutUs = () => {
  const form = useRef();
  const [inputValue, setInputValue] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Usertype: "",
    Message: "",
  });
  const MessageNotify = () => {
    toast.success(
      "Message Sent Successfully, SkillUp will response you soon !",
      {
        theme: "dark",
        autoClose: 1500,
        hideProgressBar: true,
        position: "top-center",
      }
    );
  };

  const errorNotify = () => {
    toast.error("Failed to send the message, please try again", {
      theme: "dark",
      autoClose: 1500,
      hideProgressBar: true,
      position: "top-center",
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    try {
      emailjs
        .sendForm(
          process.env.REACT_APP_CONTACT_SERVICE,
          process.env.REACT_APP_CONTACT_TEMPLATE,
          form.current,
          process.env.REACT_APP_CONTACT_API
        )
        .then(MessageNotify());
    } catch (error) {
      errorNotify();
    }

    setInputValue({
      FirstName: "",
      LastName: "",
      Email: "",
      Usertype: "",
      Message: "",
    });
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <section>
        <section className="Aboutme">
          <div className="MyInfo">
            <img src={Mypic} alt="My Pic" width={"200px"} height={"200px"} />
            <div>
              <p>
                Hi Everyone , 👋 <br /> <br />
                We are PG pursuing Students 🧑‍🎓, We choose SkillUp (Skill
                Enhancement Web App) as my major project because We have
                released many times that while studying hard to fulfill our
                dreams we tend to only focus on theortical part of our studies
                and ignore our natural skills, extra-curricular activities and
                interest which can be a good source of reducing Stress specially
                in student life and can help in improving focus.
                <br />
                But, The major problem arises is that from where we can get all
                these stuff ? Most of the resources on sites like Udemy,
                Skillshare are costly, so what about Unpreviledge or Financially
                Weak Students ? <br />
                Hence, Consedering all these thoughts, I have tried to develope
                ,<b>SkillUp</b> which can be used by anyone to follow up their
                interests and add some new skills in their Skillset through
                Video Lessons and Blogs. To make it more authenticate features
                like "Live session" had been added which makes learning a skill
                more easier and faster.
              </p>
            </div>
          </div>
        </section>
        <form className="container" ref={form} onSubmit={sendEmail}>
          <h2>Get In touch with Me 🤝</h2>
          <div className="row100">
            <div className="col">
              <div className="inputBox">
                <input
                  type="text"
                  name="FirstName"
                  value={inputValue.FirstName}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  required="required"
                />
                <span className="text">Frist Name</span>
                <span className="line"></span>
              </div>
            </div>
            <div className="col">
              <div className="inputBox">
                <input
                  type="text"
                  name="LastName"
                  value={inputValue.LastName}
                  required="required"
                />
                <span className="text">Last Name</span>
                <span className="line"></span>
              </div>
            </div>
            <div className="col">
              <div className="inputBox">
                <input
                  type="text"
                  name="Email"
                  required="required"
                  value={inputValue.Email}
                />
                <span className="text">Email</span>
                <span className="line"></span>
              </div>
            </div>
            <div className="col">
              <div className="inputBox">
                <input
                  type="text"
                  name="Usertype"
                  required="required"
                  value={inputValue.Usertype}
                />
                <span className="text">Usertype</span>
                <span className="line"></span>
              </div>
            </div>
          </div>
          <div className="row100">
            <div className="col">
              <div className="inputBox textarea">
                <textarea
                  required="required"
                  name="Message"
                  value={inputValue.Message}
                ></textarea>
                <span className="text">Type Your Message Here</span>
                <span className="line"></span>
              </div>
            </div>
          </div>
          <div className="row100">
            <div className="col">
              <input type="submit" name="send" />
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AboutUs;

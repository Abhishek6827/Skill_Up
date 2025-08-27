import React, { useState, useRef, useEffect } from "react";
import {
  doc,
  collection,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./CreateSession.css";
import { AiOutlineDelete } from "react-icons/ai";
import Navbar from "../Navbar/Navbar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "yup-phone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "@emailjs/browser";
import imogi from "../SVG/emptySession.svg";

const schema = yup.object().shape({
  Link: yup.string().url().required(),
  CourseName: yup.string().required(),
  StartTime: yup.string().required(),
  SessionDate: yup.string().required(),
  SessionDuration: yup.string().required(),
  Category: yup.string().required(),
  Description: yup.string().min(50).required(),
  volunteerEmail: yup.string(),
  volunteerName: yup.string(),
  releasedDay: yup.string(),
  volunteerImage: yup.string(),
});

const CreateSession = () => {
  const [createSessionOpen, setCreateSessionOpen] = useState(true);
  const [mySessionOpen, setmySessionOpen] = useState(false);
  const [totalSessions, setTotalSessions] = useState([]);
  const form = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log(new Date().toDateString());

  // Fetching Volunteer Personal created Sessions
  useEffect(() => {
    const getPersonalSessions = async () => {
      try {
        const getData = [];
        const Snapshot = await getDocs(
          collection(db, "session", auth.currentUser.uid, "sessionCollection")
        );
        Snapshot.forEach((doc) => {
          console.log(doc.id);
          getData.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setTotalSessions(getData);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    getPersonalSessions();

    return () => {
      // useEffect CleanUp function
      setTotalSessions([]);
    };
  }, []);

  console.log(totalSessions);

  // Function for Making session
  const clickHandler = async (data) => {
    let ID = (Math.random() + 1).toString(36).substring(3);
    try {
      await setDoc(
        doc(db, "session", auth.currentUser.uid, "sessionCollection", ID),
        data
      );
      await setDoc(doc(db, "totalSession", ID), data);

      emailjs.sendForm(
        process.env.REACT_APP_CREATED_SESSION_SERVICE,
        process.env.REACT_APP_CREATED_SESSION_TEMPLATE,
        form.current,
        process.env.REACT_APP_CREATED_SESSION_API
      );
      successsNotify();
      reset();
    } catch (error) {
      console.log(error);
      errorNotify();
    }
  };

  const successsNotify = () => {
    toast.success("Session Published Successfully !", {
      position: "top-center",
      autoClose: 1500,
      theme: "dark",
      hideProgressBar: true,
    });
  };

  const deleteNotify = () => {
    toast.success("Session deleted !", {
      position: "top-center",
      autoClose: 1500,
      theme: "dark",
      hideProgressBar: true,
    });
  };

  const errorNotify = () => {
    toast.error("Session not Published!", {
      theme: "dark",
      autoClose: 1500,
      hideProgressBar: true,
      position: "top-center",
    });
  };

  function createSessionHandler() {
    setCreateSessionOpen(true);
    setmySessionOpen(false);
  }

  function mySessionHandler() {
    setCreateSessionOpen(false);
    setmySessionOpen(true);
  }

  return (
    <>
      <Navbar />
      <div className="sessionMenu">
        <div
          className={
            createSessionOpen ? "createSessionActive" : "createSession"
          }
          onClick={createSessionHandler}
        >
          <p>Create a Session</p>
        </div>
        <div
          className={mySessionOpen ? "mySessionsActive" : "mySessions"}
          onClick={mySessionHandler}
        >
          <p>My Sessions</p>
        </div>
      </div>
      <div className="createSessionWrapper">
        {createSessionOpen && (
          <div className="createSessionContainer">
            <div className="createSessionContainerLeft">
              <form
                onSubmit={handleSubmit(clickHandler)}
                className="formContainer"
                ref={form}
              >
                <input
                  type="text"
                  name="volunteerEmail"
                  className="Email"
                  {...register("volunteerEmail")}
                  defaultValue={auth.currentUser.email}
                />
                <input
                  type="text"
                  name="volunteerName"
                  className="Name"
                  {...register("volunteerName")}
                  defaultValue={auth.currentUser.displayName}
                />
                <input
                  type="text"
                  name="volunteerImage"
                  className="Name"
                  {...register("volunteerImage")}
                  defaultValue={auth.currentUser.photoURL}
                />
                <input
                  type="text"
                  name="releasedDate"
                  className="Name"
                  {...register("releasedDate")}
                  defaultValue={new Date().toDateString()}
                />

                <label style={{ fontWeight: "500" }}>
                  Paste Session Link here
                </label>
                <div>
                  <input
                    className="SessionLink"
                    type="text"
                    placeholder="Paste Zoom, Google, WebX etc meeting link..."
                    {...register("Link")}
                    name="Link"
                  />
                  <p className="errorMessage">{errors.Link?.message}</p>
                </div>

                <label style={{ fontWeight: "500" }}>Course Name </label>
                <div>
                  <input
                    className="SessionCourseName"
                    {...register("CourseName")}
                    placeholder="Course Name..."
                    name="CourseName"
                  />
                  <p className="errorMessage">{errors.CourseName?.message}</p>
                </div>

                <label style={{ fontWeight: "500" }}>Choose Date</label>
                <div>
                  <input
                    className="SessionDate"
                    name="Date"
                    type="date"
                    {...register("SessionDate")}
                  />
                  <p className="errorMessage">{errors.SessionDate?.message}</p>
                </div>

                <label style={{ fontWeight: "500" }}> Session Timings </label>
                <div className="sessionTiming">
                  <div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        width: "100%",
                        color: "grey",
                      }}
                    >
                      Starting time :{" "}
                    </div>
                    <input
                      className="SessionTime"
                      type="time"
                      name="Time"
                      {...register("StartTime")}
                    />
                    <p
                      style={{ color: "red", fontSize: "12px", width: "100%" }}
                    >
                      {errors.StartTime?.message}
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        color: "grey",
                      }}
                    >
                      Session Duration{" "}
                    </div>
                    <select
                      className="SessionDuration"
                      placeholder="User Type..."
                      {...register("SessionDuration")}
                      name="Duration"
                    >
                      <option value={"less than 1hr"}>Less than 1hr</option>
                      <option value={"1hr - 2hr"}>1hr - 2hr</option>
                      <option value={"2hr+"}>2hr+</option>
                    </select>
                    <p className="errorMessage">
                      {errors.SessionDuration?.message}
                    </p>
                  </div>
                </div>

                <label style={{ fontWeight: "500" }}>Category</label>
                <div>
                  <select
                    className="SessionCategory"
                    placeholder="Category"
                    {...register("Category")}
                    name="Category"
                  >
                    <option value={"Dance"}>Dance</option>
                    <option value={"Music"}>Music</option>
                    <option value={"Art & Craft"}>Art & Craft</option>
                    <option value={"Cooking"}>Cooking</option>
                    <option value={"Computer science"}>Computer science</option>
                    <option value={"Photography"}>Photography</option>
                    <option value={"Videography"}>Videography</option>
                  </select>
                  <p className="errorMessage">{errors.Category?.message}</p>
                </div>

                <label style={{ fontWeight: "500" }}>Description</label>
                <div>
                  <textarea
                    className="SessionTextarea"
                    rows={15}
                    cols={10}
                    style={{ resize: "none" }}
                    placeholder="Tell learners something about the skills they'll get to grab and your teaching methodology..."
                    {...register("Description")}
                    name="Description"
                  />
                  <p className="errorMessage">{errors.Description?.message}</p>
                </div>

                <div className="formBottom">
                  <button
                    className="resetButton"
                    type="button"
                    onClick={() => {
                      reset();
                    }}
                  >
                    Reset
                  </button>
                  <button className="createButton" type="submit">
                    Create Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {mySessionOpen && (
          <div className="personalSessionContainer">
            {totalSessions.length > 0 ? (
              totalSessions.map((item, index) => (
                <div
                  key={item.id || index}
                  height={"20%"}
                  margin={"1rem"}
                  className="sessionWrapper"
                >
                  <div className="personalSessionwrapper">
                    <div className="sessionHeading">
                      <p className="sessionCourseName">{item.CourseName}</p>
                    </div>
                    <div className="sessionMiddle">
                      <p className="sessionCategory">{item.Category}</p>
                      <p className="sessionDuration">{item.SessionDuration}</p>
                    </div>
                    <div className="timeSession">
                      <div className="timeSessionWrapper">
                        <div className="sessionDate">
                          <b>Date:</b> {item.SessionDate}
                        </div>
                        <div className="sessionStartTime">
                          <b>Starts At:</b> {item.StartTime}
                        </div>
                      </div>
                      <div className="sessionDescription">
                        <b>Description:</b> {item.Description}
                      </div>
                      <div className="sessionLink">
                        <p style={{ margin: "0.5rem" }}>
                          <b>Session Link:</b>{" "}
                          <a
                            href={item.Link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              textDecorationLine: "none",
                              color: "blue",
                            }}
                          >
                            {item.Link}
                          </a>
                        </p>
                      </div>
                      <AiOutlineDelete
                        className="deleteSession"
                        onClick={async () => {
                          try {
                            await deleteDoc(
                              doc(
                                db,
                                "session",
                                auth.currentUser.uid,
                                "sessionCollection",
                                item.id
                              )
                            );
                            await deleteDoc(doc(db, "totalSession", item.id));
                            deleteNotify();
                            // Refresh the sessions list
                            const getData = [];
                            const Snapshot = await getDocs(
                              collection(
                                db,
                                "session",
                                auth.currentUser.uid,
                                "sessionCollection"
                              )
                            );
                            Snapshot.forEach((doc) => {
                              getData.push({
                                ...doc.data(),
                                id: doc.id,
                              });
                            });
                            setTotalSessions(getData);
                          } catch (error) {
                            console.error("Error deleting session:", error);
                            toast.error("Failed to delete session");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="emptyPersonalSession">
                <img
                  src={imogi || "/placeholder.svg"}
                  alt="Empty"
                  height={"100px"}
                  width="100px"
                />
                <p className="emptyMessage">No Sessions available !</p>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateSession;

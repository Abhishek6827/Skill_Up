import React, { useState, useRef } from "react";
import { storage } from "../../firebase";
import "./DocumentForm.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "yup-phone";
import { Box, FormControl, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import document from "../SVG/certificate.svg";

const schema = yup.object().shape({
  IDCardType: yup.string(),
  CertificationType: yup.string(),
});

const DocumentForm = () => {
  const [IdDocURL, setIdDocURL] = useState(null);
  const [certificateDocURL, setCertificateDocURL] = useState(null);
  const [Docs, setDocs] = useState({
    IDCard: null,
    CertificationDoc: null,
  });
  const idRef = useRef(null);
  const certificateRef = useRef(null);
  const navigate = useNavigate();

  const changeHandler = async (e) => {
    setDocs({ ...Docs, IDCard: e.target.files[0] });
    const newFile = e.target.files[0];
    const storageRef = ref(storage, auth.currentUser.uid);
    const filePath = ref(storageRef, newFile.name);
    const uploadFile = uploadBytesResumable(filePath, newFile);

    //track progress
    uploadFile.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(progress);
      if (progress === 100 && e.target.id === "IDDoc") {
        setTimeout(async () => {
          const IdURL = await getDownloadURL(filePath);
          setIdDocURL(IdURL);
        }, [2000]);
      }
      if (progress === 100 && e.target.id === "certificationDoc") {
        setTimeout(async () => {
          const certificateURL = await getDownloadURL(filePath);
          setCertificateDocURL(certificateURL);
        }, [2000]);
      }
    });
  };

  const [error, setError] = useState(false);
  const message = "Please upload the documents !";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = async (data) => {
    if (Docs.IDCard != null) {
      await setDoc(doc(db, "user", auth.currentUser.uid), data, {
        merge: true,
      });
      navigate("/Homepage");
      console.log(Docs);
      console.log(data);
    } else {
      setError(true);
    }
  };

  return (
    <Box display={"flex"} margin={"3rem"}>
      <Box className="Left" display={"flex"} flex={0.5}>
        <img
          src={document || "/placeholder.svg"}
          alt="DocumentPic"
          width="80%"
          height={"80%"}
        />
      </Box>
      <Box
        sx={{
          width: "80%",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          padding: "0.5rem 0 1rem 0",
          boxShadow: 15,
        }}
        flex={0.5}
        className="Right"
      >
        <Typography
          textAlign="center"
          sx={{ marginBottom: "1rem", fontSize: "30px" }}
        >
          Document Submission
        </Typography>
        <FormControl
          sx={{
            width: "100%",
            height: "auto",
            margin: "auto",
            display: "flex",
            alignItems: "center",
          }}
        >
          <form
            className="DocumentForm"
            onSubmit={handleSubmit(submitHandler)}
            style={{
              fontSize: "18px",
              height: "80vh",
              width: "80%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <label className="documentLabel">
              Identification Document Type
            </label>
            <select {...register("IDCardType")} className="DocumentFormInput">
              <option value="Aadhar Card">Aadhar Card</option>
              <option value="Institute Card">Institute Card</option>
              <option value="Voter Card">Voter Card</option>
              <option value="Driving License">Driving License</option>
              <option value="Pan Card">Pan Card</option>
              <option value="Any other card">Any other card</option>
            </select>
            <p className="errorMessage">{errors.IDCardType?.message}</p>

            <label className="documentLabel">
              Upload Identification Document
            </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="file"
                onChange={changeHandler}
                ref={idRef}
                className="DocumentFormInput"
                id="IDDoc"
              />
              {IdDocURL !== null && (
                <a
                  href={IdDocURL}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: "30%",
                    height: "30px",
                    textDecoration: "none",
                    color: "white",
                    fontSize: "16px",
                    border: "none",
                    backgroundColor: "purple",
                    padding: "5px",
                    borderRadius: "5px",
                    textAlign: "center",
                  }}
                >
                  Preview
                </a>
              )}
            </div>
            <p className="errorMessage">{error && message}</p>

            <label className="documentLabel">Any Certification</label>
            <textarea
              name="Certification Type"
              placeholder="Anything of which you are proud of OR got recognised"
              rows="10"
              cols="20"
              {...register("CertificationType")}
              style={{ padding: "10px", fontSize: "15px" }}
            />

            <label className="documentLabel">Upload Certificate</label>
            <div style={{ display: "flex" }}>
              <input
                type="file"
                className="DocumentFormInput"
                id="certificationDoc"
                onChange={changeHandler}
                ref={certificateRef}
              />
              {certificateDocURL !== null && (
                <a
                  href={certificateDocURL}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: "30%",
                    height: "30px",
                    textDecoration: "none",
                    color: "white",
                    fontSize: "16px",
                    border: "none",
                    backgroundColor: "purple",
                    padding: "5px",
                    borderRadius: "5px",
                    textAlign: "center",
                  }}
                >
                  Preview
                </a>
              )}
            </div>

            <button type="submit" className="FormSubmitButton">
              Submit
            </button>
          </form>
        </FormControl>
      </Box>
    </Box>
  );
};

export default DocumentForm;

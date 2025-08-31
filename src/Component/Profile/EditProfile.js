import React from "react";
import { FormControl, Box, Typography, TextField, Button } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import "yup-phone";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNo: yup.string().required("Phone number is required"),
  about: yup.string(),
  institution: yup.string().required("Institution is required"),
  course: yup.string().required("Course is required"),
});

const EditProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
    // Handle form submission here
  };

  return (
    <>
      <Navbar />
      <Typography
        variant="h2"
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "5rem 1rem 1rem 1rem",
        }}
      >
        Edit Profile
      </Typography>
      <Box
        sx={{
          width: "50%",
          height: "auto",
          display: "flex",
          justifyItems: "center",
          margin: "auto",
          padding: "1rem",
          boxShadow: 15,
        }}
      >
        <FormControl
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "70%",
            height: "auto",
            display: "flex",
            justifyItems: "space-between",
            margin: "auto",
            padding: "1rem",
          }}
        >
          <TextField
            label="First Name"
            id="firstName"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            sx={{ margin: "1rem" }}
          />
          <TextField
            label="Last Name"
            id="lastName"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            sx={{ margin: "1rem" }}
          />
          <TextField
            label="Phone No"
            id="phoneNo"
            {...register("phoneNo")}
            error={!!errors.phoneNo}
            helperText={errors.phoneNo?.message}
            sx={{ margin: "1rem" }}
          />
          <TextField
            id="about"
            label="Tell us about Yourself"
            multiline
            rows={8}
            {...register("about")}
            error={!!errors.about}
            helperText={errors.about?.message}
            sx={{ margin: "1rem" }}
          />
          <TextField
            label="School/College/University"
            id="institution"
            {...register("institution")}
            error={!!errors.institution}
            helperText={errors.institution?.message}
            sx={{ margin: "1rem" }}
            required
          />
          <TextField
            label="Class/Standard/Course"
            id="course"
            {...register("course")}
            error={!!errors.course}
            helperText={errors.course?.message}
            sx={{ margin: "1rem" }}
            required
          />
          <Button
            type="submit"
            variant="outlined"
            style={{ width: "30%", marginLeft: "65%" }}
          >
            Save
          </Button>
        </FormControl>
      </Box>
    </>
  );
};

export default EditProfile;

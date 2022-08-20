import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { Link, useHistory } from "react-router-dom"

const Register = () => {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line
  const [success, setSuccess] = useState(false)

  // const initialState = {
  //   username: "",
  //   password : "",
  //   confirmPassword: ""
  // }

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const { username, password, confirmPassword } = formData;

  //const [formData, setFormData ] = useState(initialState)


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const register = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    const newUser = {
      username,
      password,
    }

    // eslint-disable-next-line
    const configApp = {
      headers: {
        "Content-Type": "application/json",
      },
    };


    // const body = JSON.stringify(newUser);
    
    setIsLoading(true);
    try {
      const res = await axios.post(config.endpoint + "/auth/register", newUser);
      console.log(res.data);
      enqueueSnackbar("Registration Successfully done", { variant: "success" })
      setFormData({
        username: "",
        password: "",
        confirmPassword: ""
      })
      // if (res.data.success === true) {
        setIsLoading(false);
        setSuccess(true);
        history.push("/login")
        return res.data
      // }
    } catch (err) {
      setIsLoading(false);
      setSuccess(false);
      if (err.response && err.response.status === 400) {
        enqueueSnackbar("Username is already taken", { variant: 'error' });
      } else {
        enqueueSnackbar("Something went wrong!", { variant: 'error' });
      }

      // console.log(err.response.data.message);
      // enqueueSnackbar(err.response.data.message, { variant: "error" })
      //return err.response.data
    }


  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = () => {
    const { username, password, confirmPassword } = formData

    if (username === "") {
      enqueueSnackbar("Username is a required field", { variant: "error" })
    } else if (username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: "error" })
    } else if (password === "") {
      enqueueSnackbar("Password is a required field", { variant: "error" })
    } else if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "error" })
    } else if (confirmPassword === "") {
      enqueueSnackbar("Confirm Password is a required field", { variant: "error" })
    } else if (confirmPassword.length < 6) {
      enqueueSnackbar("Confirm Password must be at least 6 characters", { variant: "error" })
    } else if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" })
    } else {
      // setSuccess(true)
      // enqueueSnackbar("Registration Successfully done", { variant: "success" })
      return true
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  }



  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        minHeight="100vh"

      >
        <Header hasHiddenAuthButtons={true} />
        <Box className="content">
          <Stack spacing={2} className="form">
            <h2 className="title">Register</h2>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              title="Username"
              name="username"
              placeholder="Enter Username"
              fullWidth
              value={username}
              onChange={handleChange}
            />
            <TextField
              id="password"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              helperText="Password must be atleast 6 characters length"
              fullWidth
              placeholder="Enter a password with minimum 6 characters"
              value={password}
              onChange={handleChange}
            />

            <TextField
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={handleChange}
            />
            {isLoading ? <div className="loading"><CircularProgress /></div> :
              <Button variant="contained" onClick={register}>
                Register Now
              </Button>}

            <p className="secondary-action">
              Already have an account?{" "}
              <Link className="link" to="/login">
                Login here
              </Link>
            </p>
          </Stack>
        </Box>
        <Footer />
      </Box>
    </>

  );
};

export default Register;

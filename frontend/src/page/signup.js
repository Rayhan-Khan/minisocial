import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import Box from "@mui/material/Box";
import {
  Alert,
  Backdrop,
  Button,
  Card,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Snackbar,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
let controller;

export default function Signup({setToken}) {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const [cshowPassword, setcshowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [profile,setProfile]=useState();
  const [userNameLoading, setUserNameLoding] = useState(false);
  const [available, setAvaiable] = useState(true);
  const [isEmail, setisEmail] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  //Loader
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  function handleChange(e) {
    setEmail(e.target.value);
  }
 async function subMit(e) {
    e.preventDefault();
    if (!available) return;
    let em = validateEmail(Email);
    setisEmail(em);
    if (!em) {
      setEmail("");
      return;
    }

    if (Password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    handleToggle();
    const formData = new FormData();
    formData.append('Name',Name);
    formData.append("Email",Email);
    formData.append("Password",Password);
    formData.append("confirmPassword",confirmPassword);
    formData.append("userName",userName);
    if(profile){
      formData.append('profile',profile);
    }
    try{
      const res=await axios.post(`${baseUrl}/signin`,formData);
      if(res.status===201){
        const { _id } = res.data.data;
          Cookies.set("user", _id, {
            secure: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 - 10000),
          });
          setToken(Cookies.get("user"));
      }

    }catch(error){
      if(error.response.status===409){
        setisEmail(false)
        setEmail("")
      }
    }
    handleClose();
  }
  const handleClickShowPassword = () => {
    setshowPassword((prev) => !prev);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const userNameAvailable =async () => {
    setUserNameLoding(true);
      try{
        controller && controller.abort();
        controller = new AbortController();
        const res=await axios.get(`${baseUrl}/search/${userName}`,
        {
          signal: controller.signal
       })
       setAvaiable(res.data.data);
      }catch(error){
      }
  setUserNameLoding(false)
}
  function login() {
    navigate("/login");
  }
   useEffect(()=>{
    userName===''?setAvaiable(false):userNameAvailable();
   },[userName])
  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100vw",
          height: 580,
          backgroundColor: "#B0B0B0",
        }}
      >
        {/*  Loader */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* password confirm password not match */}
        {!isEmail && (
          <Snackbar
            open={true}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={3000}
            /* message="Enter Valid email" */
            onClose={() => setisEmail(true)}
          >
            <Alert
              onClose={() => setisEmail(true)}
              severity="error"
              sx={{ width: "100%" }}
            >
               Not Valid email or email is used.
            </Alert>
          </Snackbar>
        )}
        {!passwordMatch && (
          <Snackbar
            open={true}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={3000}
            message="Password and confirm password not match"
            onClose={() => setPasswordMatch(true)}
          >
            <Alert
              onClose={() => setPasswordMatch(true)}
              severity="error"
              sx={{ width: "100%" }}
            >
              Password and confirm password not match
            </Alert>
          </Snackbar>
        )}
        <Card
          sx={{
            //display:'flex',
            width: 300,
            justifyContent: "center",
            alignItems: "center",
            m: "auto",
            height: 500,
            backgroundColor: "#FFFFFF",
            padding: "20px",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              margin: 2,
            }}
            onSubmit={subMit}
          >
            <FormControl
              fullWidth
              sx={{ m: 1, width: "30ch" }}
              variant="standard"
            >
              <InputLabel>Name</InputLabel>
              <Input
                id="standard-adornment-name"
                required
                value={Name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl
              error={!isEmail}
              sx={{ m: 1, width: "30ch" }}
              variant="standard"
            >
              <InputLabel>Email</InputLabel>
              <Input
                id="standard-adornment-email"
                required
                value={Email}
                onChange={(e) => handleChange(e)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "30ch" }} variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                value={Password}
                required
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "30ch" }} variant="standard">
              <InputLabel htmlFor="standard-adornment-cpassword">
                confirmPassword
              </InputLabel>
              <Input
                id="standard-adornment-cpassword"
                type={cshowPassword ? "text" : "password"}
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setcshowPassword((prev) => !prev)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {cshowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "30ch" }} variant="standard">
              <InputLabel htmlFor="standard-adornment-cpassword">
                Username
              </InputLabel>
              <Input
                id="standard-adornment-userName"
                type="text"
                value={userName}
                required
                onChange={(e)=>setUserName(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    {userName ? (
                      userNameLoading ? (
                        <CircularProgress color="inherit" size={26} />
                      ) : available ? (
                        <CheckCircleIcon sx={{ color: "green", mr: 1 }} />
                      ) : (
                        <ErrorIcon sx={{ color: "red" }} />
                      )
                    ) : (
                      ""
                    )}
                  </InputAdornment>
                }
              />
            </FormControl>
            
            <p>{profile&& profile.name}</p>
            <Button
              sx={{ m: "auto", width: "25ch" }}
              variant="contained"
              component="label"
              color="success"
            >
              Upload profile Pic
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) =>{setProfile(e.target.files[0])}}
              />
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ margin: "auto", marginTop: 2 }}
              type="submit"
            >
              Signup
            </Button>
          </form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              padding: "4px",
              margin: "6px",
              gap: "8px",
            }}
          >
            <Button
              sx={{ m: "auto", width: "30ch" }}
              variant="contained"
              onClick={login}
            >
              Already have an account?
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
}

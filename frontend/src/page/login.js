import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/baseUrl";
import Box from "@mui/material/Box";
import {
  Alert,
  Avatar,
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
import img from "./img/log.jpg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import Cookies from "js-cookie";

export default function Login({ setToken }) {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const [error, setError] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  function handleChange(e) {
    setPassword(e.target.value);
  }
  function subMit(e) {
    e.preventDefault();
    handleToggle();
    (async function () {
      try {
        const res = await axios.post(baseUrl + "/login", { Email, Password });
        if (res.status === 200) {
          const { _id } = res.data.data;
          Cookies.set("user", _id, {
            secure: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 - 10000),
          });
          setToken(Cookies.get("user"));
        }
        handleClose();
      } catch (error) {
        if (error.response.status === 401) setError(true);
        handleClose();
      }
    })();
  }
  const handleClickShowPassword = () => {
    setshowPassword((prev) => !prev);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function signup() {
    navigate("/signup");
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#B0B0B0",
      }}
    >
      {/*  Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {error && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2000}
          onClose={() => setError(false)}
        >
          <Alert
            onClose={() => setError(false)}
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
          height: 430,
          backgroundColor: "#FFFFFF",
          padding: "20px",
        }}
      >
        <Avatar
          alt="R"
          src={img}
          sx={{ width: 150, height: 150, margin: "auto" }}
        />
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
            <InputLabel>Email</InputLabel>
            <Input
              id="standard-adornment-email"
              required
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => handleChange(e)}
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

          <Button
            variant="contained"
            color="success"
            sx={{ margin: "auto", marginTop: 4 }}
            type="submit"
          >
            Login
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
          <Button variant="contained" onClick={signup}>
            Create New Account
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

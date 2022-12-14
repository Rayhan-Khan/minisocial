import * as React from "react";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import profile from "./img/profile.png";
import { baseUrl, generatePublicUrl } from "../utils/baseUrl";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Avatar, Button, Skeleton } from "@mui/material";
import axios from "axios";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
  },
}));

const Header = function ({ setToken }) {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [Profile, setProfile] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notification, setNotification] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [user]=useState(Cookies.get('user'));

  async function logout(){
    await axios.post(`${baseUrl}/logout`);
    setToken(false);
  }
  async function profilePage(){
    navigate(`/profile/${user}`)
  }

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    ></Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="primary"
        >
          <Badge badgeContent={notification} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={profilePage}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="primary"
        >
          <Avatar
            alt="Remy Sharp"
            src={Profile ? generatePublicUrl(Profile) : profile}
          />
        </IconButton>
        <p>{userName}</p>
      </MenuItem>
      <MenuItem onClick={logout}>
        <IconButton
          size="large"
          aria-label="logout"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="primary"
        >
          <LogoutIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

   function homepage(){
    navigate("/");
   }

  React.useEffect(() => {
    if (Cookies.get("user")) {
      (async function () {
        try {
          const user = axios.post(`${baseUrl}/api/authUser`, {
            isLoggedin: true,
          });
          const notification = axios.get(`${baseUrl}/totalnotificationunread`);

          const res = await Promise.all([user, notification]);
          if (res[0].status === 200) {
            setLoading(false);
            setUsername(res[0].data.user.data.userName);
            if (res[0].data.user.data.profilePicUrl)
              setProfile(res[0].data.user.data.profilePicUrl);
            setNotification(res[1].data);
          }
        } catch (error) {
          if (error?.response?.status === 303) {
            Cookies.remove("user");
            setToken(Cookies.get("user"));
          }
        }
      })();
    }
  }, []);

  return loading ? (
    <>
      <Skeleton variant="h1" width="100%" height="60px" />
    </>
  ) : (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              wrap="true"
              component="div"
              sx={{ mr: "5px" }}
              onClick={homepage}
            >
              Social
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Search
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mr: "0px" }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search by Name...."
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              <Button variant="contained" color="success">
                { 
                  <Link
                    style={{ color: "white", textDecoration: "none" }}
                   
                    to={`/search/${search}`}
                  >
                    Search
                  </Link>
                }
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show new notifications"
                color="inherit"
              >
                <Badge badgeContent={notification} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
                onClick={profilePage}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={Profile ? generatePublicUrl(Profile) : profile}
                />
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="show new notifications"
                color="inherit"
                onClick={logout}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
      <Outlet />
    </>
  );
};

export default Header;

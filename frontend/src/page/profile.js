import { Avatar, Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl, generatePublicUrl } from "../utils/baseUrl";
import profile from "./img/profile.png";
import Follower from "./followee";
import Cookies from "js-cookie";
import Following from "./following";
import DisplayPost from "./displayPost";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function () {
  const [value, setValue] = React.useState(0);
  const [user, setUser] = useState([]);
  const [followersLength, setFollowersLength] = useState(0);
  const [followingLength, setFollowingLength] = useState(0);
  const [follow, setFollow] = useState([]);
  const { id ,setId} = useParams();
  const [owner] = useState(Cookies.get("user"));
  useEffect(() => {
    (async function () {
      try {
        const res = await axios.get(`${baseUrl}/${id}`);
        setUser(res.data.user);
        setFollow(res.data.following);
        setFollowersLength(res.data.followersLength);
        setFollowingLength(res.data.followingLength);
      } catch (error) {
        console.log(error);
      }
    })();

   
  }, [id]);


  async function startfollow(e) {
    try {
      await axios.post(`${baseUrl}/follow/${e}`);
      setFollow((prev) => [...prev, { user: e }]);
      setFollowersLength(prev=>prev+1);
    } catch (error) {}
  }
  async function unfollow(e) {
    try {
      await axios.put(`${baseUrl}/unfollow/${e}`);
      //setNewFollow(prev=>!prev);
      setFollow((prev) => prev.filter((user) => user.user !== e));
      setFollowersLength(prev=>prev-1);
    } catch (error) {}
  }


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "6px",
          columnGap: "2rem",
        }}
      >
        <Avatar sx={{ width: "150px", height: "150px" }}>
          <img
            width="200px"
            height="200px"
            alt="no image"
            src={
              user.profilePicUrl
                ? generatePublicUrl(user.profilePicUrl)
                : profile
            }
          />
        </Avatar>
        <Box sx={{ mt: ".5rem" }}>
          <Typography sx={{ color: "gray" }} variant="h4">
            User:{user.userName}
          </Typography>
          <Typography sx={{ color: "gray" }} variant="h6">
            Name:{user.name}
          </Typography>
          <Typography sx={{ color: "gray" }} variant="h6">
            follower:{followersLength}
          </Typography>
          <Typography sx={{ color: "gray" }} variant="h6">
            following:{followingLength}
          </Typography>
        </Box>
        <Box sx={{m:'auto'}}>{
          id === owner ? null : follow.some((element) => element.user ===
          id) ? (
          <Button onClick={() => unfollow(id)} variant="outlined">
            unFollow
          </Button>
          ) : (
          <Button onClick={() => startfollow(id)} variant="contained">
            Follow
          </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="Post" {...a11yProps(0)} />
            <Tab label="Followers" {...a11yProps(1)} />
            <Tab label="Following" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div style={{display:'flex',justifyContent:'center',margin:'auto'}}>
        <DisplayPost profile={id}/>
        </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Follower id={id} setId={setId} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Following setId={setId} id={id}/>
        </TabPanel>
      </Box>
    </>
  );
}

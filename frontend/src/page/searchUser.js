import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";

import { Box } from "@mui/system";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { baseUrl, generatePublicUrl } from "../utils/baseUrl";
import profile from "./img/profile.png";

function SearchUser() {
  const { username } = useParams();
  const [user, setUser] = useState([]);
  const [follow, setFollow] = useState([]);
  const [notfound, setNotfound] = useState(false);
  const [owner] = useState(Cookies.get("user"));
  async function startfollow(e) {
    try {
      await axios.post(`${baseUrl}/follow/${e}`);
      setFollow((prev) => [...prev, { user: e }]);

    } catch (error) {}
  }
  async function unfollow(e) {
    try {
      await axios.put(`${baseUrl}/unfollow/${e}`);
      //setNewFollow(prev=>!prev);
      setFollow((prev) => prev.filter((user) => user.user !== e));
    } catch (error) {}
  }

  useEffect(() => {
    (async function () {
      const res = await axios.get(`${baseUrl}/searchText/${username}`);
      if (res.data.data.length > 0) setUser(res.data.data);
      setFollow(res.data.following);
      if (res.data.data.length === 0) setNotfound(true);
    })();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#D3D3D3",
        width: "99vw",
        height: `90vh`,
      }}
    >
      {notfound ? (
        <Typography variant="h3" wrap="true">
          Not Found Any User name {username}
        </Typography>
      ) : (
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            height: "88vh",
            bgcolor: "background.paper",
          }}
        >
          {user.map((Mapuser) => {
            return (
                <ListItem key={Mapuser._id}
                  secondaryAction={
                    Mapuser._id === owner ? (
                      <h3 style={{ color: "gray" }}>you</h3>
                    ) : follow.some((element) => element.user === Mapuser._id) ? (
                      <Button
                        onClick={() => unfollow(Mapuser._id)}
                        variant="outlined"
                      >
                        unFollow
                      </Button>
                    ) : (
                      <Button
                        onClick={() => startfollow(Mapuser._id)}
                        variant="contained"
                      >
                        Follow
                      </Button>
                    )
                  }
                  sx={{ display: "flex" }}
                >
                  <Link
                    to={`/profile/${Mapuser._id}`}
                    style={{ textDecoration: "none", display: "flex" }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <img
                          width="50px"
                          height="50px"
                          alt="no image"
                          src={
                            Mapuser.profilePicUrl
                              ? generatePublicUrl(Mapuser.profilePicUrl)
                              : profile
                          }
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={Mapuser.name} />
                  </Link>
                </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}

export default SearchUser;

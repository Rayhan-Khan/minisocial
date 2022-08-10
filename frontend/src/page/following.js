import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl, generatePublicUrl } from "../utils/baseUrl";
import profile from "./img/profile.png";

 function Following({id,setId}){
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
     useEffect(()=>{
        (async function(){
            try{
             const res=await axios.get(`${baseUrl}/following/${id}`)
             //console.log(res)
             if (res.data.user.length > 0) setUser(res.data.user);
             console.log(res.data.user)
             setFollow(res.data.following);
             
             if (res.data.user.length === 0) setNotfound(true);
            }catch(error){}
           
        })()
    },[]) 

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
              No one Follow..
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
                    <ListItem key={Mapuser.user._id}
                      secondaryAction={
                        Mapuser.user._id === owner ? (
                          <h3 style={{ color: "gray" }}>you</h3>
                        ) : follow.some((element) => element.user === Mapuser.user._id) ? (
                          <Button
                            onClick={() => unfollow(Mapuser.user._id)}
                            variant="outlined"
                          >
                            unFollow
                          </Button>
                        ) : (
                          <Button
                            onClick={() => startfollow(Mapuser.user._id)}
                            variant="contained"
                          >
                            Follow
                          </Button>
                        )
                      }
                      sx={{ display: "flex" }}
                    >
                      <Link
                        style={{ textDecoration: "none", display: "flex" }}
                        to={`/profile/${Mapuser.user._id}`}
                        onClick={()=>setId(Mapuser.user._id)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <img
                              width="50px"
                              height="50px"
                              alt="no image"
                              src={
                                Mapuser.user.profilePicUrl
                                  ? generatePublicUrl(Mapuser.user.profilePicUrl)
                                  : profile
                              }
                            />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={Mapuser.user.name} />
                      </Link>
                    </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      );
}

export default Following;
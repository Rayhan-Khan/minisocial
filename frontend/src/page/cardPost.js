import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import calculateTime from "../utils/calculateTime";
import profile from "./img/profile.png";
import { baseUrl, generatePublicUrl } from "../utils/baseUrl";
import Cookies from "js-cookie";
import axios from "axios";

export default function CardPost({ post }) {
  const [user] = React.useState(Cookies.get("user"));
  const [isLike, setLike] = React.useState(
    post.likes.some((id) => id.user === user)
  );
  const [likelength,setLikeLength]=React.useState(post.likes.length);
  async function addLike(){
    try {
        await axios.post(`${baseUrl}/like/${post._id}`);
        setLike(true);
        setLikeLength(prev=>prev+1);
        
      } catch (error) {}
  }
  async function removeLike(){
     await axios.put(`${baseUrl}/unlike/${post._id}`);
    setLike(false);
    setLikeLength(prev=>prev-1);
  }
  return (
    <Card sx={{ width: 450, mt: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <img
              width="50px"
              height="50px"
              alt="no image"
              src={
                post.user.profilePicUrl
                  ? generatePublicUrl(post.user.profilePicUrl)
                  : profile
              }
            />
          </Avatar>
        }
        title={post.user.name}
        subheader={calculateTime(post.createdAt)}
      />
      {post.picUrl && (
        <CardMedia
          component="img"
          height="auto"
          image={generatePublicUrl(post.picUrl)}
          alt="Paella dish"
        />
      )}
      <CardContent>
        {post.text && (
          <Typography variant="body2" color="text.secondary">
            {post.text}
          </Typography>
        )}
      </CardContent>
      <CardActions disableSpacing>
        {isLike ? (
          <IconButton onClick={removeLike}>
            <FavoriteIcon
              sx={{ width: "50px", height: "50px", color: "red" }}
            />
          </IconButton>
        ) : (
          <IconButton onClick={addLike}>
            <FavoriteIcon sx={{ width: "50px", height: "50px" }} />
          </IconButton>
        )}
        {likelength>0 &&<Typography sx={{color:'gray'}}>{likelength}</Typography>}
      </CardActions>
    </Card>
  );
}

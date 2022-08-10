import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import { Box } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import { baseUrl } from "../utils/baseUrl";
import CircularProgress from "@mui/material/CircularProgress";

function Createpost() {
  const [text, setText] = useState("");
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (!profile && !text) return;
    const formData = new FormData();
    if (profile) {
      formData.append("picUrl", profile);
    }
    if (text) formData.append("text", text);
    try {
        setLoading(true);
      const res = await axios.post(`${baseUrl}/post`, formData);
      if(res.status===201){
        setText("");
         setProfile("");
         setLoading(false);
         
        }
    } catch (error) {console.log(error)}
  }
  return (
    <form onSubmit={submit}>
      <Card sx={{ xs: { width: "100vw" }, width: "50vw", height: 150, mt: 3 }}>
        <textarea
          placeholder="what is your mind"
          style={{ width: "98%", height: 80, resize: "none" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <Box sx={{display:"flex",justifyContent:"center"}}>
          <Button
            sx={{width: "10ch",mr:1 }}
            variant="contained"
            component="label"
            color="success"
          >
            Upload
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => {
                setProfile(e.target.files[0]);
              }}
            />
          </Button>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button sx={{width: "10ch"}} type="submit" variant="contained" color="success">
              Post
            </Button>
          )}
        </Box>
        <p style={{ml:3}}>{profile && " Photo : " + profile.name}</p>
      </Card>
    </form>
  );
}

export default Createpost;

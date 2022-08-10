import { Box } from "@mui/system";
import Createpost from "./createPost";
import DisplayPost from "./displayPost";



function Post(){
    return <>
    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
    <Createpost/>
    <DisplayPost/>
    </Box>
    </>
}

export default Post;
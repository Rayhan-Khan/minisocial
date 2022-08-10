import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CardPost from "./cardPost";
import axios from 'axios';
import { baseUrl } from "../utils/baseUrl";
import React from 'react';


function DisplayPost({profile}) {
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber,setPageNumber]=useState(1);
  const [post,setPost]=useState([]);
  

  useEffect(()=>{
    fetchData();
  },[pageNumber])

  async function fetchData() {
    try{
       if(!profile)
        {const res= await axios.get(`${baseUrl}/all/post`,{ params: {pageNumber}});
        if(res.status===200){
            if(res.data.length>0){
            setPost(prev=>[...prev,...res.data.filter(post=>!prev.some(id=>post._id===id._id))]);
            setPageNumber(prev=>prev+1);
            console.log(pageNumber)
        }
            if(res.data.length===0)
                setHasMore(false)
        }}
        if(profile){
            const res= await axios.get(`${baseUrl}/post/${profile}`);
        if(res.status===200){
            if(res.data.length>0){
            setPost(prev=>[...prev,...res.data.filter(post=>!prev.some(id=>post._id===id._id))]);
            setPageNumber(prev=>prev+1);
            setHasMore(false)    
        }
        }
        }
    }catch(error){}
        
        
  }
  
  return (
    <>
      <InfiniteScroll
        hasMore={hasMore}
        dataLength={post.length}
         //This is important field to render the next data
        next={fetchData}
        loader={<h1>loading...</h1>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        
      >
   { post.map(post=>{return<CardPost key={post._id} post={post}/>})} 
      </InfiniteScroll>
    </>
  );
}

export default DisplayPost;

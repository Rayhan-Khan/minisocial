import { Navigate, Outlet } from "react-router-dom";



const NotLoggedin=function({token}){
    
   return !token?<Outlet/>:<Navigate to='/'/>;
}
export default NotLoggedin;
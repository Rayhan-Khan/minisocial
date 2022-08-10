import axios from 'axios'
axios.defaults.withCredentials = true
export const baseUrl='https://minisocialapp.herokuapp.com/api';
export const loggedin='https://minisocialapp.herokuapp.com';
export const generatePublicUrl=(fileName)=>{
    return `${loggedin}/static/public/${fileName}`;
}
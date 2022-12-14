import axios from 'axios'
axios.defaults.withCredentials = true
/* export const baseUrl='https://minisocialapp.herokuapp.com/api';

export const generatePublicUrl=(fileName)=>{
    return `${loggedin}/static/public/${fileName}`;
} */

export const baseUrl='/api'
export const generatePublicUrl=(fileName)=>{
    return `$/static/public/${fileName}`;
}
import axios from "axios"



export const api = () => {
    console.log("Creating api...");
    const apiAxios = axios.create({
        baseURL:'http://localhost:8000/',
        withCredentials:true,
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withXSRFToken:true
    });
    console.log("Api created successfully...");
    return apiAxios;
}
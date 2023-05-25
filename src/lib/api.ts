import axios from "axios";

export const api = axios.create({
  baseURL: 'http://serverIP:3333' //Put your server IP here
})
import axios from "axios";
import { baseURL } from "../config";
import { message } from "antd";

const api = axios.create({
  baseURL,
});

api.interceptors.response.use((res) => {
  return res.data;
}, error => {
  const errObj = error.response.data
  console.log('error status code', errObj.statusCode)
});

export default api;
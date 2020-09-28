import axios from 'axios'
import {Message, MessageBox} from "element-ui"
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

const service = axios.create({
  baseURL: "/bgData",
  timeout: 20000
});

service.interceptors.request.use(config => {
  return config;
}, error => {
  console.log(error);
  return Promise.reject(error);
});

service.interceptors.response.use(res => {
  const code = res.status;
  if (code !== 200) {
    Message({
      type: "error",
      message: res.statusText
    });
  } else {
    return res.data;
  }
}, error => {
  Message({
    type: "error",
    message: error
  });
  return Promise.reject(error);
});

export default service;

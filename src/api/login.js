import request from '../util/request'

export function doLogin(form){
  return request({
    url: "/login",
    type: "POST",
    data: form
  });
}

import request from '../../util/request'

export function getIcons(){
  return request({
    url: "/icon",
    method: "GET"
  });
}

import request from '../../util/request'
import {confirmBeforeRemove} from "../../util/callbackUtil";

export function getBannerList(form){
  return request({
    url: '/banner/getBannerList',
    method: 'get',
    params: form
  })
}

export function saveBanner(form){
  return request({
    url: '/banner/saveBanner',
    method: 'post',
    data: form
  })
}

export function delBanner(id){
  confirmBeforeRemove({url: `/banner/delBanner/${id}`, method: 'delete'}, arguments[1], arguments[2]);
}

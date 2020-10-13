import request from '../../util/request'
import {confirmBeforeRemove} from "../../util/callbackUtil";
const prefix = '/partner';

export function getPartnerList(form){
  return request({
    url: `${prefix}/getPartnerList`,
    method: 'get',
    params: form
  })
}

export function savePartner(form){
  return request({
    url: `${prefix}/save`,
    method: 'post',
    data: form
  })
}

export function removePartner(id){
  const option = {
    url: `${prefix}/remove/${id}`,
    method: 'delete'
  }
  confirmBeforeRemove(option, arguments[1], arguments[2])
}

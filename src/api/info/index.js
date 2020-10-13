import request from '../../util/request'
import {confirmBeforeRemove} from "../../util/callbackUtil";

const prefix = '/group/info';

export function getGroupInfoList(form) {
  return request({
    url: `${prefix}/getGroupInfoList`,
    method: 'get',
    params: form
  })
}

export function saveGroupInfo(form) {
  return request({
    url: `${prefix}/save`,
    method: 'post',
    data: form
  })
}

export function removeGroupInfo(id) {
  const option = {
    url: `${prefix}/remove/${id}`,
    method: 'delete'
  };
  confirmBeforeRemove(option, arguments[1], arguments[2]);
}

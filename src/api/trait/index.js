import request from '../../util/request'
import {confirmBeforeRemove} from "../../util/callbackUtil";

export function getTraitList(form) {
  return request({
    url: '/trait/getTraitList',
    method: 'get',
    params: form
  })
}

export function saveTrait(form) {
  return request({
    url: '/trait/save',
    method: 'post',
    data: form
  })
}

export function removeTrait(id) {
  confirmBeforeRemove({url: `/trait/remove/${id}`, method: 'delete'}, arguments[1], arguments[2]);
}

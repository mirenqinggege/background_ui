import request from '../../util/request'
import {MessageBox} from "element-ui";
import {ajaxCallback} from "../../util/callbackUtil";

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
  MessageBox({
    type: 'warning',
    message: '确定要删除吗（此操作无法恢复）',
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消'
  }).then(() => {
    request({url: `/banner/delBanner/${id}`, method: 'delete'}).then(res => {
      ajaxCallback(res);
    });
  })
}

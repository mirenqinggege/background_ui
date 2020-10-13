import {MessageBox, Message} from "element-ui"
import request from './request'

export function ajaxCallback(res, sFun, eFun) {
  if (res.code === "00000") {
    Message.success(res.message);
    if (sFun) {
      sFun();
    }
  } else {
    Message.error(res.message);
    if (eFun) {
      eFun();
    }
  }
}

/**
 * @param requestConfig {Object} axios请求设置
 * @param sFun {function} 成功回调
 * @param eFun {function} 失败回调
 */
export function confirmBeforeRemove(requestConfig,sFun, eFun) {
  MessageBox({
    type: 'warning',
    message: '确定要删除吗（此操作无法恢复）',
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消'
  }).then(() => {
    request(requestConfig).then(res => {
      ajaxCallback(res, sFun, eFun);
    })
  });
}

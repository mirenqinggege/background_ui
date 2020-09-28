import {MessageBox, Message} from "element-ui"

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

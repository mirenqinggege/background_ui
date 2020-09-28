import request from "../../util/request"


export function getDictTypeList(form){
  return request({
    url: "/dict/getDictTypeList",
    method: "get",
    params: form
  });
}

export function getDictDataList(dictType){
  return request({
    url: `/dict/getDictDataList/${dictType}`,
    method: "get"
  })
}

export function dictTypeSave(form){
  return request({
    url: "/dict/dictTypeSave",
    method: "post",
    data: form
  })
}

export function dictTypeRemove(id){
  return request({
    url: `/dict/dictTypeRemove/${id}`,
    method: "delete"
  })
}


export function dictDataSave(form){
  return request({
    url: "/dict/dictDataSave",
    method: "post",
    data: form
  })
}

export function dictDataRemove(id){
  return request({
    url: `/dict/dictDataRemove/${id}`,
    method: "delete"
  })
}

/**
 *
 * @param dictDataList {Array} 字典数据列表
 * @param value {string} 值
 * @return 字典标签
 */
export function dictFormatter(dictDataList, value){
  let result = "-";
  dictDataList.forEach(value1 => {
    if(result !== "-"){
      return;
    }
    if (value1.value === value) {
      result = value1.label;
    }
  });
  return result;
}

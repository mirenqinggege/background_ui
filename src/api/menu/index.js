import request from '../../util/request'


export function getTreeMenu(form) {
  return request({
    url: `/menu/init`,
    method: "get",
    params: form
  });
}

export function getRootMenus() {
  return request({
    url: "/menu/getRootMenus",
    method: "get"
  })
}

export function searchMenus(form) {
  return request({
    url: "/menu/getMenus",
    method: "get",
    params: form
  })
}

export function getMenuInfo(id) {
  return request({
    url: `/menu/getMenuInfo?menuId=${id}`,
    method: "get"
  });
}

export function save(form) {
  return request({
    url: "/menu/save",
    method: "post",
    data: form
  });
}

export function getRoutes() {
  return request({
    url: "/menu/getRoutes",
    method: "get"
  });
}

export function remove(id){
  return request({
    url: `/menu/deleteById/${id}`,
    method: "delete"
  })
}

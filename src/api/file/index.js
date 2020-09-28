import request from '../../util/request'

export function fileUpload(form) {
  const formData = new FormData();
  formData.append("file", form);
  return request({
    url: '/file/upload',
    method: 'post',
    data: formData
  })
}

export function getFileInfoById(id){
  return request({
    url: `/file/getFileInfo/${id}`,
    method: 'get'
  });
}

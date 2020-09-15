import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/demo/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/demo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/demo/pv',
    method: 'get',
    params: {
      pv
    }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/demo/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/demo/update',
    method: 'post',
    data
  })
}
export function deleteArticle(data) {
  return request({
    url: '/vue-element-admin/demo/delete',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/miniprogram/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/miniprogram/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/miniprogram/user/logout',
    method: 'post'
  })
}

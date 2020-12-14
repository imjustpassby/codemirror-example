import request from '@/utils/request'

export function postSql(data) {
  return request({
    url: '/api/postSql',
    method: 'POST',
    data
  })
}

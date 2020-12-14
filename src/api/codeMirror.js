import request from '@/utils/request'

export function postSql(data) {
  return request({
    url: '/postSql',
    method: 'POST',
    data
  })
}

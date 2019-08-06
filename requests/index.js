
const BASE_URL = 'http://rap2api.taobao.org/app/mock/165048'
const get = (URL) => {
  wx.showLoading({
    title: '加载中...',
    mask: true,
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + URL,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        wx.hideLoading()//此处为showLoading的结束函数,两个必须配对使用
      },
    })
  })
}
export const getList = () => {
  return get('/api/xinhai')
}
export const hotList = () => {
  return get('/api/remen')
}
export const removeList = () => {
  return get('/aa/ai/ac')
}
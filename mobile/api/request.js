let API_BASE_URL
// #ifdef H5
API_BASE_URL = 'http://localhost:3000'
// #endif
// #ifndef H5
API_BASE_URL = 'http://192.168.1.8:3000'
// #endif

export function request(path, options = {}) {
  const token = uni.getStorageSync('token')
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${path}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {}),
      },
      success: (response) => {
        const result = response.data
        if (!result || typeof result !== 'object') {
          reject(new Error('接口返回格式异常'))
          return
        }
        if (response.statusCode === 401 || result.code === 401) {
          uni.showToast({ title: '请先登录', icon: 'none' })
          uni.navigateTo({ url: '/pages/login/index' })
          reject(result)
          return
        }
        if (result.code !== 0) {
          uni.showToast({ title: result.message || '请求失败', icon: 'none' })
          reject(result)
          return
        }
        resolve(result.data)
      },
      fail: (error) => {
        reject(error)
      },
    })
  })
}

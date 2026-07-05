export function isMobilePhone(value) {
  return /^1[3-9]\d{9}$/.test(value)
}

export function required(message) {
  return { required: true, message, trigger: 'blur' }
}

export function phoneRule() {
  return {
    validator: (_rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
        return
      }
      if (!isMobilePhone(value)) {
        callback(new Error('请输入正确的手机号'))
        return
      }
      callback()
    },
    trigger: 'blur',
  }
}

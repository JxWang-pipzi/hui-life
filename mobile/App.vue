<script>
export default {
  onLaunch() {
    uni.setStorageSync('appLaunchAt', Date.now())
    // #ifdef APP-PLUS
    // App 端本地资源在 WebView 中使用 _www 前缀，直接写 /static 容易加载失败。
    uni.loadFontFace({
      family: 'uniicons',
      source: "url('_www/static/uniicons.ttf')",
      global: true,
      success() {
        console.log('[成功][字体加载] uniicons 字体加载成功')
      },
      fail(err) {
        console.log('[失败][字体加载] uniicons 字体加载失败', err)
      },
    })
    // #endif
  },
}
</script>

<style lang="scss">
@font-face {
  font-family: uniicons;
  src: url('/static/uniicons.ttf');
}

page {
  min-height: 100%;
  color: #1f2937;
  background: #f5f7fb;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.page {
  min-height: 100vh;
  padding: 24rpx;
}

.card {
  padding: 28rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.06);
}

.muted {
  color: #6b7280;
}

.primary-button {
  color: #fff;
  background: #1f7a5c;
  border-radius: 999rpx;
}
</style>

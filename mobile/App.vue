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
  color: #0f172a;
  background: #f1f5f9;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.page {
  min-height: 100vh;
  padding: 24rpx 24rpx calc(32rpx + env(safe-area-inset-bottom));
}

.card {
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.96);
  border: 1rpx solid rgba(148, 163, 184, 0.2);
  border-radius: 24rpx;
  box-shadow: 0 14rpx 40rpx rgba(15, 23, 42, 0.07);
}

.muted {
  color: #6b7280;
}

.primary-button {
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  border-radius: 18rpx;
  box-shadow: 0 12rpx 28rpx rgba(15, 118, 110, 0.22);
}

.primary-button::after {
  border: 0;
}

button {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

button:active {
  opacity: 0.84;
  transform: scale(0.98);
}
</style>

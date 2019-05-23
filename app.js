//app.js
App({
  // domain: 'http://192.168.1.212:8888/s',       //本地
  // domain: 'http://tmobile.beibeiyue.cn/s',  //83
  domain: 'https://fuli.haochengzhang.com/s',        //线上
  // domain_clue: 'http://192.168.1.110:8090/customerDetail/checkNoVerifyNum',
  domain_clue: 'https://sale.haochengzhang.com/kb/customerDetail/checkNoVerifyNum',
  /* ------------- ------------- 全局数据存储 -------------------------- */
  globalData: {
    userOpenid: null,
    userLocation: null,
    userAddress: null
  },
  userInfo: {
    loginMsg:'',              //用户是否登录
    openid: '',               // 用户唯一标识
    member:'',                //当前用户是否是会员
    memberId: 1426794,        //会员账户
    status:null,              //当前是否绑定手机,0:未绑定，1已绑定
    babyMsgStatus:null,       //是否完善宝宝信息
    phone:null,               //绑定手机号
    address:null,             //地址信息
    city:null,                //当前城市
    lng:null,                 //当前经纬度
    lat:null
  },
  onLaunch() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})
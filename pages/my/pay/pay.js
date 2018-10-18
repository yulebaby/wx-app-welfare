const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellPrice: '',
    subbranchId:'',
    productId:'',
    orderId:'',
    payBtn:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ 
      sellPrice: options.sellPrice,
      subbranchId: options.subbranchId,
      productId: options.productId
    })
  },

  pay(){
    let that = this;
    wx.showLoading({
      mask:true
    })
    if (this.data.payBtn){
      console.log(1121251)
      this.setData({ payBtn :false})
      Http.get('/payOrderReturnCode', { openId: app.userInfo.openid, subbranchId: that.data.subbranchId, productId: that.data.productId }).then(res => {
        if (res.result == 0) {
          console.log(res);
          this.setData({ orderId: res.data.orderId })
          wx.requestPayment({
            'timeStamp': String(res.data.timeStamp),
            'nonceStr': res.data.nonceStr,
            'package': res.data.packages,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log('成功')
              that.setData({ payBtn: true })
              Http.get('/welfarePayIsSuccess', { orderId: that.data.orderId }).then(res => {
                console.log('支付完毕')
                console.log(res)
                if (res.result == 0) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '支付成功',
                    icon: 'succes',
                    duration: 1000,
                    mask: true
                  })
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../my-exchange/exchange-detail/exchange-detail?orderId=' + that.data.orderId + '&origin=buy',
                    })
                  }, 1000)
                } else {
                  wx.hideLoading();
                  wx.showModal({
                    // title: '提示',
                    content: '支付失败',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else {
                        console.log('用户点击取消')
                      }

                    }
                  })
                }
                wx.hideLoading();
              }, _ => {
                wx.hideLoading();
              });
            },
            'fail': function (res) {
              console.log('失败');
              wx.hideLoading();
              that.setData({ payBtn: true })
              Http.get('/welfarePayIsSuccess', { orderId: that.data.orderId }).then(res => {
                console.log('支付完毕')
                console.log(res)
                if (res.result == 0) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '支付成功',
                    icon: 'succes',
                    duration: 1000,
                    mask: true
                  })
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../my-exchange/exchange-detail/exchange-detail?orderId=' + that.data.orderId + '&origin=buy',
                    })
                  }, 1000)
                } else {
                  wx.hideLoading();
                  wx.showModal({
                    // title: '提示',
                    content: '支付失败',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else {
                        console.log('用户点击取消')
                      }

                    }
                  })
                }
                wx.hideLoading();
              }, _ => {
                wx.hideLoading();
              });
            },
            'complete': function (res) {
              console.log('执行')
            }
          })


          // wx.showToast({
          //   title: '购买成功',
          //   icon: 'succes',
          //   duration: 1000,
          //   mask: true
          // })

        }
        wx.hideLoading();
      }, _ => {
        wx.hideLoading();
      });
    }
    
  }
})
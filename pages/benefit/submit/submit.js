const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayType:'',
    mobilePhone:'',
    subbranchId:'',
    productId:'',
    orderId:'',
    storeMsg:{},
    courseMsg:{},
    userMsg:{},
    distance:'',
    exchangeSuccess:false,
    residueCount:'',
    orChange:true,
    limit_click: 'auto'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ 
      displayType: options.type,
      subbranchId: options.selectedStore,
      productId: options.productId
    })
    this.getMsg()
  },

  getMsg() {
    let that=this;
    Http.post('/showOrder', { openId: app.userInfo.openid, subbranchId: that.data.subbranchId, productId: that.data.productId ,lng:app.userInfo.lng,lat:app.userInfo.lat}).then(res => {
      if (res.result == 0 ) {
        console.log(res)
        console.log()
        if (res.distance > 1000) {
          res.distance = (res.distance / 1000).toFixed(1) + "km";
        } else {
          res.distance = parseInt(res.distance) + "m";
        }
        this.setData({ 
          distance: res.distance,
          mobilePhone: res.mobilePhone,
          storeMsg: res.subbranchContent[0],
          courseMsg: res.productContent[0],
          userMsg: res.content
        })
      }
      wx.hideLoading();
    }, _ => {
      wx.hideLoading();
    });
  },
  exchange(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this;
    if (this.data.orChange){
      console.log(1)
      this.setData({ orChange: false });
      Http.get('/saveOrder', { subbranchId: that.data.subbranchId, openId: app.userInfo.openid, productId: that.data.productId }).then(res => {
        if (res.result == 0) {
          console.log(res)
          that.setData({
            orderId: res.orderId,
            residueCount: res.residueCount,
            exchangeSuccess: true,
            orChange: true
          });
          console.log(that.data.orderId)
          wx.hideLoading();
        } else {
          this.setData({ orChange: true });
          wx.hideLoading();
          wx.showModal({
            // title: '提示',
            content: '兑换失败',
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

      }, _ => {
        wx.hideLoading();
      });
    }
    
    
  },
  buy(){
    this.setData({ limit_click: 'none' })
    setTimeout(function () {
      this.setData({ limit_click: 'auto' })
    }, 1500)
  },
  know(){
    let that =this;
    console.log(11111)
    this.setData({ exchangeSuccess: false })
    setTimeout(function () {
      console.log(that.data.orderId)
      wx.navigateTo({
        url: '../../my/my-exchange/exchange-detail/exchange-detail?orderId=' + that.data.orderId +'&origin=exchange'
      })
    }, 200)
  }
})
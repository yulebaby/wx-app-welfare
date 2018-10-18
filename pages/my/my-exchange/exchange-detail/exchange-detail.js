const app = getApp();
const Http = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    origin:'',
    detailMsg:{},
    orderId:'' ,
    member:app.userInfo.member,
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ orderId: options.orderId})
    if (options.origin){
      this.setData({ origin: options.origin })
    }
    this.getMsg();
  },
  onUnload:function(){
    if (this.data.origin == 'buy'){
      wx.navigateTo({
        url: '../my-exchange/exchange-list/exchange-list',
      })
    } else if (this.data.origin == 'exchange'){
      wx.navigateTo({
        url: '../../my/my-exchange/exchange-list/exchange-list',
      })
    }
    
  },
  getMsg() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that=this;
    Http.post('/orderDetail', { openId: app.userInfo.openid, orderId: that.data.orderId,lng:app.userInfo.lng,lat:app.userInfo.lat}).then(res => {
      if (res.result == 0) {
        console.log(res)
        if (res.productList[0].distance > 1000) {
          res.productList[0].distance = (res.productList[0].distance / 1000).toFixed(1) + "km";
        } else {
          res.productList[0].distance = parseInt(res.productList[0].distance) + "m";
        }
        this.setData({
          detailMsg: res.productList[0]
        })
      }
      wx.hideLoading();
    }, _ => {
      wx.hideLoading();
    });
  },
  tel(event) {
    console.log(event.currentTarget.id)
    this.setData({ phone: event.currentTarget.id})
    let that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone , //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /*　导航　*/
  mapclick(event) {
    console.log(event.currentTarget.dataset)
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude;
        wx.openLocation({
          latitude: Number(event.currentTarget.dataset.lat),
          longitude: Number(event.currentTarget.dataset.lng),
          name: event.currentTarget.dataset.storename,
          address: event.currentTarget.dataset.address,
          scale: 28
        })
      }
    })
  }
})
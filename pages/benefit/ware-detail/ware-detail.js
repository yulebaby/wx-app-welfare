var WxParse = require('../../../wxParse/wxParse.js');
const app=getApp();
const Http = require('../../../utils/request.js');
const getAddress = require('../../../utils/getAddress.js');
const getUserInfo = require('../../../utils/getUserInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperArray: [],
    wareMsg:'',
    storeMsg:'',
    productId:null,
    display:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('福利详情')
    console.log(options)
    if(options.origin == 'app'){
      this.setData({
        display: 'detail',
        productId: options.productId
      })
      getUserInfo.login(options.phone, loginMsg => {
        wx.showLoading({ title: '加载中...', mask: true });
        console.log('获取信息成功')
        console.log(loginMsg)
        this.getaddressIndex();
      })
    }else{
      if (options.id.indexOf('http') == -1) {
        this.setData({
          display: 'detail',
          productId: options.id
        })
        this.wareDetail()
        console.log(options.id)
      } else {
        this.setData({
          display: 'h5',
          productId: options.id
        })
      }
    }
    
  },
  /* ------------------- 获取用户地理位置信息 ------------------- */
  getaddressIndex() {
    getAddress(address => {
      console.log(address)
      app.userInfo.address = address;
      app.userInfo.city = address.address_component.city;
      app.userInfo.lng = address.location.lng;
      app.userInfo.lat = address.location.lat;
      this.wareDetail()
      wx.hideLoading();
    })
  },

  wareDetail(){
    // 商品详情
    var that=this;
    Http.post('/commercialProductDetail', { openId: app.userInfo.openid, cityName: app.userInfo.city,  productId: that.data.productId, lng: app.userInfo.lng, lat: app.userInfo.lat, different: 'detail' }).then(res => {
      wx.hideLoading();
      if (res.result == 0 && res.productContent){
        //富文本转换
        // res.productContent[0].brandDesc = res.productContent[0].brandDesc.replace(/(<\/?spanyes.*?>)/g, '');
        // var reg = /style\s*?=\s*?([‘"])[\s\S]*?\1/;
        // var article = res.productContent[0].brandDesc;//article是取到的数据
        // article = article.replace(/<style(([\s\S])*?)<\/style>/g, '');
        // article = article.replace(reg, '');
        // WxParse.wxParse('article', 'html', article, that, 5);

        res.productContent[0].carouselPic = res.productContent[0].carouselPic.split(",");
        res.productContent[0].intro = res.productContent[0].intro.split(",");
        if (res.subbranchList[0].distance>1000){
          res.subbranchList[0].distance = (res.subbranchList[0].distance / 1000).toFixed(1) + "km";
        }else{
          res.subbranchList[0].distance = parseInt(res.subbranchList[0].distance) + "m";
        }
        this.setData({ 
          swiperArray: res.productContent[0].carouselPic,
          wareMsg: res.productContent[0],
          storeMsg: res.subbranchList
        })

        //富文本转换
        var article1 = that.data.wareMsg.ruleContent//article是取到的数据
        WxParse.wxParse('article1', 'html', article1, that, 5);
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  /*会员即可兑换*/
  exchange(){
    wx.navigateTo({
      url: '../store-list/store-list?type=exchange&productId=' + this.data.productId,
    })
    // if (app.userInfo.member){
    //   wx.navigateTo({
    //     url: '../store-list/store-list?type=exchange&productId=' + this.data.productId,
    //   })
    // }else{
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '刷卡兑换仅针对鱼乐贝贝门店会员,您可以到门店体验办卡',
    //     confirmColor:'#000' ,
    //     confirmText: '确定',
    //     showCancel: false,
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else {
    //         console.log('用户点击取消')
    //       }

    //     }
    //   })
    // }
  },
  buy(){
    wx.navigateTo({
      url: '../store-list/store-list?type=buy&productId=' + this.data.productId,
    })
  },
  tel(){
    wx.makePhoneCall({
      phoneNumber: '40091827901', //此号码并非真实电话号码，仅用于测试
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

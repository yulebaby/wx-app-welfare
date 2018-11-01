const app=getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayType:'',
    productId:'',
    wareMsg:'',
    storeMsg:'',
    selectNo:false,
    orselect: 1000,
    selectedStore:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ 
      displayType:options.type,
      productId: options.productId
    })
    this.storeList();
  },

  storeList(){
    let that=this;
    // 门店列表
    Http.post('/commercialProductDetail', { openId: app.userInfo.openid, cityName: app.userInfo.city, productId: that.data.productId, lng: app.userInfo.lng, lat: app.userInfo.lat, different: 'list' }).then(res => {
      wx.hideLoading();
      if(res.result==0){
        for (var i = 0; i < res.subbranchList.length;i++){
          if (res.subbranchList[i].distance > 1000) {
            res.subbranchList[i].distance = (res.subbranchList[i].distance / 1000).toFixed(1) + "km";
          } else {
            res.subbranchList[i].distance = parseInt(res.subbranchList[i].distance) + "m";
          }
        }
        this.setData({
          wareMsg: res.productContent[0],
          storeMsg : res.subbranchList
        })
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  selectStore(event){
    console.log(event.currentTarget.dataset.index)
    console.log(event.currentTarget.id)
    this.setData({
      selectNo:true,
      orselect: event.currentTarget.dataset.index,
      selectedStore: event.currentTarget.id
    })
  },
  submitStore(event){
    if (event.target.id == 'exchange'){
      if (app.userInfo.member == 1) {
        this.submit(event.target.id)
      } else if (app.userInfo.member == 0){
        wx.showModal({
          title: '温馨提示',
          content: '刷卡兑换仅针对鱼乐贝贝门店会员,您可以到门店体验办卡',
          confirmColor: '#000',
          confirmText: '确定',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else {
              console.log('用户点击取消')
            }

          }
        })
      }else{
        wx.navigateTo({
          url: '../../my/bind-phone/bind-phone',
        })
      }
    }else{
      this.submit(event.target.id)
    }
  },
  submit(payType){
    if (app.userInfo.member == 1 || app.userInfo.status == 1) {
      if (this.data.selectNo) {
        wx.navigateTo({
          url: '../submit/submit?type=' + payType + '&selectedStore=' + this.data.selectedStore + '&productId=' + this.data.productId,
        })
      } else {
        wx.showModal({
          // title: '提示',
          content: '请选择门店',
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
      
    } else {
      wx.navigateTo({
        url: '../../my/bind-phone/bind-phone',
      })
    }
    
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
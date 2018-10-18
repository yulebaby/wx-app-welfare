const app = getApp();
const getAddress = require('../../utils/getAddress.js');
const Http = require('../../utils/request.js');
const getUserInfo = require('../../utils/getUserInfo.js');
Page({
  data: {
    swiperArray: [],
    wareType: [],
    typeNow: 'RECOMMEND',
    wareList: '',
    cityList: [],
    cityName: '',
    index: 0,
    selectCity: '',
    chiefStatus: true
  },
  onLoad: function (options) {
    console.log('获取电话号码')
    console.log(options)
    getUserInfo.login(options.phone , loginMsg =>{
      wx.showLoading({ title: '加载中...', mask: true });
      console.log('获取信息成功')
      console.log(loginMsg)
      this.getaddressIndex();
    })
  },
  /* ------------------- 获取用户地理位置信息 ------------------- */
  getaddressIndex() {
    getAddress(address => {
      console.log(address)
      app.userInfo.address = address;
      app.userInfo.city = address.address_component.city;
      app.userInfo.lng = address.location.lng;
      app.userInfo.lat = address.location.lat;
      this.wareType();
      this.getBanner();
      this.cutType();
      wx.hideLoading();
    })
  },

  /*进入商品详情*/
  goToDetail: function (event) {
    wx.navigateTo({
      url: '../benefit/ware-detail/ware-detail?id=' + event.target.id
    })
  },
  /*获取banner*/
  getBanner() {
    let that = this;
    console.log(that.data.cityName)
    Http.post('/welfareBanner', { cityName: that.data.cityName }).then(res => {
      if (res.result == 0 && res.bannerList) {
        this.setData({ swiperArray: res.bannerList })
      }
      wx.hideLoading();
    }, _ => {
      wx.hideLoading();
    });
  },
  /*-获取类型*/
  wareType() {
    Http.post('/welfareProductType').then(res => {
      if (res.result == 0 && res.welfareProductTypeList) {
        let cityList = [];
        for (var i = 0; i < res.welfareJoinCityList.length; i++) {
          cityList.push(res.welfareJoinCityList[i].cityName);
        }
        this.setData({
          wareType: res.welfareProductTypeList,
          cityList: cityList
        })
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  bindPickerChange(e) {
    console.log(e.detail.value)
    this.setData({ index: e.detail.value })
    this.cutCity();
  },
  /*商品列表*/
  cutType(event) {
    if (event) {
      this.setData({ typeNow: event.target.id });
      this.wareList();
    } else {
      this.wareList();
    }
  },
  wareList(cutCityName) {
    console.log('刷新数据')
    let that = this;
    var alreadySelectedCity;
    if (cutCityName) {
      alreadySelectedCity = cutCityName;
      that.data.typeNow = 'RECOMMEND';
      that.cutType();
    } else {
      alreadySelectedCity = app.userInfo.city;
    }
    Http.post('/commercialProductList', { openId: app.userInfo.openid, cityName: alreadySelectedCity, lng: app.userInfo.lng, lat: app.userInfo.lat, productType: that.data.typeNow }).then(res => {
      console.log('成功获取数据')
      if (res.result == 0 && res.commercialProductResult) {
        wx.hideLoading();
        console.log(res.commercialProductResult.commercialProductResult)
        var unBuy = res.commercialProductResult.commercialProductResult;
        var buy = res.commercialProductResult.usedProductList;
        var allWarelist = unBuy.concat(buy);
        for (var i = 0; i < allWarelist.length; i++) {
          allWarelist[i].intro = allWarelist[i].intro.split(',')
        }
        console.log(allWarelist)
        this.setData({ wareList: allWarelist })
        wx.hideLoading();
      }

    }, _ => {
      wx.hideLoading();
    });
  },
  /*切换城市*/
  cutCity() {
    this.setData({
      typeNow: 'RECOMMEND',
      cityName: this.data.cityList[this.data.index]
    })
    app.userInfo.city = this.data.cityList[this.data.index];
    this.wareList(this.data.cityList[this.data.index]);
    this.getBanner();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.wareType();
    this.getBanner();
    this.cutType();
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //关闭首席测评
  closeChief(){
    this.setData({ chiefStatus :false});
  }


})
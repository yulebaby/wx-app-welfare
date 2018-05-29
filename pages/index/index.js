const App = getApp();
const format = require('./../..//utils/util.js');
const GetInfo = require('./../../utils/getinfo.js');
const Http = require('./../../utils/request.js');

Page({
  data: {
    showModal: null,                     // 是否显示弹出层
    groupInfo: null,                     // 团信息   
    groupId  : '',                       // 分享的团Id
    location : {},
    shopInfo : null,
    phone: ''
  },

  onLoad: function (options) {
    if (options.groupId) {
      this.setData({ groupId: options.groupId });
    }

    wx.showLoading({ title: '加载中...' });

    /* ----------------- 根据 openId 查询参团信息 ----------------- */
    GetInfo.getOpenId().then( user => {
      GetInfo.getAddress(location => {
        this.setData({ location });
        let params = Object.assign(location, user);
        Http.post(`/showShopDistance`, { paramJson: JSON.stringify(params) }).then(stores => {
          this.setData({ shopInfo: stores.result });
        });
        Http.post(`/loogGroup/${JSON.stringify({ openId: user.openId, groupId: this.data.groupId })}`).then(group => {
          wx.hideLoading();
          this.setData({groupInfo: group.result})
        })
      });
    });
    

  },

  onReady() {
    
  },

  /* ----------------- 提交信息参团 ----------------- */
  formSubmit(e) {
    let params = e.detail.value;
    params.formId = e.detail.formId;
    let [ nameReg, phoneReg ] = [ /^[\u0391-\uFFE5A-Za-z]{2,30}$/, /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/ ];
    if (!nameReg.test(params.name)) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    if (!phoneReg.test(params.mobilePhone)) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    wx.showLoading({
      title: '信息提交中...',
      mask: true
    });

    params.openId = App.globalData.openId;
    params.longitude = this.data.location.longitude;
    params.latitude = this.data.location.latitude;
    params.storeId = this.data.shopInfo.id;
    if (this.data.groupId) { params.groupId = this.data.groupId; }
    Http.post(`/addGroupMember`, { paramJson: JSON.stringify(params) }).then( res => {
      wx.hideLoading();
      if (res.success) {
        /* ------------- 参团成功 ------------- */
        this.setData({ showModal: res.success ? 'group' : null, groupInfo: res.result });
      } else {
        /* -------- 用户距离太远无法参加 -------- */
        this.setData({ showModal: 'distance' });
      }
    }, err => {
      wx.hideLoading();
    });
    
  },
  /* ---------------- 获取用户电话号码 ---------------- */
  getPhoneNumber(e) {
    let params = Object.assign(e.detail, App.globalData);
    Http.post(`/decodeUserInfo`, { paramJson: encodeURIComponent(JSON.stringify(params)) }).then(res => {
      this.setData({ phone: res.success ? res.result.purePhoneNumber : '' });
    });
  },
  /* ---------------- 显示/关闭弹出层 ---------------- */
  showModal(e) {
    let type = e.target.dataset.type || null
    this.setData({ showModal: type });
  },
  closeModal() {
    this.setData({ showModal: null });
  },
  /* -------------------- 分享 -------------------- */
  onShareAppMessage: function (res) {
    let _this = this;
    return {
      title: '参团免费领礼包，快来参加吧',
      path: `pages/index/index?groupId=${this.data.groupInfo.groupId || this.data.groupId}`,
      imageUrl: 'https://ylbb-wxapp.oss-cn-beijing.aliyuncs.com/activity/share.jpg',
      success(res) {
        _this.setData({ showModal: null });
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
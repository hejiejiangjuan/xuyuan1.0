//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '请点击授权',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShow:false,
    isLogin:false
  },

  onLoad: function () {
  var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../index/index'
        })
      }, 1)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          isShow: false
        })
        wx.request({
          url: app.globalData.base_url + 'wxUser/dologin',
          method: 'POST',
          data: {
            userInfo: encodeURI(res.rawData),
            openId: app.globalData.openId
          },
          header: app.globalData.header,
          success(res) {
            app.globalData.userInfo = res.data.datas;
            wx.setStorageSync('isLogin', true);
            setTimeout(function () {
              wx.switchTab({
                url: '../index/index'
              })
            }, 1)
          }
        })
        // this.setData({
        //   userInfo: res.data.datas,
        //   hasUserInfo: true
        // })
        
      }
     
      
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      app.mygetUserInfo();
    }
  },
  onReady:function(){
    var that = this;
    setTimeout(function () {
      that.setData({
        isShow: true
      })
    }, 1000)
  },
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  //   setTimeout(function () {
  //     wx.switchTab({
  //       url: '../index/index'
  //     })
  //   }, 1)
  // },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
          wx.request({
            url: app.globalData.base_url + 'wxUser/dologin',
            method: 'POST',
            data: {
              userInfo: encodeURI(e.detail.rawData),
              openId: app.globalData.openId
            },
            header: app.globalData.header,
            success(res) {
              app.globalData.userInfo = res.data.datas;
              if (res.data.datas) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1)
              }
            }
          })
      // wx.getUserInfo({
      //   success: res => {
      //     // 可以将 res 发送给后台解码出 unionId
      //     // this.globalData.userInfo = res.userInfo
      //     // // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      //     // // 所以此处加入 callback 以防止这种情况
      //     // if (this.userInfoReadyCallback) {
      //     //   this.userInfoReadyCallback(res)
      //     // }
      //   }
      // })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
})

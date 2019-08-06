//app.js
var aldstat = require("./utils/ald-stat.js");
App({
  onLaunch: function() {
    // 展示本地存储能力
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.systemInfo = res;
      },
    })
    this.util = require('./utils/util.js');
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs) 
    // 判断用户是否已存在，存在直接登录后台
    // var p = this.myLogin();
    // console.log(p)
  },
  myLogin(){
    var that = this;
    var p = new Promise(function(resolve,reject){
      var storageOpenId = wx.getStorageSync('openId');
      
      var userInfoStr = wx.getStorageSync('userInfoStr');
      if (storageOpenId && userInfoStr) {
        wx.request({
          url: that.globalData.base_url + 'wxUser/dologin',
          method: 'POST',
          data: {
            userInfo: encodeURI(userInfoStr),
            openId: storageOpenId
          },
          success(res) {
            
            that.globalData.openId = storageOpenId;
            that.globalData.userInfo = res.data.datas.wxUser;
            that.globalData.sessionId = res.data.datas.sessionId;
            that.globalData.header = {
              'content-type': 'application/json',
              'Cookie': 'JSESSIONID=' + that.globalData.sessionId,
              'openid': storageOpenId
            }
            resolve(that.globalData.header)
          }
        })
      } else {
        // 从微信获取数据登录
        wx.login({
          success: res => {
            
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var code = res.code;
            wx.request({
              url: that.globalData.base_url + 'wxUser/getOpenId',
              method: 'POST',
              data: {
                code: code,
                appid: that.globalData.appid
              },
              success(res) {
                
                that.globalData.openId = res.data.datas.openId;
                wx.setStorageSync('openId', that.globalData.openId);
                that.globalData.sessionId = res.data.datas.sessionId;
                that.globalData.header = {
                  'content-type': 'application/json',
                  'Cookie': 'JSESSIONID=' + that.globalData.sessionId,
                  'openid': that.globalData.openId
                }
                resolve(that.mygetUserInfo())
              }
            })
          }
        })
      }
    })
    return p;
  },
  mygetUserInfo() {
    var that = this;
    // 获取用户信息
    var p = new Promise(function(resolve,reject){
      wx.getSetting({
        success: res => {
          
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                // that.globalData.userInfo = res.userInfo
                var userInfoStr = res.rawData;
                wx.request({
                  url: that.globalData.base_url + 'wxUser/dologin',
                  method: 'POST',
                  data: {
                    userInfo: encodeURI(res.rawData),
                    openId: that.globalData.openId
                  },
                  header: that.globalData.header,
                  success(res) {
                    
                    that.globalData.userInfo = res.data.datas.wxUser;
                    wx.setStorageSync('userInfoStr', userInfoStr);
                    resolve('获取用户信息成功')
                  }
                })
              }
            })
          } else {
            
            var pages = getCurrentPages()    //获取加载的页面
            var currentPage = pages[pages.length - 1]    //获取当前页面的对象
            currentPage.setData({
              showModal: !currentPage.data.showModal
            })
            wx.hideTabBar({
              fail: function () {
                setTimeout(function () {
                  wx.hideTabBar()
                }, 0)
              }
            });
            resolve('unauth')//未授权
          }
        }
      })
    })
    return p
  },
  /** 替换emoji表情 */
  filterEmoji(name) {
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return str;
  },
  //替换换行
  replaceNewLine (content) {
    if (content != '' && content > 0) {
      for (var i in content) {
        var obj = content[i];
        if (obj.type == 0) {
          obj.info = obj.info.split('\n').join('&hc');
          content[i] = obj;
        }
      }
    }
    return content;
  },
  //还原换行
  restoreNewLine (content) {
    if (content != '' && content > 0) {
      for (var i in content) {
        var obj = content[i];
        if (obj.type == 0) {
          obj.info = obj.info.join('&hc').split('\n');
          content[i] = obj;
        }
      }
    }
    return content;
  },
  scrollToTop(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  globalData: {
    // base_url: "https://test.heidouinfo.com/",
    base_url: "http://192.168.2.100:8080/",
    // base_url: "http://192.168.2.49:9090/",
    fileServer: "https://file.heidouinfo.com/",
    appid: 'wxa142de562c1bcb7d',
    header: null,
    sessionId: null,
    openId: null,
    userInfo: null,
    systemInfo: null
  }
})
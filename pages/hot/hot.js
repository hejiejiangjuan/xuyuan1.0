// pages/hot/hot.js
import {hotList} from '../../requests/index.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
    list: [],
    current_data: {},
    fileServer: app.globalData.fileServer,//文件服务器地址,
    publicCommand : '',
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false
  },
 
  //跳转活动详情
  toActivityDetail (e) {
    const index = e.currentTarget.dataset.index;
    const activity = this.data.list[index];
    wx.navigateTo({
      url: '../activitytheme/activitytheme?id=' + activity.id
    })
  },
  tapateCad(e) {
    const onlyFans = e.currentTarget.dataset.onlyFans;
    const index = e.currentTarget.dataset.index;
    const activity = this.data.list[index];
    this.setData({
      current_data: activity
    })
    //将数据加入缓存
    wx.setStorage({
      key: 'hot_activity_detail',
      data: activity,
    })
    if (onlyFans == 1) {
      //判断是否已输入过口令
      const has_command = wx.getStorageSync('has_command_' + activity.id)
      if (has_command) {
        wx.navigateTo({
          url: '../joinActivity/joinActivity?id=' + activity.id
        })
      } else {
        //输入口令
        this.setData({
          showModal: !this.data.showModal
        })
      }
    } else {
      //跳转到参加活动页
      wx.navigateTo({
        url: '../joinActivity/joinActivity?id=' + activity.id
      })
    }
  },
  //解锁抽奖
  unlockPrize : function () {
    const activity = this.data.current_data;
    if (activity.publicCommand == this.data.publicCommand) {
      //加入缓存
      wx.setStorageSync('has_command_'+activity.id, true);
      this.setData({
        showModal: false,
      })
      wx.navigateTo({
        url: '../joinActivity/joinActivity?id=' + activity.id
      })
    } else {
      wx.showToast({
        title: '口令不正确',
        icon: 'none',
        duration: 2000
      })
    }
  },

  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.current_data.publicName,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  publicCommandInput : function (e) {
    this.setData({
      publicCommand : e.detail.value
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getHotActivity();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getHotActivity();
    
  },
  //获取列表
  getHotActivity : function () {
    const that = this;
    wx.request({
      url: app.globalData.base_url +'wx/wish/activity/getHotActivity',
      data : {
        userId: app.globalData.userInfo.id
      },
      header: app.globalData.header,
      method : 'POST',
      success (res) {
        const data = res.data;
        if (data.code == 200) {
          that.setData({
            list: data.datas
          })
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
        that.setData({
          isRefreshing: false,
          isLoadingMoreData: false,
          hasMoreData: false
        })
      }

    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getHotActivity();
    app.scrollToTop();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    this.getHotActivity()//数据请求
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return
    }
    this.setData({
      isLoadingMoreData: true
    })
    this.getHotActivity()//数据请求
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    
  }
})
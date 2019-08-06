// components/modal/modal.js
var app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    //modal的高度
    height: {
      type: String,
      value: '80%'
    },
    isLogin:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo: function (e) {
      var that = this
      if (e.detail.userInfo) {
        that.triggerEvent("cofom");
        that.setData({ show: false });
        wx.showTabBar({
          aniamtion: true,
        })
        // if (res.data.datas) {
        //   setTimeout(function () {
        //     wx.navigateBack({
        //       delta: 1
        //     })
        //   }, 1)
        // }
      } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '重新授权',
          success: function (res) {
            if (res.confirm) {
            }
          }
        })
      }
    },
  
  }
})

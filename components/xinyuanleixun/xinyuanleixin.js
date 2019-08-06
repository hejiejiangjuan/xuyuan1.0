// components/xinyuanleixun/xinyuanleixin.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabs: ["实物"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    compontele:[]
  },
  
  onLoad: function () {
    
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    tabClick: function (e) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
      });
    },
    componentEle() {
      wx.navigateTo({
        url: '/pages/comentelect/comentelect',
      })
      // console.log(9999999)
    },
    // componentDele(){
    //   console.log(9999)
    // },
    onShow() {
      // console.log(9999999)
      var that = this;
      var text = that.data.text;
      var compontele = wx.getStorageSync('compontele');
      console.log(compontele[0])

      that.setData({
        compontele: compontele[0]
      })
    },
  }
})

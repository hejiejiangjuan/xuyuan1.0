// pages/makewish/makewish.js
const app = getApp();
var list = [];
function Detail(prize_name, prize_num, chooseType) {
  this.prize_name = prize_name;
  this.prize_num = prize_num;
  this.chooseType = chooseType;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    countryIndex: 0,
    location: '', //城市选择
    date: "2019-01-01",
    time: "12:01",
    pseu: false,
    titleImg: false,
    ishish: false,
    index: 0,
    multiArray: [
      ['无脊柱动物', '脊柱动物'],
      ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']
    ],
    objectMultiArray: [
      [{
        id: 0,
        name: '无脊柱动物'
      },
      {
        id: 1,
        name: '脊柱动物'
      }
      ],
      [{
        id: 0,
        name: '扁性动物'
      },
      {
        id: 1,
        name: '线形动物'
      },
      {
        id: 2,
        name: '环节动物'
      },
      {
        id: 3,
        name: '软体动物'
      },
      {
        id: 3,
        name: '节肢动物'
      }
      ]
    ],
    multiIndex: [0, 0],
  },
  //增加一个空类型
  insert: function () {
    let info = this.data.info;
    info.push(new Detail());
    this.setData({
      info: info
    });
  },
  // 城市选择
  bindMultiPickerChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']
            break
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物']
            break
        }

        break

    }
    this.setData(data)
  },
  init: function () {
    let that = this;
    this.setData({
      info: [],
    });
  },
  //时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //匿名开关
  pseuDony: function (e) {
    this.setData({
      pseu: e.detail.value
    })
  },
  //头像开关
  titleImgswitch(e) {
    this.setData({
      titleImg: e.detail.value
    })
  },
  //同步开关
  isHish(e) {
    this.setData({
      ishish: e.detail.value
    })
  },
  //点击更换
  tiaoZym(e) {
    let index = e.currentTarget.id;
    wx.navigateTo({
      url: '../elect/elect?id=' + index
    })
  },
  showTopTips(){
    wx.navigateTo({
      url: '../takecard/takecard',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.init();
    that.insert();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
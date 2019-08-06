// pages/makewish/makewish.js
const app = getApp();
var list = [];
function Detail(prize_name, prize_num, chooseType) {
  this.prize_name = prize_name;
  this.prize_num = prize_num;
  this.chooseType = chooseType;
  this.wishContent = '';
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxNum:'',
    multiIndex: [0, 0],
    tempIndex: [0, 0],
    selectArea:[],
    tempSelArea:[],
    provinces:[],
    citys:[],
    randomImg:'',
    randomName:'',
    storyInput:'',
    t_length:0,//背后故事长度
    dateStart: null,
    fileServer: app.globalData.fileServer,//文件服务器地址,
    info: [],
    countryIndex:0,
    location: '', //城市选择
    date: "",
    pseu: false,
    titleImg: false,
    ishish: false,
    index: 0,
    activityId : '',
    activityName : ''
  },
  submitWish(){
    var that = this;
    for(var i = 0;i<this.data.info.length;i++){
      if(this.data.info[i].wishContent.length<1){
        wx.showToast({
          title: '请填写心愿内容',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (!this.data.info[i].chooseType){
        wx.showToast({
          title: '请选择心愿类型',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    //
    if (this.data.storyInput.length<1){
      wx.showToast({
        title: '请填写心愿故事',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.wxNum.length<1){
      wx.showToast({
        title: '请填写微信号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.pseu){//匿名发布
      if (this.data.randomName.length<1){
        wx.showToast({
        title: '匿名发布的昵称不能为空',
        icon: 'none',
        duration: 2000
      })
      return
      }
    }
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/addWishDetail',
      method: 'POST',
      header: app.globalData.header,
      data:{
        wishList: encodeURI(JSON.stringify(that.data.info)),
        reachDate: encodeURI(that.data.date),
        story: encodeURI(that.data.storyInput),
        wechatNo: encodeURI(that.data.wxNum),
        anonymity: encodeURI(that.data.pseu?'0':'1'),
        nickName: encodeURI(that.data.randomName),
        userDefaultImg: encodeURI(that.data.titleImg?'1':'0'),
        imgAddr: encodeURI(that.data.randomImg),
        provincialId: encodeURI(this.data.selectArea[0][this.data.multiIndex[0]].id),
        cityId: encodeURI(this.data.selectArea[1][this.data.multiIndex[1]] ? this.data.selectArea[1][this.data.multiIndex[1]].id:''),
        sync: encodeURI(this.data.ishish),
        activityId: encodeURI(this.data.activityId),
        activityName: encodeURI(this.data.activityName)
      },
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          // that.setData({
          //   randomName: data.datas.name
          // })
          var id = data.datas;
          wx.showToast({
            title: '许愿成功',
            icon: 'none',
            duration: 2000
          })
          wx.navigateTo({
            url: '../takecard/takecard?joinId=' + id,
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },
  // 上传头像
  upload() {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.base_url + 'fileUpload', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = res.data
            const dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
              that.setData({
                randomImg: dataObj.datas
              });
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })

      }
    })
  },
  bindNickNameInput(e){
    this.setData({
      randomName:e.detail.value
    })
  },
  bindWxinput(e){
    this.setData({
      wxNum:e.detail.value
    })
  },
  wishContentInput(e){
    var textVal = e.detail.value;
    textVal = app.filterEmoji(textVal);
    // var infoObj = 'info[' + e.currentTarget.id + '].wishContent';
    var infoObj = this.data.info[e.currentTarget.id];
    infoObj.wishContent = textVal;
    this.setData({
      infoObj
    })
  },
  getReadyInfo() {//获取随机（昵称和头像）以及地区
  var that = this;
  //随机昵称
    wx.request({
      url: app.globalData.base_url + 'wishDetail/getRandomDefaultNickName',
      method: 'GET',
      header: app.globalData.header,
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          that.setData({
            randomName: data.datas.name
          })
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
    //随机头像
    wx.request({
      url: app.globalData.base_url + 'wishDetail/getRandomDefaultImg',
      method: 'GET',
      header: app.globalData.header,
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          that.setData({
            randomImg: data.datas.addr
          })
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
    //省份信息
    wx.request({
      url: app.globalData.base_url + 'wx/wish/public/getAllProvincial',
      method: 'POST',
      header: app.globalData.header,
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          that.setData({
            provinces: data.datas
          })
          //城市信息
          wx.request({
            url: app.globalData.base_url + 'wx/wish/public/getAllCity',
            method: 'POST',
            header: app.globalData.header,
            success(res) {
              const data = res.data;
              if (data.code == 200) {
                that.setData({
                  citys: data.datas
                })
                var cityList = [];
                for (var i = 0; i < that.data.citys.length; i++) {
                  if (that.data.provinces[0].id == that.data.citys[i].pid) {
                    cityList.push(that.data.citys[i]);
                  }
                }
                that.setData({
                  'selectArea[0]': that.data.provinces,
                  'selectArea[1]': cityList
                });
              } else {
                wx.showToast({
                  title: '系统错误，请稍后重试',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          });
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
    
  },
  bindText: function (e) {
    var textVal = e.detail.value;
    textVal = app.filterEmoji(textVal);
    this.setData({
      t_length: textVal.length,
      storyInput: textVal
    })
  },
  //移除类型
  remove: function (e) {
    let info = this.data.info;
    if(info.length>1){
      info.splice(e.currentTarget.id, 1);
      this.setData({
        info: info
      });
    }
    
  },
  //增加一个空类型
  insert: function () {
    let info = this.data.info;
    if (info.length<6){
      info.push(new Detail());
      this.setData({
        info: info
      });
    }
    
  },
  clickArea(){
    this.data.tempIndex = JSON.parse(JSON.stringify(this.data.multiIndex));
    this.data.tempSelArea = JSON.parse(JSON.stringify(this.data.selectArea));
  },
  // 城市选择确定
  bindMultiPickerChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindcancel(e){
    this.setData({
      multiIndex:this.data.tempIndex,
      selectArea:this.data.tempSelArea
    });
  },
  bindMultiPickerColumnChange(e) {
    var that = this;
    const data = {
      selectArea:this.data.selectArea,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        var pid = that.data.provinces[data.multiIndex[0]].id;
        var cityList = [];
        for(var i=0;i<that.data.citys.length;i++){
          if(pid == that.data.citys[i].pid){
            cityList.push(that.data.citys[i]);
          }
        }
        data.selectArea[1] = cityList;
    }
    this.setData(data)
  },
  init: function () {
    let that = this;
    var info = [];
    //获取活动详情，渲染心愿类型，若没有则查询
    var activity = wx.getStorageSync('hot_activity_detail');
    if (activity) {
      
      const wish_list = activity.activity_wish_list;
      if (wish_list != '' && wish_list != undefined) {
        for (var i = 0; i < wish_list.length; i++) {
          var detail = new Detail();
          var one = wish_list[i];
          var chooseType = {
            id: one.id,
            wishName: one.wishName,
            icon: one.icon
          }
          detail.chooseType = chooseType;
          info.push(detail)
        }
        this.setData({
          info: info,
          activityName: activity.activityTheme
        });
      }
    } else {
      const that = this;
      wx.request({
        url: app.globalData.base_url + 'wx/wish/activity/getActivityDetailById',
        data: {
          activityId: that.data.activityId
        },
        header: app.globalData.header,
        method: 'POST',
        success(res) {
          const data = res.data;
          if (data.code == 200) {
            activity = data.datas;
            const wish_list = activity.activity_wish_list;
            for (var i = 0; i < wish_list.length; i++) {
              var detail = new Detail();
              var one = wish_list[i];
              var chooseType = {
                id: one.id,
                wishName: one.wishName,
                icon: one.icon
              }
              detail.chooseType = chooseType;
              info.push(detail)
            }
            that.setData({
              info: info,
              activityName: activity.activityTheme
              
            });
          } else {
            wx.showToast({
              title: '系统错误，请稍后重试',
              icon: 'none',
              duration: 2000
            })
          }

        }
      })
    }


  
  },
//时间
bindDateChange: function(e) {
  this.setData({
    date: e.detail.value
  })
},
//匿名开关
pseuDony: function(e) {
  if (e.detail.valu){

  }
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
/**
 * 生命周期函数--监听页面加载
 */
onLoad: function(options) {
  var that = this;
  var curDate = new Date();
  var curDateStr = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate();
  var activityId = options.id;
  this.setData({
    dateStart: curDateStr,
    date: curDateStr,
    activityId: activityId
  });
  that.init();
  //that.insert();
  //获取随机（昵称和头像）以及地区
  this.getReadyInfo();
},

/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function() {
  
},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function() {

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

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function() {

},

/**
 * 用户点击右上角分享
 */
onShareAppMessage: function() {

}
})
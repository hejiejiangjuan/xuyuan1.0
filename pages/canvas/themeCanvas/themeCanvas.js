var app= getApp()
function findBreakPoint(text, width, context) {
  var min = 0;
  var max = text.length - 1;
  while (min <= max) {
    var middle = Math.floor((min + max) / 2);
    var middleWidth = context.measureText(text.substr(0, middle)).width;
    var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
    if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
      return middle;
    }
    if (middleWidth < width) {
      min = middle + 1;
    } else {
      max = middle - 1;
    }
  }

  return -1;
}

function breakLinesForCanvas(context, text, width, font) {
  var result = [];
  if (font) {
    context.font = font;
  }
  var textArray = text.split('\r\n');
  for (let i = 0; i < textArray.length; i++) {
    let item = textArray[i];
    var breakPoint = 0;
    while ((breakPoint = findBreakPoint(item, width, context)) !== -1) {
      result.push(item.substr(0, breakPoint));
      item = item.substr(breakPoint);
    }
    if (item) {
      result.push(item);
    }
  }
  return result;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    list: '',
    screenHeight: "",
    scrolHeight:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let item = JSON.parse(options.activityId);
    var myCanvasHeight;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#d75e49',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    
    wx.getSystemInfo({
      success: function (res) {
        myCanvasHeight = res.windowHeight
      },
    })
    var linheight = item.activity_wish_list.length * 10
     this.setData({
       screenHeight: myCanvasHeight + linheight,
       scrolHeight: myCanvasHeight - 60
     })
    that.setData({
      list: item
    })
    
    const list = that.data.list
    that.drawInit(list);

  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) { },
  /**
   * 绘制图片
   */

  drawInit: function (list) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var that = this
    var res = wx.getSystemInfoSync();
    var canvasWidth = res.windowWidth;
    // 获取canvas的的宽  自适应宽（设备宽/750) px
    var Rpx = (canvasWidth / 375).toFixed(2);
    //画布高度 -底部按钮高度
    // var canvasHeight = that.data.screenHeight - Rpx * 120;
    var canvasHeight = that.data.screenHeight - Rpx * 120;
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('secondtoCanvas')
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight + Rpx * 120);
    //设置行高
    var lineHeight = Rpx * 30;
    //左边距
    var paddingLeft = Rpx * 24;
    //右边距
    var paddingRight = Rpx * 24;
    //当前行高
    var currentLineHeight = Rpx * 60;
    // //标题内容颜色默认
    // ctx.fillStyle = "red";
    // // //高度减去 图片高度
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    var attimg = 'https://file.heidouinfo.com/' + list.themeAddr;
    wx.getImageInfo({
      src: attimg,//服务器返回的带参数的小程序码地址
      success: function (res) {
    
        //res.path是网络图片的本地地址
        //绘制图片
        const img = res.path;

        let cWidth = canvasWidth - Rpx * 34;
        let cHeight = Rpx * 180;
        var width = res.width;
        var height = res.height;
        // 描绘图片
        drawImage(img, width, height);

        function drawImage(imgPath, imgWidth, imgHeight) {
          let dWidth = cWidth / imgWidth;  // canvas与图片的宽度比例
          let dHeight = cHeight / imgHeight;  // canvas与图片的高度比例
          if (imgWidth > cWidth && imgHeight > cHeight || imgWidth < cWidth && imgHeight < cHeight) {
            if (dWidth > dHeight) {
              ctx.drawImage(imgPath, 0, (imgHeight - cHeight / dWidth) / 2, imgWidth, cHeight / dWidth, canvasWidth - cWidth - Rpx * 16, Rpx * 10, cWidth, cHeight)
            } else {
              ctx.drawImage(imgPath, (imgWidth - cWidth / dHeight) / 2, 0, cWidth / dHeight, imgHeight, canvasWidth - cWidth - Rpx * 16, Rpx * 10, cWidth, cHeight)
            }
          } else {
            if (imgWidth < cWidth) {
              ctx.drawImage(imgPath, 0, (imgHeight - cHeight / dWidth) / 2, imgWidth, cHeight / dWidth, canvasWidth - cWidth - Rpx * 16, Rpx * 10, cWidth, cHeight)
            } else {
              ctx.drawImage(imgPath, (imgWidth - cWidth / dHeight) / 2, 0, cWidth / dHeight, imgHeight, canvasWidth - cWidth - Rpx * 16, Rpx * 10, cWidth, cHeight)
            }
          }
        }
        var imgHeight = Rpx * 160;
        const activityTheme = list.activityTheme
        var resultTitle = breakLinesForCanvas(ctx, activityTheme, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 15).toFixed(0)}px PingFangSC-Regular`);
        //字体颜色
        ctx.fillStyle = 'black';
        resultTitle.forEach(function (line, index) {
          currentLineHeight += Rpx * 30;
          ctx.fillText(line, paddingLeft, currentLineHeight + imgHeight - Rpx * 40);
        });

       
        //设置内容
        const leixinag = list.activity_wish_list
        for (var i in leixinag) {
          var leixinginfo = leixinag[i].wishName + ' | ' + '心愿：' + leixinag[i].prizeName + 'x' + leixinag[i].prizeNum
  
          var resultTitle = breakLinesForCanvas(ctx, leixinginfo, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 12).toFixed(0)}px PingFangSC-Regular`);
          //字体颜色
          ctx.fillStyle = '#a0a0a0';
          resultTitle.forEach(function (line, index) {
            currentLineHeight += Rpx * 20;
            ctx.fillText(line, paddingLeft, currentLineHeight + imgHeight - Rpx * 40);
          });
        }

        // //画分割线
        currentLineHeight += Rpx * 30;
        ctx.setLineDash([Rpx * 6, Rpx * 3.75]);
        ctx.moveTo(paddingLeft, currentLineHeight + imgHeight - Rpx * 60);
        ctx.lineTo(canvasWidth - paddingRight, currentLineHeight + imgHeight - Rpx * 60);
        ctx.strokeStyle = '#cccccc';
        ctx.stroke();
        //设置  来源 
        var source = '活动发起者'
        var browsingVolume = list.nick_name;
        currentLineHeight += Rpx * 30;
        ctx.font = `${(Rpx * 15).toFixed(0)}px PingFangSC-Regular`;
        //字体颜色
        ctx.fillStyle = 'black';
        ctx.fillText(source, paddingLeft, currentLineHeight + imgHeight - Rpx * 60);
        ctx.setTextAlign('right');
        ctx.fillText(browsingVolume, canvasWidth - paddingRight, currentLineHeight + imgHeight - Rpx * 60);
        //恢复左对齐
        ctx.setTextAlign('left');
        //画背景
        ctx.setFillStyle('#f4f4f4')
        ctx.fillRect(0, currentLineHeight + imgHeight - Rpx * 45, canvasWidth, Rpx * 20)

        const ewimgto = app.globalData.fileServer + list.codeAddr
        wx.getImageInfo({
          src: ewimgto,
          success: function(res) {
            //绘制图片
            const ewimg = res.path;
            const ewimgWidth = Rpx * 150; //图片宽度
            const ewimgHeight = Rpx * 150; //图片高度
            var ewimgurl_x = canvasWidth - ewimgWidth; //绘制在画布上的位置
            var ewimgurl_y = currentLineHeight + imgHeight; //绘制的图片在画布上的位置
            ctx.save();
            ctx.beginPath(); //开始绘制
            ctx.drawImage(ewimg, ewimgurl_x / 2, ewimgurl_y, ewimgWidth, ewimgHeight);
            ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
            // 二维码
            let strer = '扫描小程序二维码参加活动~'
            let P = canvasWidth;
            ctx.setFontSize(15);
            ctx.setFillStyle('red');
            // 剩余宽度50%开始绘制文字
            ctx.fillText(strer, (P - ctx.measureText(strer).width) * 0.5, currentLineHeight + imgHeight + ewimgHeight + Rpx * 40);

            ctx.draw();
            wx.showToast({
              title: '加载成功',
              icon: 'success',
              duration: 2000
            })
          },
        })
      },
      fail: function (res) {
        //失败回调
      }
    });

  },
  saveImg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'secondtoCanvas',
      fileType: 'jpg',
      success: function (res) {
        wx.showLoading({
          title: '保存中...',
          mask: true
        });
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            wx.hideLoading()
          }
        })
      }
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.info.title,
      path: '/pages/content/content?id=' + this.data.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
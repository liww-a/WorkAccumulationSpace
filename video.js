// 登录
/** szIP： ip地址
 * szPort: 端口
 * szUsername： 用户名
 * szPassword： 密码
 * custom： null
*/
loginVideo(szIP, szPort, szUsername, szPassword, custom) {
    var that = this
    let loading = that.$loading({
        target: '.video-box-obj',
        text: '正在登录'
    })
    that.videoInit('100%', '100%', '1')
    if (szIP === '' || szPort === '') {
        return
    }
    var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
        async: false,
        success: function (xmlDoc) {
            that.showOPInfo('登录成功', true)
            loading.close()
            setTimeout(function () {
                that.getChannelInfo(szIP, custom) // 获取通道
                var nums = that.initChannel() // 初始化通道
                var oSel = $(".sel").val() // 获取当前流码值
                that.changeWndNum(nums) // 窗口分割数
                $('.window-num').val(nums) // 获取当前窗口数
                that.initClick(szIP) // 注册点击事件
                that.chooseChannel(szIP) // 选择实时监控通道
                that.chooseBackChannel(szIP) // 选择回放通道
                that.cameraControl() // 初始化云台控制按钮点击事件
                // 根据视频配置信息中的自定义摄像头名称显示通道
                // 不写是默认，写的话可以使用的前提是摄像头编号(表单填写)和通道id(插件中获取)相同才可以使用
                // 实际中通道编号可能不是顺序排列
                // 目前配置菜单中的通道编号来源尚不明确，不知用户根据何种资料填写，目前是顺序排列，会有不匹配的情况
                var _lis = $('#channels').find('li') // 实时监控通道列表
                var _len = _lis.length
                var _k = 0
                for (var i = 0; i < _len; i++) {
                    if (_lis.eq(i).attr('isplay') === '1') {
                        that.startRealPlay(szIP, _k, oSel, _lis.eq(i).attr('pid'))
                        _k++
                    }
                }
                if (_lis.eq(0).attr('isplay') === '1') {
                    that.startRealPlay(szIP, 0, oSel, _lis.eq(0).attr('pid'))
                }
                that.timebar.setMouseUpCallback(() => {
                    that.stopPlayback(szIP)
                    clearInterval(that.ALL_WINDOWINFO[that.g_iWndIndex])
                    that.ALL_WINDOWINFO[that.g_iWndIndex].currentTime = that.timebar.m_tCurrentMidTime.getStringTime()
                    if (that.ALL_WINDOWINFO[that.g_iWndIndex].direction === 1) {
                        if (that.ALL_WINDOWINFO[that.g_iWndIndex].isPlay) {
                            that.startPlayback(szIP, that.ALL_WINDOWINFO[that.g_iWndIndex].channel, that.ALL_WINDOWINFO[that.g_iWndIndex].currentTime, that.ALL_WINDOWINFO[that.g_iWndIndex].endTime)
                            that.upDateTimeLine()
                        } else {
                            that.ALL_WINDOWINFO[that.g_iWndIndex].isFirst = true
                        }
                    } else {
                        if (that.ALL_WINDOWINFO[that.g_iWndIndex].isBack) {
                            that.reversePlayback(szIP, that.ALL_WINDOWINFO[that.g_iWndIndex].channel, that.ALL_WINDOWINFO[that.g_iWndIndex].startTime, that.ALL_WINDOWINFO[that.g_iWndIndex].currentTime)
                            that.upDateTimeLine()
                        } else {
                            that.ALL_WINDOWINFO[that.g_iWndIndex].isBackFirst = true
                        }
                    }
                })
            }, 10)
        },
        error: function () {
            that.showOPInfo('登录失败', false)
            loading.close()
        }
    })
    if (iRet === -1) {
        that.showOPInfo('已登录过', true)
    }
}

// 获取通道
/** szIP： ip地址
 * custom：null
*/
getChannelInfo(szIP, custom) {
    // 实时监控下面的通道列表
    var oSel = $('#channels').empty()
    // 回放下面的通道列表
    var oSel_2 = $('#channels_2').empty()
    if (szIP === '') {
        return
    }
    var that = this
    // 模拟通道
    WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
      async: false,
      success: (xmlDoc) => {
        var oChannels = $(xmlDoc).find('VideoInputChannel')
        that.nAnalogChannel = oChannels.length
        $.each(oChannels, function (i) {
          var id = parseInt($(this).find('id').eq(0).text(), 10)
          var name = $(this).find('name').eq(0).text()
          if (name === '') {
            name = 'Camera' + (id < 9 ? '0' + id : id)
          }
          oSel.append('<li class="list-group-item" pid="' + id + '" bZero="false">' + name + '<i class="el-icon-caret-right start-play" title="开始预览"></i></li>')
          oSel_2.append('<li class="list-group-item" pid="' + id + '" bZero="false">' + name + '</li>')
        })
        that.showOPInfo('获取模拟通道成功', true)
      },
      error: function () {
        that.showOPInfo('获取模拟通道失败', false)
      }
    })
    // 数字通道
    WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find('InputProxyChannelStatus')
            $.each(oChannels, function (i) {
                var id = parseInt($(this).find('id').eq(0).text(), 10)
                var name = $(this).find('name').eq(0).text()
                var online = $(this).find('online').eq(0).text()
                // 过滤禁用的数字通道
                if (online === 'false') {
                    return true
                }
                if (name === '') {
                    name = 'IPCamera' + ((id - that.nAnalogChannel) < 9 ? '0' + (id - that.nAnalogChannel) : (id - that.nAnalogChannel))
                }
                oSel.append('<li class="list-group-item" pid="' + id + '" isPlay="1" bZero="false">' + name + '<i class="el-icon-caret-right start-play" title="开始预览"></i></li>');
                oSel_2.append('<li class="list-group-item" pid="' + id + '" bZero="false">' + name + '</li>')
            })
            that.showOPInfo('获取数字通道成功', true)
        },
        error: function () {
            that.showOPInfo('获取数字通道失败', false)
        }
    })
    // 零通道
    WebVideoCtrl.I_GetZeroChannelInfo(szIP, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find('ZeroVideoChannel')
            $.each(oChannels, function (i) {
                var id = parseInt($(this).find('id').eq(0).text(), 10)
                var name = $(this).find('name').eq(0).text()
                if (name === '') {
                    name = 'Zero Channel' + (id < 9 ? '0' + id : id)
                }
                // 过滤禁用的零通道
                if ($(this).find('enabled').eq(0).text() === 'true') {
                    oSel.append('<li class="list-group-item" pid="' + id + '" bZero="true">' + name + '<i class="el-icon-caret-right start-play" title="开始预览"></i></li>')
                    oSel_2.append('<li class="list-group-item" pid="' + id + '" bZero="true">' + name + '</li>')
                }
            })
            that.showOPInfo('获取零通道成功', true)
        },
        error: function () {
            that.showOPInfo('获取零通道失败', false)
        }
    })
}

// 开始播放
/** szIP： ip地址
 * iWndIndex： 播放通道数量
 * iStreamType： type为string或number 码流类型 1 - 主码流，2 - 子码流
 * iChannelID：  type为string或number  播放通道号，默认通道1
*/
startRealPlay(szIP, iWndIndex, iStreamType, iChannelID) {
    var that = this
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.g_iWndIndex)
    // $('#channels option').eq($('#channels').get(0).selectedIndex) 获取到当前选中的通道
    // .attr('bZero') == 'true' ? true : false 判断选中通道是什么通道  true: 零通道  false：数字通道
    var bZeroChannel = $('#channels option').eq($('#channels').get(0).selectedIndex).attr('bZero') == 'true' ? true : false
    // var bZeroChannel = false
    if (szIP === '') {
        return
    }
    // 已经在播放了，先停止已经在播放了，先停止
    if (oWndInfo !== null) {
        WebVideoCtrl.I_Stop()
    }
    // 传入当前窗口索引
    if (iWndIndex !== null) {
        var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
            iWndIndex: iWndIndex,
            iStreamType: iStreamType,
            iChannelID: iChannelID,
            bZeroChannel: bZeroChannel
        })
        // 不传则默认当前选中窗口
    } else {
        var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
            iStreamType: iStreamType,
            iChannelID: iChannelID,
            bZeroChannel: bZeroChannel
        })
    }
    if (iRet === 0) {
        that.showOPInfo('开始预览成功', true)
    } else {
        that.showOPInfo('开始预览失败', false)
    }
}
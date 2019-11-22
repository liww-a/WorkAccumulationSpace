
// window.onUnload = function () {
//     var newWindow;
//     if ((window.screenLeft >= 10000 && window.screenTop >= 10000) || event.altKey) {
//         newWindow = window.open('退出程序地址', '网页名称',
//             'width=0,height=0,top=4000,left=4000'); //新窗口将在视区之外打开 
//         newWindow.opener = null;
//         sleep(5000); //执行休眠操作以便能够处理完新打开窗口执行代码 
//         newWindow.close(); //新窗口关闭
//     }
// }

// function sleep(milisecond) {
//     var currentDate, beginDate = new Date();
//     var beginHour, beginMinute, beginSecond, beginMs;
//     var hourGaps, minuteGaps, secondGaps, msGaps, gaps;
//     beginHour = beginDate.getHours();
//     beginMinute = beginDate.getMinutes();
//     beginSecond = beginDate.getSeconds();
//     beginMs = beginDate.getMilliseconds();
//     do {
//         currentDate = new Date();
//         hourGaps = currentDate.getHours() - beginHour;
//         minuteGaps = currentDate.getMinutes() - beginMinute;
//         secondGaps = currentDate.getSeconds() - beginSecond;
//         msGaps = currentDate.getMilliseconds() - beginMs;
//         if (hourGaps < 0) hourGaps += 24; //考虑进时进分进秒的特殊情况 
//         gaps = hourGaps * 3600 + minuteGaps * 60 + secondGaps;
//         gaps = gaps * 1000 + msGaps;
//     } while (gaps < milisecond);
// }











var first = echarts.init(document.getElementById('box1'))
var option = {
    title: {
        text: 'Echarts'
    },
    tooltip: {

    },
    legend: {
        data: ['销量']
    },
    xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    },
    yAxis: {},
    series: [
        // {
        //     name: '销量',
        //     type: 'bar',
        //     label: {
        //         show: true,
        //         position: 'top'
        //     },
        //     data: [5, 20, 36, 10, 10, 20]
        // },
        // {
        //     name: '销量',
        //     type: 'line',
        //     label: {
        //         show: true,
        //         position: 'top'
        //     },
        //     data: [5, 20, 36, 10, 10, 20]
        // },
        {
            name: '销量',
            type: 'line',
            label: {
                show: true,
                position: 'outside'
            },
            data: [
                {
                    // name: '衬衫',
                    value: 5
                },
                {
                    // name: '羊毛衫',
                    value: 20
                },
                {
                    // name: '雪纺衫',
                    value: 36
                },
                {
                    // name: '裤子',
                    value: 10
                },
                {
                    // name: '高跟鞋',
                    value: 10
                },
                {
                    // name: '袜子',
                    value: 20
                }
            ]
        }
    ]
}
first.setOption(option)
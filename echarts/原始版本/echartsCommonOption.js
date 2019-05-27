/**
 * Echarts 公共配置
 * 图例文字颜色，X,Y轴坐标色
 * @type {Object}
 */

const COLOR_VAL = {
    TEXT_COLOR: '#7187b4',
    HIGH_LIGHT_TEXT_COLOR: '#b3c1e1',
    SPLIT_LINE_COLOR: '#333e5c'
}

export default {
    COLOR_VAL,
    legend: {
        y: 'top',
        type: 'scroll',
        textStyle: {
            color: COLOR_VAL.TEXT_COLOR,
            fontSize: 12
        },
        inactiveColor: '#3c3f46',
        pageIconColor: COLOR_VAL.HIGH_LIGHT_TEXT_COLOR,
        pageIconInactiveColor: '#6c81ac',
        pageIconSize: 10,
        pageTextStyle: {
            color: COLOR_VAL.HIGH_LIGHT_TEXT_COLOR
        }
    },
    xAxis: {
        nameTextStyle: {
            color: COLOR_VAL.TEXT_COLOR,
            fontSize: 14
        },
        // X轴文字与坐标轴距离
        axisLabel: {
            margin: 30,
            color: COLOR_VAL.HIGH_LIGHT_TEXT_COLOR
                // interval: 0,
                // rotate: -5
        },
        axisLine: {
            lineStyle: {
                color: COLOR_VAL.TEXT_COLOR
            }
        },
        boundaryGap: true
    },
    // grid: {
    //     left: '5%',
    //     bottom: '10%'
    // },
    yAxis: {
        // nameLocation: 'middle',
        // nameGap: 50,
        // nameRotate:90,
        splitLine: {
            show: true,
            lineStyle: {
                color: COLOR_VAL.SPLIT_LINE_COLOR
            }
        },
        nameTextStyle: {
            color: COLOR_VAL.TEXT_COLOR,
            fontSize: 14
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: COLOR_VAL.TEXT_COLOR
            }
        },
        axisTick: {
            show: false
        }
    },
    toolbox: {
        right: '16px',
        iconStyle: {
            normal: {
                borderColor: COLOR_VAL.TEXT_COLOR
            },
            emphasis: {
                borderColor: COLOR_VAL.HIGH_LIGHT_TEXT_COLOR
            }
        },

    },
    dataZoomBase: {
        borderColor: 'transparent',
        backgroundColor: COLOR_VAL.SPLIT_LINE_COLOR,
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        handleSize: 6,
        // handleStyle: {
        //     shadowBlur: 8,
        //     shadowOffsetX: 0,
        //     shadowOffsetY: 0,
        //     shadowColor: '#aaa'
        // },
        labelFormatter: ''
    }
};
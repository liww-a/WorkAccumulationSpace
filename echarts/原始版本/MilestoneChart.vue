<!--
    进度管理
    里程碑节点进度图
    定制
    应该不可复用
 -->
<template>
<div class="echarts-container">
	<div :id="option.id" class="echarts-container" v-if="data && data.length">

	</div>
	<no-data v-else></no-data>
</div>
</template>

<script>
import commonOption from './echartsCommonOption';
import utils from 'utils/utils';
import NoData from 'components/NoData';
export default {
	name: 'MilestoneChart',
	props: {
        option: {
            type: Object,
            default: function() {
                return {}
            }
        },
        data: {
            type: Array,
            default: function() {
                return []
            }
        },
        minRange: {
            type: Number,
            default: -30
        },
        maxRange: {
            type: Number,
            default: 30
        }
    },
	components: {
		NoData
	},
	data() {
		return {
			chart: null,
            settings: null,
			columnSeries: {
				// type: 'bar',
				// barWidth: '25%',
				// stack: 'a'
				lineStyle: {
                    normal: {
                        type: 'solid',
                        width: '3'
                    }
                },
                symbolSize: 10
			},
			xAxis: [],
			chartData: {
				legend: [],
				series: []
			}
		}
	},
	methods: {
		combineData() {
			if (this.option.type == 'line') {
				// this.chartData = utils.columnEchart(this.data, this.columnSeries, this.option.color);
				this.chartData = utils.columnEchart(this.data, this.columnSeries);
			} else {
				this.chartData = utils.columnEchart(this.data, this.columnSeries);
			}
			// this.option.xAxis.map((item) => {
			// 	this.xAxis.push(item.name)
			// })
		},
        //默认开启动画
		draw(id, animation = true) {
            this.combineData();
            if (this.chart !== null) this.$echarts.dispose(document.getElementById(id))
			this.chart = this.$echarts.init(document.getElementById(id));
			let options = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						// 图表类型为line用line，可选为：'line' | 'shadow'
						type: (this.option.type && this.option.type == 'line') ? 'line' : 'shadow'
					},
					formatter: (params) => {
                        var date = this.$moment(params[0].value[0]).format('YYYY-MM-DD');
                        let formateStr = date + '<br/>';
                        let temp = {};
                        params.map((params) => {
                            var day = params.value[1];
                            var stage = params.value[2];
                            if (!temp[stage]) {
                                if (day == 0) {
                                    formateStr += stage + '<br/>'
                                } else {
                                    var text = day > 0 ? '滞后' + day + '天' : '提前' + -day + '天';
                                    formateStr += stage + '-' + text + '<br/>';
                                }
                            }
                            temp[stage] = 1;
                        })
                        return formateStr;
					}
				},
				toolbox: {
					show: true,
                    ...commonOption.toolbox,
					feature: {
                        dataZoom: {
                            title: {
                                back: '区域回退'
                            },
                            yAxisIndex: 'none'
                        },
                        restore: {},
						// saveAsImage: {}
					}
				},
				legend: {
                    selectedMode: false,
					//图例
					...commonOption.legend,
					data: this.chartData.legend
				},
				color: this.option.color,
				series: this.chartData.series,
				//默认不开启缩放
				dataZoom: [
                    {
						show: false,
						type: 'slider',
						showDataShadow: false,
						start: 0,
						end: 100,
						bottom: 40,
						height: 5,
                        ...commonOption.dataZoomBase
					},
					{
						disabled: false,
                        type: 'inside',
						zoomOnMouseWheel: true
					}
				],
                animation: animation
			};
			let axis = {
                //时间轴，不显示具体时间，只显示标记线
				xAxis: {
                    show: false,
					type: 'time',
                    nameTextStyle: {
                        color: '#7187b4',
                        fontSize: 14
                    },
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        margin: 30,
                        textStyle: {
                            color: '#b3c1e1'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#7187b4'
                        }
                    },
					splitNumber: 10
				},
				yAxis: {
                    type: 'value',
                    min: this.minRange - 5,
                    max: this.maxRange + 5,
					name: this.option.yAxis ? this.option.yAxis : '',
					...commonOption.yAxis,
					boundaryGap: ['20%','20%']
				}
			}
			options = Object.assign({}, options, axis);
            /**
             * options.series
             *     0计划节点
             *     1实际节点
             *     2实际进度
             * 一定确保index获取的值正确
             */
            //计划阶段数据 时间对应的阶段名称映射
            let stageMap = {}
            //markline数组
            let marklineData = []
            this.data[0].data.map((item) => {
                //item[0]  阶段时间
                //item[2]  阶段名称
                stageMap[item[0]] = item[2]
                marklineData.push({
                    xAxis: item[0]
                })
            })
            //标记线，传入series[0]即计划的数据线
            let mileStioneMarkLine = {
                markLine: {
                    silent: true,
                    //不显示箭头
                    symbol:false,
                    label: {
                        normal: {
                            position: 'start',
                            formatter:(params) => {
                                var value = params.value;
                                var date = this.$moment(value).format('YYYY-MM-DD')
        						return '\n' + stageMap[value] + '\n' + date
        					}
                        }
                    },
                    lineStyle: {
                        normal: {
                            type: 'dashed',
                            color: '#b3c1e1',
                            opacity: '0.5'
                        }
                    },
                    //计划时间
                    data: marklineData
                }
            }
            options.series[0] = Object.assign({}, options.series[0], mileStioneMarkLine);
            /**
             * 实际进度区块
             * 本质还是line
             * 取消显示line本体和圆点symbol
             * 设定markarea
             */
            let final = {
                showSymbol: false,
                lineStyle: {
                    normal: {
                        color: 'rgba(0,0,0,0)',
                        type: 'solid',
                        width: '3'
                    }
                },
                markArea: {
                    itemStyle: {
                        normal: {
                            color: 'rgba(179,193,225,.1)'
                        }
                    },
                    data: (() => {
                        let data = options.series[2].data;
                        let arr = []
                        data.map((item) => {
                            arr.push({
                                xAxis: item[0]
                            })
                        })
                        return [ arr ]
                    })()
                }
            }
            options.series[2] = Object.assign({}, options.series[2], final);
            //更改实际进度图例为rect 不改是line的形状
            (() => {
                let name = options.legend.data[2];
                options.legend.data[2] = {
                    name: name,
                    icon: 'rect'
                }
            })()
			this.chart.setOption(options);
            this.settings = options;
            this.linkLine(true);
            this.chart.on('click', (e) => {
				this.$emit('item-click', e)
			});
            // 缩放时重新连线
            this.chart.on('datazoom', (e) => {
                let batch = e.batch[0];
                let zoomStart = batch.start;
                let zoomEnd = batch.end;
                this.linkLine(false, [zoomStart, zoomEnd]);
            })
            this.chart.on('restore', (e) => {
                options.dataZoom[0].start = 0;
                options.dataZoom[0].end = 100;
                this.chart.setOption(options);
                this.linkLine(false);
            })
		},
        linkLine(clear, zoom) {
            //获取点的坐标  用于连线
            let connectLineData = this.getConnect();
            let connectLine = {
                markLine: {
                    silent: true,
                    //不显示箭头
                    symbol:false,
                    label: {
                        normal: {
                            show: false
                            // position: 'start',
                            // formatter:(params) => {
                            //     var value = params.value;
                            //     var date = this.$moment(value).format('YYYY-MM-DD')
        					// 	return '\n' + stageMap[value] + '\n' + date
        					// }
                        }
                    },
                    lineStyle: {
                        normal: {
                            type: 'dashed',
                            color: '#b3c1e1',
                            opacity: '0.5'
                        }
                    },
                    //计划时间
                    data: connectLineData
                }
            }
            this.settings.series[1] = Object.assign({}, this.settings.series[1], connectLine);
            //获取完销毁当前实例，导入连线数据,重新渲染
            if (clear) this.chart.clear();
            if (zoom) {
                this.settings.dataZoom[0].start = zoom[0];
                this.settings.dataZoom[0].end = zoom[1];
            }
            this.chart.setOption(this.settings);
        },
        //生成连线数据
        getConnect() {
            let planLine = this.data[0].data;
            let realLine = this.data[1].data;
            let connect = [];
            // 新增需求 计划节点包含项目起止时间
            // 实际节点加入了实际开工节点
            // 很坑爹
            planLine.map((item, index) => {
                let planPoint = planLine[index];
                let realPoint = realLine[index];
                //实际节点可能没有 同时存在是生成两个点坐标数据
                if (planPoint && realPoint) {
                    let p = this.chart.convertToPixel({seriesIndex: 0}, planPoint);
                    let r = this.chart.convertToPixel({seriesIndex: 1}, realPoint);
                    connect.push([
                        {
                            x: p[0],
                            y: p[1]
                        },
                        {
                            x: r[0],
                            y: r[1]
                        }
                    ])
                }
            })
            return connect;
        },
        handleResize() {
            //resize不能重新导入新的各点的坐标数据，所以调用了重绘，并且关闭了动画与resize的视觉效果保持一致
            this.draw(this.option.id, false);
        },
		init() {
			this.xAxis = [];
            if (this.data && this.data.length) {
                this.draw(this.option.id);
                window.addEventListener('resize', this.handleResize);
            }
		}
	},
	mounted() {
		//默认为柱图
		this.columnSeries.type = this.option.type ? this.option.type : 'bar';
		this.$nextTick(function() {
            this.init();
		});
	},
	updated() {
		this.$nextTick(function() {
            this.init();
		});
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.handleResize)
    }
}
</script>

<!--
    进度管理
    里程碑节点进度图
    定制
    应该不可复用
 -->
<template>
<div class="echarts-container">
	<div
        :id="option.id"
        class="echarts-container"
        v-if="data && data.length">
	</div>
	<no-data v-else></no-data>
</div>
</template>

<script>
import util from 'utils/echarts'
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
        //默认开启动画
		draw(id, animation = true) {
			let options = {
				legend: {
					data: this.chartData.legend
				},
				color: this.option.color,
				series: this.chartData.series
			};
            /**
             * options.series
             * 0计划节点
             * 1实际节点
             * 2实际进度
             * 一定确保index获取的值正确
             */
            let stageMap = {}
            let marklineData = []
            this.data[0].data.map((item) => {
                //item[0]  阶段时间
                //item[2]  阶段名称
                stageMap[item[0]] = item[2]
                marklineData.push({
                    xAxis: item[0] // 提取x轴数据(日期集合)
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
                        // arr = [
                        //     {xAxis: '1484409600000'},
                        //     {xAxis: '1512403200000'}
                        // ]
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
	}
}
</script>

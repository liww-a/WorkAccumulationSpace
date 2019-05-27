/*
 * @Author: qintl 
 * @File: 进度管理 
 * @Date: 2017-09-25 12:53:56 
 * @Last Modified by: qintl
 */
<template>
    <div class="vertical-row-5 schedule">
        <el-row :gutter="10">
            <el-col :span="6" :lg="4">
                <div class="vertical-col-1">
                    <card class="index-manager">
                        <div class="" slot="header">
                            项目施工状态
                        </div>
                        <div class="chart-adapt" style="top:0;">
                            <div class="i-m-pie">
                                <pie-chart :option="option" :data="pieData" @item-click="handlePieClick">
                                </pie-chart>
                            </div>
                            <div class="i-m-desc" v-if="pieData.series[0].value !== null">
                                <p v-for="(item,index) in pieData.series">
                                    {{item.name}}：
                                    <span :style="'color:' + option.color[index]">{{item.value}}</span>
                                    个
                                </p>
                            </div>
                        </div>
                    </card>
                </div>
                <div class="vertical-col-1">
                    <card :haveMenu="true">
                        <div class="" slot="header">
                            新开工项目
                            <i @click="handleNewProjectClick" class="B5D B5D-more1"></i>
                        </div>
                        <beautiful-slide>
                            <list-content :data="listDateFormate">
                                <list-item v-for="(item, index) in listDateFormate"
                                    :num="index"
                                    :name="item.projectName"
                                    @item-click="handleProjectClick(item)"
                                >
                                    <item-detail :left-text="`开工日期：${item.date}`" :limit="false"></item-detail>
                                </list-item>
                            </list-content>
                        </beautiful-slide>
                    </card>
                </div>
            </el-col>
            <el-col :span="12" :lg="14">
                <card>
                    <div class="clear" slot="header">
                        <search-drop-menu-content
                            :defaultActive="searchList[0].projectId"
                            :title="searchList[0].projectName"
                            v-if="searchList.length"
                            :data="searchList"
                            useId="projectId"
                            name="projectName"
                            @select="changeProject"
                        >
                        </search-drop-menu-content>
                        <jump-group v-if="searchList.length" :id="jumpOption.id" :name="jumpOption.name" :origin="origin" :originName="originName" :bimProjectId="jumpOption.bimProjectId" :workspaceId="jumpOption.workspaceId"></jump-group>
                    </div>
                    <div class="half-height">
                        <chart-card>
                            <div class="" slot="header">
                                里程碑节点
                            </div>
                            <milestone-chart :data="milestoneData" :option="milestoneOption" :min-range="" :max-range=""></milestone-chart>
                        </chart-card>
                    </div>
                    <div class="half-height">
                        <chart-card>
                            <div class="" slot="header">
                                施工计划总览
                            </div>
                            <schedule-plan-chart :data="planData" :option="planLine"></schedule-plan-chart>
                        </chart-card>
                    </div>
                </card>
            </el-col>
            <el-col :span="6">
                <div class="vertical-col-1">
                    <card :haveMenu="true">
                        <div class="" slot="header">
                            滞后项目统计
                            <i class="B5D B5D-more1" @click="handleClickGo"></i>
                        </div>
                        <column-chart :option="delayOption" tip="个数" :data="delayData" @item-click="delayClick"></column-chart>
                    </card>
                </div>
                <div class="vertical-col-1">
                    <card :haveMenu="true">
                        <div class="" slot="header">
                            工期延误排名
                            <drop-menu-content defaultActive="contractNode" title="合同开工节点" @select="changeDelayType">
                                <drop-menu-item index="contractNode">合同开工节点</drop-menu-item>
                                <drop-menu-item index="milestoneNode">里程碑节点</drop-menu-item>
                                <drop-menu-item index="totalScheduleNode">总进度计划</drop-menu-item>
                            </drop-menu-content>
                            <i class="B5D B5D-more1" @click="handleScheduleDelayRankClick"></i>
                        </div>
                        <beautiful-slide>
                            <list-content :data="majorList">
                                <list-item-extra v-for="(item, index) in majorList"
                                    :num="index"
                                    :name="item.projectName"
                                    :extra="item.durationCompletionRate"
                                    @item-click="handleProjectClick(item)"
                                >
                                    <!-- :delay="item.durationCompletionRate < 0"-->
                                    <item-percent :percent="item.percent" :delay="true" :value="item.value">
                                        <span>{{item.value}}</span>
                                    </item-percent>
                                </list-item-extra>
                            </list-content>
                        </beautiful-slide>
                    </card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import api from 'src/api';
import 'assets/css/schedule.less';
import utils from 'utils/utils';
import { mapGetters } from 'vuex';
import MilestoneChart from 'components/chart/MilestoneChart';
import SchedulePlanChart from 'components/chart/SchedulePlanChart';
import toProjectAccount from 'src/container/toProjectAccount';
  export default {
    name : 'schedule',
    components:{
        MilestoneChart,
        SchedulePlanChart
    },
    mixins: [toProjectAccount],
    data () {
        return {
            origin: '/platform/schedule',
            originName: '进度管理',
            jumpOption: {
                id: '',
                name: '',
                bimProjectId: '',
                workspaceId: ''
            },
            // 项目施工状态
            option: {
                id: 'pie_chart',
                color: ['#ea9a16', '#9e0c1e', '#3576c1', '#8db95c', '#6c81ac']
            },
            planData: null,
            // 里程碑
            milestoneOption: {
                id: 'milestone_chart',
                xAxis: [],
                yAxis: '提前/滞后时间（天）',
                color: ['#3576c1', '#ea9a16', '#b3c1e1'],
                type: 'line'
            },
            // 施工计划
            planLine: {
                id: 'plan_chart',
                xAxis: [],
                yAxis: '产值（万元）',
                color: ['#6651c4', '#ea9a16', '#3576c1', '#8db95c', '#465677', '#773887', '#8f2330', '#d37b8e', '#e0d45c'],
                type: 'line'
            },
            // 滞后项目
            delayOption: {
                id: 'delay_chart',
                reverse: true,
                xAxis: [],
                color: ['#ea9a16','#6c2333']
            },
            delayData: [],
            searchList:[],
            pieData: {
                series: [
                    {
                        value: null
                    }
                ]
            },
            newStartList: [],
            majorList: [],
            currentState: {
                projectId: '',
                projectCompose: 'engineering',
                projectRank: 'contractNode'
            }
        }
    },
    computed : {
        ...mapGetters(['currentYear', 'rootId', 'companyId', 'companyName', 'limit']),
        commonParam () {
            return {
                tenantId: this.rootId
            }
        },
        listDateFormate () {
            if (this.newStartList.length) {
                this.newStartList.map((item) => {
                    item.date = this.$moment(item.startDate).format('YYYY.MM.DD')
                })
                return this.newStartList
            } else {
                return []
            }
        }
    },
    watch: {
        limit () {
            this.init()
        }
    },
    methods : {
        changeDelayType(item) {
            let type = item.index;
            this.currentState.projectRank = type;
            this.fetchProjectRank(type)
        },
        delayClick(item) {
            let seriesName = item.seriesName;
            let type = seriesName.charAt(seriesName.length-1);
            let size;
            type == '上' ? size = 'ge' :  size = 'lt';
            this.$router.push({
                path: '/schedule/projectBehind',
                query: {
                    name: item.name,
                    seriesName: size
                }
            }); 


        },
        //获取项目施工状态
        fetchProcessState() {
            this.$get(api.fetchProcessState(this.companyId),{
                ...this.commonParam
            }).then((res) => {
                let data = res.data;
                let resetData = utils.pieEchart(data,{
                    name: 'typeName',
                    key: 'count'
                }, 'typeId')
                //验收 在施 停工
                resetData.legend = [
                    resetData.legend[1],
                    resetData.legend[3],
                    resetData.legend[4]
                ];
                resetData.series = [
                    resetData.series[1],
                    resetData.series[3],
                    resetData.series[4]
                ];
                this.pieData = resetData
            }).catch((mes) => {
                this.pieData = []
            })
        },
        //获取项目列表
        fetchSearchList() {
            this.$get(api.fetchSearchList(this.companyId),{
                ...this.commonParam,
                orderBy: 'contractDelay'
            }).then((res) => {
                this.searchList = res.data;
                if (res.data.length) {
                    let firstData = res.data[0];
                     //存入首个项目Id
                    this.currentState.projectId = firstData.projectId;
                    this.changeJumpOption({
                        id: firstData.projectId,
                        name: firstData.projectName,
                        bimProjectId: firstData.bim5DProjectId,
                        workspaceId: firstData.workspaceId
                    });
                    //列表获取到之后，请求首个项目的数据
                    this.fetchMilestone(this.currentState.projectId);
                    this.fetchSchedulePlan(this.currentState.projectId);
                }
            })
        },
        //获取里程碑节点
        fetchMilestone(id) {
            this.$get(api.fetchMilestone(this.companyId, id),{
                ...this.commonParam
            }).then((res) => {
                let data = res.data;
                let list = data.milestoneList;
                let _len = list.length;
                if (_len) {
                    let series = [
                        {
                            name: '计划节点',
                            genre: 'planEndDate',
                            data: []
                        },
                        {
                            name: '实际节点',
                            genre: 'realEndDate',
                            data: []
                        },
                        {
                            name: '项目实际进度',
                            genre: 'realSchedule',
                            data: []
                        }
                    ]
                    // 计算有精度误差 只取整数部分
                    // 延迟时间
                    let delayDay = data.startDate ? parseInt((data.startDate - data.contractStartDate) / 1000 / 86400) : 0;
                    // 开工时间
                    let timeRange = {
                        planStartDate: data.contractStartDate,
                        realStartDate: data.startDate,
                        delay: delayDay
                    }
                    // 计算最大最小延迟天数，传入图表，保证缩放时锁定纵坐标数值
                    let delayGroup = list.map((item) => item.realEndDate ? item.delay : 0);
                    delayGroup.push(delayDay);
                    this.milestoneRange.min = (Math.min.apply(null, delayGroup) < 0) ? Math.min.apply(null, delayGroup) : -5;
                    this.milestoneRange.max = (Math.max.apply(null, delayGroup) > 0) ? Math.max.apply(null, delayGroup) : 5;
                    //0是计划节点
                    //delay为要取的字段
                    let dataArr = this.getDataArr(list,{
                        planEndDate: 0,
                        realEndDate: 'delay'
                    },'milestoneName', timeRange)
                    series.map((item) => {
                        let genre = item.genre;
                        if (genre !== 'realSchedule') { // 当item.genre 为 计划节点  和 实际节点时
                            item.data = dataArr[genre]
                        } else {
                            let start = data.startDate;
                            let currentTime = data.currDate;
                            if (start) {
                                item.data.push([start, 0, '开工'])
                                item.data.push([currentTime, 0, '当前进度'])
                            } else {
                                item.data.push([currentTime, 0, '-'])
                                item.data.push([currentTime, 0, '当前进度'])
                            }
                        }
                    })
                    this.milestoneData = series;
                } 
                
            })
            
        },
        //返回一个Object，key为类型字段genre，每个key存放一个array
        getDataArr(data, keys, name, range) {
            let obj = {};
            for (let key in keys) {
                let arr = [];
                if (!keys[key]) { // keys[key] = 0时
                    data.map((item) => {
                        let time = item[key]; // item['planEndDate'] 计划结束时间
                        let title = item[name]; // item['milestoneName'] // '地基施工'
                        arr.push([time, 0, title]);
                    })
                } else {
                    data.map((item) => { // realEndDate
                        let time = item[key]; // item['realEndDate'] 实际结束时间
                        let value = item[keys[key]] // item['delay'] 延迟时间
                        let title = item[name]; // item['milestoneName'] // '地基施工'
                        arr.push([time, value, title]);
                    })
                }
                // 后加的计划开始时间
                // 为了不影响代码统一
                // 此处非正常处理
                switch (key) {
                    case 'planEndDate':
                        // 默认取的都是计划结束时间
                        // 遍历完成后，把第一项强制变为开始时间
                        arr.unshift([range.planStartDate, 0, '开工']);
                        break;
                    case 'realEndDate':
                        arr.unshift([range.realStartDate, range.delay, '开工']);
                        break;
                    default:
                        break;
                }
                obj[key] = arr
            }
            return obj;
        },
        //获取施工计划
        fetchSchedulePlan(id) {
            this.$get(api.fetchSchedulePlan(this.companyId, id),{
                ...this.commonParam
            }).then((res) => {
                let data = res.data;
                let resetData = this.schedulePlanReset(data, {
                    key: 'stageId',
                    target: 'stageName',
                    date: 'date',
                    value: 'value',
                    day: 'day'
                });
                // console.log(resetData);
                this.planData = resetData
            }).catch((mes) => {
                this.planData = []
            })
        },
        /**
         * 施工计划总览
         * 重构数据源,根据接口返回数据定制，目前不好复用
         * @param {Array} data 数据源
         * @param {Object} config  [配置项]
         */
        schedulePlanReset(data, config) {
            let key = config.key;
            let target = config.target;
            let date = config.date;
            let value = config.value;
            let day = config.day;
            let arr = [];
            let stageGroup = {};
            let maxItem = {
                day: 0
            };
            let len = data.length;
            let addTime = 60000;
            for (let i = 0;i < len; i++) {
                let item = data[i];
                let nextItem = data[i + 1];
                maxItem = maxItem.day > item[day] ? maxItem : item;
                /**
                 * 存在下一项，每项的结束时间增加，防止相同时间覆盖时间轴的坐标文字
                 * 2018-01-03 ---> 暂时注释掉增加时间的代码
                 * 开头与结尾的时间不会增加，如果返回的最后一项阶段的时间和前面某个阶段时间重合，会不在一个点上
                  */
                // if (nextItem) {
                //     if (nextItem[key] !== item[key]) {
                //         item.date += addTime;
                //     // 滞后的项目也要加相同的时间，否则会导致不在一条线显示
                //     } else if (nextItem[key] === item[key] && nextItem[value] === item[value]) {
                //         item.date += addTime;
                //         nextItem.date += addTime;
                //     }
                // }
                // 如果没有就赋值
                if (!stageGroup[item[key]]) {
                    stageGroup[item[key]] = {
                        name: item[target],
                        genre : item[key],
                        data: [
                            [item[date], item[value], item[day]]
                        ],
                        last: false,
                        showDate: false
                    }
                // 相同字段的对象已有，在该对象下的data数组中存放新数据
                } else {
                    stageGroup[item[key]].data.push([item[date], item[value], item[day]]);
                }
                // 两端显示日期
                if (i === 0 || i === len - 1) stageGroup[item[key]].showDate = true;
            }
            // 标记天数最大一项
            stageGroup[maxItem[key]].last = true;
            // 标记线数据
            let markLine = [];
            // stageGroup一个key对应一个series
            for (let key in stageGroup) {
                let last = stageGroup[key].last;
                let data = stageGroup[key].data;
                let _len = data.length;
                // 计划可能有停滞阶段，只取两端的值放入标记线
                // 需求修改 计划中只显示开始时间，最后一项加入结束时间
                if (last) {
                    markLine.push(data[_len - 1]);
                } else {
                    markLine.push(data[0]);
                }
                arr.push(stageGroup[key]);
            }
            // 按时间正序排序
            markLine = markLine.sort((a, b) => {
                return a[0] - b[0];
            })
            // 在数组第一项加入时间线标注
            let opt = {
                name: arr[0].name,
                genre: arr[0].genre
            }
            arr.unshift({
                ...opt,
                data: markLine
            })
            // console.log(arr);
            // console.log(stageGroup);
            // console.log(markLine)
            return arr;
        },
        //滞后项目统计
        fetchDelayProject() {
            this.$get(api.fetchDelayProject(this.companyId),{
                ...this.commonParam
            }).then((res) => {
                let data = res.data;
                let delayData = data.delayData;
                let delayDay = data.delayDay;
                let chartData = utils.generateChartData(delayData, {
                    lt30: `滞后${delayDay}天以下`,
                    ge30: `滞后${delayDay}天以上`
                },'name')
                this.delayData = chartData.series
                this.delayOption.xAxis = chartData.column
            }).catch((mes) => {
                this.delayData = []
            })
        },
        //项目切换
        changeProject(item) {
            let id = item.index;
            this.changeJumpOption({
                id,
                name: item.title,
                bimProjectId: item.bimProjectId,
                workspaceId: item.workspaceId
            })
            this.fetchMilestone(id);
            this.fetchSchedulePlan(id)
        },
        //获取最新开工项目
        fetchNewStart() {
            this.$get(api.fetchNewStart(this.companyId),{
                ...this.commonParam
            }).then((res) => {
                this.newStartList = res.data
            }).catch((mes) => {
                this.newStartList = []
            })
        },
        //获取合同工期延误排名列表
        fetchProjectRank(type) {
            this.$get(api.fetchProjectRank(this.companyId, type),{
                ...this.commonParam
            }).then((res) => {
                let data = res.data;
                let arr = [];
                switch (type) {
                    case 'contractNode':
                        arr = []
                        data.map((item, index) => {
                            let maxContract = data[0].contractDelay;
                            arr.push({
                                projectId: item.projectId,
                                projectName: item.projectName,
                                durationCompletionRate: item.contractDelayRate.toFixed(2),
                                percent: (item.contractDelay/maxContract * 100).toFixed(2),
                                value: item.contractDelay + '天'
                            })
                        })
                        this.majorList = arr
                        break;
                    case 'milestoneNode':
                        arr = []
                        data.map((item) => {
                            let maxMilestone = data[0].milestoneNodeDelay;
                            arr.push({
                                projectId: item.projectId,
                                projectName: item.projectName,
                                durationCompletionRate: item.milestoneNodeDelayRate.toFixed(2),
                                percent: (item.milestoneNodeDelay/maxMilestone * 100).toFixed(2),
                                value: item.milestoneNodeDelay + '天'
                            })
                        })
                        this.majorList = arr
                        break;
                    case 'totalScheduleNode':
                        arr = []
                        data.map((item) => {
                            let maxTotal = data[0].totalScheduleDelay;
                            arr.push({
                                projectId: item.projectId,
                                projectName: item.projectName,
                                durationCompletionRate: item.totalScheduleDelayRate.toFixed(2),
                                percent: (item.totalScheduleDelay/maxTotal * 100).toFixed(2),
                                value: item.totalScheduleDelay + '天'
                            })
                        })
                        this.majorList = arr
                        break;
                    default:

                }
            }).catch((mes) => {
                this.majorList = []
            })
        },
        handlePieClick(item) {
            this.$router.push( {
                path :'/schedule/projectConstructionStatus',
                query: {
                    status: this.pieData.legend[item.dataIndex].extra
                }
            })
        },
        init() {
            this.fetchSearchList();
            this.fetchProcessState();
            this.fetchNewStart();
            this.fetchDelayProject();
            this.fetchProjectRank(this.currentState.projectRank)
        },
        // 点击新开工项目更多按钮事件
        handleNewProjectClick () {
            this.$router.push('/schedule/newProject');
        },
        // 点击工期延误排名风多按钮事件
        handleScheduleDelayRankClick () {
            this.$router.push({
                path: '/schedule/scheduleDelayRank',
                query: {
                    dropDefaultType: this.currentState.projectRank,
                }
            });
        },
        // 项目点击
        handleProjectClick(item) {
            let id = item.id ? item.id : item.projectId;
            let name = item.projectName;
            this.toProjectAccount({
                id,
                name,
                rootId: this.rootId,
                companyId: this.companyId,
                companyName: this.companyName,
                origin: this.origin,
                originName: this.originName
            })
        },
        handleClickGo () {
            this.$router.push({
                path: '/schedule/projectBehind',
                query: {
                    name: '合同开工节点',
                    seriesName: 'all'
                }
            }); 
        }
    },
    created () {
        // limit为初始值不发请求  防止与watch limit 中的初始化冲突造成两次初始化的情况
        if (this.limit[0] === 1) return
        this.init()
    }
  }
</script>

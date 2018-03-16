<template>
	<div class="wechat-page">
		<!-- <mt-cell title="标题文字"></mt-cell> -->
        <mt-cell title="姓名" v-model="physicalTest.studentName"></mt-cell>
        <mt-cell title="性别" v-model="physicalTest.isMan"></mt-cell>
        <mt-cell title="学号" v-model="physicalTest.studentNo"></mt-cell>
        <mt-cell title="大学" v-model="physicalTest.collegeName"></mt-cell>
        <mt-cell title="班级" v-model="physicalTest.className"></mt-cell>
        
        <mt-cell title="身高" v-model="physicalTest.height"></mt-cell>
        <mt-cell title="体重" v-model="physicalTest.weight"></mt-cell>
        <mt-cell title="肺活量" v-model="physicalTest.vitalCapacity"></mt-cell>
        <mt-cell title="立定跳远" v-model="physicalTest.standingLongJump"></mt-cell>
        <mt-cell title="坐位体前屈" v-model="physicalTest.sitAndReach"></mt-cell>
        <mt-cell title="一分钟仰卧起坐" v-model="physicalTest.oneMinuteSitUp"></mt-cell>
        <mt-cell title="引体向上" v-model="physicalTest.pullUp"></mt-cell>
        <mt-cell title="50米" v-model="physicalTest.fiftyRunTime"></mt-cell>
        <mt-cell title="800米" v-model="physicalTest.eightHundredRunTime"></mt-cell>
        <mt-cell title="1000米" v-model="physicalTest.oneThousandRunTime"></mt-cell>
        <mt-cell title="总分" v-model="physicalTest.totalScore"></mt-cell>
        <!-- <mt-cell title="标题文字" is-link>
            <span style="color: green">这里是元素</span>
        </mt-cell> -->
	</div>
</template>

<script>
	import resources from '../resources'
    
    //根据条件信息筛选体测记录
    const coursePhysicalQuery = `
        query(
            $openId: String
        ){
            allstudents:StudentCoursesPhysicalTestSingle(
                openId: $openId
            ){
                id
                isMan
                studentNo
                collegeName
                studentName
                className
                totalScore
                height
                weight
                vitalCapacity
                standingLongJump
                sitAndReach
                oneMinuteSitUp
                pullUp
                fiftyRunTime
                eightHundredRunTime
                oneThousandRunTime
                }
            }
        }
    `;

	export default {
		data() {
			return {
                openid: '',
                universityId: resources.universityId,
                classId: this.$route.params.classId,
                pageSize: 10,
                pageNumber: 1,
                dataCount: 0,
                loading: false,
                showClassSelectButton: false,
                options: {
                    teacherName: [],
                    schoolYear: [],
                    courseName: [],
                    courseTime: [],
                },
                filters: {
                    studentName: '',
                    studentNo: '',
                    className: '',
                    testResult: '',
                    schoolYear: '',
                    term: '',
                    teacherName: '',
                    courseName: '',
                    courseTime: ''
                },
                physicalList: [],
                teacherNameList: [],

                showDialog: false,
                form: {
                },
                result: '',
                mistakeMes: '',
                physicalTest: {
                    id: '',
                    isMan: false,
                    studentNo: "",
                    collegeName: "",
                    studentName: "",
                    className: "",
                    totalScore: 0,
                    height: 0,
                    weight: 0,
                    vitalCapacity: 0,
                    standingLongJump: 0,
                    sitAndReach: 0,
                    oneMinuteSitUp: 0,
                    pullUp: 0,
                    fiftyRunTime: 0,
                    eightHundredRunTime: 0,
                    oneThousandRunTime: 0
                }
			}
		},
		watch: {
		},
		methods: {
			getData(){
                console.log("OPEN-ID：");
                console.log(this.openid);

                let params = {
                    "openId": this.openid
                    // "openId": this.openid
                };
                let _this = this;
                this.loading = true;
                // _this.physicalTest = [];
                this.$ajax.post(`${resources.graphQlApi}`,{
                                'query': `${coursePhysicalQuery}`,
                                variables: params
                    })
                    .then(res => {
                        console.log(res);
                        this.loading = false;
                        this.physicalTest = res.data.data.allstudents;
                        if (this.physicalTest.isMan) {
                            this.physicalTest.isMan = '男';
                        } else {
                            this.physicalTest.isMan = '女';
                        }
                    });
            },
			
		},
		mounted: function () {
            
			this.openid = getQueryString('openid') || getCookie('openid');
			// 获取url参数
			function getQueryString(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) return unescape(r[2]);
				return null;
			}

			// 获取cookies
			function getCookie(name) {
				var arr = document.cookie.split('; ');
				var i = 0;
				for (i = 0; i < arr.length; i++) {
					var arr2 = arr[i].split('=');
					if (arr2[0] == name) {
						var getC = decodeURIComponent(arr2[1]);
						return getC;
					}
				}
				return '';
            }
           
            this.getData();
		}
	}

</script>

<style lang="scss" scoped>
	
</style>
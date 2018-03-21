<template>
    <div class="loan-rate">
        <div class="top">
            <div class="top-title">
                {{physicalTest.collegeName}}    {{physicalTest.className}}
                <br/>
                {{physicalTest.studentNo}}  {{physicalTest.studentName}}的体测查询</div>
        </div>
        <div class="second-title">
            <!-- <div class="label"></div> -->
            <!-- <div class="right-word"> {{physicalTest.collegeName}}    {{physicalTest.className}}</div> -->
            <div class="separate-border"></div>
        </div>
        <div class="first-table">
            <table class="mytable">
                <tr>
                    <th>项目</th>
                    <th>成绩</th>
                    <th>分数</th>
                    <th>评价</th>
                </tr>
                <tr>
                    <td>BMI</td>
                    <td>{{BMI}}</td>
                    <td>/</td>
                    <td v-if="BMI < 18.5">
                        过轻
                    </td>
                    <td v-if="BMI >= 18.5 && BMI < 23.9">
                        正常
                    </td>
                    <td v-if="BMI >= 23.9 && BMI < 27">
                        过重
                    </td>
                    <td v-if="BMI >= 27 && BMI < 32">
                        肥胖
                    </td>
                    <td v-if="BMI >= 32">
                        非常肥胖
                    </td>
                </tr>
                <tr>
                    <td>身高</td>
                    <td>{{physicalTest.height}} cm</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>体重</td>
                    <td>{{physicalTest.weight}} kg</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>肺活量</td>
                    <td>{{physicalTest.vitalCapacity}} ml</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>立定跳远</td>
                    <td>{{physicalTest.standingLongJump}} cm</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>坐位体前屈</td>
                    <td>{{physicalTest.sitAndReach}} cm</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>仰卧起坐</td>
                    <td>{{physicalTest.oneMinuteSitUp}} 次</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>引体向上</td>
                    <td>{{physicalTest.pullUp}} 次</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>50米</td>
                    <td>{{physicalTest.fiftyRunTime}} s</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>800米</td>
                    <td>{{physicalTest.eightHundredRunTime}} min</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>1000米</td>
                    <td>{{physicalTest.oneThousandRunTime}} min</td>
                    <td>/</td>
                    <td>/</td>
                </tr>
                <tr>
                    <td>总分</td>
                    <td>/</td>
                    <td>{{physicalTest.totalScore}}</td>
                    <td>/</td>
                </tr>
            </table>
            <!-- <br/> -->
            
            <div class="mywords">
                注意：男生仰卧起坐和800米为空，女生引体向上和1000米为空。
            </div>
        </div>
        
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
                },
                BMI: 0
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
                        if (res != null) {
                            this.loading = false;
                            this.physicalTest = res.data.data.allstudents;
                            if (this.physicalTest.isMan) {
                                this.physicalTest.isMan = '男';
                            } else {
                                this.physicalTest.isMan = '女';
                            }
                            this.BMI = (this.physicalTest.weight / 
                                ((this.physicalTest.height / 100.0) * (this.physicalTest.height / 100.0))).toFixed(2);
                        } else {
                            this.$toast('没有查到您的体测信息'); 
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


<style lang="scss">
    .loan-rate{
        background: #fff;
        position: absolute;
        width: 100%;
        top: 1px;
        bottom: 1px;
        .top{
            height: 12%;
            text-align: center;
            .top-title{
                font-weight: bold;
                color: #5497dd;
                position: relative;
                top: 50%;
                font-size: 1.3rem;
                transform: translateY(-50%);
            }
        }

        .second-title{
            .label{
                margin-left: 1rem;
                display: inline-block;
                background-color: black;
                height:0.6rem;
                width: 2%;
            }
            .right-word{
                display: inline-block;
                margin-left: 0.2rem;
                font-size: 0.6rem;
            }
            .separate-border{
                margin-left: 0.8rem;
                margin-top: 0.5rem;
                border:1px dashed #c5c5c5;
            }
        }

        .first-table{
            height: 25%;
            margin-top: 1rem;
            text-align: center;
            .mytable{
                width: 99%;
                text-align: center;
                margin:0 auto;
                border-spacing: 0px;
                border-collapse: collapse;
                th{
                    font-size: 1.1rem;
                    vertical-align:middle; text-align:center;
                    height:2.2rem;
                    width: 25%;
                    border:solid 1px #c5c5c5;
                }
                td{
                    font-size: 1.1rem;
                    vertical-align:middle; text-align:center;
                    height:2.2rem;
                    width: 25%;
                    border:solid 1px #c5c5c5;
                }
            }
            .mywords{
                font-size: 1rem;
                padding-top: 0.5rem;
                line-height: 1.3rem;
                text-align: left;
                width: 90%;
                margin: 0 auto;
                color: #969293;
            }
        }     

        .third-title{
            margin-top: 2rem;
            .label{
                margin-left: 1rem;
                display: inline-block;
                background-color: black;
                height:0.6rem;
                width: 2%;
            }
            .right-word{
                display: inline-block;
                margin-left: 0.2rem;
                font-size: 0.6rem;
            }
            .separate-border{
                margin-left: 1rem;
                margin-top: 0.5rem;
                border:1px dashed #c5c5c5;
            }
        }
    }
</style>
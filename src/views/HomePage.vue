<!--  微页面  -->
<template>
	<div class="wechat-page">
		<div v-if="step === 1" class="page-1">
			<label>学校</label>
			<select v-model="loginForm.universityId">
				<option value='' disabled selected style='display:none;'>请选择您当前就读学校</option>
				<option v-for="universitiy in universities" :value="universitiy.id">{{universitiy.name}}</option>
			</select>

			<label>学号</label>
			<input size="large" type="text" v-model="loginForm.studentNo" placeholder="请输入您的学号">

			<label>姓名</label>
			<input size="large" type="text" v-model="loginForm.name" placeholder="请输入您的姓名">
			<p v-if="verifyError" class="error-msg">该账号不存在，请联系客服 </p>
		</div>
		<div v-if="step === 2" class="page-3">
			<label>新密码</label>
			<input min="6" max="12" size="large" type="password" v-model="loginForm.password" placeholder="请输入6~12位，包含英文或者数字的密码">
			<label>再次输入密码</label>
			<input min="6" max="12" size="large" type="password" v-model="loginForm.rePassword" placeholder="请输入6~12位，包含英文或者数字的密码">
			<p v-if="passError" class="error-msg">{{passErrorMsg}}</p>
			<p class="protocol">
				<el-checkbox v-model="agree"></el-checkbox>
				我已认真阅读并接受光氧运动的 <a href="javascript:;" @click="openDialog()">《用户协议》</a>
			</p>
			<el-dialog title="用户协议" :visible.sync="agreeVisible" size="large">
				<div class="agree-content" id="agree-content">
					1、条款的确认和接纳</br>
					请务必认真阅读和理解《光氧运动App安装许可使用协议》，您一旦安装、复制、下载、访问或者以其他方式使用本软件产品，将视为对本协议的接受，即表示您同意接收本《协议各项条款的约束》。</br>

					2、光氧运动App课外锻炼加入了第二层防作弊参数，能有效监控学生的跑步情况。若采用自行车、电动车、滑板车等交通工具或者一人带多只手机等作弊行为，如被App后台或人工监控发现不正常数据，则本次跑步次数作废，如本学期出现3次以上此类情况，本学期课外锻炼分为0分,严重者以作弊行为上报教务处处理。</br>

					3、课外锻炼次数要求：15周内完成规定次数（见评价表），锻炼时间由学生自行安排，每人每天可以跑多次，有效刷卡一天只能算一次。请在规定时间内完成打卡次数，超出规定时间，则按照不合格处理。</br>

					4、用户必须做好参加锻炼的各项准备工作，包括穿合适的运动服、运动鞋，充足的睡眠、合理的营养等，做好跑前热身运动和跑后的放松运动。锻炼中有任何不适，应停止锻炼，尽快到校内医务室就诊。</br>

					5、用户使用本产品时，应注意自身安全，防止摔倒。当用户出现摔打、手机掉落、手机碎屏、遭到他人侵犯等情形时，一切责任由用户自己或侵权方承担，光氧运动App及其运营者不承担任何责任。</br>

					6、用户可通过手机App及时查询自己相关课外锻炼信息，如对成绩记录、软件及其他信息有疑问，请通过微信公众号联系客服。</br>

					7、光氧运动App及运营商不能保证网络服务的持续性、及时性、安全性、满意度；同时也不能保证信息准确、及时传送等，即使用户正当使用光氧运动App仍有所遭受损失的可能，该损失由用户自行承担，光氧运动App及其运营商不承担任何责任。</br>

					8、用户在使用光氧运动App时须遵守所有使用网络会员服务的网络协议、服务规则和程序；不得干扰网络服务，不得未经许可而非法进入其他手机系统。</br>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button :disabled="!isBottom" @click="agreeProtocol()">同意协议</el-button>
				</span>
			</el-dialog>
		</div>
		<el-button @click="step == 1 ? next() : submit()" :disabled="isLoading || (step == 2 && !agree) ">{{step == 1 ? '下一步' : '提交'}}</el-button>
	</div>
</template>

<script>
	import resources from '../resources'
	import md5 from 'js-md5'
	import { Loading, Message } from 'element-ui'
	import $ from 'jquery'

	const universitiesQuery = `
	{
		universities {
			id
			name
		}
	}`;

	const studentQuery = `
	query(
		$universityId: Long
		$studentNo: String
		$name: String
	){
		student(
			universityId: $universityId,
			studentNo: $studentNo
			name: $name
		){
			name
			id
			userId
		}
	}`

	export default {
		data() {
			return {
				step: 1,
				openid: '',
				agreeVisible: false,
				isLoading: false,
				agree: false,
				universities: [],
				loginForm: {
					// 测试账号: 15210231110 name: 林金鸿
					universityId: 1,
					studentNo: '',
					name: '',
					password: '',
					rePassword: '',
				},
				userId: '',
				verifyError: false, // 学号与姓名验证结果
				passError: false,
				passErrorMsg: '',
				isBottom: false,
			}
		},
		watch: {
			'loginForm': {
				handler: function (val, oldval) {
					this.isLoading = false;
					this.verifyError = false;
					this.passError = false;
				},
				deep: true //对象内部的属性监听，也叫深度监听
			}
		},
		methods: {
			getUniversities() {
				this.$ajax.post(`${resources.graphQlApi}`, {
					'query': `${universitiesQuery}`
				})
					.then(res => {
						this.universities = res.data.data.universities;
					});
			},
			next() {
				let _this = this;

				if (!this.loginForm.name || !this.loginForm.universityId || !this.loginForm.studentNo) {
					Message.error({
						message: '学校／学号／姓名不能为空'
					})
					return;
				}

				let params = {
					universityId: this.loginForm.universityId,
					studentNo: this.loginForm.studentNo.trim(),
					name: this.loginForm.name.trim()
				}
				_this.isLoading = true;
				this.$ajax.post(`${resources.graphQlApi}`, {
					'query': `${studentQuery}`,
					variables: params
				})
					.then(res => {
						if (res.data.data.student) {
							try {
								_this.userId = res.data.data.student.userId;
								// 调用一次user更新接口，更新userid
								let updateUrl = resources.users(_this.userId);
								this.$ajax({
									method: 'post',
									url: updateUrl,
									timeout: 10000,
									params: {
										'openid': _this.openid
									}//this is important !
								}).then((res) => {
									console.log('成功更新openid')
									Message.success({
										message: '学籍信息验证成功！'
									})
									_this.step++;
									_this.isLoading = false;
								})
							} catch (e) {
								alert(e)
							}
						} else {
							_this.verifyError = true;
						}
					});
			},
			submit() {
				let _this = this;
				let reg = /^[0-9a-zA-Z]+$/;
				if (this.loginForm.password !== this.loginForm.rePassword) {
					_this.passError = true;
					_this.passErrorMsg = '两次密码输入不一致，请重新输入';
					return
				}

				if (this.loginForm.password.length < 6 || this.loginForm.password.length > 12 || !reg.test(this.loginForm.password)) {
					_this.passError = true;
					_this.passErrorMsg = '请输入6~12位，包含英文或者数字的密码';
					return;
				}

				_this.passError = false;
				let url = resources.users(this.userId);
				this.$ajax({
					method: 'post',
					url: url,
					timeout: 10000,
					params: {
						'studentNo': this.loginForm.studentNo,
						'password': md5(this.loginForm.password),
						'openid': this.openid
					}//this is important !
				}).then((res) => {
					Message.success({
						message: '成功更新密码！'
					});
					window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.guangyangyundong.sport';
				})

			},
			openDialog() {
				let _this = this;
				this.agreeVisible = true;
				setTimeout(function() {
					document.getElementById("agree-content").addEventListener("scroll", function(){
						var $this = $(this),
						viewH = $this.height(),//可见高度
						contentH = $this.get(0).scrollHeight,//内容高度
						scrollTop = $this.scrollTop();//滚动高度
						if(scrollTop / (contentH - viewH) >= 0.95){ //到达底部100px时,加载新内容
							_this.isBottom = true;
						}
					});
				}, 200);
			},
			agreeProtocol() {
				this.agreeVisible = false;this.agree = true;
			}
		},
		mounted: function () {
			this.getUniversities();
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
		}
	}

</script>

<style lang="scss" scoped>
	.wechat-page {
		color: #fff;
		background: #66a6ff;
		height: 100%;
		width: 100%;
		.page-1,
		.page-3 {
			padding: 10px;
		}
		.page-2 {
			text-align: center;
			padding: 0;
			padding-top: 60px;
		}
		label {
			display: block;
			margin: 10px 0;
			font-size: 16px;
		}
		select {
			width: 90%;
			color: #fff;
			border: none;
			border-radius: 0;
			border-bottom: 1px solid #fff;
			outline: none;
			background: transparent;
			margin: 5px;
		}

		input {
			color: #fff;
			background: transparent;
			border: none;
			border-bottom: 1px solid #fff;
			width: 90%;
			outline: none;
			margin: 5px;
		}

		button {
			width: 95%;
			height: 35px;
			/* background: #fff;
			border: 1px solid #ccc; */
			border-radius: 12px;
			outline: none;
			margin: 0 auto;
			margin-top: 10px;
			display: block;
		}

		::-webkit-input-placeholder {
			/* WebKit browsers */
			color: #fff;
		}

		:-moz-placeholder {
			/* Mozilla Firefox 4 to 18 */
			color: #fff;
		}

		::-moz-placeholder {
			/* Mozilla Firefox 19+ */
			color: #fff;
		}

		:-ms-input-placeholder {
			/* Internet Explorer 10+ */
			color: #fff;
		}
		.el-form-item__content {
			width: 90%;
		}
		.avatar-uploader .el-upload {
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}
		.avatar-uploader .el-upload:hover {
			border-color: #20a0ff;
		}
		.avatar-uploader-icon {
			font-size: 28px;
			color: #fff;
			width: 178px;
			height: 178px;
			line-height: 178px;
			text-align: center;
			border: 3px solid #fff;
			border-radius: 50%;
		}
		.avatar {
			width: 178px;
			height: 178px;
			display: block;
		}
		.error-msg {
			font-size: 12px;
			color: #59f4df;
			margin: 5px;
		}
		.protocol {
			font-size: 12px;
			color: #fff;
			a {
				color: #fff;
			}
			label {
				display: inline-block;
			}
		}
		.agree-content {
			height: 390px;
			overflow: auto;
			display: inline-block;
		}
	}
</style>

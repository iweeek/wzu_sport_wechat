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
					《腾讯游戏许可及服务协议》（以下简称“本协议”）由您与腾讯游戏服务提供方共同缔结，本协议具有合同效力。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制腾讯责任的条款、对用户权利进行限制的条款、约定争议解决方式和司法管辖的条款，以及开通或使用某项服务的单独协议。前述限制、免责及争议解决方式和管辖条款可能以黑体加粗或其他合理方式提示您注意。
						除非您已阅读并接受本协议所有条款，否则您无权使用腾讯游戏服务。您使用腾讯游戏服务即视为您已阅读并同意签署本协议。
						如果您未满18周岁，请在法定监护人的陪同下阅读本协议，并特别注意未成年人使用条款。
						一、【定义】
						1.1 本协议：指本协议正文、《腾讯服务协议》、《QQ号码规则》、游戏规则及其修订版本。上述内容一经正式发布，即为本协议不可分割的组成部分。本协议同时还包括文化部根据《网络游戏管理暂行办法》（文化部令第49号）制定的《网络游戏服务格式化协议必备条款》。
						1.2 游戏规则：指腾讯游戏服务提供方不时发布并修订的关于腾讯游戏的用户守则、玩家条例、游戏公告及通知等内容。
						1.3 腾讯游戏服务提供方：指向您提供腾讯游戏及其服务的深圳市腾讯计算机系统有限公司，在本协议中简称为“腾讯”。
						1.4 腾讯游戏：指由腾讯负责运营的游戏的统称，包括计算机客户端游戏、网页游戏、HTML5游戏（H5游戏）、移动终端游戏、电视端游戏以及其他形式的游戏；腾讯游戏可能以软件形式提供，这种情况下，腾讯游戏还包括该相关软件及相关文档。
						1.5 腾讯游戏服务：指腾讯向您提供的与游戏相关的各项在线运营服务。
						1.6 您：又称“玩家”或“用户”，指被授权使用腾讯游戏及其服务的自然人。
						1.7 游戏数据：指您在使用腾讯游戏过程中产生的被服务器记录的各种数据，包括游戏日志、安全日志等数据。
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
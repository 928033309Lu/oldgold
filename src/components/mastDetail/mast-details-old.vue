<template>
    <el-dialog :modal="false"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               custom-class="tower-details"
			   width="91%"
			   height="88%"
			   id="detailWrapper"
			   style="background:rgba(0,0,0,0);"
               :center="true"
			   @close="closeDetail">
        <div  class="contentBox">
			<div  class="jiantouBox">
				<span class="jiantou" @click="onOpenVisible(false)" v-show="styleVisible"><icon class="rightIcon" name="arrow-right-copy"></icon></span>
				<span class="jiantou" @click="onOpenVisible(true)" v-show="!styleVisible"><icon class="rightIcon2" name="arrow-right-copy"></icon></span>
			</div>
			<div class="title">
				[ {{towerInfo.name}} 号测风塔] 
				<span style="padding-right: 25px;"> ———<b>·</b></span>
				<span class="col">起止日期：{{start_data}} — {{end_data}}</span>
			</div>
            <div class="mastDetailHeader">
                
                <!-- <div class="lineAndCycle"></div> -->
                <!-- <div class="close"  @click="closeDetail"><i class="el-dialog__close el-icon el-icon-close"></i></div> -->

                <div class="leftBox leftBoxMargin" >
                    <div>
						<div class="left_head">
							<div>风向、风能分布图</div>
							<div>
								<span>高度：</span>
								<span v-show="all_heightArr.length==1"
								:style="{color:'#33C86F'}"
								>{{all_heightArr[0]}}m</span>

								<select class="select"
								v-show="all_heightArr.length!=1"
								:style="{color:'#33C86F'}"
								
								 @change="selectChange($event)" >
								 	
									<option 
									v-for="(item,index) of all_heightArr"
									:key="index"
									
									:value="item">{{item}}m</option>
									
								</select>
							</div>
                        </div>
						<div class="left_biao1">风向分布图</div>
						<div class="biao1">
							<span></span>
							风向
						</div>
						<e-charts id="aaa" ref="echarts1" class="echart" :style="{width:main1Style.width+'px',height:main1Style.height+'px'}" :options="chart1" :autoResize="true"></e-charts>
                    </div>
					<div>
						<div class="left_biao2">风能分布图</div>
						<div class="biao2">
							<span></span>
							风能
						</div>
						<e-charts ref="echarts2" class="echart" :style="{width:main1Style.width+'px',height:main1Style.height+'px'}" :options="chart2" :autoResize="true"></e-charts>
					</div>
                </div>
                <div class="rightBox rightBoxnone" >
                    <div>
                        <p><span>湍流曲线图</span></p>
						<div class="biao3">
							代表湍流 
							<div class="fanzhuan3">(lrep)</div>
						</div>
						<e-charts ref="echarts3" class="echart" :style="{width:main2Style.width+'px',height:main2Style.height+'px'}" :options="chart3" :autoResize="true"
						@legendselectchanged= "legendselect($event)"></e-charts>
						
                    </div>
                    <div>
						<p><span>威布尔分布图</span> </p>
						<div class="biao4">频率</div>
						<!-- <div id="main4" :style="main4Style"></div> -->
						<e-charts ref="echarts4" class="echart" :style="{width:main2Style.width+'px',height:main2Style.height+'px'}" :options="chart4" :autoResize="true"></e-charts>
                    </div>
				</div>
				<div class="rightrightBox rightBoxnone rightBoxnone3" v-show="main3Style.width>0" :style="{width:main3Style.width+'px'}">
					<div :style="{height:(main3Style.height)+'px'}">
							<p class="imgbox" ><el-input v-model="imgName1" type="text" :readonly="!readonlyActive" placeholder="请输入标题"></el-input> 
								<el-tooltip  
								effect="light" 
								popper-class="onmytooltip"
								content="编辑"
								:visible-arrow="false"
								placement="top">
								<b v-if="enManager" @click.stop="readonlyActive = true" v-show="!readonlyActive" class="iconbox"><icon name="bianji"></icon></b>
								</el-tooltip>
								
								<small @click.stop="onfanhui" v-show="readonlyActive" class="iconbox">保存</small>
								
							</p>
							<div style="border: none;position: relative;height: 80%;">
								<img v-if="imageUrl1" :src="imageUrl1" :style="{height:(main3Style.height-35)+'px'}" class="avatar">
								<!-- <el-image
								v-if="imageUrl1"
								:style="{height:(main3Style.height-35)+'px'}" class="avatar"
								:src="imageUrl1"
								fit="fit"></el-image> -->
								<span class="avatar-uploader-icon" @click.stop="upload1" v-if="readonlyActive"><i class="el-icon-plus"></i></span>	
								<span class="avatar-uploader-icon2" @click.stop="onRemove1" v-if="readonlyActive"><icon name="remove"></icon></span>	
							</div>
					</div>
					<div :style="{height:(main3Style.height)+'px'}">
							<p class="imgbox" ><el-input v-model="imgName2" type="text" :readonly="!readonlyActive2" placeholder="请输入标题"></el-input>
								<el-tooltip  
								effect="light" 
								popper-class="onmytooltip"
								content="编辑"
								:visible-arrow="false"
								placement="top">
								<b v-if="enManager" @click.stop="readonlyActive2 = true" v-show="!readonlyActive2" class="iconbox"><icon name="bianji"></icon></b>
								</el-tooltip>
								
								<small @click.stop="onfanhui2" v-show="readonlyActive2" class="iconbox">保存</small>
							</p>
							<div style="border: none;position: relative;height: 80%;">
								<img v-if="imageUrl2" :src="imageUrl2" :style="{height:(main3Style.height-35)+'px'}" class="avatar">
								<!-- <el-image
								v-if="imageUrl2"
								:style="{height:(main3Style.height-35)+'px'}" class="avatar"
								:src="imageUrl2"
								fit="fit"></el-image> -->
								<span class="avatar-uploader-icon" @click.stop="upload2" v-if="readonlyActive2"><i class="el-icon-plus"></i></span>							
								<span class="avatar-uploader-icon2" @click.stop="onRemove2" v-if="readonlyActive2"><icon name="remove"></icon></span>						
							</div>
					</div>
				</div>
			</div>
			<el-upload
				class="avatar-uploader"
				:action="'/mast_pic/'+$store.state.app.projectId"
				:show-file-list="false"
				:http-request="httpRequest1"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload">
				<button ref="buttonUpload1">上传1</button>
			</el-upload>
			<el-upload							
				class="avatar-uploader"
				:action="'/mast_pic/'+$store.state.app.projectId"
				:show-file-list="false"
				:http-request="httpRequest2"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload">
				<button ref="buttonUpload2">上传2</button>
			</el-upload>
        </div>
    </el-dialog>
</template>

<script>
	import tubiaos from './tuBiao.js';
	
	import util from '@/libs/util';
    import ECharts from '../../echarts/ECharts';
	// import echarts from "echarts";
    import { fixedNumber } from '@/libs/function-util';
    import { baseTooltipFormatter } from '@/libs/echarts-util';
    export default {
        name: 'mast-details',
		components: {ECharts},
        data () {
            return {
				readonlyActive: false,
				readonlyActive2: false,
				imageUrl1:"",
				imageUrl2:"",
				imgName1:"",
				imgName2:"",
                dialogVisible: false,
                towerInfo: {},
				heights:"",
				chart1: null,
				chart2: null,
				chart3: null,
				chart4: null,
				all_heightArr:[],
				myall_heightArr:[],
				start_data:"",
				end_data:"",
				main1Style:{
					width: 0,
					height: 0  //下面写了不同分辨率高度
				},
				main2Style:{
					width: 0,
					height: 0  //下面写了不同分辨率高度
				},
				main3Style:{
					width: 0,
					height: 0
				},
				main2TipWidth : (document.documentElement.clientWidth*0.65-210),
				styleVisible: true,
				weibull_series:[],
				weibull_xAxis:[],
				// roleShow:false   //权限
            };
        },
		updated() {
		   //屏幕变化触发
		   let that = this;
		   if(this.chart3 && this.chart3.legend){
			   this.chart3.legend.y = 9;
			   this.chart4.legend.y = 9;
		   }
		   if(this.styleVisible){
				this.$refs['echarts1'] && this.$refs['echarts1'].refresh2();
				this.$refs['echarts2'] && this.$refs['echarts2'].refresh2();
				this.$refs['echarts3'] && this.$refs['echarts3'].refresh2();
				this.$refs['echarts4'] && this.$refs['echarts4'].refresh2();
				if(this.chart3){
					this.chart3.grid.right = "9%";
					this.chart4.grid.right = "9%";
				}
				window.onresize = function temp() {
					that.main1Style.width = (document.documentElement.clientWidth*0.30-70);
					that.main1Style.height = (document.documentElement.clientHeight*0.30);
					that.main2Style.width = (document.documentElement.clientWidth*0.65-100);
					that.main2Style.height = (document.documentElement.clientHeight*0.30);
					that.main3Style.width = 0;
					that.main3Style.height = (document.documentElement.clientHeight*0.30+35);
					// that.main2TipWidth = (document.documentElement.clientWidth*0.65-210);
					if(window.screen.width < 1900 && window.screen.width >= 1600){
						that.main1Style.width = (document.documentElement.clientWidth*0.30-60);
					}
					if(window.screen.width < 1900 && window.screen.width >= 1600 && window.screen.height == 900){
						that.main1Style.width = (document.documentElement.clientWidth*0.30-55);
					}
					if(window.screen.width < 1600 && window.screen.width >= 1400 ){
						that.main2Style.width = (document.documentElement.clientWidth*0.65-80);
						// that.main2TipWidth = (document.documentElement.clientWidth*0.65-180);
					}
					if(window.screen.width < 1400 && window.screen.width >= 1360){
						that.main1Style.width = (document.documentElement.clientWidth*0.30-45);
						// that.main2TipWidth = (document.documentElement.clientWidth*0.65-200);
					}
					if(window.screen.width < 1360){
						that.main1Style.width = (document.documentElement.clientWidth*0.30-45);
					}
					
					// if(that.chart3 && that.chart3.legend){
					// 	that.chart3.legend.x = that.main2TipWidth;
					// 	that.chart4.legend.x = that.main2TipWidth;
					// }
				};
			}
			else{
				this.$refs['echarts1'] && this.$refs['echarts1'].refresh2();
				this.$refs['echarts2'] && this.$refs['echarts2'].refresh2();
				this.$refs['echarts3'] && this.$refs['echarts3'].refresh2();
				this.$refs['echarts4'] && this.$refs['echarts4'].refresh2();
				if(this.chart3){
					this.chart3.grid.right = "15%";
					this.chart4.grid.right = "15%";
				}
				window.onresize = function temp() {
					that.main1Style.width = (document.documentElement.clientWidth*0.26-75);
					that.main1Style.height = (document.documentElement.clientHeight*0.30);
					that.main2Style.width = (document.documentElement.clientWidth*0.49-160);
					that.main2Style.height = (document.documentElement.clientHeight*0.30);
					that.main3Style.width = (document.documentElement.clientWidth*0.20+200);
					that.main3Style.height = (document.documentElement.clientHeight*0.30+35);
					// that.main2TipWidth = (document.documentElement.clientWidth*0.49-260);
					if(window.screen.width < 1900 && window.screen.width >= 1600){
						that.main3Style.width = (document.documentElement.clientWidth*0.24-10);
					}
					if(window.screen.width < 1900 && window.screen.width >= 1600 && window.screen.height == 900){
						that.main3Style.width = (document.documentElement.clientWidth*0.24);
					}
					if(window.screen.width < 1600 && window.screen.width >= 1400 ){
						that.main3Style.width = (document.documentElement.clientWidth*0.24+10);
					}
					if(window.screen.width < 1600 && window.screen.width >= 1400 && window.screen.height == 1050){
						that.main3Style.width = (document.documentElement.clientWidth*0.24+10);
					}
					if(window.screen.width < 1400 && window.screen.width >= 1360){
						that.main1Style.width = (document.documentElement.clientWidth*0.26-40);
						that.main3Style.width = (document.documentElement.clientWidth*0.24-10);
						// that.main2TipWidth = (document.documentElement.clientWidth*0.49-250);
					}
					if(window.screen.width < 1360){
						that.main1Style.width = (document.documentElement.clientWidth*0.26-40);
						that.main3Style.width = (document.documentElement.clientWidth*0.24);
					}
					
					// if(that.chart3 && that.chart3.legend){
					// 	that.chart3.legend.x = that.main2TipWidth;
					// 	that.chart4.legend.x = that.main2TipWidth;
					// }
				};
			}
		},
		watch: {
			
		},
		computed: {
			enManager: function () {
				if(this.$store.state.user.loginUserInfo.role !=9 && this.$store.state.user.loginUserInfo.role !=1 && this.$store.state.user.loginUserInfo.role !=11 && this.$store.state.user.loginUserInfo.role !=12){
					return false;
				}else{
					return true;
				}
			}
		},
        methods: {
			upload1 () {
				if(!this.imgName1){
					this.$message.warning("请输入图片名称!")
					return;
				}
				if(this.imgName1 == this.imgName2 ){
					this.$message.warning("两个图片名字不能重复！")
					return;
				}
                this.$refs.buttonUpload1.click();
            },
			upload2 () {
				if(!this.imgName2){
					this.$message.warning("请输入图片名称!")
					return;
				}
				if(this.imgName1 == this.imgName2 ){
					this.$message.warning("两个图片名字不能重复！")
					return;
				}
                this.$refs.buttonUpload2.click();
			},
			onRemove1(){
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				};
				util.ajax.delete("/mast_pic/"+this.$store.state.app.projectId+"?mast_name="+this.towerInfo.name+"&location=top",config)
				.then((res) => {
					this.$message.success(res.data.data);
					if(res.data.code==200){
						this.imageUrl1 = "";
						this.imgName1 = "";
						this.readonlyActive = false;
					}
                }).catch(err => {
                    console.log(err);
                });
			},
			onRemove2(){
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				};
				util.ajax.delete("/mast_pic/"+this.$store.state.app.projectId+"?mast_name="+this.towerInfo.name+"&location=bottom",config)
					.then((res) => {
					this.$message.success(res.data.data);
					if(res.data.code==200){
						this.imageUrl2 = "";
						this.imgName2 = "";
						this.readonlyActive2 = false;
					}
                }).catch(err => {
                    console.log(err);
                });
			},
			onfanhui(){
				this.readonlyActive = false;
				// this.getImgData();
				const formData = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                formData.append('pic_file',"");            
                formData.append('pic_name', this.imgName1);    //图片名称        
                formData.append('mast_name', this.towerInfo.name);  //测风塔名称          
                formData.append('location', "top");  //位置       
                
				util.ajax.post('/mast_pic/'+this.$store.state.app.projectId, formData,config).then((res) => {
				   console.log(res);   
				   if(res.data.code==200){
					   this.$message.success("数据更新成功！");
					}
                }).catch(err => {
                    console.log(err);
				});
				
			},
			onfanhui2(){
				this.readonlyActive2 = false;
				const formData2 = new FormData();
				let config2 = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                formData2.append('pic_file',"");            
                formData2.append('pic_name', this.imgName2);    //图片名称        
                formData2.append('mast_name', this.towerInfo.name);  //测风塔名称          
                formData2.append('location', "bottom");  //位置     
				util.ajax.post('/mast_pic/'+this.$store.state.app.projectId, formData2,config2).then((res) => {
				   console.log(res);
				   if(res.data.code==200){
					   this.$message.success("数据更新成功！");
					}
                }).catch(err => {
                    console.log(err);
                });
				
			},
			httpRequest1(option){
				console.log(option);
				
				const formData = new FormData();
                const file = option.file;
                const filename = file.name;
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                formData.append('pic_file', file, file.name);            
                formData.append('pic_name', this.imgName1);    //图片名称        
                formData.append('mast_name', this.towerInfo.name);  //测风塔名称          
                formData.append('location', "top");  //位置       
                option.headers['Content-Type'] = 'multipart/form-data';
                // option.headers['Accept'] = '*/*';
                util.ajax.post(option.action, formData ,config).then((res) => {
				   console.log(res);
				   this.$message.success(res.data.data);
                   if(res.data.code == 200){
					   this.getImgData();
				   }
                }).catch(err => {
                    console.log(err);
                });
			},
			httpRequest2(option){
				console.log(option);		
				
				const formData = new FormData();
                const file = option.file;
                const filename = file.name;
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                formData.append('pic_file', file, file.name);            
                formData.append('pic_name', this.imgName2);    //图片名称        
				formData.append('mast_name', this.towerInfo.name);  //测风塔名称      
				formData.append('location', "bottom");  //位置       
                option.headers['Content-Type'] = 'multipart/form-data';
                // option.headers['Accept'] = '*/*';
                util.ajax.post(option.action, formData ,config).then((res) => {
				//    console.log(res);
				   this.$message.success(res.data.data);
                   if(res.data.code == 200){
					   this.getImgData();
				   }
                }).catch(err => {
                    console.log(err);
                });
			},
			handleAvatarSuccess(res, file) {
				console.log(res, file);
				
			},
			beforeAvatarUpload(file) {
				console.log(file);
				const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
				// const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传图片只能是 jpg / png 格式!');
				}
				// if (!isLt2M) {
				// 	this.$message.error('上传图片大小不能超过 2MB!');
				// }
				return isJPG ;
				
			},
			getImgData(){
				this.readonlyActive = false;
				this.readonlyActive2 = false;
				let project = this.$store.state.app.projectId;
				
				util.ajax.get("/mast_pic/"+project+"?mast_name="+this.towerInfo.name)
				.then((res) => {
				//    console.log(res);
				   if(res.data.data.pic_name_file && res.data.data.pic_name_file.top){
					   	let obj = res.data.data.pic_name_file.top;
					   	for (var i in obj) {
							// console.log('键：' + i);
							this.imgName1 = i;
							// console.log('值：' + obj[i]);
							var title1 = obj[i];
						}
						this.imageUrl1 = util.S3Path+project+"/upload_pic/"+title1;
						// console.log(obj);
						
				   }else{
					this.imgName1 = "";
				   }
				   if(res.data.data.pic_name_file && res.data.data.pic_name_file.bottom){
						let obj = res.data.data.pic_name_file.bottom;
						for (var i in obj) {
							// console.log('键：' + i);
							this.imgName2 = i;
							// console.log('值：' + obj[i]);
							var title2 = obj[i];
						}
					   this.imageUrl2 = util.S3Path+project+"/upload_pic/"+title2;
					//    console.log(obj);
					   
				   }else{
					this.imgName2 = "";
				   }
                }).catch(err => {
                    console.log(err);
                });
			},
			legendselect(ev){
				// console.log(ev)
				var selected=ev.selected;
        		var setiesName=ev.name;
				
				// let changeObj = this.chart3.legend.data.find(dt => dt.name === setiesName)
				// console.log(changeObj)
				////// changeObj.icon = selected[setiesName] ? "image://http://localhost:8080/static/aa1.png" : "image://http://localhost:8080/static/aa2.png"

				// if(this.chart3.legend.data[3].name == changeObj.name){
				// 	this.chart3.legend.data[3].icon = selected[setiesName] ? "image://http://localhost:8080/static/b1.png" : "image://http://localhost:8080/static/b3.png"
				// }
				// if(this.chart3.legend.data[4].name == changeObj.name){
				// 	this.chart3.legend.data[4].icon = selected[setiesName] ? "image://http://localhost:8080/static/b2.png" : "image://http://localhost:8080/static/b3.png"
				// }
				// if(this.chart3.legend.data[5].name == changeObj.name){
				// 	this.chart3.legend.data[5].icon = selected[setiesName] ? "image://http://localhost:8080/static/b3.png" : "image://http://localhost:8080/static/b3.png"
				// }	
			},
			onOpenVisible(isTrue){
				this.styleVisible = isTrue;
				if(this.styleVisible){
					this.main1Style.width = (document.documentElement.clientWidth*0.30-70);
					this.main1Style.height = (document.documentElement.clientHeight*0.30);		
					this.main2Style.width = (document.documentElement.clientWidth*0.65-100);
					this.main2Style.height = (document.documentElement.clientHeight*0.30);				
					this.main3Style.width = 0;
					this.main3Style.height = (document.documentElement.clientHeight*0.30+35);
					// this.main2TipWidth = (document.documentElement.clientWidth*0.65-210);

					if(window.screen.width < 1900 && window.screen.width >= 1600){
						this.main1Style.width = (document.documentElement.clientWidth*0.30-60);
					}
					if(window.screen.width < 1900 && window.screen.width >= 1600 && window.screen.height == 900){
						this.main1Style.width = (document.documentElement.clientWidth*0.30-55);
					}
					if(window.screen.width < 1600 && window.screen.width >= 1400 ){
						this.main2Style.width = (document.documentElement.clientWidth*0.65-80);
						// this.main2TipWidth = (document.documentElement.clientWidth*0.65-180);
					}
					if(window.screen.width < 1400 && window.screen.width >= 1360){
						this.main1Style.width = (document.documentElement.clientWidth*0.30-45);
						// this.main2TipWidth = (document.documentElement.clientWidth*0.65-200);
					}
					if(window.screen.width < 1360){
						this.main1Style.width = (document.documentElement.clientWidth*0.30-45);
					}
					

					this.$refs['echarts1'] && this.$refs['echarts1'].refresh2();
					this.$refs['echarts2'] && this.$refs['echarts2'].refresh2();
					this.$refs['echarts3'] && this.$refs['echarts3'].refresh2();
					this.$refs['echarts4'] && this.$refs['echarts4'].refresh2();

					this.chart3.grid.right = "9%";
					this.chart4.grid.right = "9%";
				}else{
					this.main1Style.width = (document.documentElement.clientWidth*0.26-75);
					this.main1Style.height = (document.documentElement.clientHeight*0.30);					
					this.main2Style.width = (document.documentElement.clientWidth*0.49-160);
					this.main2Style.height = (document.documentElement.clientHeight*0.30);
					this.main3Style.width = (document.documentElement.clientWidth*0.24-30);
					this.main3Style.height = (document.documentElement.clientHeight*0.30+35);
					// this.main2TipWidth = (document.documentElement.clientWidth*0.49-260);

					if(window.screen.width < 1900 && window.screen.width >= 1600){
						this.main3Style.width = (document.documentElement.clientWidth*0.24-10);
					}
					if(window.screen.width < 1900 && window.screen.width >= 1600 && window.screen.height == 900){
						this.main3Style.width = (document.documentElement.clientWidth*0.24);
					}
					if(window.screen.width < 1600 && window.screen.width >= 1400 ){
						this.main3Style.width = (document.documentElement.clientWidth*0.24+10);
					}
					if(window.screen.width < 1600 && window.screen.width >= 1400 && window.screen.height == 1050){
						this.main3Style.width = (document.documentElement.clientWidth*0.24+10);
					}
					if(window.screen.width < 1400 && window.screen.width >= 1360){
						this.main1Style.width = (document.documentElement.clientWidth*0.26-40);
						this.main3Style.width = (document.documentElement.clientWidth*0.24-10);
						// this.main2TipWidth = (document.documentElement.clientWidth*0.49-250);
					}
					if(window.screen.width < 1360){
						this.main1Style.width = (document.documentElement.clientWidth*0.26-40);
						this.main3Style.width = (document.documentElement.clientWidth*0.24);
					}

					this.$refs['echarts1'] && this.$refs['echarts1'].refresh2();
					this.$refs['echarts2'] && this.$refs['echarts2'].refresh2();
					this.$refs['echarts3'] && this.$refs['echarts3'].refresh2();
					this.$refs['echarts4'] && this.$refs['echarts4'].refresh2();

					this.chart3.grid.right = "15%";
					this.chart4.grid.right = "15%";
				}
				this.chart3.legend.y = 9;
				// this.chart3.legend.x = this.main2TipWidth;
				this.chart4.legend.y = 9;
				// this.chart4.legend.x = this.main2TipWidth;
			},
            open (towerInfo) {
                if (!towerInfo) return;
                this.dialogVisible = true;
                this.towerInfo = towerInfo;
				setTimeout(()=>{
					this.getMain1()	
				})
				setTimeout(()=>{
					this.getMain3()	
				})
				this.getImgData();
				
				this.main1Style.width = (document.documentElement.clientWidth*0.30-70);
				this.main1Style.height = (document.documentElement.clientHeight*0.30);		
				this.main2Style.width = (document.documentElement.clientWidth*0.65-100);
				this.main2Style.height = (document.documentElement.clientHeight*0.30);				
				this.main3Style.width = 0;
				this.main3Style.height = (document.documentElement.clientHeight*0.30+35);
				// this.main2TipWidth = (document.documentElement.clientWidth*0.65-210);
				
				if(window.screen.width < 1900 && window.screen.width >= 1600){
					this.main1Style.width = (document.documentElement.clientWidth*0.30-60);
				}
				if(window.screen.width < 1900 && window.screen.width >= 1600 && window.screen.height == 900){
					this.main1Style.width = (document.documentElement.clientWidth*0.30-55);
				}
				if(window.screen.width < 1600 && window.screen.width >= 1400 ){
					this.main2Style.width = (document.documentElement.clientWidth*0.65-80);
					// this.main2TipWidth = (document.documentElement.clientWidth*0.65-180);
				}
				if(window.screen.width < 1400 && window.screen.width >= 1360){
					this.main1Style.width = (document.documentElement.clientWidth*0.30-45);
					// this.main2TipWidth = (document.documentElement.clientWidth*0.65-210);
				}
				if(window.screen.width < 1360){
					this.main1Style.width = (document.documentElement.clientWidth*0.30-45);
				}
				
                // if(this.$store.state.user.loginUserInfo.role !=9 && this.$store.state.user.loginUserInfo.role !=1 && this.$store.state.user.loginUserInfo.role !=11 && this.$store.state.user.loginUserInfo.role !=12){
				// 	this.roleShow = false;
				// }else{
				// 	this.roleShow = true;
				// }
            },
            closeDetail () {
				this.chart1 = this.getChart1DefaultValue();
				this.chart2 = this.getChart2DefaultValue();
				this.chart3 = this.getChart3DefaultValueSome();
				this.chart4 = this.getChart4DefaultValue();
				this.all_heightArr =[];
				this.heights = "";
                this.dialogVisible = false;
				this.$emit('close');
				this.imageUrl1 = "";
				this.imageUrl2 = "";
				this.styleVisible = true;
            },
			reversalTime(str){
				var arr = str.split("-")
				// console.log(arr)
				var str_a = arr[0] 
				var str_c = arr[2] 
				arr[0] = str_c
				arr[2] = str_a
				// console.log(arr)
				return arr.join("-")
			},
			
			//切换高度
			selectChange(obj){
				// console.log(this.$store.state.app.projectInfo.project_id,this.towerInfo.name)
				console.log(obj.target.value)
				this.heights = obj.target.value
				this.getMain1()
				// this.getMain3()
			},
			getMain1(){
				// console.log(this.$store.state.app.projectInfo.project_id,this.towerInfo.name)
				this.chart1 = this.getChart1DefaultValue();
				this.chart2 = this.getChart2DefaultValue();
				util.ajax.get('/wind/direction_power', {
                    params: {
                        project_id : this.$store.state.app.projectInfo.project_id,
						mast_name : this.towerInfo.name,
						height : this.heights
                    }
                }).then(res => {
                //    console.log(res,1111)
				  
				if(res.status == 200){		
				   
				   // 图一
				   var angleAxis = res.data.data.wind_direction.angleAxis_data
				   var series  = res.data.data.wind_direction.series_data
				   this.all_heightArr = res.data.data.all_height
				   //自己添加高度测试
				//    this.all_heightArr[1] = 70
				//    this.all_heightArr[2] = 60
				   //////
				//    console.log(angleAxis)
				   this.start_data = res.data.data.start_data
				   this.end_data = res.data.data.end_data
				   
				   var custData=[];
				   let arr1 = []; //刻度用的
				   for (var i = 0; i < series.length; i++) {
					//    console.log(i)
						
					   	arr1.push(i)
						
				   }
					// for (var i = 0; i < series.length; i++) {
					// 	var temp={
					// 			value: series[i],
					// 			label: {
					// 				show: true,
					// 				// position: 'insideTop',
					// 				// formatter: '{value}%'
					// 			},
					// 			itemStyle: {
					// 				normal: {
					// 					color: "#3380C8"
					// 				}
					// 			}
					// 		};
					// 	custData.push(temp);        
					// }
					this.chart1 = this.getChart1DefaultValue(angleAxis,series,custData,arr1);

					//图二
						var angleAxis2 = res.data.data.wind_power.angleAxis_data
					   var series2  = res.data.data.wind_power.series_data
						var custData2=[];
						 let arr2 = []; //刻度用的
						for (var j = 0; j < series2.length; j++) {
							//    console.log(j)
							arr2.push(j)	
						}
						
						for (var j = 0; j < series2.length; j++) {
							var temp2={
									value: series2[j],
									label: {
										show: true,
										position: 'insideTop',
										formatter: '{value}%'
									},
									itemStyle: {
										normal: {
											color: "#33C86F"
										}
									}
								};
							custData2.push(temp2);        
						}
					this.chart2 = this.getChart2DefaultValue(angleAxis2,series2,custData2,arr2);
				
				}else{
					this.$message.error("获取数据失败！")
				}


                }).catch((err) => {
                    console.log("err:"+err);
                });

				
			},
			
			getMain3(){
				this.chart3 = this.getChart3DefaultValueSome()
				this.chart4 = this.getChart4DefaultValue();
				this.chart3.legend.y = 9;
				// this.chart3.legend.x = this.main2TipWidth;
				this.chart4.legend.y = 9;
				// this.chart4.legend.x = this.main2TipWidth;
				util.ajax.get('/wind/wei_turbulence', {
                    params: {
                        project_id : this.$store.state.app.projectInfo.project_id,
						mast_name : this.towerInfo.name,
                    }
                }).then(res => {
                //    console.log(res,3333)
				   
				if(res.status == 200){
				   var turbulence_a = res.data.data.turbulence.A
				   var turbulence_b = res.data.data.turbulence.B
				   var turbulence_c = res.data.data.turbulence.C
				   var ser = res.data.data.turbulence.series;
				   var series=[];
				   var series = ser.map((item,index,arr)=>{
					   if(item[2] == 0 && item[3] == 0 && item[4] == 0){
							// console.log(item)
							item = [0]
					   }
					   return item;
				   })
				//    console.log(series)
				   var xAxis = res.data.data.turbulence.xAxis
					// var xAxis = []
					// // 不用后天给的坐标，设固定30长度
					// for(var i=0; i<=29; i++){
					// 	xAxis.push(i)
					// }
				//    console.log(xAxis)
					//图四
					var weibull_series = res.data.data.weibull.series
					var weibull_xAxis = res.data.data.weibull.xAxis	
					
					let heights = this.all_heightArr
					//自己加数据测试多个高度		
				    // series[1]= [0.6578671329, 0.4262016814, 0.2589068255, 0.1934967334, 0.1540777737, 0.1293034177, 0.1765434806, 0.1120629886, 0.1147408625, 0.1170145652, 0.1230060044, 0.1201834377, 0.120139975, 0.1207443357, 0.119393515, 0.1227421516, 0.1113944129, 0.128681236, 0.1166878392, 0.1304110506, 0.1706910569, 0.1556603774]
				    // series[2]= [0.7578671329, 0.4262016814, 0.2589068255, 0.1934967334, 0.1540777737, 0.1293034177, 0.1765434806, 0.1120629886, 0.1147408625, 0.1170145652, 0.1230060044, 0.1201834377, 0.120139975, 0.1207443357, 0.119393515, 0.1227421516, 0.1113944129, 0.128681236, 0.1166878392, 0.1304110506, 0.1706910569, 0.1556603774]
					
					// console.log(series,this.all_heightArr)
				    // weibull_series[1]= [0.015726542001582608, 0.018116696514097703, 0.01580067469076673, 0.01390112864936904, 0.044771146557827664, 0.05464162258964641, 0.06320019990837533, 0.06846861854983133, 0.06853108991712131, 0.0660530590146183, 0.06534505018533172, 0.0641997417850152, 0.05722377243763275, 0.054516679855066426, 0.050018741410187, 0.04356336679022115, 0.03750364416309192, 0.0318395735287993, 0.02823705801507642, 0.02326017242097372, 0.01967848069634751, 0.017283744950231144, 0.013806172171088251, 0.010037066344592062, 0.008870934155178877, 0.005934779892549248, 0.004539586023072758, 0.0033109824663695806, 0.002769563949856316, 0.0024363833243096914, 0.0020199075423764108, 0.0010620132439298656, 0.0008121277747698972, 0.0006455374619965849, 0.00037482820373995254, 0.00029153304735329643, 0.00047894714922327265, 0.00029153304735329643, 0.0002707092582566324, 0.00008329515638665612, 0.00002082378909666403, 0.00004164757819332806, 0.00002082378909666403, 0, 0, 0, 0, 0, 0]
					// weibull_series[2]= [0.025726542001582608, 0.018116696514097703, 0.01580067469076673, 0.01390112864936904, 0.044771146557827664, 0.05464162258964641, 0.06320019990837533, 0.06846861854983133, 0.06853108991712131, 0.0660530590146183, 0.06534505018533172, 0.0641997417850152, 0.05722377243763275, 0.054516679855066426, 0.050018741410187, 0.04356336679022115, 0.03750364416309192, 0.0318395735287993, 0.02823705801507642, 0.02326017242097372, 0.01967848069634751, 0.017283744950231144, 0.013806172171088251, 0.010037066344592062, 0.008870934155178877, 0.005934779892549248, 0.004539586023072758, 0.0033109824663695806, 0.002769563949856316, 0.0024363833243096914, 0.0020199075423764108, 0.0010620132439298656, 0.0008121277747698972, 0.0006455374619965849, 0.00037482820373995254, 0.00029153304735329643, 0.00047894714922327265, 0.00029153304735329643, 0.0002707092582566324, 0.00008329515638665612, 0.00002082378909666403, 0.00004164757819332806, 0.00002082378909666403, 0, 0, 0, 0, 0, 0]
					
					// 	-----------------------------------
					// if(series.length==1){
					// 	this.chart3 = this.getChart3DefaultValue(turbulence_a,turbulence_b,turbulence_c,series,xAxis);
					// 	// console.log(this.all_heightArr)
					// 	var heightName = heights[0]+"m"
					// 	this.chart3.series[0].name = heightName
					// 	this.chart3.series[0].data = series[0]
					// 	this.chart3.legend.data.unshift(heightName)
					// }
					// this.getinitMain4(weibull_series,weibull_xAxis)
					//多个高度只显示曲线---------
					if(this.all_heightArr.length>1){
						let colors4 = ["#33C8C6","#00FF00","#F00188"]
						let colorsb4 = ["#B5C833","#00FF00","#F00188"]
						this.chart4 = this.getChart4DefaultValue(weibull_series,weibull_xAxis);
						
						for(var i=0 ;i<weibull_series.length; i++){
							
							this.chart4.legend.data.push(
								{
									name:heights[i]+"m",
								})
							this.chart4.series.push(
							{
								name: heights[i]+"m",
								type:'line',
								symbol: 'none',  //取消折点圆圈
								itemStyle : {  /*设置折线颜色*/
									normal : {
									color: colorsb4[i]
									}
								},
								// data:[50, 75, 100, 150, 200, 250, 150, 100, 95, 160, 50, 45],
								data: weibull_series[i],
								smoothMonotone:'none',
								smooth: true   //平滑曲线
							})
							
						}
						
					}else{


					//----------------
					let colors4 = ["#33C8C6","#00FF00","#F00188"]
					let colorsb4 = ["#B5C833","#00FF00","#F00188"]
					this.chart4 = this.getChart4DefaultValue(weibull_series,weibull_xAxis);
					
					this.chart4.legend.y = 9;
					// this.chart4.legend.x = this.main2TipWidth;
					for(var i=0 ;i<weibull_series.length; i++){
						
						this.chart4.legend.data.push(
							{
								name:heights[i]+"m ", //柱状
							},
							{
								name:heights[i]+"m",
							})
						this.chart4.series.push(
							{
							name: heights[i]+"m ", //柱状,名字不能与线重复，别去空格
							type:'bar',
							// data:[0.1,0.14,0.1],
							data: weibull_series[i],
							itemStyle : {  
					            normal : {
					               color: colors4[i]
					            }
					        },
							barWidth:13,
							barGap:'30%',/*多个并排柱子设置柱子之间的间距*/
							barCategoryGap:'50%',/*多个并排柱子设置柱子之间的间距*/
						},
						{
					        name: heights[i]+"m",
					        type:'line',
							symbol: 'none',  //取消折点圆圈
					        itemStyle : {  /*设置折线颜色*/
					            normal : {
					               color: colorsb4[i]
					            }
					        },
					        // data:[50, 75, 100, 150, 200, 250, 150, 100, 95, 160, 50, 45],
							data: weibull_series[i],
							smoothMonotone:'none',
							smooth: true   //平滑曲线
						})
						
					}
					// console.log(this.chart4)
					}

					//////////----------
					// console.log(this.chart4)   "#33c86f","#33c8c6",,"#357abf"
					//虚线颜色00FF00
					//new    #153AC2  #33C86F  #743EEE
					//new线   #FF0000 
					// let colorsmy = ["#00FF00","#33c8c6","#357abf"]
					let colorsmy = ["#FF0000","#33c8c6","#357abf","#FF0000","#33c8c6","#357abf"];  //线颜色
					
					// console.log(this.chart3)
					//大于一个高度，虚线，动态添加几个
					
						this.chart3 = this.getChart3DefaultValueSome(turbulence_a,turbulence_b,turbulence_c,series,xAxis);
						
						this.chart3.legend.y = 9;
						// this.chart3.legend.x = this.main2TipWidth;
						for(var item=0;item<heights.length;item++){
							this.chart3.legend.data.push({
								name: heights[item]+"m",
								icon: "line"
								// icon: image,
							})
							this.chart3.color.push(colorsmy[item]);
							this.chart3.series.push({
								name: heights[item]+"m",
					            type:'line',
					//             stack: item ,   
								symbol: 'none',  //取消折点圆圈
					            //data:[120, 132, 101, 134, 90, 230, 210],
					            data: series[item],
								lineStyle: {
									color: colorsmy[item],
									width: 2,
									// type: "dotted"
								},
								textStyle: {
									color: '#fff'
								}
							})

						}
						// console.log(this.chart3.series,this.chart3.legend,this.chart3)


					}else{
						this.$message.error("获取数据失败！")
					}	
						
                }).catch((err) => {
                    console.log("err:"+err);
                });
			},
			//4用这个函数里的
			getChart4DefaultValue(weibull_series,weibull_xAxis){
				return{
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							axios : "auto"
						}
					},
					grid: {
						left: '5%',
						right: '9%',
						top:"5%",
						bottom: '4%',
						containLabel: true
					},
					  

					legend: {
						// data: [
						// 	{
						// 		name:"柱状0"
						// 	},
						// 	{
						// 		name:"曲线0"
						// 	}
						// ],
						data: [],
						textStyle:{
							color: '#fff'
						},
						itemHeight: 5,
						itemWidth: 12,
						borderColor:"#fff",
						borderRadius: 1,
						orient: 'vertical',  //垂直显示
						y: 'top',    //延Y轴
						x: 'right', //居右显示
						align:"left"
					},
					xAxis: [
						{
							type: 'category',
							name: '风速(m/s)',
							boundaryGap: false,
							// data: [0,5,10,15,20,25],
							data: weibull_xAxis,

							axisLine: {
								lineStyle: {
									color: '#fff'
								}
							},
							nameGap:8,                 //---坐标轴名称与轴线之间的距离
						}
					],
					yAxis: [
						{
							type: 'value',
							name: '',
							min: 0,
							max:function(value) {
								// console.log(value)
								return (value.max+0.02).toFixed(2)
							},
							// max:'dataMax',
							// max: 0.1,
							interval: 0.02,
							axisLine: {
								lineStyle: {
									color: '#fff'
								}
							},
							splitLine:{
								show:true,
								lineStyle:{
									color:"rgba(255,255,255,0.3)"
								}
							},//网格线
						},
						
					],
					series: [
						// {
						// 	name:'数据a1',
						// 	type:'bar',
						// 	// data:[0.1,0.14,0.1],
						// 	data: weibull_series,
						// 	itemStyle : {  
					    //         normal : {
					    //            color:'#33C8C6'
					    //         }
					    //     },
						// 	barWidth:8,
						// 	// barGap:'0%',/*多个并排柱子设置柱子之间的间距*/
						// 	barCategoryGap:'10%',/*多个并排柱子设置柱子之间的间距*/
						// },
						// {
					    //     name:'数据b1',
					    //     type:'line',
						// 	symbol: 'none',  //取消折点圆圈
					    //     itemStyle : {  /*设置折线颜色*/
					    //         normal : {
					    //            color:'#B5C833'
					    //         }
					    //     },
					    //     // data:[50, 75, 100, 150, 200, 250, 150, 100, 95, 160, 50, 45],
						// 	data: weibull_series,
						// 	smoothMonotone:'none',
						// 	smooth: true   //平滑曲线
					    // }
					]
				}
			},
			
			getChart1DefaultValue (angleAxis,series,custData,arr1) {
				
                return {
// 					title : {
// 						text: '风向分布图',
// 						subtext: '',
// 						textStyle:{
// 							fontSize:13,
// 							color:'#fff',
// 							left:"50px",
// 							top:"50px"
// 						}
// 					},

					// legend: {
					// 	show: true,
					// 	data: ['风向分布图'],
					// 	textStyle: {
                    //         color: '#fff'
                    //     }
					// },
					// backgroundColor:'rgba(0,0,0,0,0)', //设置无背景色
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							axios : "auto",
							// lineStyle:{  //提示框竖线
							// 	color:"red"
							// },
							
						}
					},
					angleAxis: {
						type: 'category',
						show:true,
						// data: [0,22.5,45,80,90,100,33,55,60,90],
						data : angleAxis,
						// min : 0,
						// max : "dataMax",
						boundaryGap: false,
						z:5,
						//坐标轴轴线设置,外圈
						axisLine: {
							show: true,
							lineStyle: {
								color: "rgba(255,255,255,0.7)",
								// color: "red",
								width: 1,
								type: "solid"
							},
						},
						//刻度标签设置
						axisLabel: {
							interval: 0,
							show: true,
							color: "#fff",
							margin: 0,
							fontSize: 11
						},
						axisTick: { //坐标轴刻度设置,外圈的点
					　　　　show: true,
							interval: 0,
							lineStyle:{
								color:"rgba(255,255,255,0.5)",
								// color:"red",
								width: 1,
								type: "solid"
							}
					　　},
						
					// 　　splitLine: { //分割线设置,竖线
					// 　　　　show: true,
					// 　　}
					},
					radiusAxis: {
						type: 'value',
						data: arr1,
						// data:series,
						// data: [],
						boundaryGap: false,
						interval: 5,
						// min: 0,
						// max:"dataMax",
						name:'',   //竖线轴名字						
						nameTextStyle: {
							color:"rgba(255,255,255,0.5)",
							fontSize: 12,
						},					
						axisTick:{//坐标轴刻度设置, 中间竖线的点
							show:true,
							lineStyle:{
								color:"rgba(255,255,255,0.8)",
								// color:"red",
								width:1,
								type:"solid"
							}
						},
						axisLine:{//坐标轴轴线相关设置,,中间竖线
							show:true,
							lineStyle:{
								color:"rgba(255,255,255,0.7)",
								width:1,
								type:"solid"
							}
						},
						axisLabel: {//刻度标签设置
							formatter: '{value}',
							interval: 4, //如果设置为 1，表示『隔一个标签显示一个标签』
							show: true,
							padding: [0, 7, 0, 0],
							margin:0,
							color: "rgba(255,255,255,0.5)",
							fontSize: 9,
							textStyle: {
					　　　　　　color: "rgba(255,255,255,0.8)"
					　　　　}
						},
						
					　	splitLine: {//坐标轴在 grid 区域中的分隔线。,圈圈的线
							show: true,
							interval: 0,  //如果设置为 1，表示『隔一个标签显示一个标签』
							lineStyle: {
								color: "rgba(255,255,255,0.3)",
								// color: "red",
								width: 1,
								type: "solid"
							}
						}
					},
					polar: {
						
						// 　center: ['50%', '50%'],
						// lineStyle: {
						// 	color: "#fff",
						// 	width: 1,
						// 	type: "solid"
						// }
					},
					series: [{
						type: 'bar',
						// data: [],
						// data: custData,
						data: series,
						coordinateSystem: 'polar',
						name: 'A',
						showSymbol: false,
						stack: 'a',
						lineStyle: {
					　　　　normal: {
					　　　　　　color: '#fff'
					　　　　}
					　　},
						itemStyle: {
							normal: {
								color: "#3380C8"
							}
						},
						zlevel:10,
					}],
					
					
				};
            },
			getChart2DefaultValue (angleAxis2,series2,custData2,arr2) {
				return {
// 					title : {
// 						text: '风向分布图',
// 						subtext: '',
// 						textStyle:{
// 							fontSize:13,
// 							color:'#fff',
// 							left:"50px",
// 							top:"50px"
// 						}
// 					},

					// legend: {
					// 	show: true,
					// 	data: ['风向分布图'],
					// 	textStyle: {
                    //         color: '#fff'
                    //     }
					// },
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							axios : "auto",
							// lineStyle:{  //提示框竖线
							// 	color:"red"
							// },
							
						}
					},
					angleAxis: {
						type: 'category',
						show:true,
						// data: [0,22.5,45,67.5,90,50,60,70,80,90,100,33,55,60,90],
						data : angleAxis2,
						min : 0,
						z:5,
						boundaryGap: false,
						// z:20,
						axisTick:{//坐标轴刻度设置, 中间竖线的点
							show:true,
							// length:5,
							interval: 0,
							lineStyle:{
								color:"rgba(255,255,255,0.8)",
								// color:"red",
								width:1,
								type:"solid"
							}
						},
						axisLine:{//坐标轴轴线相关设置,,中间竖线
							show:true,
							interval: 0,
							lineStyle:{
								color:"rgba(255,255,255,0.7)",
								width:1,
								type:"solid"
							}
						},
						//刻度标签设置
						axisLabel: {
							interval: 0,
							show: true,
							color: "#fff",
							margin: 0,
							fontSize: 11
						},
					// 　　splitLine: { //分割线设置,竖线
					// 　　　　show: true,
					// 　　}
					},
					radiusAxis: {
						type: 'value',
						data: arr2,
						// data:series2,
						// z:10,
						boundaryGap: false,
						// splitNumber: 20,
						// min: 0,
						
						// max:"dataMax",
						interval: 5,
						name:'',
						
						nameTextStyle: {
							color:"rgba(255,255,255,0.5)",
							fontSize: 12,
						},
						
						axisTick:{//坐标轴刻度设置
							show:true,
							// length:5,
							lineStyle:{
								color:"rgba(255,255,255,0.5)",
								width:1,
								type:"solid"
							}
						},
						axisLine:{//坐标轴轴线相关设置
							show:true,
							lineStyle:{
								color:"rgba(255,255,255,0.5)",
								width:1,
								type:"solid"
							}
						},
						axisLabel: {//刻度标签设置
							formatter: '{value}',
							interval: 4, //如果设置为 1，表示『隔一个标签显示一个标签』
							show: true,
							padding: [0, 7, 0, 0],
							margin:0,
							color: "rgba(255,255,255,0.5)",
							fontSize: 9,
							textStyle: {
					　　　　　　color: "rgba(255,255,255,0.8)"
					　　　　}
						},
						
						splitLine: {//坐标轴在 grid 区域中的分隔线。,圈圈的线
							show: true,
							lineStyle: {
								color: "rgba(255,255,255,0.3)",
								// color: "red",
								width: 1,
								type: "solid"
							}
						}
					},
					polar: {
						// 　center: ['50%', '50%'],
						// lineStyle: {
						// 	color: "#fff",
						// 	width: 1,
						// 	type: "solid"
						// }
					},
					series: [{
						type: 'bar',
						// data: [1,2,3,4,3,5,1],
						data: custData2,
						// data: series,
						coordinateSystem: 'polar',
						name: 'bar',
						showSymbol: false,
						stack: 'a',
						lineStyle: {
					　　　　normal: {
					　　　　　　color: '#fff'
					　　　　}
					　　},
						zlevel:10
					}],
					
					
				};
            },
	// 		getChart3DefaultValue (turbulence_a,turbulence_b,turbulence_c,series,xAxis) {
    //             return {
					
	// 				tooltip: {
	// 					trigger: 'axis'
	// 				},
	// 				legend: {
	// 					data: ['标准湍流-A','标准湍流-B','标准湍流-C'],
	// 					textStyle:{
	// 						color: '#fff'
	// 					},
	// 					// backgroundColor: "red",
	// 				},
	// 				color:['#33C8C6','#33c86f','#F00188','#B5C833'],
	// 				// grid: {
	// 				// 	left: '4%',
	// 				// 	right: '4%',
	// 				// 	bottom: '2%',
	// 				// 	containLabel: true
	// 				// },
	// 				// toolbox: {
	// 				// 	feature: {
	// 				// 		saveAsImage: {}
	// 				// 	}
	// 				// },
	// 				xAxis: {
	// 					type: 'category',
	// 					name:"风速(m/s)",
	// 					boundaryGap: false,
	// 					// data: ['0','5','10','15','20','25'],
	// 					data: xAxis,
	// 					axisLine: {
	// 						lineStyle: {
	// 							color: '#fff'
	// 						}
	// 					},
	// 				},
	// 				yAxis: {
	// 					type: 'value',
	// 					min: 0,
	// 					max : 1.6,
	// 					interval: 0.2,
	// 					axisLine: {
	// 						lineStyle: {
	// 							color: '#fff'
	// 						}
	// 					},
	// 					splitLine:{
	// 						show:true,
	// 						lineStyle:{
	// 							color:"rgba(255,255,255,0.3)"
	// 						}
	// 					},//网格线
	// 				},
	// 				series: [
	// 				{
	// 					name:"",
	// 		            type:'line',
	// 		            stack: '总量',   
	// 					symbol: 'none',  //取消折点圆圈
	// 		            //data:[120, 132, 101, 134, 90, 230, 210],
	// 		            data: [],
	// 					lineStyle:{
	//                         width:4,
	// 						color: "#33C8C6",
	//                         type:'dotted'  //'dotted'虚线 'solid'实线
	//                     } ,
	// 					textStyle: {
	// 						color: '#fff'
	// 					}
	// 				} ,
	// 				{
	// 						name:'标准湍流-A',
	// 						type:'line',
	// 						stack: '总量',
	// 						symbol: 'none',  //取消折点圆圈
	// 						lineStyle: {
	// 							color: "#33c86f",
	// 							width: 2,
	// 							type: "solid"
	// 						},
	// 						textStyle: {
	// 							color: '#fff'
	// 						},
	// 						// data:[0, 0.2, 0.4, 0.6, 0.8, 1.0,],
	// 						data: turbulence_a
							
	// 					},
	// 					{
	// 						name:'标准湍流-B',
	// 						type:'line',
	// 						stack: '总量',
	// 						symbol: 'none',  //取消折点圆圈
	// 						lineStyle: {
	// 							color: "#F00188",
	// 							width: 2,
	// 							type: "solid"
	// 						},
	// 						textStyle: {
	// 							color: '#fff'
	// 						},
	// 						// data:[0, 0.2, 0.4, 0.6, 0.8, 1.0,],
	// 						data : turbulence_b 
							
	// 					},
	// 					{
	// 						name:'标准湍流-C',
	// 						type:'line',
	// 						stack: '总量',
	// 						symbol: 'none',  //取消折点圆圈
	// 						lineStyle: {
	// 							color: "#B5C833",
	// 							width: 2,
	// 							type: "solid"
	// 						},
	// 						textStyle: {
	// 							color: '#fff'
	// 						},
	// 						// data:[0, 0.2, 0.4, 0.6, 0.8, 1.0,],
	// 						data : turbulence_c 
	// 					}
						
	// 				]
	// 			};
    //         },
			getChart3DefaultValueSome (turbulence_a,turbulence_b,turbulence_c,series,xAxis) {
                return {
					
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							axios : "auto",
							// lineStyle:{  //提示框竖线
							// 	color:"red"
							// },
							
						}
					},
					legend: {
						// data: ['标准湍流-A','标准湍流-B','标准湍流-C'],
						data: [
							{
								name:"标准湍流-A",
								icon:"rect"
							},
							{
								name:"标准湍流-B",
								icon:"rect"
							},
							{
								name:"标准湍流-C",
								icon:"rect"
							}
						],
						textStyle:{
							color: '#fff'
						},
						itemHeight: 5,
						itemWidth: 12,
						borderColor:"#fff",
						borderRadius: 1,
						orient: 'vertical',  //垂直显示
						y: 'top',    //延Y轴
						x: 'right', //居右显示
						align:"left"
						
					},
					color:['#153AC2' , '#33C86F' , '#743EEE' ],
					grid: {
						left: '6%',
						right: '9%',
						top:"5%",
						bottom: '4%',
						containLabel: true
					},
					
					// toolbox: { //工具箱
					// 	feature: {
					// 		saveAsImage: {}
					// 	}
					// },
					xAxis: {
						type: 'category',
						name:"风速(m/s)",
						boundaryGap: false,
						// min:0,s
						// max: "dataMax",
						// data: ['0','5','10','15','20','25'],
						data: xAxis,
						axisLine: {
							lineStyle: {
								color: '#fff'
							}
						},
						splitLine:{
							show:false,
							
						},//去除网格线
						nameGap: 8
					},
					yAxis: {
						type: 'value',
						min: 0,
						max:function(value) {
								// console.log(value)
								return (value.max+0.2).toFixed(1)
							},
						interval: 0.2,
						axisLabel:{
							formatter: function (value) {
								// console.log(value)
								
								if(value == 1){
									value = "1.0"
								}
								return value
							}
						},
						axisLine: {
							lineStyle: {
								color: '#fff'
							}
						},
						splitLine:{
							show:true,
							lineStyle:{
								color:"rgba(255,255,255,0.3)"
							}
						},//网格线
						fontSize: 15,
					},
					series: [
					{
							name:'标准湍流-A',
							type:'line',
							stack: 'a',
							symbol: 'none',  //取消折点圆圈
							lineStyle:{
		                        width:1,
								color:"#153AC2",
		                        type:'solid'  //'dotted'虚线 'solid'实线
		                    } ,
							textStyle: {
								color: '#fff'
							},
							// data:[0, 0.2, 0.4, 0.6, 0.8, 1.0,],
							data: turbulence_a,
							areaStyle: {normal: {}},
							
						},
						{
							name:'标准湍流-B',
							type:'line',
							stack: 'b',
							symbol: 'none',  //取消折点圆圈
							lineStyle: {
								color: "#33C86F",
								width: 1,
								type: "solid"
							},
							textStyle: {
								color: '#fff'
							},
							// data:[0, 0.2, 0.4, 0.6, 0.8, 1.0,],
							data : turbulence_b ,
							areaStyle: {normal: {}},
							
						},
						{
							name:'标准湍流-C',
							type:'line',
							stack: 'c',
							symbol: 'none',  //取消折点圆圈
							lineStyle: {
								color: "#743EEE",
								width: 1,
								type: "solid"
							},
							textStyle: {
								color: '#fff'
							},
							// data:[0, 0.2, 0.4, 0.6, 0.8, 1.0,],
							data : turbulence_c ,
							areaStyle: {normal: {}},
						}
						
					]
				};
            }
			
        }
    };
</script>

<style lang="less" scoped>
	@import "./mast-details";
/deep/ .avatar-uploader {
	position: absolute;
	z-index: -1;
	opacity: 0;
}
/deep/ .avatar-uploader-icon ,/deep/ .avatar-uploader-icon2{
	display: block;
	font-size: 28px;
	color: #ccc;
	width: 30px;
	height: 30px;
	text-align: center;
	cursor: pointer;
	position: absolute;
	z-index: 999;
	left: 50%;
	top: 50%;
	margin-top: -35px;
	margin-left: -15px;
}
/deep/ .avatar-uploader-icon2 {
	margin-top: 15px;
}
/deep/ .avatar-uploader-icon:hover,/deep/ .avatar-uploader-icon2:hover{
	color: blue;
}
.avatar {
	width: 100%;
	height: 100%;
	display: block;
	border: none !important;
}
.rightBoxnone{
	border: none !important;
	&>div{
		border: 1px solid rgba(211, 219, 228, 0.8);
		box-sizing: border-box;
	}
	&>div:nth-of-type(1){
		margin-bottom: 10px;
	}
}
.rightBoxnone3>div:nth-of-type(1){
	margin-bottom: 12px;
}
.leftBoxMargin>div{
	margin-bottom: 5px;
}
.echart{
	padding-right: 10px;
}
/*分辨率低于1420....，采用下面的样式*/
@media screen and (max-device-width:1420px){	
	.echart{
		/* width: 100%; */
		height: 200px;
	}

}
/*分辨率低于1420....，采用下面的样式*/
@media screen and (max-device-width:1300px){	
	.echart{
		/* width: 100%; */
		height: 200px;
	}

}

/* 大于1420。。。小于1500。。。 */
@media screen and (min-width:1420px) and (max-width:1500px){
	.echart{
		/* width: 100%; */
		height: 280px;
	}
}

/* 分辨率高于1500.....，采用下面的样式 */
@media screen and (min-device-width: 1500px){
	.echart{
		/* width: 100%; */
		height: 250px;
	}
}
/* 分辨率高于.....，采用下面的样式 */
@media screen and (min-device-width: 1700px){
	.echart{
		/* width: 100%; */
		height: 290px;
	}
}
/* 分辨率高于.....，采用下面的样式 */
@media screen and (min-device-width: 2000px){
	.echart{
		/* width: 100%; */
		height: 310px;
	}
}
</style>

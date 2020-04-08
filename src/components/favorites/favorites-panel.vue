<template>
    <!-- <transition name="search-fade"> -->
        <div class="container filterBox" :class="minActive?'minActive':''">
                <div class="zengjiaBox" v-show="openAddBox" :style="{left:openAddStyle.x+'px',top:openAddStyle.y+'px'}">
                    <ul @mouseleave="onLeaveAddBox()">
                        <li @click="addElement('wenjianjia')">文件夹</li>
                        <li @click="addElement('tubiao')">图标</li>
                        
                        <li @click="addElement('zhexian')">折线</li>
                        <li @click="addElement('duobianxing')">多边形</li>
                    </ul>
                </div>
            <!-- //测量工具 -->
            <div class="celiangBox">
                <p>
                    <el-tooltip class="el-tooltip-item"  effect="light" popper-class="menu-tooltip-popper" content="量测" placement="top" :hide-after="3000" :enterable="false" >
                        <span :class="numberShow == 1? 'celiangActive' : '' " @click="onClick('celiang')"><icon name="celiang" style="width:17px;height:17px;"></icon></span>
                    </el-tooltip>
                    <el-tooltip class="el-tooltip-item"  effect="light" popper-class="menu-tooltip-popper" content="即时标绘" placement="top":hide-after="3000" :enterable="false" >
                        <span :class="numberShow == 2? 'celiangActive' : '' " @click="onClick('huizhi')"><icon name="huizhi" style="width:17px;height:17px;"></icon></span>
                    </el-tooltip>
                </p>
                <!-- 测量 -->
                <div v-show="numberShow == 1 && celiangShow" class="measuring-tool" >
                    <!--空间距离-->
                    <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="三角测量" placement="top" :hide-after="3000" :enterable="false" >
                        <span  v-bind:class="{active: isActiveArr[0]}" @click="onMeasuringClick('measureHeightComplex', 0)">
                            <icon name="kongjianjuliceliang"></icon>
                        </span>
                    </el-tooltip>
                    <!--长度-->
                    <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="长度" placement="top" :hide-after="3000" :enterable="false" >
                        <span style="position: relative;top:2px;" v-bind:class="{active: isActiveArr[1]}" @click="onMeasuringClick('measureLength', 1)">
                            <i class="iconfont icon-icon_changdu_px" style="font-size: 28px;" ></i>
                        </span>
                    </el-tooltip>
                    <!--高度-->
                    <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="高度" placement="top" :hide-after="3000" :enterable="false" >
                        <span  v-bind:class="{active: isActiveArr[2]}" @click="onMeasuringClick('measureHeightSample', 2)">
                            <icon name="gaodu"></icon>
                        </span>
                    </el-tooltip>
                    <!--面积测量-->
                    <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="面积" placement="top" :hide-after="3000" :enterable="false" >
                        <span style="font-size: 28px;" v-bind:class="{active: isActiveArr[3]}" @click="onMeasuringClick('measureArea', 3)">
                            <icon name="mianjiceliang"></icon>
                        </span>
                    </el-tooltip>
                    <!--剖面分析-->
                    <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="剖面分析" placement="top" :hide-after="3000" :enterable="false" >
                        <span  style="position: relative;top:-2px;font-size: 28px;" v-bind:class="{active: isActiveArr[5]}" @click="onMeasuringClick('poumian', 5)">
                            <i class="iconfont icon--"></i>
                        </span>
                    </el-tooltip>
                    <!--橡皮擦-->
                    <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="清除" placement="top" :hide-after="3000" :enterable="false" >
                        <span  v-bind:class="{active: isActiveArr[4]}" @click="onMeasuringClick('clearMeasure', 4)">
                            <icon name="xiangpica"></icon>
                        </span>
                    </el-tooltip>
                   
                </div>
                <!-- 即时绘制 -->
                <draw-timing v-show="numberShow == 2 && huizhiShow" ref="drawTimingFav"
                @clearDrawPlot="onClearDrawPlot" @drawSelected="onDrawSelected"
                ></draw-timing>
            </div>

            <ul class="tabBox" >
                <li @click.stop="flyHome"><i class="iconfont icon-02"></i>热点收藏</li>
                <!-- <router-link :to="{name:'assess',params:{goto:'assess-home'}}" tag="li">
                    <icon name="tubiaozhexiantu" style="width: 16px;height:16px;"></icon>后评估案例</router-link> -->
                <li @click.stop="goAssessHome" class="assess"><icon name="tubiaozhexiantu" style="width: 16px;height:16px;"></icon>后评估案例</li>
                <li @click.stop="openLayer"><img src="../../images/layer.png" alt="" style="width: 20px;vertical-align: middle;position: relative;top:-2px;"/>图层</li>
            </ul>
            <div style="display: flex;" class="right-top-box">
                <div class="minIcon" @click="onMin(true)">——</div>
                <div @click="closeAllTab" style="height: 30px;width: 30px;z-index: 3">
                    <icon class="header-icon" name="close"></icon>
                </div>
            </div>
            <div v-show="minActive" class="minIconBox" @click="onMin(false)"><icon name="arrow-right-copy"></icon></div>
            <div class="header-panel"  @mouseenter="addWenjian=true" @mouseleave="addWenjian=false">
                <span class="header-text" >
                    <span @click="openWenjianjia" class="sanjiao" :class="isUploaded?'sanjiaoActive':''"><icon name="zuosanjiao-copy" ></icon></span>
                    <span class="eye1"> 
                        <!-- <i :class=" isUploaded ? 'iconfont icon-yanjing' : 'iconfont icon-bkj' "></i>  -->
                        <!-- <el-checkbox @click="openWenjianjia" v-model="isUploaded"></el-checkbox> -->
                    </span>
                    <span class="icon2"> <i class="iconfont icon-02"></i> </span>
                    <!-- <input @blur="titleborderCol = false" class="ipt" v-model="isContenteditable" type="text" :readonly="!titleborderCol" :style="titleborderCol?'border:1px solid #fff;':''" /> -->
                    <span>{{isContenteditable?isContenteditable:'收藏夹'}}</span>
                    <span v-show="addWenjian" class="iconBox1" >   
                        <el-tooltip content="新增"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">                                 
                            <span @click="addElement('genwenjianjia')" class="delIcon"><icon name="zengjia" /></span> 
                        </el-tooltip>
                        <el-tooltip content="重命名"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">
                            <span @click.stop="onbianji('checkName',null,null,true)" class="delIcon"><icon name="bianji" /></span>   
                        </el-tooltip>            
                        <el-tooltip content="导入文件"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">
                            <span  class="delIcon"  @click="onUpload" ><icon name="daoru" /></span>              
                        </el-tooltip> 
                        <el-tooltip content="导出全部文件"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">
                            <span @click.stop="onDaochuAll" class="delIcon"><icon name="daochu" /></span>              
                        </el-tooltip>               
                    </span>
                </span>
                
            </div>
            <el-upload style="position: absolute;opacity: 0;z-index: -1;" action="" :multiple="false" 
            :http-request="uploadRequest" :before-upload="beforeUpload" :show-file-list="false" :drag="false" accept=".kmz" >  
            <!-- accept=".kml,.kmz" -->
                <button size="small" type="primary" ref="button">点击上传</button>
            </el-upload>
            <el-tree :data="favoriteData" 
            :class="!isUploaded ? 'tree' : ''"
            @check-change="treeChange"
            @node-click="treeNodeClick"
            @check="onCheck"
            
            :check-strictiy="true"
            :expand-on-click-node="false"
            :check-on-click-node="false"
            :render-after-expand="false"
            show-checkbox 
            node-key="id" 
            default-expand-all
            accordion
           
            ref="tree"
            :props="defaultProps">
                <span 
               
                class="custom-tree-node" slot-scope="{ node, data ,store }">
                    <span class="titleSpan" @click="() => onDingwei(node , data)">
                        <i :class="data.icon"></i> {{node.label}}
                    </span>  
                    <span class="show" v-if="data.type==0 || data.fileOnly">
                            <el-tooltip content="新增"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">                
                                <span class="delIcon zengjia" @click.stop="() => onAdd(node , data )" style="position: relative;">
                                    <icon name="zengjia" class="remove-btn"/>
                                </span> 
                            </el-tooltip>
                            <el-tooltip content="重命名"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">                
                                <span class="delIcon" @click.stop="() => onbianji('checkName' ,node , data )">
                                    <icon name="bianji" class="remove-btn"/>
                                </span> 
                            </el-tooltip>
                            <el-tooltip content="删除"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">                
                                <span class="delIcon" @click.stop="() => onRemove(node , data )">
                                    <icon name="remove" class="remove-btn"/>
                                </span> 
                            </el-tooltip>
                            
                            <el-tooltip content="导出"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">                
                                <span class="delIcon" @click.stop="() => onDaochu(node , data )">
                                    <icon name="daochu" class="remove-btn"/>
                                </span> 
                            </el-tooltip>
                           
                    </span>
                    <span class="show" v-if="data.type!=0 && !data.fileOnly">
                            <el-tooltip content="定位"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">                
                                <span class="delIcon" @click.stop="() => onDingwei(node , data)">
                                    <icon name="dizhi" class="remove-btn"/>
                                </span>
                            </el-tooltip>
                            <el-tooltip content="修改"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">                
                                <span class="delIcon" @click.stop="() => onShezhi(node , data)">
                                    <icon name="shezhi" class="remove-btn"/>
                                </span> 
                            </el-tooltip>
                            <el-tooltip content="删除"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">                   
                                <span class="delIcon" @click.stop="() => onRemove(node , data)">
                                    <icon name="remove" class="remove-btn"/>
                                </span> 
                            </el-tooltip>
                            <el-tooltip content="导出"  class="item" effect="light" popper-class="onmytooltip" :visible-arrow="false" placement="top">                   
                                <span class="delIcon" @click.stop="() => onDaochu(node , data)">
                                    <icon name="daochu" class="remove-btn"/>
                                </span> 
                            </el-tooltip>
                    </span>
                </span>

            </el-tree>
        </div>
    <!-- </transition> -->
</template>

<script>
import util from '@/libs/util';
import { mapActions } from 'vuex';
import _ from 'lodash';
import DrawTiming from '../menu/draw-timing-fav.vue';
export default {
    name: 'favorite-panel',
    components: {
        DrawTiming
    },
    props: {},
    data () {
        return {
            celiangShow: false,
            huizhiShow: false,
            numberShow: 0,
            isActiveArr: [false, false, false, false, false,false],
            oldName: "",  //只改根名字，接口
            shezhiNameData:{},  //修改要素
            checkNameData:{},  //重命名
            topCheckNameActive: false,
            parentObjData:{},  //父元素
            waitingTwoMinute:false,
            imgValue:"",
            position:{
                x:0,
                y:0
            },
            titleborderCol:false,
            isContenteditable:"收藏夹",
            id: 1000,
            openAddBox: false,
            openAddStyle:{
                x:0,
                y:0
            },
            openAddObj: {},
            addWenjian: false,
            isUploaded: false,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            favoriteData: [],
            KmlLayerData: {},
            loadKmz: true,
            minActive: false,
            // loginUserInfo: JSON.parse(sessionStorage.getItem("goldfarm.loginUser") ) ||null,
            index: 0
        };
    },
    computed: {
        // favoriteData () {
        //     let root = [];
        //     this.$store.state.favorites.favoriteData.forEach(item => {
        //         root.push({ name: item, children: [] });
        //     });
        //     return root;
        // },
        // userId () {
        //     return this.$store.state.user.loginUserInfo.user_id;
        // },
        loginUserInfo () {
            return this.$store.state.user.loginUserInfo;
        },
        enManager: function () {
            return this.$store.state.user.loginUserInfo.role === 10;
        },
    },
    watch: {
        favoriteData:function(val){
            if(val.length>0){
                this.isUploaded = true;
            }else{
                this.isUploaded = false;
            }
        },
        waitingTwoMinute () {
            this.$store.commit('globeLoading', {loading: this.waitingTwoMinute, text: '正在获取数据...'});
        },
        "$store.state.favorites.addObjData":function(val){
            console.log(val);
            if(val){
                let data = {...val};
                data.layerId = this.index+=1;
                data.id = this.index;
                data.newAdd = true;
                this.favoriteData.push(data);
                //新增图层
                this.$emit("newAddNewKmlLayer",data);
                this.$emit("closeAddkmz");
                // console.log(this.favoriteData);
                //新建文件夹要调保存
                this.setKmzData();
            }
        },
        "$store.state.favorites.addYaosuData":function(val){
            console.log(val);
            if(val){      
            //    this.$refs['tree'].append(val,val.pid);
                val.isChecked = true;
                
                // if(val.type == 0){
                //     val.icon = "iconfont icon-wenjianjia1";          
                // }
                // if(val.type == 1){
                //     val.icon = "iconfont icon-dingwei";
                // }
                // if(val.type == 2){
                //     val.icon = "iconfont icon-weibiaoti2";
                // }
                // if(val.type == 3){
                //     val.icon = "iconfont icon-duobianxing";
                // }
                this.$refs['tree'].append(val,val.pid);
                this.$refs['tree'].setChecked(val,true,true);
            }          
        },
        "$store.state.favorites.addYaosuDataWenjian":function(val){
            console.log(val);
            if(val){      
                val.isChecked = true;
                // val.icon = "iconfont icon-wenjianjia1";          
               
                this.$refs['tree'].append(val,val.pid);
                
            }          
        },
        "$store.state.favorites.checkName":function(val){
            console.log(val);
            if(val){      
                if(this.topCheckNameActive){
                    this.isContenteditable = val;
                    //最上面重命名收藏夹
                    this.setCheckName();
                }else{
                    //非最上面
                    this.checkNameData.name = val;

                    if(this.oldName){
                        //子文件没数据时没数据，只改名字，接口保存
                        this.setNullCheckName();
                    }
                }
            }        
        },
        "$store.state.favorites.shezhiData":function(val){
            console.log(val);
            if(val){
                this.shezhiNameData = val;
            }
        }
    },
    mounted () {
       
        this.getFavoriteFiles();
    },
    methods: {
        //新增测量工具
        onClick(type){
            if(type == "celiang"){
                this.huizhiShow = false;
                this.numberShow = 1;
                this.celiangShow = !this.celiangShow;
                if(!this.celiangShow){
                    this.numberShow = 0;
                }
                this.onClearDrawPlot();
            }else{
                this.celiangShow = false;
                this.numberShow = 2;
                this.huizhiShow = !this.huizhiShow;
                if(!this.huizhiShow){
                    this.numberShow = 0;
                }
                this.onMeasuringClick('clearMeasure', 4);
            }
            this.$refs['drawTimingFav'].activeCeliang = this.huizhiShow; 
        },
        onMeasuringClick (itemType, index) {
            for (let i in this.isActiveArr) {
                this.isActiveArr[i] = false;
            }
            this.isActiveArr.splice(index, 1, true);
            this.$emit('menuSelected', itemType);
            if (index === 4) this.isActiveArr.splice(index, 1, false);
        },
        //清除即时绘制
        onClearDrawPlot(){
            this.$emit("clearDrawPlot");
            this.$refs['drawTimingFav'].defaultInfo();
        },
        onDrawSelected(type , options){
            this.$emit('drawSelected', type , options);
        },
       

        //子文件没数据时没数据，只改名字，接口
        setNullCheckName(){
            console.log(this.oldName , this.checkNameData.name);
            util.ajax.post('/km_file_name/'+this.loginUserInfo.user_id,{
                km_file_name_old : this.oldName,
                km_file_name_new : this.checkNameData.name
            })
            .then(res=>{
                console.log(res ,"子文件没数据时没数据，只改名字，接口");
                if(res.data.code != 201){
                    this.checkNameData.name = this.oldName;
                    this.$message.error("文件名修改失败！");
                }
            })
        },
        //获取最上面收藏夹名字
        getCheckName(){
            util.ajax.get('/km_root_name/'+this.loginUserInfo.user_id)
            .then(res=>{
                // console.log(res);
                if(res.data.code==200){
                    this.isContenteditable = res.data.data;
                }
            }).catch(res=>{
                this.$message.error('收藏夹名字获取失败！');
            })
        },
        //最上面重命名收藏夹
        setCheckName(){
            util.ajax.post('/km_root_name/'+this.loginUserInfo.user_id,{
                km_root_name: this.isContenteditable
            })
            .then(res=>{
                // console.log(res);
                if(res.data.code==201){
                    this.$message.success('收藏夹名字修改成功！');
                }
            })
        },
        //获取数据事件
        getFavoriteFiles(){
            this.getPersonalFavoriteFiles({ userId: this.loginUserInfo.user_id })
            .then(res => {
                let root = [];
                this.$store.state.favorites.favoriteData.forEach((item,index) => {
                    root.push(this.getKmlFileData(item));
                });
                this.favoriteData = root;
                // console.log(this.favoriteData,"后端获取的数据");
            })
            .catch(err => {
                this.$message.error('获取收藏夹数据出错：' + err.message);
            });
            //弹窗
            this.getbindKmlLayerPopupWindBack();
            //获取收藏夹名字
            this.getCheckName();
        },
          
        //获取数据
        ...mapActions(['getPersonalFavoriteFiles']),
        //路径格式
        getKmlFileUrl (fileName) {
            let newfileName = encodeURIComponent(fileName+".kmz");
            return util.S3Path + 'kmz&kml/' + this.loginUserInfo.user_id + '/' + newfileName;
        },
        //设置首次获取数据格式
        getKmlFileData (fileName) {
            // console.log(fileName.split(".")[0]); //转数据格式
            let newName = fileName.split(".")[0];
            this.index ++;
            return { name: newName, name2: fileName,id : this.index ,type: -1,layerId : this.index ,type: -1, isfile: true, children: [] , fileOnly : true  , only: true ,newAdd: false ,isupload: false};
        },
        //注册点击图标显示图片事件
        getbindKmlLayerPopupWindBack(){
            this.$emit("enterKmlMoudle",{
                clickCallBack:data=>{
                    // console.log(data);
                    if(data && data.info){
                        // console.log(data.feature._description);
                        if(data.info.indexOf("img")!=-1){
                            this.imgValue = data.info;
                            this.$emit("imgValue",this.imgValue,true ,this.position);
                            // console.log(this.imgValue);
                        }else{
                            this.$emit("imgValue","",false ,{});
                        }
                    }else{
                        this.$emit("imgValue","",false ,{});
                    }
                },
                moveCallBack:data=>{
                    // console.log(data);
                    this.position.x = data.position.x;
                    this.position.y = data.position.y;
                }
            });
        },
        // getbindKmlLayerPopupWindBack(){
        //     window.viewer.enterKmlMoudle && window.viewer.enterKmlMoudle(
        //         {   
        //             clickCallBack:(data)=>{
        //                 console.log(data);
        //                 if(data && data.info){
        //                     // console.log(data.feature._description);
        //                     if(data.info._value.indexOf("img")!=-1){
        //                         this.imgValue = data.info._value;
        //                         this.$emit("imgValue",this.imgValue,true ,this.position);
        //                         // console.log(this.imgValue);
        //                     }else{
        //                         this.$emit("imgValue","",false ,{});
        //                     }
        //                 }else{
        //                     this.$emit("imgValue","",false ,{});
        //                 }
        //             },
        //             moveCallBack:(data)=>{
        //                 // console.log(data);
        //                 this.position.x = data.position.x;
        //                 this.position.y = data.position.y;
        //             }

        //         }
        //     );
        // },
        //复选框发生改变事件
        treeChange(obj, checked, self){
           
            // console.log(obj, checked, self ,"复选框发生改变事件");
           
            obj.isChecked = checked;
            if(checked && obj.only && !obj.newAdd){
                obj.only = false;
                this.waitingTwoMinute = true;
                //加载kml
                var options = {};
                options.url = this.getKmlFileUrl(obj.name);
                options.layerId = obj.layerId;
                options.id = obj.id;
                options.visible = true;
                options.clampToGround = true;
                // console.log(options);
                this.$emit('openLoadKmlLayer', "loadKmlLayer" , options, (data) => {
                    data.then(res => {
                        // console.log(res);
                        obj.children = res;
                        
                        //遍历--设置获取数据后默认全选中
                        this.test_parse(obj);
                        this.waitingTwoMinute = false;
                        // console.log(this.favoriteData,"获取三维数据改变后的tree");
                    })
                })
                setTimeout(()=>{
                    if(obj.children.length<=0){
                        this.waitingTwoMinute = false;
                        obj.only = true;
                    }
                },30000)
            }
           
            //开启单个要素 ---新
            if(obj.isChecked && obj.type != 0){  
                // console.log(obj,"开启单个要素");
                this.$emit('openfeatureVisible' ,"treeNodeVisible" , obj , true);      
            }   
            //关闭单个要素--新  
            if(!obj.isChecked && obj.type != 0){  
                // console.log(obj,"关闭单个要素");
                this.$emit('openfeatureVisible' ,"treeNodeVisible" , obj , false);    
            }          

        },
        //遍历--设置获取数据后默认全选中
        test_parse(source){
            source.isChecked = true;
            let data = source.children;
            // for (var key in data) {
            //     // console.log(data[key]);
            //     data[key].isChecked = true; 

               //使用这方法不用遍历--打开一个新的自动关闭之前的
                this.$nextTick(() => {
                    this.$refs['tree'].setCheckedNodes(data);
                })
                
                // this.$nextTick(() => {
                //     this.$refs['tree'].setChecked(data[key],true,true);
                // })
                // if (data[key].type == 0 && data[key].children && data[key].children.length>0) {
                //     // console.log("1111");
                //     this.test_parse(data[key]);
                // }
            // }   
        },
        //点击节点事件
        treeNodeClick(obj, node, self){
            //关闭图片界面
            this.$parent.closeImgValueKmzBox();
            console.log(obj, node, self ,"点击节点事件");
            //判断点击到名字，给三维请求拿数据，
            if(obj.only && !obj.newAdd){
                obj.only = false;
                this.waitingTwoMinute = true;
                //加载kml
                var options = {};
                options.url = this.getKmlFileUrl(obj.name);
                options.layerId = obj.layerId;
                options.id = obj.id;
                options.visible = false;
                options.clampToGround = true;
                // console.log(options);
                this.$emit('openLoadKmlLayer', "loadKmlLayer" , options, (data) => {
                    data.then(res => {
                        // console.log(res);
                        obj.children = res;

                        this.waitingTwoMinute = false;
                        // console.log(this.favoriteData,"获取三维数据改变后的tree");
                    })
                })
                setTimeout(()=>{
                    if(obj.children.length<=0){
                        this.waitingTwoMinute = false;
                        obj.only = true;
                    }
                },30000)
            }   
            //  //显示图层可见性                        
            //  if(item.type == 0 ){     
            //     let box={}
            //     box.KmlLayerData=item.KmlLayerData;
            //     box.obj = item;
            //     this.$emit('openLoadKmlLayer' ,"layerVisible" , box);   
            // }       
        },
        //点击当前复选框事件
        onCheck(data , selectedObj){
            // console.log(data , selectedObj ,"点击当前复选框事件");
            //关闭图片界面
            this.$parent.closeImgValueKmzBox();
            
            if(data.isChecked ){
                console.log("复选框选中+调用定位");
                //---新
                this.$emit("featureLoaction", data);
            }
        },
        //传数据格式---现三维转
        // filterArray(data, parent , obj ,res) {
        //     // console.log(data, obj , parent)
        //     let vm = this;
        //     var tree = [];
        //     var temp;
        //     for (var i = 0; i < data.length; i++) {
        //         // console.log(this.KmlLayerData)              
        //         //
        //         if (data[i].pid == parent) {
        //             data[i].children = [];
        //             // data[i].disabled = false;
        //             // data[i].bianjied = true;
        //             data[i].isChecked = false;
        //             // data[i].hoverChecked = false;
        //             data[i].KmlLayerData = this.KmlLayerData;
        //             if(data[i].type == 0){
        //                 data[i].icon = "iconfont icon-wenjianjia1"               
        //             }
        //             if(data[i].type == 1){
        //                 data[i].icon = "iconfont icon-dingwei"
        //             }
        //             if(data[i].type == 2){
        //                 data[i].icon = "iconfont icon-weibiaoti2"
        //             }
        //             if(data[i].type == 3){
        //                 data[i].icon = "iconfont icon-duobianxing"
        //             }                   
        //             var obj = data[i];
        //             temp = this.filterArray(data, data[i].id);
        //             if (temp.length > 0) {
        //                 obj.children = temp;
        //             }
        //             tree.push(obj);
        //         }
        //     }       
        //     // console.log(tree)
        //     return tree;
        // },   
        onSetTreeData(){
            this.favoriteData = [];
            // console.log(this.$store.state.favorites.treeData,"赋值");
            this.favoriteData = this.$store.state.favorites.treeData;
        },
        //新增事件
        onAdd(node , data ){
            //关闭图片界面
            this.$parent.closeImgValueKmzBox();

            if(this.enManager){
                this.$message('您没有权限执行此操作！');
                return;
            }
            // console.log(node , data , window.event ,"新增");
            //判断没改动过,关闭时就不调保存
            this.favoriteData.map((item,index)=>{
                if(item.layerId == data.layerId){
                    item.isupload = true;
                }
            })

            this.$store.commit('objData',data); //当前元素
            this.parentObjData = data;
            this.openAddBox = true;
            this.openAddStyle.x = window.event.x-50;
            this.openAddStyle.y = window.event.y-10;
            
        },
        //离开选择要素框
        onLeaveAddBox(){
            this.openAddBox = false;
        },
        //新增要素事件
        addElement(type){
            if(this.enManager){
                this.$message('您没有权限执行此操作！');
                return;
            }

            this.$emit("addElement" ,type );
            this.openAddBox = false;
            
        },
        onbianji(type ,node, data , isTrue=false){
            //关闭图片界面
            this.$parent.closeImgValueKmzBox();
            console.log(type ,node, data ,isTrue,"编辑");
            this.checkNameData = {};
            this.topCheckNameActive = false;
            if(this.enManager){
                this.$message('您没有权限执行此操作！');
                return;
            }
             //修改最上面收藏夹名字
            if(isTrue){
                this.topCheckNameActive = isTrue;
                this.checkNameData = data;
                this.$emit("addElement" ,type);
            }
            //存起来，修改跟文件名字
            if(data && data.type==-1){
                this.oldName = data.name;
                this.checkNameData = data;
                this.$emit("addElement" ,type);
            }
            //修改子节点名字
            if(data && data.type!=-1){
                this.oldName = null;
                this.checkNameData = data;
                this.$emit("addElement" ,type);

                //判断没改动过,关闭时就不调保存
                this.favoriteData.map((item,index)=>{
                    if(item.layerId == data.layerId){
                        item.isupload = true;
                    }
                })
            }
        },
        onRemove(node, data){
            //关闭图片界面
            this.$parent.closeImgValueKmzBox();

            if(this.enManager){
                this.$message('您没有权限执行此操作！');
                return;
            }

            console.log(node, data , "删除");
            
            //删除kmz父文件
            if( data.isfile){
                this.$confirm('此操作会删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                    let delName = data.name+".kmz";
                    let newdelName = encodeURIComponent(delName);
                    //km_server/1?file_name=test.kmz
                    util.ajax.delete('/km_server/' + this.loginUserInfo.user_id +"?file_name="+ newdelName ).then((res) => {
                        // console.log(res)
                        if(res.data.code == 204){
                            this.$message.success(res.data.message);
                            this.favoriteData.forEach((item,index)=>{
                                if(item.name2 == delName){
                                    this.favoriteData.splice(index,1);
                                }
                            })
                            // console.log(this.favoriteData);
                            this.$store.state.favorites.favoriteData = this.favoriteData;
                            // 用---treeNodeRemove
                            this.$emit('removeKmlLayer' ,data);
                            this.$set(data);
                            this.$nextTick(() => {
                                this.$refs['tree'].remove(data.id,data);
                            })
                            this.$message.success("删除成功!");
                        }
                    })
                    
                }).catch((err) => {
                    console.log(err);
                });
            }
            //删除子节点
            else{
                //判断没改动过,关闭时就不调保存
                this.favoriteData.map((item,index)=>{
                    if(item.layerId == data.layerId){
                        item.isupload = true;
                    }
                })

                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1); 
                //关闭单个要素--新-删除      
                if(data.isChecked){  
                    data.isChecked = false;
                    // this.$emit('openfeatureVisible' ,"treeNodeVisible" , data , false);  
                    // 用---treeNodeRemove
                    this.$emit('removeKmlLayer' ,data);
                }   
                this.$set(data);
                this.$nextTick(() => {
                    this.$refs['tree'].remove(data.id,data);
                })
            }
        },
        onDingwei(node , data ){
            //关闭图片界面
            this.$parent.closeImgValueKmzBox();
            // console.log(node , data );
            
            if(data.isChecked ){
                console.log("定位");
                //---新
                this.$emit("featureLoaction", data);   
            }
        },
        onShezhi(node , data ){
            //关闭图片界面
            this.$parent.closeImgValueKmzBox();

            if(this.enManager){
                this.$message('您没有权限执行此操作！');
                return;
            }

            // console.log(node , data ,"设置修改");
            //判断没改动过,关闭时就不调保存
            this.favoriteData.map((item,index)=>{
                if(item.layerId == data.layerId){
                    item.isupload = true;
                }
            })

            this.$store.commit('shezhiData',data); //当前元素
            this.shezhiNameData = data;
            switch (data.type){
                case 1:
                    this.$emit("addElement" ,"tubiao" ,true);
                break;
                case 2:
                    this.$emit("addElement" ,"zhexian" ,true);
                break;
                case 3:
                    this.$emit("addElement" ,"duobianxing" ,true);
                break;
            }

        },
        onDaochu(node , data ){
            //关闭图片界面
            this.$parent.closeImgValueKmzBox();
            console.log(node , data ,"导出");
            if(data.name2){
                this.onDaochu1(node , data);

            }else{
                
                var arr = [];
                arr.push(data);
               
                arr.map((item,index)=>{
                    let config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    util.ajax.post('/km_export/'+this.loginUserInfo.user_id,{
                        km_node_data: item
                    },config).then((res) => {
                        console.log(res);
                        if(res.data.code == 201){
                            this.getXiaZai();
                        }
                        
                    }).catch((err) => {
                        console.log(err);
                    });
                })
                
            }

        },
        getXiaZai(){
            let url =  util.baseUrl + '/km_export/'+this.loginUserInfo.user_id;

            let link = document.createElement('a');
            link.style.display = 'none';
            link.target = '_blank';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        onDaochu1(node , data ){     
            // console.log(node , data )       
            let user_id = this.loginUserInfo.user_id;
            let xiazai_name = data.name2;
            let url =  util.S3Path + 'kmz&kml/' + user_id +'/'+ xiazai_name;

            let link = document.createElement('a');
            link.style.display = 'none';
            link.target = '_blank';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        },
        //导出全部已有的Kmz文件
        onDaochuAll(){
            console.log("导出全部已有的Kmz文件");
            // console.log(this.favoriteData);
            this.favoriteData.forEach((item,index)=>{
                this.onxiazai(item);
            })

        },
        onxiazai(data){
            let user_id = this.loginUserInfo.user_id;
            let xiazai_name = data.name2;
            let url =  util.S3Path + 'kmz&kml/' + user_id +'/'+ xiazai_name;

            let link = document.createElement('a');
            link.style.display = 'none';
            link.target = '_blank';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        //点击收藏夹、、j间接调用上传
        onUpload(){
            this.$refs.button.click();
        },
        //
        openWenjianjia(){
            this.isUploaded = !this.isUploaded;
        },
        //打开后评估
        goAssessHome(){
             //关闭图片界面
             this.$parent.closeImgValueKmzBox();
            //保存--新
            this.setKmzData();
            // this.$router.push({name: "assess",params:{goto:'assess'}});
            this.$emit("openAssess");
             //清空绘制
            this.onMeasuringClick('clearMeasure', 4);
            this.onClearDrawPlot();
        },
        //返回地球主页
        flyHome(){
            this.$emit("flyHome");
            //清空绘制
            this.onMeasuringClick('clearMeasure', 4);
            this.onClearDrawPlot();
        },
        openLayer(){
            //关闭图片界面
             this.$parent.closeImgValueKmzBox();
            //保存--新
            this.setKmzData();
            //清空绘制
            this.onMeasuringClick('clearMeasure', 4);
            this.onClearDrawPlot();

            this.$emit("openLayer");
        },
        closeAllTab (){
            this.onMeasuringClick('clearMeasure', 4);
            this.onClearDrawPlot();
            this.$emit('closeAllTab')
        },
        //最小化
        onMin(isTrue){
            //关闭图片界面
            this.$parent.closeImgValueKmzBox();
            this.minActive = isTrue;
        },
        //关闭KMZ收藏夹
        onClose () {
             //关闭图片界面
             this.$parent.closeImgValueKmzBox();
            this.imgValue ="";
            //关闭收藏
            this.$emit('close');

            //保存--新
            this.setKmzData();
            //清空绘制
            this.onMeasuringClick('clearMeasure', 4);
            this.onClearDrawPlot();
        },
        //保存
        setKmzData(){
            this.favoriteData.map((item,index)=>{
                if(item.children.length && item.isupload){
                    // console.log(item);
                    let config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    util.ajax.post('/km_save/'+this.loginUserInfo.user_id  ,{
                        km_data: item
                    },config).then((res) => {
                        console.log(res);
                        if(res.data.code != 201){
                            this.$message.success("文件数据保存失败！");
                            return;
                        }
                        // this.$message.success("文件数据保存成功！");
                    }).catch((err) => {
                        console.log(err);
                    });
                }
                if(item.newAdd && !item.isupload){
                    // console.log(item);
                    let config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    util.ajax.post('/km_save/'+this.loginUserInfo.user_id  ,{
                        km_data: item
                    },config).then((res) => {
                        console.log(res);
                        if(res.data.code != 201){
                            this.$message.success("文件数据保存失败！");
                            return;
                        }
                        // this.$message.success("文件数据保存成功！");
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            })
            
        },
        //上传前钩子
        beforeUpload(option){
            console.log("文件名字符："+option.name.length);
            if(option.name.length-4>20){
                this.$message.error('文件名不能超过20字符');
                return false;
            }
        },
        //上传
        uploadRequest (option) {
            this.waitingTwoMinute = true;
            const file = option.file;
            let fileExt = this.getFileExt(file.name);
            if (!fileExt || '.kmz'.indexOf(String(fileExt).toLowerCase()) < 0) {
                // this.$message.error('请选择扩展名为.kml,.kmz的文件。');
                this.$message.error('请选择扩展名为.kmz的文件。');
                return;
            }
            const formData = new FormData();
            formData.append('km_file', file);
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            util.ajax.post('/km_server/' + this.loginUserInfo.user_id, formData, config).then((res) => {
                if (res.data.code !== 201) {
                    this.$message.error(file.name + '文件上传出错。');
                } else {
                    this.favoriteData.push(this.getKmlFileData(file.name));
                    this.waitingTwoMinute = false;
                    console.log(this.favoriteData,"上传");
                }
            }).catch((err) => {
                throw err;
            });
        },

        getFileExt (filename) {
            if (!filename || filename.lastIndexOf('.') < 0) return null
            return filename.substring(filename.lastIndexOf('.'))
        }
    }

};
</script>

<style scoped>

.filterBox .header-panel {
  margin-top: 0;
  /* margin-top: 80px; */
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
}
.filterBox .header-text {
    width: 100%;
    margin-top: 10px;
    color: #d4eff6;
  height: 25px;
  line-height: 25px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  font-weight: 100;
  opacity: 1;
  position: relative;
  padding-left: 5px;
}
.filterBox .header-icon {
  color: rgba(212, 239, 246, 1);
  height: 20px;
  line-height: 28px;
  font-size: 28px;
  cursor: pointer;
  font-weight: 900;
  opacity: 0.8;
}
.filterBox .header-icon:hover {
  color: #fff;
  opacity: 1;
}
.filterBox .condition-main-panel {
  margin-top: 20px !important;
}
.filterBox .condition-panel {
  flex-direction: row;
  margin-top: 7px;
  opacity: 0.7;
}
.filterBox .condition-text {
  font-family: MicrosoftYaHei;
  color: rgba(212, 239, 246, 1);
  font-size: 10px;
}
.filterBox .el-checkbox__label {
  font-size: 10px !important;
  padding-left: 3px !important;
  color: #d4eff6;
}
.filterBox .el-checkbox + .el-checkbox {
  margin-left: 0px !important;
}
.filterBox /deep/ .el-checkbox{
    width: 35px !important;
    /* position: relative;
    top: -3px; */
}
.filterBox .el-checkbox__original {
  display: none !important;
}
.filterBox .list-panel {
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  bottom: 20px;
  top: 230px;
  width: 350px;
  padding-right: 20px;
}
  .el-tree-node__label{
                font-family: MicrosoftYaHei;
                font-weight: 400;
                line-height: 30px;
                font-size: 10px !important;
                color: #d4eff6;
            }
</style>

<style lang="less" scoped>
.tabBox{
    border: 1px solid rgba(240,252,255,0.3);
    border-left: none;
    border-right: none;
    display: flex;
    color: #d4eff6;
    text-align: center;
    margin: 0;
    padding: 0;
    /* margin-top: 50px; */
    font-size: 15px; 
    &>li{
        flex: 1;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
    } 
    &>li:nth-of-type(2){
        border-left: 1px solid rgba(240,252,255,0.3);
        border-right: 1px solid rgba(240,252,255,0.3); 
    }
    &>li:nth-of-type(1){
        color:rgba(51,200,111,1);
    }
}
.celiangBox{
    margin-top: 50px;
    background:rgba(25,28,54,0.6);
    color: #d4eff6;
    &>p{
        height: 40px;
        line-height: 40px;
        margin: 0;
        padding: 0px 0 0 10px;
        span{
            margin-right: 5px;
            width: 25px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            display: inline-block;
            border:1px solid rgba(199,218,207,1);
            border-radius: 4px;
            cursor: pointer;
            outline: none;
            box-sizing: border-box;
        }
    }
    .measuring-tool{
        height: 40px;
        line-height: 40px;
        padding: 0 0 0 8px;
        span{
            margin-right: 10px;
            width: 25px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            display: inline-block;
            font-size: 21px;
            cursor: pointer;
            outline: none;
        }
    }
}
.celiangActive{
    background:rgba(51,200,111,1) !important;
    border: none !important;
    position: relative;
    top: -1px;
}
.active{
    color:rgba(47,255,47,1) !important;
}
.Ayewu {
    border-bottom: 1px solid rgba(240,252,255,0.3);
    opacity: 1 !important;
    .assess{
      display: none !important;
    }
}

.minIcon{
    width: 25px;
    height: 25px;
    z-index: 99;
    cursor: pointer;
    color: #d4eff6;
    font-size: 11px;
    margin-right: 5px;
}
.minIconBox{
    position: relative;
    left: 400px;
    top: 50%;
    width: 30px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 20px;
    margin-top: -50px;
    border-radius: 0 4px 4px 0;
    background: rgba(19, 31, 54, 0.6);
    color: #d4eff6;
    cursor: pointer;
    z-index: 99999;
}
.minIcon:hover{
    color: #fff;
}
.right-top-box{
    position: absolute;
    right: 0;
    top : 25px;
}
.filterBox {
  width: 400px;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  background: rgba(19, 31, 54, 0.6);
  padding: 15px 0;
  z-index: 2;
  transition: all 0.5s;
}
.minActive{
    left: -400px !important;
    transition: all 0.5s;
}
.filterBox /deep/ .custom-tree-node{
    width: 85%;
    color: #d4eff6;
    display: flex;
    justify-content: space-between;
    .titleSpan{
        width: 65%;
        /* border:1px solid red; */
        overflow: hidden;
        text-overflow: ellipsis;      
 	    white-space: nowrap;
    }
    .title{
        padding-left: 10px;
    }
}
.sanjiao{
    color: rgba(255, 255, 255,0.9);
    position: absolute;
    transition: all 0.5s;
    cursor: pointer;
}
/deep/ .icon-yanjing{
    color: #33C86F;
}
.sanjiaoActive{
    transform: rotate(90deg);
    transition: all 0.5s;
}
.icon2{
    margin: 0 8px 0 -1px;
}
.eye1{
    margin-left: 20px;
    cursor: pointer;
}

.filterBox /deep/ .curEye{
    cursor: pointer;
    display: inline-block;
    margin-right: 10px;
}
.filterBox /deep/ .delIcon{
    margin-right: 5px;
}
/deep/ .custom-tree-node .show{
    display: none;
}
/deep/ .custom-tree-node:hover .show{
    display: block !important;
}
.filterBox /deep/ .gongjuhe{
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    color: #d4eff6;
}
.iconBox1{
    position:absolute;
    right: 5px;
    top:0px;
    cursor: pointer;
}
.filterBox .zengjiaBox{
    width: 65px;
    position: absolute;
    /* top: 225px;
    left: 400px; */
    z-index: 9999;
    p{
        padding: 0;
        margin: 0;
    }
    p:nth-of-type(1){
        font-size: 15px;
    }
    &>ul{
        white-space: nowrap;
        padding: 10px;
        line-height: 20px;
        margin: 0;
        font-size: 12px;
        color: #d4eff6;
        background: rgba(19, 31, 54, 0.6);
        &>li:hover{
            color: #33C86F;
            cursor: pointer;
        }
    }
   
}
.ipt{
    background: none;
    border: none;
    color: #d4eff6;
    font-size: 16px;
    outline: none;
    width: 128px;
}

.filterBox .el-tree{
    height: 75%;
    overflow: auto;
    background:rgba(255, 255, 255,0); 
    font-size: 15px; 
    .el-tree-node{
        .el-tree-node__content{
            .el-tree-node__label{
                font-family: MicrosoftYaHei;
                font-weight: 400;
                line-height: 30px;
                font-size: 10px !important;
                color: #d4eff6;
            }
        }
    }
}
.filterBox /deep/ .tree{
    height: 0 !important;
}
/* .filterBox /deep/ .el-checkbox__inner{
   opacity: 0 !important;
} */
.filterBox /deep/ .el-tree-node__content:hover{
    background-color: rgba(19, 31, 54,1) !important;
}
.filterBox /deep/ .el-tree-node:focus>.el-tree-node__content{
    background-color: rgba(10, 10, 10,1) !important;
}

</style>

<template>
    <div class="compass"  >
        <img class="bg" src="../../images/dibu1.png" />
        <div :style="retateStyle" class="pointBox" >
            
            <img class="point" src="../../images/zhen1.png" @click="autoNorth" />
        </div>
        <ol class="ol" @mouseenter="mouseEnter" @mouseleave="mouseleave">
            <li class="lio1" @click="onChange(0,$event)"><div class="dian"></div><div v-show="activeArr[0]" ></div></li>
            <li class="lio2" @click="onChange(15,$event)"><div class="dian"></div><div v-show="activeArr[15]" ></div></li>
            <li class="lio3" @click="onChange(14,$event)"><div class="dian"><span v-show="!activeArr[14]">NE</span></div><div v-show="activeArr[14]" ></div></li>
            <li class="lio4" @click="onChange(13,$event)"><div class="dian"></div><div v-show="activeArr[13]" ></div></li>
            <li class="lio5" @click="onChange(12,$event)"><div class="dian"></div><div v-show="activeArr[12]" ></div></li>
            <li class="lio6" @click="onChange(11,$event)"><div class="dian"></div><div v-show="activeArr[11]" ></div></li>
            <li class="lio7" @click="onChange(10,$event)"><div class="dian"><span v-show="!activeArr[10]">ES</span></div><div v-show="activeArr[10]" ></div></li>
            <li class="lio8" @click="onChange(9,$event)"><div class="dian"></div><div v-show="activeArr[9]" ></div></li>
            <li class="lio9" @click="onChange(8,$event)"><div class="dian"></div><div v-show="activeArr[8]" ></div></li>
            <li class="lio10" @click="onChange(7,$event)"><div class="dian"></div><div v-show="activeArr[7]" ></div></li>
            <li class="lio11" @click="onChange(6,$event)"><div class="dian"><span v-show="!activeArr[6]">WS</span></div><div v-show="activeArr[6]" ></div></li>
            <li class="lio12" @click="onChange(5,$event)"><div class="dian"></div><div v-show="activeArr[5]" ></div></li>
            <li class="lio13" @click="onChange(4,$event)"><div class="dian"></div><div v-show="activeArr[4]" ></div></li>
            <li class="lio14" @click="onChange(3,$event)"><div class="dian"></div><div v-show="activeArr[3]" ></div></li>
            <li class="lio15" @click="onChange(2,$event)"><div class="dian"><span v-show="!activeArr[2]">NW</span></div><div v-show="activeArr[2]" ></div></li>
            <li class="lio16" @click="onChange(1,$event)"><div class="dian"></div><div v-show="activeArr[1]" ></div></li>
    
        </ol>
        
        <ul class="ul">
            <li class="li1">N</li>
            <li class="li2" v-show="activeArr[14]">NE</li>
            <li class="li3">E</li>
            <li class="li4" v-show="activeArr[10]">ES</li>
            <li class="li5">S</li>
            <li class="li6" v-show="activeArr[6]">WS</li>
            <li class="li7">W</li>
            <li class="li8" v-show="activeArr[2]">NW</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'compass',
        data (){
            return{
                activeArr:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                cunArr:[],
                isShow: false,
                angle: 0 ,  //正北 0
                yuanXY:{
                    x:809,
                    y:24
                }
            }
        },
        computed: {
            northInfo () {
                return this.$store.state.app.northInfo;
            },
            retateStyle () {
                return {
                    transform: 'rotate(' + (360 - this.northInfo.angle) + 'deg)'
                };
            }
        },
        methods: {
            init(){
                this.activeArr = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
            },
            mouseEnter(){
                this.cunArr = this.activeArr;
                // console.log(this.cunArr,"cun");
                this.init();
            },
            mouseleave(){
                this.activeArr = this.cunArr;
                // console.log(this.activeArr,"000");
                // console.log(this.cunArr,"cun");
            },
            autoNorth () {
                // for(var i=0; i<this.activeArr.length; i++ ){
                //     this.activeArr[i] = false;
                // }
                // this.activeArr[0] = true;
                // this.$emit('auto-north', this.angle);
            },
            onChange(num, ev){
                let deg = num*22.5;
                this.$emit('auto-north', deg);
                // console.log(num,deg,360 - this.northInfo.angle);
                // console.log(ev.target);
                for(var i=0; i<this.activeArr.length; i++ ){
                    this.activeArr[i] = false;
                }
                this.activeArr[num] = true;
                this.cunArr = this.activeArr;
                console.log(this.cunArr,"cun");
            },
            getAngle(point1, point2, point3) {
				var bb = (point2.y - point1.y) * (point2.y - point1.y) + (point2.x - point1.x) * (point2.x - point1.x);
				var aa = (point3.y - point1.y) * (point3.y - point1.y) + (point3.x - point1.x) * (point3.x - point1.x);
				var cc = (point3.y - point2.y) * (point3.y - point2.y) + (point3.x - point2.x) * (point3.x - point2.x);
				var cosa = (bb + cc - aa) / (2 * Math.sqrt(bb) * Math.sqrt(cc));
				return Math.acos(cosa);
            },
            duration(point1, point2, point3) {
				var sp = (point1.x - point3.x) * (point2.y - point3.y) - (point1.y - point3.y) * (point2.x - point3.x);
				// console.log(sp);
				if (sp > 0) {
					return 1
				} else if (sp < 0) {
					return -1
				} else {
					return 0;
				}
			}
        }
    };
</script>

<style lang="less" scoped>
    .compass {
        position: absolute;
        top: 25px;
        right: 23px;
        width: 86px;
        height: 86px;
        
        .yuan{
            width: 8px;
            height: 8px;
            background: #FFD93F;
            border-radius:50%;
            position: absolute;
            z-index: 112;
            top: -12px;
            left: 48%;
            margin-left: -4px;
            cursor: pointer;
        }
        .bg {
            width: 86px;
            height: 86px;
            user-select: none;
            display: block;
        }
        .pointBox{
            position: absolute;
            /* z-index: 1111; */
            top: 8px;
            left: 36px;
            width: 16px;
            height: 60px;
            transform-origin: center center;
        }
        .point {
            display: block;
            width: 18px;
            height: 46px;
            cursor: pointer;
            
        }
    }
    .ol{
        position: absolute;
        top: -23px;
        left: -20px;
        width: 120px;
        height: 120px;
        margin: 0;
        padding: 0;
        z-index: 112;
        &>li{
            position: absolute;
            width: 10px;
            height: 10px;
            cursor: pointer;
            font-size:13px;
            &>div{
                width: 8px;
                height: 8px;
                background: #FFD93F;
                border-radius:50%;
                cursor: pointer; 
                
            }
            &>div:nth-of-type(1){
                opacity: 0.9;
                display: none;
            }
            &>div:nth-of-type(1){
               position: absolute;
            }
        }
        &>li:hover .dian{
            display: block;
        }
        .dian>span{
            position: absolute;
            color: #fff;
        }
        .lio1{
            top: 17%;
            left: 49%;
            margin-top: -0.5px;
        }
        .lio2{
            top: 18%;
            left: 61%;
        }
        .lio3{
            top: 25%;
            left: 72%;
            span{
                left:11px;
                top:-15px;
            }
        }
        .lio4{
            top: 35%;
            left: 78%;
        }
        .lio5{
            top: 47%;
            left: 80%;
        }
        .lio6{
            top: 59%;
            left: 78%;
        }
        .lio7{
            top: 69%;
            left: 71%;
            span{
                left:8px;
                top:7px;
            }
        }
        .lio8{
            top: 76%;
            left: 61%;
        }
        .lio9{
            top: 78%;
            left: 49%;
            margin-left: 0.5px;
        }
        .lio10{
            top: 76%;
            left: 38%;
        }
        .lio11{
            top: 70%;
            left: 27%;
            span{
                left:-20px;
                top:4px;
            }
        }
        .lio12{
            top: 60%;
            left: 20%;
        }
        .lio13{
            top: 47%;
            left: 18%;
        }
        .lio14{
            top: 35%;
            left: 20%;
        }
        .lio15{
            top: 25%;
            left: 27%;
            span{
                left:-26px;
                top:-15px;
            }
        }
        .lio16{
            top: 18%;
            left: 37%;
        }
       
    }
    .ul{
        position: absolute;
        top: -23px;
        left: -20px;
        width: 120px;
        height: 120px;
        margin: 0;
        padding: 0;
        /* border: 1px solid red; */
        color: #fff;
        &>li{
            position: absolute;
            width: 20px;
            height: 20px;
            line-height:20px;
            text-align: center;
            font-size:13px;
        }
        .li1{
            top: 0;
            left: 52%;
            margin-left: -10px;
        }
        .li3{
            top: 50%;
            right: 0;
            margin-top: -10px;
        }
       .li5{
            left: 52%;
            bottom: 0;
            margin-left: -10px;
        }
        .li7{
            left: 0;
            top: 50%;
            margin-top: -10px;
        }
        .li2{
            left: 80%;
            top: 20%;
            margin-top: -10px;
        }
        .li4{
            left: 75%;
            bottom: 10%;
            margin-top: -10px;
        }
        .li6{
            top: 80%;
            left: 10%;
            margin-top: -10px;
        }
        .li8{
            top: 20%;
            left: 5%;
            margin-top: -10px;
        }
    }
</style>
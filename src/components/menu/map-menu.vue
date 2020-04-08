<template>
    <div class="mapMenu"
    @mouseenter="selectedBoxActive = true"
    @mouseleave="selectedBoxActive = false">
        <div class="cont" >
            <img v-show="!messageActive" src="../../images/map1.png" alt="" />
            <img v-show="messageActive" src="../../images/map2.png" alt="" />
            <div v-show="!messageActive" class="title" style="color: #000;">地图</div>
            <div v-show="messageActive" class="title">地球</div>
        </div>

        <ul 
        @mouseenter="selectedBoxActive = true"
        @mouseleave="selectedBoxActive = false"
        class="selectedBox" v-show="selectedBoxActive">
            <li @click="onMapClick('ditu')" :style="!messageActive?'border:1px solid #1BB656;':''">
                <img src="../../images/map1.png" alt="" />
                <div class="top-left">地图</div>
            </li>
            <li @click="onMapClick('diqiu')" :style="messageActive?'border:1px solid #1BB656;':''">
                <img src="../../images/map2.png" alt="" />
                <div class="top-left top-right">地球</div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default{
        name:"mapMenu",
        data () {
            return{
                messageActive: true,
                selectedBoxActive: false
            }
        },
        methods: {
            onMapClick(type){
                switch (type){
                    case "ditu":
                        this.message = "地图";
                        this.messageActive = false;
                        this.selectedBoxActive = false;
                    break;
                    case "diqiu":
                        this.message = "地球";
                        this.messageActive = true;
                        this.selectedBoxActive = false;
                    break;
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .mapMenu{
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 8888;          
        color: #fff;
        font-size:12px;
        border-radius:4px;
        width:130px;
        height:100px;
        .cont{
            position: absolute;
            bottom: 0;
            right: 0;
            border:1px solid rgba(255,255,255,0.7);
            width:100px;
            height:80px;
            border-radius:4px;
        }
        img{
            border-radius:4px;
            display: block;
            width:100px;
            height:80px;     
            cursor: pointer;  
        }
        .title{
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 123;
            padding: 3px 4px;
        }
        .top-left{
            background:rgba(27,182,86,0.6);
            border-radius:0px 0px 4px 0px;
            color:rgba(255,255,255,1);
            position: absolute;
            bottom: 0;
            right: 108px;
            z-index: 123;
            padding: 3px 4px;
        }
        .top-right{
            right: 0;
        }
        .selectedBox{
            position: absolute;
            top: -75px;
            left: -80px;
            z-index: 456;
            margin: 0;
            padding: 0;
            width: 210px;
            display: flex;
            justify-content: space-between;
            &>li{
                border: 1px solid rgba(255,255,255,0.7);
                border-radius:4px;
            }
        }
    }
</style>
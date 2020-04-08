<template>
    <div class="noiseBox">
        <div class="noise-container" v-if="isSelect">
            <div class="noise-item">
                <div class="legend-top">
                   
                    <div class="image-container">
                        <img src="../../images/noise.png" alt="">

                    </div>
                    <div class="legend-scale">
                        <p>&nbsp; <small><small> 0 ~30</small></small></p>
                        <p>&nbsp; <small><small> 30~35</small></small></p>
                        <p>&nbsp; <small><small> 35~40</small></small></p>
                        <p>&nbsp; <small><small> 40~45</small></small></p>
                        <p>&nbsp; <small><small> 45~50</small></small></p>
                        <p>&nbsp; <small><small> 50~55</small></small></p>
                        <p>&nbsp; <small><small> 55~60</small></small></p>
                        <p>&nbsp; <small><small> 60~65</small></small></p>
                        <p>&nbsp; <small><small> 65~70</small></small></p>
                        <p>&nbsp; <small><small> 70~75</small></small></p>
                        <p>&nbsp; <small><small> 75~80</small></small></p>
                        <p>&nbsp; <small><small> 80~85</small></small></p>
                        <p>&nbsp; <small><small> ≥85 &nbsp;&nbsp;</small></small></p>
                    </div>
                </div>
                <div class="legend-content">
                    <div class="active">噪音</div>
                    <div>单位：分贝</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
       
        data () {
            return {
               
            };
        },
        props:["isSelect"],
        mounted() {
           //屏幕变化触发
            window.onresize = function temp() {
                document.querySelector(".noiseBox").style.fontSize=document.documentElement.clientWidth/31+"px";
            };
        },
        methods: {
            
        }
        
    };
</script>

<style lang="less" scoped>
/*分辨率低于1200....，采用下面的样式*/
@media screen and (max-device-width:1200px){
    .noiseBox{
        
        .noise-container{
            display: flex;
            border: 1px solid #fff;
            padding-top: 20px;
            border-radius: 5px;
            position: relative;
            /* right: 30px; */
            right: 0;
        }
        .noise-item{
            /* width: 90px; */
        }
        .legend-content{
            background: rgba(3, 32, 62, 0.6);
            height: 65px;        
            color: RGBA(211, 219, 228, 1);
            text-align: center;
            border-radius: 0 0 5px 5px;
        }
        .legend-content div{
            font-size: 13px;
        }
        .legend-content div:nth-of-type(2){
            padding-top: 8px;
            font-size: 10px;
        }
        .legend-content .active{
            color: RGBA(51, 200, 111, 1);
            font-size: 14px;
        }
        .legend-top{
            display: flex;
            justify-content: center;
            margin-bottom: 2px;
            padding: 0 10px;
            position: relative;
        }
        .legend-scale{
            display: flex;
            flex-flow: column;
            text-align: left;
            height: 205px;
            color: rgba(255,255,255,1);
            position: relative;
            top: -1px;
        }
        
        .legend-scale p{
            margin: 0;
            font-size: 11px;
            width: 45px;
            height: 16px;
            line-height: 16px;
        }
    
        .image-container{
            width: 25px;
            height: 205px;
        }   
        .image-container img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }
}

/* 分辨率高于1500.....，采用下面的样式 */
@media screen and (min-device-width: 1500px){
    .noiseBox{
        font-size: 50px;
        .noise-container{
            display: flex;
            border: 1px solid #fff;
            padding-top: 20px;
            border-radius: 5px;
            position: relative;
            /* right: 30px; */
            right: 0;
        }
        .noise-item{
            /* width: 80px; */
            width: 1.66em;
        }
        .legend-content{
            background: rgba(3, 32, 62, 0.6);
            /* height: 65px; */
            height: 1.3em;
            
            color: RGBA(211, 219, 228, 1);
            text-align: center;
            border-radius: 0 0 5px 5px;
        }
        
        .legend-content div:nth-of-type(2){
            padding-top: 8px;
            font-size: 12px;
        }
        .legend-content .active{
            color: RGBA(51, 200, 111, 1);
            font-size: 14px;
        }
        .legend-top{
            display: flex;
            justify-content: center;
            margin-bottom: 2px;
            position: relative;
        }
        .legend-scale{
            display: flex;
            flex-flow: column;
            text-align: left;
            height: 205px;
            font-size: 10px;
            color: rgba(255,255,255,1);
            position: relative;
            top: -1px;
  
        }
        .legend-scale p{
            margin: 0;
            height: 16px;
            line-height: 16px;
            font-size: 10px;
  
        }
    
        .image-container{
            width: 25px;
            height: 205px;

        }   
        .image-container img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }

}

@media screen and (min-device-width: 2000px){
    .noiseBox{
        font-size: 50px;
        .noise-container{
            display: flex;
            border: 1px solid #fff;
            padding-top: 20px;
            border-radius: 5px;
            position: relative;
            /* right: 30px; */
            right: 0;
        }
        .noise-item{
            /* width: 80px; */
            width: 1.6em;
        }
        .legend-content{
            background: rgba(3, 32, 62, 0.6);
            /* height: 65px; */
            height: 1.3em;
            
            color: RGBA(211, 219, 228, 1);
            text-align: center;
            border-radius: 0 0 5px 5px;
        }
        
        .legend-content div:nth-of-type(2){
            /* padding-top: 8px; */
            padding-top: 0.18em;
            font-size: 0.26em;
        }
        .legend-content .active{
            color: RGBA(51, 200, 111, 1);
            /* font-size: 14px; */
            font-size: 0.28em;
        }
        .legend-top{
            display: flex;
            justify-content: center;
            /* align-items: flex-end; */
            margin-bottom: 2px;
            position: relative;
        }
        .legend-scale{
            display: flex;
            flex-flow: column;
            /* justify-content: space-between; */
            /* justify-content: start; */
            text-align: left;
            height: 205px;
            /* height: 3.6em; */
            font-size: 10px;
            color: rgba(255,255,255,1);
            position: relative;
            top: -1px;
            /* border: 1px solid red; */
        }
        
        .legend-scale p{
            margin: 0;
            height: 16px;
            line-height: 16px;
            /* font-size: 10px; */
            font-size: 0.2em;
        }
    
        .image-container{
            width: 25px;
            height: 205px;
            /* width: 0.5em; */
            /* height: 3.6em; */
        }   
        .image-container img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }
}
/* 大于1200。。。小于1500。。。 */
@media screen and (min-width:1200px) and (max-width:1500px){
    .noiseBox{
        font-size: 50px;
        .noise-container{
            display: flex;
            border: 1px solid #fff;
            padding-top: 20px;
            border-radius: 5px;
            position: relative;
            /* right: 30px; */
            right: 0;
        }
        .noise-item{
            width: 90px;
            /* width: 1.8em; */
        }
        .legend-content{
            background: rgba(3, 32, 62, 0.6);
            /* height: 65px; */
            height: 1.3em;
            
            color: RGBA(211, 219, 228, 1);
            text-align: center;
            border-radius: 0 0 5px 5px;
        }
        
        .legend-content div:nth-of-type(2){
            /* padding-top: 8px; */
            padding-top: 0.18em;
            font-size: 12px;
        }
        .legend-content .active{
            color: RGBA(51, 200, 111, 1);
            font-size: 14px;
        }
        .legend-top{
            display: flex;
            justify-content: center;
            margin-bottom: 2px;
            position: relative;
        }
        .legend-scale{
            display: flex;
            flex-flow: column;
            text-align: left;
            height: 205px;
            font-size: 10px;
            color: rgba(255,255,255,1);
            position: relative;
            top: -1px;
            /* border: 1px solid red; */
        }
        .legend-scale p{
            margin: 0;
            height: 16px;
            line-height: 16px;
            font-size: 11px;
        }
    
        .image-container{
            width: 25px;
            height: 205px;

        }   
        .image-container img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }

}
</style>

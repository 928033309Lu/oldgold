<template>
    <div class="legend-container">
        <div class="legend-item" v-if="itemOne">
            <div class="legend-top">
                <div class="image-container">
                    <img src="../../images/ex001.jpg" alt="">

                </div>
                <div class="legend-scale">
                    <p>{{itemOneMax | roundNumber}}</p>
                    <!--<p>5.5</p>-->
                    <p>{{itemOneMin | roundNumber}}</p>
                </div>
            </div>
            <div class="legend-content">
                <div v-bind:class="{active: one}">综合风图谱</div>
                <div v-bind:class="{active: two}">风图谱</div>
                <div v-bind:class="{active: three}">风能切片</div>
            </div>
        </div>
        <div class="legend-item" v-if="itemTwo">
            <div class="legend-top">
                <div class="image-container">
                    <img src="../../images/ex003.jpg" alt="">

                </div>
                <div class="legend-scale">
                    <p>{{itemTwoMax | roundNumber}}</p>
                    <!--<p>1.5</p>-->
                    <p>{{itemTwoMin | roundNumber}}</p>
                </div>
            </div>
            <div class="legend-content">
                <div class="active">大湍流区</div>
            </div>
        </div>
        <div class="legend-item" v-if="itemThree">
            <div class="legend-top">
                <div class="image-container">
                    <img src="../../images/ex002.jpg" alt="">

                </div>
                <div class="legend-scale">
                    <p>{{itemThreeMax | roundNumber}}</p>
                    <!--<p>2.5</p>-->
                    <p>{{itemThreeMin | roundNumber}}</p>
                </div>
            </div>
            <div class="legend-content">
                <div class="active">机组震动区</div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'legend-button',
        data () {
            return {
                itemOne: false,
                itemTwo: false,
                itemThree: false,
                one: false,
                two: false,
                three: false,
                itemOneMax: null,
                itemOneMin: null,
                itemTwoMax: null,
                itemTwoMin: null,
                itemThreeMax: null,
                itemThreeMin: null
            };
        },
        methods: {
            setStatus (item, selected, data) {
                this[item] = selected;
                if (item === 'itemOne' && selected) {
                    this.itemOneMax = data.max;
                    this.itemOneMin = data.min;
                }
                if (item === 'itemTwo' && selected) {
                    this.itemTwoMax = data.max;
                    this.itemTwoMin = data.min;
                }
                if (item === 'itemThree' && selected) {
                    this.itemThreeMax = data.max;
                    this.itemThreeMin = data.min;
                }
                if (this.itemOne || this.itemTwo || this.itemThree) {
                    this.$emit('border', true);
                } else {
                    this.$emit('border', false);
                }
            },
            setSubStatus (item, selected) {
                this[item] = selected;
            },
            close () {
                this.itemOne = false;
                this.itemTwo = false;
                this.itemThree = false;
            }
        },
        filters: {
            roundNumber (value) {
                return Math.round(value);
            }
        }
    };
</script>

<style scoped>
    .legend-container{
        display: flex;
    }
    .legend-item{
        width: 80px;
    }
    .legend-content{
        background: rgba(3, 32, 62, 0.6);
        height: 65px;
        font-size: 12px;
        color: RGBA(211, 219, 228, 1);
        text-align: center;
        border-radius: 0 0 5px 5px;
    }
    .legend-content .active{
        color: RGBA(51, 200, 111, 1);
    }
    .legend-top{
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-bottom: 2px;
        position: relative;
    }
    .legend-scale{
        display: flex;
        flex-flow: column;
        align-items: center;
        height: 180px;
        font-size: 12px;
        color: rgba(255,255,255,1);
        justify-content: space-between;
        position: absolute;
        left: 55px;
    }
    .legend-scale p{
        margin: 0;
    }
    .image-container{
        width: 22px;
        height: 180px;
    }

</style>

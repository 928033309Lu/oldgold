<template>
    <div class="container" v-if="visibility">
        <div class="progress">
            <div class="speed">
                <div class="content">
                    <div>
                        <span class="icon">
                            <icon name="shangchuan"></icon>
                        </span>
                    </div>

                    <div>
                        上传（{{speed | byteman}}/s）
                    </div>

                </div>
            </div>
            <div class="percent">
                <div class="done" :style="{width: percentage + '%'}"></div>
                <div class="textName">
                    正在上传文件：{{progressingFile}}
                </div>
            </div>
            <!-- ///去掉取消上传@click="ConfirmCancelUpload" -->
            <div class="cancel" @click="ConfirmCancelUpload" >
                <div class="content">
                    <div>
                         <span class="icon">
                            <icon name="guanbi"></icon>
                        </span>
                    </div>
                    <div style="cursor: pointer">
                        取消上传
                    </div>
                </div>
            </div>
            <!-- <div class="cancel" @click="closeProgressBar" v-if="uploadCompleted" style="cursor: pointer">
                <div class="content">
                    <div>
                         <span class="icon">
                            <icon name="guanbi"></icon>
                        </span>
                    </div>
                    <div>
                        上传成功
                    </div>
                </div>
            </div> -->
        </div>
        <!--<div class="info">
            <div class="action">
                操作
            </div>
            <div class="progressing" v-bind:class="{ active: progressing }" @click="setActive('progressing')">
                {{progressingCount}}正在进行
            </div>
            <div class="success" v-bind:class="{ active: success }" @click="setActive('success')">
                {{successCount}}成功
            </div>
            <div class="failed" v-bind:class="{ active: failed }" @click="setActive('failed')">
                {{errorCount}}失败
            </div>
        </div>-->
        <!--取消上传确认框-->
        <el-dialog
                title="提示"
                :visible.sync="cancelUploadVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">确认中止文件上传操作？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUploadVisible = false" class="gf-button cancelBtn" style="width: 34%;">取 消</el-button>
                <el-button @click="ConfirmCancelUpload" class="confirmBtn" style="width: 34%;">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import Bus from '../upload/bus';
export default {
    name: 'progress-bar',
    data () {
        return {
            progressing: true,
            success: false,
            failed: false,
            visibility: false,
            percentage: 0,
            progressingCount: 0,
            successCount: 0,
            errorCount: 0,
            speed: 0,
            uploadCompleted: true,
            progressingFile: '',
            closeProgressBarVisible: false,
            cancelUploadVisible: false,
            done: null
        };
    },
    computed: {
        closeComplete () {
            return {
                close: this.percentage > 90
            };
        }
    },
    methods: {
        setActive (el) {
            this.progressing = false;
            this.success = false;
            this.failed = false;
            this[el] = true;
        },
        // 取消上传
        cancelUpload () {
            this.cancelUploadVisible = true;
            // Bus.$emit('cancelAxios', true);
            // this.visibility = false;
        },
        closeProgressBar () {
            this.visibility = false;
            Bus.$emit('uploadClose', true);
        },
        close (done) {
            this.cancelUploadVisible = true;
            this.done = done;
        },
        ConfirmCancelUpload () {
            this.cancelUploadVisible = false;
            this.uploadCompleted = true;
            Bus.$emit('uploadCompleted', true);
            Bus.$emit('cancelAxios', true);
            this.progressing = 0;
            this.progressingCount = 0;
            this.successCount = 0;
            this.errorCount = 0;
            this.speed = 0;
            this.closeProgressBar();
            if (this.done) this.$emit('confirmCancel', this.done);
        },
        closePorgressBar () {
            this.visibility = false;
        }
    },
    watch: {
        progressingCount () {
            this.uploadCompleted = this.progressingCount < 1;
        }
    },
    created () {
        Bus.$on('percentage', (percentage) => {
            if (percentage) this.percentage = percentage;
        });
        Bus.$on('progressing', (progressing) => {
            this.progressing = progressing;
        });
        Bus.$on('progressingCount', (progressingCount) => {
            this.progressingCount = progressingCount;
        });
        Bus.$on('successCount', (successCount) => {
            this.successCount = successCount;
        });
        Bus.$on('errorCount', (errorCount) => {
            this.errorCount = errorCount;
        });
        Bus.$on('speed', (speed) => {
            this.speed = speed;
        });
        Bus.$on('progressingFile', (progressingFile) => {
            this.progressingFile = progressingFile;
        });
        Bus.$on('uploadBegin', (status) => {
            if (status) {
                this.percentage = 0;
                this.progressingCount = 0;
                this.successCount = 0;
                this.errorCount = 0;
                this.speed = 0;
                this.uploadCompleted = true;
                this.visibility = true;
            }
        });
        Bus.$on('uploadCompleted', (uploadCompleted) => {
            this.uploadCompleted = uploadCompleted;
            this.speed = 0;
            // 进度条停留5秒自动关闭
            setTimeout(() => {
                if (this.visibility) {
                    this.closeProgressBar();
                }
            // }, 5000);
            }, 100);
        });
    }
};
</script>

<style lang="less" scoped>
.container{
    width: 100%;
    height: 100px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .progress{
        height: 60px;
        width: 100%;
        background-color: RGBA(0, 22, 44, 1);
        display: flex;
        cursor: default;
        .speed{
            color: RGBA(51, 200, 111, 1);
            width: 230px;
            height: 100%;
            flex-shrink:0;
            .content{
                height: 100%;
                text-align: center;
                display: flex;
                vertical-align: inherit;
                align-items: center;
                justify-content: center;
                div:first-child{
                    padding-right: 10px;
                }
            }
        }
        .percent{
            position: relative;
            width: 1500px;
            /*height: 30px;*/
            height: 20px;
            display: flex;
            margin-top: 20px;
            line-height: 20px;
            background-color: RGBA(9, 49, 90, 1);
            .done{
                height: 100%;
                background-color: RGBA(51, 200, 111, 1);
                flex-shrink: 0;
            }
            .none{
                height: 100%;
                color: RGBA(212, 239, 246, 1);
            }
            .close{
                position: absolute;
                right: 10px;
            }
            .textName{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                text-align: center;
                color: RGBA(212, 239, 246, 1);
            }
        }
        .cancel{
            cursor: pointer;
            width: 180px;
            height: 100%;
            color: RGBA(51, 200, 111, 1);
            flex-shrink:0;
            .content{
                height: 100%;
                text-align: center;
                display: flex;
                vertical-align: inherit;
                align-items: center;
                justify-content: center;
                div:first-child{
                    padding-right: 10px;
                }
            }
        }
    }
    .info{
        cursor: default;
        height: 40px;
        width: 100%;
        background-color: RGBA(0, 0, 0, 1);
        color: RGBA(212, 239, 246, 1);
        display: flex;
        text-align: center;
        line-height: 40px;
        .action{
            width: 230px;
            height: 100%;
            flex-shrink:0;
        }
        .progressing, .success, .failed{
            width: 118px;
            height: 100%;
            flex-shrink:0;
            cursor: pointer;
        }
        .active{
            background-color: RGBA(0, 22, 44, 1);
        }
    }
}
</style>

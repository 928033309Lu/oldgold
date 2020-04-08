<style lang="less" scoped>
.upload-status-indicator {
    display: inline-flex;
    flex-direction: column;
    align-items: center;

    .status-icon {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 2px;
        color: #FFFFFF;
        box-sizing: border-box;
        span {
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            line-height: 20px;
        }
    }
    .status-icon.option {
        // background: rgba(212, 239, 246, 0.5);
        border: dashed 1px rgba(212,239,246,0.5);
    }
    .status-icon.none {
        // background: rgba(212, 239, 246, 0.5);
        border: solid 1px rgba(212,239,246,0.5);
    }
    .status-icon.uploading {
        background: rgba(51, 200, 111, 0.8);
    }
    .status-icon.complete {
        background: rgba(51, 200, 111, 0.8);
    }
    .status-icon.mistake {
        background: rgba(255, 12, 0, 0.8);
    }
    .grey {
        background: grey !important;
    }
    .status-label {
        padding: 3px;
        color: #D4EFF6;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        /*opacity: 0.9;*/
    }
    .status-label.bold {
        font-weight: bold;
    }
}
</style>

<template>
    <div class="upload-status-indicator">
        <i class="status-icon" :class="status">
            <span>
                <icon name="correct" v-if="status == 'complete'"></icon>
                <!-- <icon name="correct" v-if="status == 'grey'"></icon> -->
            </span>
        </i>
        <span class="status-label" :class="{bold: fontWeight === 'bold'}" v-html="label"></span>
    </div>
</template>

<script>
    export default {
        name: 'upload-status-indicator',
        props: {
            label: {
                type: String,
                default: ''
            },
            status: {
                type: String,
                default: 'none'// option,none,uploading,complete    + grey
            },
            fontWeight: { // normal, bold
                type: String,
                default: 'normal'
            }
        }
    };
</script>

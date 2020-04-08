<style lang="less" scoped>
.file-upload-button {
  display: inline-block;
  .trigger {
    height: 50px;
    border-radius: 4px;
    border: solid 1px #33c86f;
    text-align: center;
    line-height: 50px;
    padding: 0 15px;
    color: #33c86f;
    font-size: 14px;
    opacity: 0.7;
    /*&:hover {*/
    /*opacity: 1;*/
    /*}*/
  }
}
.button-container {
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  background: rgba(3, 32, 62, 0.6);
  color: #d3dbe4;
  cursor: pointer;
  /*border-top-right-radius: 4px;*/
  /*border-bottom-right-radius: 4px;*/
}
.button-container :hover {
  background: rgba(3, 32, 62, 0.3) !important;
  color: #33c86f;
}
.icon-panel {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 4px;
}
.button-container-none{
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    position: relative;
    background: rgba(3, 32, 62, 0.6);
    color: #d3dbe4;
    cursor: not-allowed;
}
</style>

<template>
    <el-upload ref="upload" class="file-upload-button" :disabled="disable" :action="action" :show-file-list="false" :auto-upload="false" :http-request="httpRequest" :on-success="onSuccess" :on-error="onError" :on-change="onChange">
        <div :class="disable?'button-container-none':'button-container'" slot="trigger" :style="disableStyle?'background: rgba(225,225,225,0.2)':''">
            <div class="icon-panel">
                <div class="spIcon">
                    <icon name="daoru"></icon>
                </div>
            </div>
        </div>
    </el-upload> 
</template>

<script>
import util from '../../libs/util';
import axios from 'axios';
const userUploadAtt = (File, config) => util.Xianluajax.post('/uploadfile?', File, config);
export default {
    name: 'design-upload-button1',
    props: {
        action: {
            type: String,
            default: '/input_rsl_line'
        },
        filename: {
            type: String,
            default: ''
        },
        disable: {
            type: Boolean,
            default: false
        },
        disableStyle: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            uploadFilename: ''
        };
    },
    methods: {
        uploadFile () {
            this.$refs.upload.submit();
        },
        httpRequest (option) {
            // const formData = new FormData();
            // const file = option[option.file];
            // formData.append('road_dxf', file);
            // formData.append('project_id', '3');
            // formData.append('scheme_id', '1');
            // option.headers['Content-Type'] = 'multipart/form-data';
            // const config = {
            //     headers: option.headers,
            //     onUploadProgress: function (e) {
            //         if (e.total > 0) {
            //             e.percent = e.loaded / e.total * 100;
            //         }
            //         option.onProgress(e);
            //     }
            // }
            // util.ajax.post('/import_road_dxf/?', formData, config).then((res) => {
            //     option.onSuccess(res);
            // }).catch(err => {
            //     option.onError(err);
            // });
            console.log(option);
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            data.append('project_id', '3');
            data.append('scheme_id', '1');
            data.append('road_dxf', '');
            userUploadAtt(data, config)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        onChange (file, fileList) {
            if (fileList.length > 1) {
                fileList.splice(0, fileList.length - 1);
            }
            this.uploadFilename = file.name;
            this.$emit('file-selected', file.raw);
            console.log(file);
        },
        onSuccess (response, file, fileList) {
            console.log('onSuccess', response, file, fileList);
        },
        onError (err, file, fileList) {
            console.error('onError', err, file, fileList);
        }
    }
};
</script>

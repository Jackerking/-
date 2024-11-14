<template>
  <div class="quill-editor-container" style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      style="height: 500px; overflow-y: hidden;"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      
      @onCreated="handleCreated"
    />
  </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, watchEffect, reactive } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { watch } from 'vue';
import axios from 'axios';
import { ElMessage,ElMessageBox } from 'element-plus';



//声明属性
const props = defineProps({
  modelValue:{
    type:String,
    default:"",
  }
})
//声明事件消息
const emits = defineEmits<{
  (e:'update:modelValue',value:string):void
}>()
  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef()

  // 内容 HTML
  const valueHtml = ref('<p>hello</p>')
  watchEffect(()=>{
    valueHtml.value = props.modelValue;
  })
  watch(valueHtml,(newHtml)=>{
    emits("update:modelValue",newHtml);
  })


  const token = '310|o6tYkcAxobs46Pv7PYILRIGxKiRG1owLmGiLoTjy';
  const headers1 = {
      'Content-Type': 'multipart/form-data',
  'Accept': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Access-Control-Allow-Origin':"*"
    };
  const toolbarConfig = {}
  const editorConfig = { 
    placeholder: '请输入内容...',
    readOnly:false,
     MENU_CONF:{
      uploadImage:{
        customBrowseAndUpload(insertFn: any) {   // TS 语法
        const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('https://picui.cn/api/v1/upload', formData, {
          headers: headers1,
      withCredentials: false
        });

        if (response.data.data.links.url) {
          const url = response.data.data.links.url; // 假设服务器返回的图片URL在data.url中
          console.log('Inserting image at:', { url});
          insertFn(url);
          ElMessage.success('图片上传成功');
        } else {
          console.log(response)
          ElMessage.error('图片上传失败11');
        }
      } catch (error) {
        ElMessage.error('图片上传失败');
      }
    }
  };
  input.click();

    }
      }
     },

   }
   

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
  })

  const handleCreated = (editor:any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
  }

</script>
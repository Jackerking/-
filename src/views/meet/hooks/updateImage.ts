
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import type { UploadFile } from 'element-plus';

// 你需要替换为实际获取的 Bearer Token
const token = '310|o6tYkcAxobs46Pv7PYILRIGxKiRG1owLmGiLoTjy';

const requestHeader = {
  'Content-Type': 'multipart/form-data',
  'Accept': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Access-Control-Allow-Origin':"*"
};

const nowMeeting = ref({
  name: '',
  creator: '',
  status: '',
  content: '',
  startTime: '',
  endTime: '',
  imageUrl: '',
  title:'',
});


const handleImageUpload2 = async (file1: UploadFile) => {
  if (!file1.raw) {
    ElMessage.error('文件无效');
    return false;
  }

  const formData = new FormData();
  formData.append('file', file1.raw);

  try {
    const response = await axios.post('https://picui.cn/api/v1/upload', formData, {
      headers: requestHeader,
      withCredentials:false
    });

    console.log('Response:', response); // 打印响应内容以检查结构

    if (response.data && response.data.data && response.data.data.links && response.data.data.links.url) {
      nowMeeting.value.imageUrl = response.data.data.links.url;
      ElMessage.success('图片上传成功');
      console.log(nowMeeting.value.imageUrl);
    } else {
      ElMessage.error('图片上传失败，未获取到图片URL');
    }
  } catch (error) {
    ElMessage.error('图片上传失败');
    console.error('Upload error:', error);
  }

  return false;
};


export default function useUploadImage() {
  return { handleImageUpload2, nowMeeting };
}

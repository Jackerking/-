<template>
    <el-container>
      <el-header>
        <el-row :gutter="20" class="search-row">
          <el-col :span="6">
            <el-form-item label="搜索会议:">
              <el-input v-model="searchQuery" placeholder="搜索会议" class="search-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="创建人:">
              <el-input v-model="creator" placeholder="创建人" class="search-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开始时间:">
              <el-date-picker
                v-model="startTime"
                type="datetime"
                placeholder="选择开始时间"
                class="search-input"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row :gutter="4" class="button-group">
          <el-col :span="1.5">
            <el-button type="primary" @click="handleCreate">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" @click="Detail">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" @click="batchDelete">批量删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" @click="handleExport" style="background-color: #f0ad4e; color: white;">导出</el-button>
          </el-col>
        </el-row>
        <el-table :data="meetings" style="width: 100%" @selection-change="handleSelectionChange1">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="会议名称"></el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column prop="status" label="会议状态"></el-table-column>
          <el-table-column prop="title" label="会议内容">
        <template #default="scope">
          <a @click="handleContentClick(scope.row)" class="highlighted-link">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
          <el-table-column prop="startTime" label="开始时间"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="mini" @click="handleContentClick(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <div class="pagination-container">
    <el-pagination
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalMeetings"
    />
  </div>
  
      </el-main>
  
    
      <el-dialog v-model="dialogVisible1" title="创建会议" width="1000px">
      <el-form :model="newMeeting" :rules="rules" ref="meetingForm">
        <el-form-item label="会议名称" prop="name">
          <el-input v-model="newMeeting.name"></el-input>
        </el-form-item>
        <el-form-item label="会议标题" prop="title">
          <el-input v-model="newMeeting.title"></el-input>
        </el-form-item>
        <el-form-item label="会议封面">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change="handleImageUpload"
            limit="1"
          >
            <div v-if="!newMeeting.imageUrl" class="avatar-uploader-icon">
              <el-icon>
                <Plus />
              </el-icon>
            </div>
            <img v-else :src="newMeeting.imageUrl" class="avatar-preview" />
          </el-upload>
          <div class="upload-hint">
            请上传大小不超过 <span class="highlight">5MB</span> 格式为 <span class="highlight">png/jpg/jpeg</span> 的文件。
          </div>
        </el-form-item>
  
        <el-form-item label="会议内容" prop="content">
          <div class="editor-container">
            <Ediator v-model="newMeeting.content" />
          </div>
        </el-form-item>
  
        <el-form-item label="创建人" prop="creator">
          <el-input v-model="newMeeting.creator"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="newMeeting.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="newMeeting.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submitForm1">创建</el-button>
      </div>
    </el-dialog>

      <el-dialog v-model="dialogVisible2" title="修改会议" width="1000px">
      <el-form :model="nowMeeting" :rules="rules" ref="nowmeetingForm">
        <el-form-item label="会议名称" prop="name">
          <el-input v-model="nowMeeting.name"></el-input>
        </el-form-item>
        <el-form-item label="会议标题" prop="title">
          <el-input v-model="nowMeeting.title"></el-input>
        </el-form-item>
        <el-form-item label="会议封面">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change="handleImageUpload2"
            limit="1"
          >
            <div v-if="!nowMeeting.imageUrl" class="avatar-uploader-icon">
              <el-icon>
                <Plus />
              </el-icon>
            </div>
            <img v-else :src="nowMeeting.imageUrl" class="avatar-preview" />
          </el-upload>
          <div class="upload-hint">
            请上传大小不超过 <span class="highlight">5MB</span> 格式为 <span class="highlight">png/jpg/jpeg</span> 的文件。
          </div>
        </el-form-item>
        <el-form-item label="会议内容" prop="content">
          <div class="editor-container">
            <Ediator v-model="nowMeeting.content"/>
          </div>
        </el-form-item>
        <el-form-item label="创建人" prop="creator">
          <el-input v-model="nowMeeting.creator"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="nowMeeting.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="nowMeeting.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="submitForm2">确定</el-button>
      </div>
    </el-dialog>
     <el-dialog v-model="dialogVisible3" title="查看会议" width="1000px">
      <el-form :model="nowMeeting" ref="meetindetailForm">
        <el-form-item label="会议名称">
          <el-input v-model="nowMeeting.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="会议标题">
          <el-input v-model="nowMeeting.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="会议封面">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change="handleImageUpload2"
            limit="1"
            disabled
          >
            <div v-if="!nowMeeting.imageUrl" class="avatar-uploader-icon">
              <el-icon>
                <Plus />
              </el-icon>
            </div>
            <img v-else :src="nowMeeting.imageUrl" class="avatar-preview" />
          </el-upload>
        </el-form-item>
        <el-form-item label="会议内容">
          <div class="editor-container">
            <Ediator v-model="nowMeeting.content" ref="ediator" />
          </div>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="nowMeeting.creator" disabled></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="nowMeeting.startTime" type="datetime" placeholder="选择开始时间" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="nowMeeting.endTime" type="datetime" placeholder="选择结束时间" disabled></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogVisible3 = false">关闭</el-button>
      </div>
    </el-dialog>
  
  
    </el-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted,reactive} from 'vue';
  import axios from 'axios';
  import { utils, writeFile } from 'xlsx';
  
  
  // import createmeeting from '../hooks/createmeeting';
  import updateImage from '../meet/hooks/updateImage';
  import type { UploadFile } from 'element-plus';
  
  import { ElMessage,ElMessageBox } from 'element-plus';
  import Ediator from './Ediator.vue';
  
  
  axios.defaults.baseURL = '/web';
  
  export  interface Meeting {
    meetingId: number; // 添加唯一标识符
    name: string;
    creator: string;
    status: string;
    content: string;
    startTime: string;
    endTime: string;
    imageUrl: string;
    totalMeetings:number;
    currentPage:number;
    pageSize:number;
    title:string;
  }
  
  
  // 获取数据
  const meetings = ref<Meeting[]>([]);
    const totalMeetings = ref<number>(0);
    const currentPage = ref<number>(1);
    const pageSize = ref<number>(10);
      const handlePageChange = (page: number) => {
    currentPage.value = page;
    fetchMeetings(currentPage.value, pageSize.value);
  };
  
  const handleSizeChange = (size: number) => {
    pageSize.value = size;
    fetchMeetings(currentPage.value, pageSize.value);
  };
  const fetchMeetings = async (page: number, size: number) => {
      try {
        const response = await axios.get('/web/pagination', {
          params: {
            page,
            size,
          },
        });
        if (response.data.isOk) {
         
          meetings.value = response.data.meetings.map(meeting => {
          // 将 startTime 转化为人类易读的格式
          const date = new Date(meeting.startTime);
          meeting.startTime = date.toLocaleString('en-GB', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
          }).replace(',', ''); // 格式化为指定格式的字符串
          return meeting;
        });
          console.log(meetings)
          totalMeetings.value = response.data.total; // 假设后端返回的数据结构中包含一个 total 字段表示总记录数
          currentPage.value = page;
          pageSize.value = size;
        } else {
          ElMessage.error('获取会议数据失败');
        }
      } catch (error) {
        ElMessage.error('获取会议数据失败');
      }
    };
  
  //创建会议
  const token = '310|o6tYkcAxobs46Pv7PYILRIGxKiRG1owLmGiLoTjy';
  const requestHeader = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Access-Control-Allow-Origin':"*"
  };
  const newMeeting = ref({
    name: '',
    creator: '',
    status: '',
    content: '',
    startTime: '',
    endTime: '',
    imageUrl: '',
    title:'',
  });
  const meetingForm = ref(null);
  const rules = {
    name: [
      { required: true, message: '请输入会议名称', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请输入会议内容', trigger: 'blur' }
    ],
    creator: [
      { required: true, message: '请输入创建人', trigger: 'blur' }
    ],
    startTime: [
      { required: true, message: '请选择开始时间', trigger: 'change' }
    ],
    endTime: [
      { required: true, message: '请选择结束时间', trigger: 'change' }
    ],
    title: [
      { required: true, message: '请输入会议标题', trigger: 'blur' }
    ]
  }
  const handleImageUpload = async (file: UploadFile) => {
    if (!file.raw) {
      ElMessage.error('文件无效');
      return false;
    }
    const formData = new FormData();
    formData.append('file', file.raw);
    
      const response = await axios.post('https://picui.cn/api/v1/upload', formData, {
        headers: requestHeader,
        withCredentials:false
      });
      console.log('Response:', response); // 打印响应内容以检查结构
      if (response.data && response.data.data && response.data.data.links && response.data.data.links.url) {
        newMeeting.value.imageUrl = response.data.data.links.url;
        ElMessage.success('图片上传成功');
      } else {
        ElMessage.error('图片上传失败,未获取到图片URL');
      }
    };
    const dialogVisible1 = ref(false);
    const submitForm1 = async () => {
    meetingForm.value.validate(async (valid) => {
      if (valid) {
        try {
          console.log('即将发送的请求数据:', newMeeting.value)
          newMeeting.value.status = '未开始'
          const response = await axios.post('/web/create', newMeeting.value)
          if (response.data.isOk) {
            ElMessage.success('创建会议成功')
            dialogVisible1.value = false
            newMeeting.value = {
              name: '',
              creator: '',
              status: '',
              content: '',
              startTime: '',
              endTime: '',
              imageUrl: '',
              title: ''
            }
            fetchMeetings(1, 10) // 刷新会议列表
          } else {
            ElMessage.error('创建会议失败')
          }
        } catch (error) {
          ElMessage.error('创建会议失败')
        }
      } else {
        console.log('表单验证失败')
      }
    })
  };
    const handleCreate = () => {
    dialogVisible1.value = true;
  };
  //更新会议
  const {handleImageUpload2, nowMeeting}=updateImage()
  const selectedMeetings = ref<Meeting[]>([]); // 存储选中的会议
  const handleSelectionChange1 = (selectedRows: Meeting[]) => {
    selectedMeetings.value = selectedRows;
  };
  
  const Detail = async() => {
    if (selectedMeetings.value.length === 0) {
      ElMessage.error('请选择要更新的会议');
      return;
    }
    else if(selectedMeetings.value.length > 1)
    {
      ElMessage.error('只能选择一个会议修改');
      return;
    }
    else{
      dialogVisible2.value = true;
      const meeting = selectedMeetings.value[0];
    const response = await axios.post('/web/nowMeeting', { meetingId:meeting.meetingId });
    console.log(selectedMeetings.value[0]);
    if (response.data.isOk) {
          nowMeeting.value = response.data.nowMeeting; // 假设后端返回的数据结构中包含一个 meetings 数组
        } 
  
    }
         
  }
  const dialogVisible2 = ref(false);
  const nowmeetingForm = ref(null);
  const submitForm2 = async () => {
    nowmeetingForm.value.validate(async (valid) => {
      if (valid) {
        try {
          console.log('即将发送的请求数据:', nowMeeting.value);
          const response = await axios.post('/web/update', nowMeeting.value);
          if (response.data.isOk) {
            ElMessage.success('修改会议成功');
            dialogVisible2.value = false;
            nowMeeting.value = {
              name: '',
              creator: '',
              status: '',
              content: '',
              startTime: '',
              endTime: '',
              imageUrl: '',
              title:'',
            };
             fetchMeetings(1,10); // 刷新会议列表
          } else {
            ElMessage.error('修改会议失败');
          }
        } catch (error) {
          ElMessage.error('修改会议失败');
        }
      } else {
        ElMessage.error('修改会议失败');
      }
    });
  };
  //删除会议
  const handleDelete = async (row: Meeting) => {
      
      try {
        // 弹出确认对话框
        await ElMessageBox.confirm(
          `你确定要删除会议 ${row.name} 吗？`,
          '确认删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );
    
        // 如果用户点击确认，继续删除操作
        const response = await axios.post('/web/delete', { meetingId: row.meetingId });
        if (response.data.isOk) {
          ElMessage.success(`会议 ${row.name} 删除成功`);
          fetchMeetings(1,10); // 刷新会议列表
        } else {
          ElMessage.error(`删除会议 ${row.name} 失败`);
        }
      } catch (error) {
        // 如果用户点击取消，或者请求发生错误，都捕获到这里
        if (error !== 'cancel') {
          console.error(`删除会议 ${row.name} 失败:`, error);
          ElMessage.error(`删除会议 ${row.name} 失败`);
        }
      }
    };
      //会议详情
      const dialogVisible3 = ref(false);
      const handleContentClick = async(row) => {
        dialogVisible3.value = true;
    const response = await axios.post('/web/nowMeeting', { meetingId: row.meetingId });
    if (response.data.isOk) {
          nowMeeting.value = response.data.nowMeeting; // 假设后端返回的数据结构中包含一个 meetings 数组
        } 
  }
       //批量删除
       const batchDelete = async () => {
    if (selectedMeetings.value.length === 0) {
      ElMessage.error('请选择要删除的会议');
      return;
    }
  
    try {
      // 弹出确认对话框
      await ElMessageBox.confirm(
        `你确定要删除选中的会议吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );
  
      // 获取选中的会议ID列表
      const meetingIds = selectedMeetings.value.map(meeting => meeting.meetingId);
           console.log(meetingIds)
      // 发送删除请求
      const response = await axios.post('/web/deleteBatch', meetingIds);
  
      // 因为后端返回的是字符串消息，不需要检查 isOk 属性
      ElMessage.success(response.data);
      fetchMeetings(1,10); // 刷新会议列表
    } catch (error) {
      // 如果用户点击取消，或者请求发生错误，都捕获到这里
      if (error !== 'cancel') {
        console.error('删除会议失败:', error);
        ElMessage.error('删除会议失败');
      }
    }
  };
  
     //导出会议
     const handleExport = () => {
    
    if (meetings.value.length === 0) {
      ElMessage.warning('没有会议数据可导出');
      return;
    }
  
    // 准备数据
    const data = meetings.value.map(meeting => ({
      '会议名称': meeting.name,
      '创建人': meeting.creator,
      '会议状态': meeting.status,
      '会议内容': meeting.content,
      '开始时间': meeting.startTime,
      '结束时间': meeting.endTime,
      '会议标题': meeting.title,
    }));
  
    // 创建工作表
    const worksheet = utils.json_to_sheet(data);
    
    // 创建工作簿
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Meetings');
  
    // 导出Excel文件
    writeFile(workbook, 'Meetings.xlsx');
  
    ElMessage.success('导出会议数据成功');
  };
  //搜索
  
  const searchQuery = ref('');
  const creator = ref('');
  const startTime = ref<Date | null>(null);
  

  const handleSearch = async () => {
    try {
      const response = await axios.get('/web/searchMeetings', {
        params: {
          name: searchQuery.value,
          creator: creator.value,
          startTime: startTime.value ? startTime.value.toISOString() : null,
        },
      });
  
      if (response.data.isOk) {
        meetings.value = response.data.meetings;
        ElMessage.success('搜索成功');
      } else {
        ElMessage.error('搜索失败');
      }
    } catch (error) {
      console.error('搜索会议失败:', error);
      ElMessage.error('搜索会议失败');
    }
  };
  
  
  const handleReset = () => {
    ElMessageBox.confirm(
      '你确定要重置所有搜索条件吗？',
      '确认重置',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      // 用户点击确定，执行重置操作
       fetchMeetings(1,10);
      searchQuery.value = '';
      creator.value = '';
      startTime.value = null;
      ElMessage.success('搜索条件已重置');
    }).catch(() => {
      // 用户点击取消，不执行任何操作
      ElMessage.info('重置操作已取消');
    });
  };
  
  
  const handleEdit =async (row: Meeting) => {
    dialogVisible2.value = true;
    const response = await axios.post('/web/nowMeeting', { meetingId: row.meetingId });
    if (response.data.isOk) {
          nowMeeting.value = response.data.nowMeeting; // 假设后端返回的数据结构中包含一个 meetings 数组
        } 
  };
   
  
  onMounted(() => {
    // fetchMeetings();
    fetchMeetings(currentPage.value, pageSize.value);
  });
  </script>
  
  
  <style scoped>
  .search-input {
    width: 100%;
  }
  
  .search-row {
    margin-bottom: 20px;
  }
  
  .button-group {
    margin-top: 1px; /* 调整按钮区上边距 */
  }
  
  .el-button {
    margin-right: 10px;
  }
  
  .avatar {
    width: 100px; /* 调整图片大小 */
    height: 100px; /* 调整图片大小 */
    display: block;
  }
  
  .upload-container {
    display: flex;
    align-items: center;
  }
  
  .avatar-uploader {
    display: inline-block;
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-align: center;
    line-height: 178px; /* 确保加号图标在中间 */
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  .avatar-preview {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 确保图片填充整个上传位置的框 */
    border-radius: 4px;
  }
  
  .upload-hint {
    margin-left: 10px;
    font-size: 12px;
    color: #606266;
  }
  
  .highlight {
    color: red;
  }
  
  .editor-container {
    height: 300px; /* 设置富文本编辑器的高度 */
    width: 900px;
    border: 1px solid #d9d9d9; /* 添加边框 */
    border-radius: 4px; /* 添加圆角 */
    overflow: hidden; /* 防止溢出 */
    padding: 10px; /* 添加内边距 */
    background-color: #fff; /* 设置背景颜色 */
  }
  .highlighted-link {
    color: #409eff;
    font-weight: bold;
    cursor: pointer;
    position: relative;
  }
  
  .highlighted-link::before { /* Example icon, you can use any Unicode character or image */
    position: absolute;
    left: -20px;
    top: 0;
  }
  .highlighted-link:hover {
    text-decoration: underline;
  }
  .pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
  
  </style>
  
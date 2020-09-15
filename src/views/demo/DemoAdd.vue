<template>
  <div>
    <el-dialog
      :keyid="keyid"
      v-bind="$attrs"
      :close-on-click-modal="false"
      :title="title"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
    >
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="11">
            <el-form-item label="title:" prop="title">
              <el-input
                v-model="formData.title"
                show-word-limit
                placeholder="title"
                :maxlength="10"
                clearable
                prefix-icon="el-icon-user-solid"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="author:" prop="author">
              <el-select v-model="formData.author" filterable clearable size="medium" :style="{width: '100%'}">
                <el-option v-for="item in authors" :key="item.id" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Date:" prop="birthday">
              <el-date-picker
                v-model="formData.birthday"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :style="{width: '100%'}"
                placeholder="date"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Summary:" prop="summary">
              <el-input
                v-model="formData.summary"
                :rows="3"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="Please enter the content"
              />
              <span v-show="contentShortLength">{{ contentShortLength }}字</span>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="Importance:" prop="importance">
              <el-rate
                v-model="formData.importance"
                :max="5"
                :colors="['#99A9BF', '#99A9BF', '#FF9900','#FF9900','#FF9900']"
                :low-threshold="1"
                :high-threshold="3"
                style="display:inline-block"
              />
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="content:" prop="content">
              <Tinymce ref="editor" v-model="formData.content" :height="400" />
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="image_uri:" prop="image_uri">
              <Upload v-model="formData.image_uri" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
const defaultForm = {
  title: '',
  author: '',
  birthday: '',
  summary: '',
  importance: 1,
  content: '',
  image_uri: ''
}
export default {
  components: {
    Tinymce,
    Upload
  },
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      required: true
    },
    keyid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formData: Object.assign({}, defaultForm),
      rules: {
        title: [{
          required: true,
          message: 'title must required',
          trigger: 'blur'
        }],
        authors: [{
          required: true,
          message: 'authors must required',
          trigger: 'blur'
        }]
      },
      authors: [{
        name: '张三',
        id: 11
      }, {
        name: 'aaa',
        id: 22
      }, {
        name: '李四',
        id: 33
      }, {
        name: 'bbbb',
        id: 44
      }]
    }
  },
  computed: {
    contentShortLength() {
      return this.formData.summary.length
    }
  },
  created() {
    console.log(this.$attrs)
  },
  methods: {
    onOpen() {},
    onClose() {},
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          this.$message.success({
            message: '成功了'
          })
          console.log(this.$attrs)
          console.log(this.$props)
          this.$listeners.handleRefresh(this.keyid)
        }
      })
    }
  }
}
</script>

<template>
  <div class="app-container">
    <div class="functoin-continer filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addPage">新增
      </el-button>
      <el-button class="filter-item" type="warning" icon="el-icon-edit" @click="editPage">修改
      </el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleted">删除
      </el-button>
    </div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        clearable
        placeholder="文字查询"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker v-model="listQuery.date" placeholder="日期选择器" value-format="yyyy-MM-dd" class="filter-item" type="date" />
      <el-date-picker
        v-model="listQuery.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        class="filter-item"
        end-placeholder="结束时间"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询 </el-button>
      <el-button v-waves class="filter-item" type="success" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>

      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>

    </div>
    <pagination
      v-show="total>0"
      class="pagination-p-m-0"
      :page-sizes="[10,20,50,100,200,500]"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="{ prop: 'id', order: 'descending' }"
      @sort-change="sortChange"
      @selection-change="mutipleSelection"
    >
      <el-table-column label="" type="selection" width="55" />
      <el-table-column label="ID" prop="id" sortable align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" prop="date" sortable width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" prop="title" sortabl min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.title }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination-p-m-0"
      :page-sizes="[10,20,50,100,200,500]"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <demo-add v-if="functions.add" ref="demoAdd" keyid="add" title="DemoAdd" :visible.sync="functions.add" @handleRefresh="handleRefresh" />
    <demo-edit v-if="functions.edit" :id="id" ref="demoEdit" keyid="edit" title="DemoEdit" :visible.sync="functions.edit" @handleRefresh="handleRefresh" />
  </div>
</template>

<script>
import {
  fetchList,
  deleteArticle
} from '@/api/demo'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import demoAdd from './DemoAdd'
import demoEdit from './DemoEdit'

// const functionBtn = {
//   demoAdd: false,
//   demoEdit: false
// }
export default {
  name: 'ComplexTable',
  components: {
    Pagination,
    demoAdd,
    demoEdit
  },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQueryInit: {}, // 刷新初始值
      functions: {
        'add': false,
        'edit': false
      }, // 功能块
      rows: [],
      cRow: {}, // 当前选择行
      id: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined, // 加了 undefined 默认不传
        title: undefined,
        type: undefined,
        sort: '+id',
        date: parseTime(new Date(), '{y}-{m}-{d}'),
        dateRange: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')]
      },
      importanceOptions: [1, 2, 3],
      showReviewer: false
    }
  },
  created() {
    this.listQueryInit = Object.assign({}, this.listQuery)
    this.getList()
  },
  methods: {
    deleted() {
      if (this.rows && this.rows.length === 1 && this.rows[0].id) {
        const id = this.rows[0].id
        if (id) {
          this.$confirm('确定要删除吗?', {
            type: 'warning'
          }).then(res => {
            this.listLoading = true
            deleteArticle({
              id: id
            }).then(response => {
              setTimeout(() => {
                this.listLoading = false
                this.handleRefresh()
              }, 1000)
            }).catch(() => {})
          })
          return true
        }
      } else {
        this.$message({
          message: '请选择一项！',
          type: 'error'
        })
        return false
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    mutipleSelection(rows) {
      this.rows = rows
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleRefresh(page = '') {
      if (page) {
        this.functions[page] = false
      }
      this.listQuery = Object.assign({}, this.listQueryInit)
      this.handleFilter()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const {
        prop,
        order
      } = data
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else {
        this.listQuery.sort = '-' + prop
      }
      this.handleFilter()
    },
    addPage() {
      this.functions.add = true
    },
    editPage() {
      if (this.rows && this.rows.length === 1 && this.rows[0].id) {
        this.cRow = this.rows[0]
        this.id = this.cRow.id
        this.functions.edit = true
        return true
      } else {
        this.$message({
          message: '请选择一项！',
          type: 'error'
        })
        return false
      }
    }
  }
}
</script>

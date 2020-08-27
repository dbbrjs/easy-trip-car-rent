<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航区 -->
      <my-bread level1="企业管理" level2="企业审核"></my-bread>
      <el-row :gutter="20" style="margin-top:25px">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @input="getstorecheckList"
            @clear="getstorecheckList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getstorecheckList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格数据 -->

      <el-table
        :data="storeList"
        style="width: 100%;margin-top:20px"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="企业编号：">
                <span>{{ props.row.sid }}</span>
              </el-form-item>
              <el-form-item label="企业名称：">
                <span>{{ props.row.sname }}</span>
              </el-form-item>
              <el-form-item label="代表法人：">
                <span>{{ props.row.representative }}</span>
              </el-form-item>
              <el-form-item label="代表人身份证号">
                <span>{{ props.row.representativeid }}</span>
              </el-form-item>
              <el-form-item label="联系电话：">
                <span>{{ props.row.sphone }}</span>
              </el-form-item>
              <el-form-item label="邮箱：">
                <span>{{ props.row.semail }}</span>
              </el-form-item>
              <el-form-item label="注册资金：">
                <span>{{ props.row.capital }}元/月</span>
              </el-form-item>
              <el-form-item label="企业状态：">
                <span>{{ props.row.sstatus | fmtstate }}</span>
              </el-form-item>
              <el-form-item label="到期时间：">
                <span>{{ props.row.dateline | fmtdata }}</span>
              </el-form-item>
              <el-form-item label="位置：">
                <span>{{ props.row.slocation }}</span>
              </el-form-item>
              <el-form-item label="营业执照：">
                <template slot-scope="scope">
                  <el-image
                    style="width: 200px;height:100px"
                    :src="scope.row.mainpic"
                  ></el-image>
                </template>
              </el-form-item>
              <el-form-item label="描述：">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column label="企业名称" prop="sname"></el-table-column>
        <el-table-column label="企业图片" prop="mainpic">
          <template slot-scope="scope">
            <el-image
              style="width: 200px;height:100px"
              :src="scope.row.mainpic"
              :preview-src-list="scope.row.kkkk"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="代表法人"
          prop="representative"
        ></el-table-column>
        <el-table-column label="状态" prop="sstatus">
          <template slot-scope="scope">
            {{ scope.row.sstatus | fmtstate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-circle-check"
              size="mini"
              @click="agree(scope.row.sid)"
              >同意</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-circle-close"
              size="mini"
              @click="refuse(scope.row.sid)"
              >拒绝</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        style="margin-top:20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        // query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 房间列表
      storeList: [],
      // 房间总数
      total: 0
    };
  },
  created() {
    this.getstorecheckList();
  },

  methods: {
    // 同意
    async agree(ev) {
      const { data: res } = await this.$axios.put(
        `store/check/${ev}/state/true`
      );
      if (res.meta.status == 201) {
        this.$message.success("操作成功！");
        this.getstorecheckList();
      }
    },
    // 拒绝
    async refuse(ev) {
      const { data: res } = await this.$axios.put(
        `store/check/${ev}/state/false`
      );
      if (res.meta.status == 201) {
        this.$message.success("操作成功！");
        this.getstorecheckList();
      }
    },
    // 根据分页获取对应的房间列表
    async getstorecheckList() {
      const { data: res } = await this.$axios.get("store/getwaitstore", {
        params: this.queryInfo
      });

      if (res.meta.status != 200) {
        return this.$message.error("获取企业列表失败！");
      }
      // 拼装大图显示的数组属性
      for (let i = 0; i < res.data.size; i++) {
        let allpic = [];
        ["mainpic"].map(function(item) {
          allpic.push(res.data.data[i][item]);
        });
        res.data.data[i]["kkkk"] = allpic;
      }

      this.storeList = res.data.data;
      console.log(res);
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getstorecheckList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getstorecheckList();
    }
  }
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

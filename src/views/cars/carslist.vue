<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航区 -->
      <my-bread level1="车辆管理" level2="车辆列表"></my-bread>
      <el-row :gutter="20" style="margin-top:25px">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @input="getcarList"
            @clear="getcarList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getcarList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格数据 -->

      <el-table
        :data="carList"
        style="width: 100%;margin-top:20px"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="车辆编号">
                <span>{{ props.row.cid }}</span>
              </el-form-item>
              <el-form-item label="车辆名称：">
                <span>{{ props.row.cname }}</span>
              </el-form-item>
              <el-form-item label="车牌号：">
                <span>{{ props.row.license }}</span>
              </el-form-item>
              <el-form-item label="出租价格：">
                <span>{{ props.row.cprice }}元/天</span>
              </el-form-item>
              <el-form-item label="车主姓名：">
                <span>{{ props.row.ownername }}</span>
              </el-form-item>
              <el-form-item label="车主身份证号：">
                <span>{{ props.row.ownerid }}</span>
              </el-form-item>
              <el-form-item label="挂靠企业：">
                <span>{{ props.row.sname }}</span>
              </el-form-item>
              <el-form-item label="车身颜色：">
                <span>{{ props.row.color }}</span>
              </el-form-item>
              <el-form-item label="排量：">
                <span>{{ props.row.cdisplacement }}</span>
              </el-form-item>
              <el-form-item label="类别：">
                <span>{{ props.row.ctype }}</span>
              </el-form-item>
              <el-form-item label="行驶里程：">
                <span>{{ props.row.cused }}km</span>
              </el-form-item>
              <el-form-item label="购买日期：">
                <span>{{ props.row.getdate | fmtdata }}</span>
              </el-form-item>
              <el-form-item label="到期时间：">
                <span>{{ props.row.dateline | fmtdata }}</span>
              </el-form-item>

              <el-form-item label="车辆展示：">
                <img :src="props.row.pic1" alt width="50px" />
                <img :src="props.row.pic2" alt width="50px" />
                <img :src="props.row.pic3" alt width="50px" />
                <img :src="props.row.pic4" alt width="50px" />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="车辆编号"
          prop="cid"
          width="120px"
        ></el-table-column>
        <el-table-column label="车辆名称" prop="cname"></el-table-column>
        <el-table-column label="车辆展示" prop="pic1">
          <template slot-scope="scope">
            <el-image
              style="width: 100px;height:75px"
              :src="scope.row.pic1"
              :preview-src-list="scope.row.kkkk"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="车辆状态" prop="cstatus">
          <template slot-scope="scope">
            {{ scope.row.cstatus | fmtcarstate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px" v-if="role==0">
          <template slot-scope="scope" v-if="scope.row.cstatus == 3">
            <el-button
              type="primary"
              icon="el-icon-back"
              size="mini"
              @click="recover(scope.row.cid)"
              >恢复</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleCarMsgBox(scope.row.cid)"
              >删除</el-button
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
      form: {
        license: "",
        cbrand: "",
        color: "",
        cprice: "",
        cname: "",
        cdisplacement: "",
        account: "",
        ownerid: "",
        ctype: "",
        getdate: "",
        cused: "",
        dateline: "",
        pic: ""
      },
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 房间列表
      carList: [],
      // 房间总数
      total: 0,
      role: localStorage.getItem("role")
    };
  },
  watch: {
    query() {
      this.getcarList();
    }
  },
  created() {
    this.getcarList();
  },

  methods: {
    // 恢复
    async recover(ev) {
      const { data: res } = await this.$axios.put(`car/recover/${ev}`);
      if (res.meta.status == 201) {
        this.$message.success("操作成功！");
        this.getcarList();
      }
    },
    // 删除
    showDeleCarMsgBox(CarId) {
      this.$confirm("确定要永久删除企业?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.delete(`car/delete/${CarId}`);
          if (res.data.meta.status == 201) {
            this.pagenum = 1;
            // 更新视图
            this.getcarList();
            // 提示
            this.$message({
              type: "success",
              message: res.data.meta.msg,
              duration: 1000
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },
    // 根据分页获取对应的房间列表
    async getcarList() {
      const { data: res } = await this.$axios.get("car/getallcar", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取房间列表失败！");
      }
      // 拼装大图显示的数组属性
      for (let i = 0; i < res.data.size; i++) {
        let allpic = [];
        ["pic1", "pic2", "pic3", "pic4"].map(function(item) {
          allpic.push(res.data.data[i][item]);
        });
        res.data.data[i]["kkkk"] = allpic;
      }
      this.carList = res.data.data;
      console.log(this.carList);
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getcarList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getcarList();
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

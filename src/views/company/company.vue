<template>
  <el-card class="box-card">
    <!--    1.面包屑-->
    <my-bread level1="企业管理" level2="企业管理"></my-bread>
    <!--    2.搜索-->
    <el-row class="searchRow">
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
          clearable
          @input="getStoreList"
          @clear="loadStoreList"
        >
          <el-button
            @click="searchUser"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!--    3.表格-->
    <el-table :data="storelist" style="width: 100%">
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
            <el-form-item label="代表人身份证号：">
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
              <span>{{ props.row.sstatus | fmtcompanystate }}</span>
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
      <!--      type='index'就是显示索引值-->
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
      <el-table-column label="代表法人" prop="representative"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <!--          企业状态开关-->
          <el-switch
            @change="changeMgState(scope.row)"
            v-model="scope.row.sstatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-close"
            @click="showDeleStoreMsgBox(scope.row.sid)"
            >关闭</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--    4.分页-->

    <el-pagination
      style="margin-top:20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--     对话框-->
    <!--    添加用户的对话框-->
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      // 表格绑定数据
      storelist: [],
      // 分页相关数据
      total: 1,
      pagenum: 1,
      pagesize: 2
    };
  },
  filters:{
    fmtcompanystate:function(v){
      if(v==true){return "正运营中"}
      if(v==false){return "已被冻结"}
    }
  },
  created() {
    this.getStoreList();
  },
  methods: {
    // 获取企业列表的请求
    async getStoreList() {
      const res = await this.$axios.get(
        `store/getall?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res);
      const {
        meta: { status, msg },
        data
      } = res.data;

      // 拼装大图显示的数组属性
      for (let i = 0; i < res.data.size; i++) {
        let allpic = [];
        ["mainpic"].map(function(item) {
          allpic.push(res.data.data[i][item]);
        });
        res.data.data[i]["kkkk"] = allpic;
      }

      if (status == 200) {
        // console.log(data)
        // 1.给表格数据赋值

        this.storelist = data.data;

        this.storelist.forEach((item, index, array) => {
          if (item.sstatus == 2) {
            array[index].sstatus = false;
          } else {
            array[index].sstatus = true;
          }
          console.log(array[index].sstatus);
        });
        console.log(this.storelist);
        // 2.给total赋值
        this.total = data.total;
        // 3.提示
        this.$message({
          type: "success",
          message: msg,
          duration: 1000
        });
      } else {
        // 3.提示
        this.$message.warning(msg);
      }
    },
    // 分页相关方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.getStoreList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getStoreList();
    },
    // 搜索用户
    searchUser() {
      // 按照inout绑定的query参数 发请求
      this.pagenum = 1;
      this.getStoreList();
    },
    // 清空数据框 重新获取数据
    loadStoreList() {
      this.getStoreList();
    },

    // 关闭企业 打开消息框
    showDeleStoreMsgBox(storeId) {
      this.$confirm("确定要关闭企业合作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.put(
            `store/check/${storeId}/state/false`
          );
          console.log(res);
          if (res.data.meta.status == 201) {
            this.pagenum = 1;
            // 更新视图
            this.getStoreList();
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
            message: "已取消",
            duration: 1000
          });
        });
    },

    // 修改状态
    async changeMgState(ev) {
      await this.$axios.put(`store/alter/${ev.sid}/state/${ev.sstatus}`);
    }
  }
};
</script>

<style scoped>
.box-card {
  height: 100%;
}

.inputSearch {
  width: 300px;
}

.searchRow {
  margin-top: 25px;
}
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

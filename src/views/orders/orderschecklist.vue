<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航区 -->
      <my-bread level1="订单管理" level2="订单审核"></my-bread>
      <el-row :gutter="20" style="margin-top:25px">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @input="getorderList"
            @clear="getorderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getorderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table
        :data="orderList"
        style="width: 100%;margin-top:25px"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="订单号">
                <span>{{ props.row.orderid }}</span>
              </el-form-item>
              <el-form-item label="车牌号">
                <span>{{ props.row.license }}</span>
              </el-form-item>
              <el-form-item label="车辆名称">
                <span>{{ props.row.came }}</span>
              </el-form-item>
              <el-form-item label="租赁人">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="用户电话">
                <span>{{ props.row.cellphone }}</span>
              </el-form-item>
              <el-form-item label="押金">
                <span>{{ props.row.deposit }}</span>
              </el-form-item>
              <el-form-item label="订单价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="租车时间">
                <span>{{ props.row.renttime | fmtdata }}</span>
              </el-form-item>
              <el-form-item label="还车时间">
                <span>{{ props.row.returntime | fmtdata }}</span>
              </el-form-item>
              <el-form-item label="逾期价格">
                <span>{{ props.row.overdueprice }}天/元</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="orderid"></el-table-column>
        <el-table-column label="车辆名称" prop="came"></el-table-column>
        <el-table-column label="租赁人" prop="username"></el-table-column>
        <el-table-column label="租车时间" prop="renttime">
          <template slot-scope="scope">
            {{ scope.row.renttime | fmtdata }}
          </template>
        </el-table-column>
        <el-table-column label="还车时间" prop="returntime">
          <template slot-scope="scope">
            {{ scope.row.returntime | fmtdata }}
          </template>
        </el-table-column>
        <el-table-column label="订单价格" prop="price">
          <template slot-scope="scope"> {{ scope.row.price }}元 </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="condition">
          <template slot-scope="scope">
            {{ scope.row.condition | fmtorderstate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-circle-check"
              size="mini"
              @click="agree(scope.row.orderid)"
              >同意</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-circle-close"
              size="mini"
              @click="refuse(scope.row.orderid)"
              >取消</el-button
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
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 房间列表
      orderList: [],
      // 房间总数
      total: 0
    };
  },
  created() {
    this.getorderList();
  },

  methods: {
    // 同意
    async agree(ev) {
      const { data: res } = await this.$axios.put(`order/agree/${ev}`);
      if (res.meta.status == 201) {
        this.$message.success("操作成功！");
        this.getorderList();
      }
    },
    // 拒绝
    async refuse(ev) {
      const { data: res } = await this.$axios.put(`order/rufuse/${ev}`);
      if (res.meta.status == 201) {
        this.$message.success("操作成功！");
        this.getorderList();
      }
    },
    // 根据分页获取对应的房间列表
    async getorderList() {
      const { data: res } = await this.$axios.get("/order/getwaitorder", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取订单列表失败！");
      }
      this.orderList = res.data.data;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getorderList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getorderList();
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

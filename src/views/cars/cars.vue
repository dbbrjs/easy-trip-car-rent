<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航区 -->
      <my-bread level1="车辆管理" level2="车辆管理"></my-bread>
      <el-row :gutter="20" style="margin-top:25px">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @input="getCarList"
            @clear="getCarList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getCarList"
            ></el-button>
          </el-input>
        </el-col>
        <el-button type="success" @click="showAddCarDia">添加车辆</el-button>
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
              <el-form-item label="挂靠企业编号：">
                <span>{{ props.row.sid }}</span>
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

              <el-form-item label="车辆展示：" class="carshow">
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
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditCarDia(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-close"
              @click="showDeleCarMsgBox(scope.row.cid)"
              >关闭</el-button
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

    <!--    添加车辆的对话框-->
    <el-dialog title="添加车辆" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="车辆名称" label-width="100px">
          <el-input
            v-model="form.cname"
            autocomplete="off"
            placeholder="请填写车辆名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="车牌号" label-width="100px">
          <el-input
            v-model="form.license"
            autocomplete="off"
            placeholder="请填写车牌号"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌" label-width="100px">
          <el-input
            v-model="form.cbrand"
            autocomplete="off"
            placeholder="请填写品牌"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="100px">
          <el-input
            v-model="form.cprice"
            autocomplete="off"
            placeholder="请填写价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="颜色" label-width="100px">
          <el-input
            v-model="form.color"
            autocomplete="off"
            placeholder="请填写颜色"
          ></el-input>
        </el-form-item>
        <el-form-item label="车主" label-width="100px">
          <el-input
            v-model="form.ownername"
            autocomplete="off"
            placeholder="请填写车主"
          ></el-input>
        </el-form-item>
        <el-form-item label="类别" label-width="100px">
          <el-input
            v-model="form.ctype"
            autocomplete="off"
            placeholder="请填写类别"
          ></el-input>
        </el-form-item>
        <el-form-item label="排量" label-width="100px">
          <el-input
            v-model="form.cdisplacement"
            autocomplete="off"
            placeholder="请填写排量"
          ></el-input>
        </el-form-item>
        <el-form-item label="车主身份证" label-width="100px">
          <el-input
            v-model="form.ownerid"
            autocomplete="off"
            placeholder="请填写车主身份证"
          ></el-input>
        </el-form-item>
        <el-form-item label="购车日期" label-width="100px">
          <el-date-picker
            value-format="yyyy/MM/dd"
            type="date"
            placeholder="选择日期"
            v-model="form.getdate"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="行驶里程" label-width="100px">
          <el-input
            v-model="form.cused"
            autocomplete="off"
            placeholder="请填写行驶里程"
          ></el-input>
        </el-form-item>
        <el-form-item label="到期时间" label-width="100px">
          <el-date-picker
            value-format="yyyy/MM/dd"
            type="date"
            placeholder="选择日期"
            v-model="form.dateline"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车辆图片" label-width="100px">
          <el-upload
            multiple
            class="upload-demo"
            action="a"
            :file-list="fileList"
            list-type="picture"
            :auto-upload="false"
            ref="uploada"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <!--    编辑车辆的对话框-->
    <el-dialog title="编辑车辆信息" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="车辆名称" label-width="100px">
          <el-input
            v-model="form.cname"
            autocomplete="off"
            placeholder="请填写车辆名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="车牌号" label-width="100px">
          <el-input
            v-model="form.license"
            autocomplete="off"
            placeholder="请填写车牌号"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌" label-width="100px">
          <el-input
            v-model="form.cbrand"
            autocomplete="off"
            placeholder="请填写品牌"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="100px">
          <el-input
            v-model="form.cprice"
            autocomplete="off"
            placeholder="请填写价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="颜色" label-width="100px">
          <el-input
            v-model="form.color"
            autocomplete="off"
            placeholder="请填写颜色"
          ></el-input>
        </el-form-item>
        <el-form-item label="车主" label-width="100px">
          <el-input
            v-model="form.ownername"
            autocomplete="off"
            placeholder="请填写车主"
          ></el-input>
        </el-form-item>
        <el-form-item label="类别" label-width="100px">
          <el-input
            v-model="form.ctype"
            autocomplete="off"
            placeholder="请填写类别"
          ></el-input>
        </el-form-item>
        <el-form-item label="排量" label-width="100px">
          <el-input
            v-model="form.cdisplacement"
            autocomplete="off"
            placeholder="请填写排量"
          ></el-input>
        </el-form-item>
        <el-form-item label="车主身份证" label-width="100px">
          <el-input
            v-model="form.ownerid"
            autocomplete="off"
            placeholder="请填写车主身份证"
          ></el-input>
        </el-form-item>
        <el-form-item label="类别" label-width="100px">
          <el-input
            v-model="form.ctype"
            autocomplete="off"
            placeholder="请填写类别"
          ></el-input>
        </el-form-item>
        <el-form-item label="购车日期" label-width="100px">
          <el-date-picker
            value-format="yyyy/MM/dd"
            type="date"
            placeholder="选择日期"
            v-model="form.getdate"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="行驶里程" label-width="100px">
          <el-input
            v-model="form.cused"
            autocomplete="off"
            placeholder="请填写行驶里程"
          ></el-input>
        </el-form-item>
        <el-form-item label="到期时间" label-width="100px">
          <el-date-picker
            value-format="yyyy/MM/dd"
            type="date"
            placeholder="选择日期"
            v-model="form.dateline"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="预览图片" label-width="100px">
          <div class="block" v-for="url in imgs" :key="url">
            <el-image style="width: 150px; height: 100px;float:left" :src="url" fit="contain"></el-image>
          </div>
        </el-form-item> -->
        <el-form-item label="车辆图片" label-width="100px">
          <el-upload
            multiple
            class="upload-demo"
            action="a"
            :file-list="fileList"
            list-type="picture"
            :auto-upload="false"
            ref="uploada"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editcar">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import qs from 'qs'
import moment from "moment";
export default {
  data() {
    return {
      // headers: {
      //   // 设置上传图片的头部信息
      //   Authorization: localStorage.getItem("token"),
      //   "Content-Type": "multipart/form-data"
      // },
      imgs: [],
      fileList: [], //缓存区文件
      formData: new FormData(),
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
        dateline: ""
      },
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 添加对话框属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      // 车辆列表
      carList: [],
      // 车辆总数
      total: 0
    };
  },
  created() {
    this.getCarList();
  },

  methods: {
    // 修改编辑
    showEditCarDia(user) {
      this.dialogFormVisibleEdit = true;
      console.log(user);
      // this.imgs=user.kkkk
      delete user["kkkk"]; //删除属性
      delete user["insertdate"];
      this.form = user;
      this.form.dateline = moment(this.form.dateline).format("YYYY/MM/DD"); // 修改后台返回的时间格式，再发送给后台
      this.form.getdate = moment(this.form.getdate).format("YYYY/MM/DD");
    },
    async editcar() {
      console.log(this.form);
      this.formData = new FormData(); // 令formdata为空，使其不会重复传之前的数据

      // 添加当前剩余图片文件
      this.$refs.uploada.uploadFiles.forEach(ev => {
        this.formData.append("files", ev.raw);
      });
      // 把form表单的数据加入到FormData中
      Object.keys(this.form).forEach(ele => {
        if (this.form[ele] != null) {
          this.formData.append(ele, this.form[ele]);
        }
      });

      const res = await this.$axios.post(`car/updatecar/`, this.formData, {
        methods: "post",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(res);
      this.dialogFormVisibleEdit = false;
      this.getCarList();
    },

    // 添加车辆 - 显示对话框
    showAddCarDia() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
      
    },
    // 添加车辆 - 发送请求
    async submitData() {
      // 关闭对话框
      this.dialogFormVisibleAdd = false;
      
      // 清空上次 上传的信息
      this.formData=new FormData()
      // 添加当前剩余图片文件
      this.$refs.uploada.uploadFiles.forEach(ev => {
        this.formData.append("files", ev.raw);
      });
      // 把form表单的数据加入到FormData中
      
      Object.keys(this.form).forEach(ele => {
        this.formData.append(ele, this.form[ele]);
      });
      console.log(this.formData);
      // 清空图片预览缓存
      this.fileList=[]

      const res = await this.$axios.post("car/createcar", this.formData, {
        methods: "post",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data"
        }
      });
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 1.提示成功
        this.$message.success(msg);
        // 2.更新视图
        this.getCarList();
        // 3.清空文本框
        this.form = {};
      } else {
        this.$message.warning(msg);
      }
    },
    // 删除车辆 打开消息框
    showDeleCarMsgBox(carId) {
      this.$confirm("下架车辆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.delete(`car/delete/${carId}`);
          if (res.data.meta.status == 201) {
            this.pagenum = 1;
            // 更新视图
            this.getCarList();
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

    // 根据分页获取对应的车辆列表
    async getCarList() {
      const { data: res } = await this.$axios.get("car/getcar", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取车辆列表失败！");
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
      this.getCarList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getCarList();
    }
  }
};
</script>

<style scoped>
.carshow img {
  margin-right: 10px;
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

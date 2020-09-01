<template>
  <!--  引入element.iu布局容器-->
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../../assets/53.gif" alt="无法显示图片" height="120" width="150" style="margin-top: -30px;" />
          </div>
        </el-col>
        <el-col :span="17" class="middle">
          <h3>简行汽车租赁后台管理系统</h3>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            {{ usersname }}
            <a href="#" class="loginout" @click="handleSignout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside width="200px" class="aside">
        <!--        侧边栏导航-->
        <el-menu :unique-opened="true" :router="true">
          <!-- 1 -->

          <el-submenu :index="'' + item.order" v-for="(item, index) in this.menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="item1.path" v-for="(item1, index) in item.children" :key="index">
              <i class="el-icon-success"></i>
              <span>{{ item1.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        {
          authName: "企业管理",
          children: [
            {
              authName: "企业管理",
              path: "company",
              juisdiction: "1",
              order: 10
            },
            {
              authName: "企业审核",
              path: "companychecklist",
              juisdiction: "1",
              order: 11
            },
            {
              authName: "企业列表",
              path: "companylist",
              juisdiction: "1",
              order: 12
            }
          ],
          order: 0,
          juisdiction: "1",
          path: "company"
        },
        {
          authName: "用户管理",
          children: [
            {
              authName: "用户列表",
              path: "users",
              juisdiction: "01",
              order: 20
            }
          ],
          order: 1,
          juisdiction: "01",
          path: "users"
        },
        {
          authName: "车辆管理",
          children: [
            {
              authName: "车辆管理",
              path: "cars",
              juisdiction: "0",
              order: 30
            },
            {
              authName: "车辆审核",
              path: "carschecklist",
              juisdiction: "0",
              order: 31
            },
            {
              authName: "车辆列表",
              path: "carslist",
              juisdiction: "01",
              order: 32
            }
          ],
          order: 2,
          juisdiction: "01",
          path: "house"
        },
        {
          authName: "订单管理",
          children: [
            {
              authName: "订单审核",
              path: "orderschecklist",
              juisdiction: "0",
              order: 40
            },
            {
              authName: "订单列表",
              path: "orderlist",
              juisdiction: "01",
              order: 41
            }
          ],
          order: 3,
          path: "orderlist",
          juisdiction: "01"
        }
      ],
      usersname: localStorage.getItem("usersname"),
      role: localStorage.getItem("role")
    };
  },
  created() {
    console.log(this.menus);
    var _this=this
    // let jrole = localStorage.getItem("role");
    let arr = [];
    var rolecheck = function(ev) {                   // 权限管理，根据权限显示                     
      for (let i = 0; i < ev.length; i++) {
        if (ev[i].juisdiction.includes(_this.role)) {
          if (ev[i].children) {
            rolecheck(ev[i].children);
          }
        } else {
          arr.push(ev[i].order);
          ev.splice(i,1)         // 可以直接删除原数组对象！！！！！
          i--
        }
      }
    };
    rolecheck(this.menus);
  },
  methods: {
    handleSignout() {
      // 1.清除token
      localStorage.clear();
      // 2.提示
      this.$message.success("退出成功");
      // 3.来到login组件
      this.$router.push({ name: "login" });
    }
    // async getMenus() {
    //   const res = await this.$axios.get(`menus`)
    //   console.log(res);
    //   this.menus = res.data.data
    // }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
}
.middle {
  text-align: center;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>

import Vue from "vue";
import Router from "vue-router";

// @->src   @自动指向src
import Login from "@/views/login/login.vue";
import Home from "../views/home/home.vue";
import Companychecklist from "../views/company/companychecklist.vue";
import Companylist from "../views/company/companylist.vue";
import Company from "../views/company/company.vue";
import Users from "../views/users/users.vue";
import Cars from "@/views/cars/cars.vue";
import Carslist from "@/views/cars/carslist.vue";
import Carschecklist from "@/views/cars/carschecklist.vue";
import Orderschecklist from "@/views/orders/orderschecklist.vue";
import Orderlist from "@/views/orders/orderlist.vue";
import Fail from "@/views/fail.vue";

import { Message } from "element-ui";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      name: "login",
      path: "/login",
      component: Login,
      meta: {
        role: [0, 1]
      }
    },
    {
      name: "fail",
      path: "/fail",
      component: Fail,
      meta: {
        role: [0, 1]
      }
    },
    {
      name: "home",
      path: "/",
      component: Home,
      redirect: "/users",
      children: [
        {
          name: "companychecklist",
          path: "/companychecklist",
          component: Companychecklist,
          // component: sessionStorage.getItem('role')==='1'?Companychecklist:Users
          meta: {
            role: [1]
          }
        },
        {
          name: "company",
          path: "/company",
          component: Company,
          meta: {
            role: [1]
          }
        },

        {
          name: "companylist",
          path: "/companylist",
          component: Companylist,
          meta: {
            role: [1]
          }
        },
        {
          name: "users",
          path: "/users",
          component: Users,
          meta: {
            role: [0, 1]
          }
        },
        {
          name: "cars",
          path: "/cars",
          component: Cars,
          meta: {
            role: [0]
          }
        },
        {
          name: "carschecklist",
          path: "/carschecklist",
          component: Carschecklist,
          meta: {
            role: [0]
          }
        },

        {
          name: "carslist",
          path: "/carslist",
          component: Carslist,
          meta: {
            role: [0, 1]
          }
        },
        {
          name: "orderschecklist",
          path: "/orderschecklist",
          component: Orderschecklist,
          meta: {
            role: [0]
          }
        },
        {
          name: "orderlist",
          path: "/orderlist",
          component: Orderlist,
          meta: {
            role: [0, 1]
          }
        }
      ]
    }
  ]
});

//vue-router@3.0版本及以上回调形式已经改成promise api的形式了，返回的是一个promise，如果路由地址跳转相同, 且没有捕获到错误，控制台始终会出现如图所示的警告 （注：3.0以下版本则不会出现以下警告！！！，因路由回调问题…）
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

// 在路由配置生效之前 统一判断token
// 路由守卫 在路由配置生效之前
// to -> 要去的路由配置
// from -> 当前的路由配置
// next() 下一步,让当前路由配置继续生效
router.beforeEach((to, from, next) => {
  console.log(to);

  if (to.path === "/login") {
    next();
  } else {
    const token = localStorage.getItem("token");
    if (!token) {
      Message.warning("请先登录"); // 这个Message也是单独应用的
      router.push({
        // 这里没有this.$router 所以直接使用router
        name: "login"
      });
      return;
    } else {
      const jrole = localStorage.getItem("role");
      if (to.meta.role.join("").includes(jrole)) {
        next();
      } else {
        Message.warning("权限不足"); // 这个Message也是单独应用的
        router.push({
          // 这里没有this.$router 所以直接使用router
          name: "login"
        });
        return;
      }
    }
    next();
  }
});

export default router;

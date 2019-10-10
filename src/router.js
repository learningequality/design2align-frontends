import Vue from "vue";
import Router from "vue-router";
// Import generated routes
import routes from "vue-auto-routing";
import Home from "./Home.vue";
import Login from "./Login.vue";
import Logout from "./Logout.vue";
import session from "./session";

Vue.use(Router);

const homeRoute = {
  path: "/",
  name: "home",
  component: Home
};

const loginRoute = {
  path: "/login",
  name: "login",
  component: Login
};

const logoutRoute = {
  path: "/logout",
  name: "logout",
  component: Logout
};

export const judgmentRoutes = routes.filter(
  route =>
    route.name.indexOf("-index") > -1 &&
    route.path.startsWith("/judgment") &&
    route.path.replace("/judgment/", "").indexOf("/") === -1
);
export const visualizationRoutes = routes.filter(
  route =>
    route.name.indexOf("-index") > -1 &&
    route.path.startsWith("/visualization") &&
    route.path.replace("/visualization/", "").indexOf("/") === -1
);

const router = new Router({
  routes: [homeRoute, loginRoute, logoutRoute]
    .concat(judgmentRoutes)
    .concat(visualizationRoutes)
});

router.beforeEach((to, from, next) => {
  if (to.name != loginRoute.name) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!session.loggedIn) {
      next({
        name: loginRoute.name
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

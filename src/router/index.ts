import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name:'/',
    component:()=> import('@/views/game/game.vue')
  },
  {
    path: '/ts/',
    name:'/ts/',
    component:()=> import('@/views/game/game-ts.vue')
  },
  {
    path: '/ts/checkAll',
    name:'CheckAll',
    component:()=> import('@/views/checkAll/index.vue')
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;

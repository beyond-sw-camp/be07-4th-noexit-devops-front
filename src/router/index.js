import { createRouter, createWebHistory } from 'vue-router';
import { memberRouter } from './memberRouter'; //라우터 임포트할때 중괄호 쓰는것 잊지말기.
import { reviewRouter } from './reviewRouter';
import { boardRouter } from './boardRouter';
const routes = [
    ...memberRouter,
    ...reviewRouter,
    ...boardRouter,

]


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
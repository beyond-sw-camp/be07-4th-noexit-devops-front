import { createRouter, createWebHistory } from 'vue-router';
import {memberRouter} from './memberRouter'; //라우터 임포트할때 중괄호 쓰는것 잊지말기.

const routes = [
    ...memberRouter,


]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
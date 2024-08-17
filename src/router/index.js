import { createRouter, createWebHistory } from 'vue-router';
import { memberRouter } from './memberRouter'; //라우터 임포트할때 중괄호 쓰는것 잊지말기.
import { reviewRouter } from './reviewRouter';
import { reservationRouter } from './reservationRouter';
import { boardRouter } from './boardRouter';
import { findBoardRouter } from './findBoardRouter';
import { gameRouter} from './gameRouter';
import { chatRouter } from './chatRouter';

const routes = [
    ...memberRouter,
    ...reviewRouter,
    ...reservationRouter,
    ...boardRouter,
    ...findBoardRouter,
    ...gameRouter,
    ...chatRouter
]


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
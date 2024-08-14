import ReviewCreate from '@/views/review/ReviewCreate.vue';
import ReviewList from '@/views/review/ReviewList.vue';

export const reviewRouter = [
  {
    path: '/review/create',
    name: 'ReviewCreate',
    component: ReviewCreate,
  },
  {
    path: '/review/list',
    name: 'ReviewList',
    component: ReviewList,
  },


];

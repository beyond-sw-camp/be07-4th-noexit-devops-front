import ReviewCreate from '@/views/review/ReviewCreate.vue';
import ReviewList from '@/views/review/ReviewList.vue';
import MemberReviewList from '@/views/member/MemberReviewList.vue'

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
  {
    path: '/review/myall',
    name: 'MemberReviewList',
    component: MemberReviewList
  },

];

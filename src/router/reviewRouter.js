import ReviewCreate from '@/views/ReviewCreate.vue';
// import ReviewList from '@/views/ReviewList.vue';

export const reviewRouter = [
  {
    path: '/review/create',
    name: 'ReviewCreate',
    component: ReviewCreate,
  },
  // vue 파일 없어서 에러 나는 것 같아서 잠시 주석 처리 해놧음
  // {
  //   path: '/review/list',
  //   name: 'ReviewList',
  //   component: ReviewList,
  // },


];

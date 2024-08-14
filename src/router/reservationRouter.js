// reservationRouter.js

import ReservationCreate from '@/views/ReservationCreate.vue';
import ReservationList from '@/views/ReservationList.vue';
import ReservationDetail from '@/views/ReservationDetail.vue';
import MemberReservationList from '@/views/member/MemberReservationList';


export const reservationRouter = [
  {
    path: '/reservation/create',
    name: 'ReservationCreate',
    component: ReservationCreate,
  },
  {
    path: '/reservation/list',
    name: 'ReservationList',
    component: ReservationList,
  },
  {
    path: '/reservation/detail/:id',
    name: 'ReservationDetail',
    component: ReservationDetail,
    props: true
  },
  {
    // 로그인한 멤버의 예약 내역
    // path: '/reservation/detail/:id',
    // name: 'ReservationDetail',
    // component: ,

  },
  {
    path: '/reservation/myreservation',
    name: 'MemberReservationList',
    component: MemberReservationList
  }
];

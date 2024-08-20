// reservationRouter.js

import ReservationCreate from '@/views/reservation/ReservationCreate.vue';
import MemberReservationList from '@/views/member/MemberReservationList.vue';
import ReservationDetail from '@/views/reservation/ReservationDetail.vue';
import StoreReservationList from '@/views/reservation/StoreReservationList.vue';
// import ReservationList from '@/views/reservation/ReservationList.vue'
import ResList from '@/views/reservation/ResList.vue';


export const reservationRouter = [
  {
    path: '/reservation/create',
    name: 'ReservationCreate',
    component: ReservationCreate,
  },
  // {
  //   path: '/reservation/list',
  //   name: 'ReservationList',
  //   component: ReservationList,
  // },
  {
    path: '/reservation/detail/:id',
    name: 'ReservationDetail',
    component: ReservationDetail,
    props: true
  },
  {

    path: '/store-reservations',
    name: 'StoreReservationList',
    component: StoreReservationList,
  },
  // {
  // 로그인한 멤버의 예약 내역
  // path: '/reservation/detail/:id',
  // name: 'ReservationDetail',
  // component: ,
  // },

  {
    path: '/reservation/myreservation',
    name: 'MemberReservationList',
    component: MemberReservationList
  },
  {
    path: '/resview',
    name: 'ResList',
    component: ResList,
  },
];

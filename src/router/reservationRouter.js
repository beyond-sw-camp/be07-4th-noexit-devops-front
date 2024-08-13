// reservationRouter.js

import ReservationCreate from '@/views/ReservationCreate.vue';
import ReservationList from '@/views/ReservationList.vue';
import ReservationDetail from '@/views/ReservationDetail.vue';
import StoreReservationList from '@/views/StoreReservationList.vue';

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
    path: '/store-reservations',
    name: 'StoreReservationList',
    component: StoreReservationList,
  },
  
];

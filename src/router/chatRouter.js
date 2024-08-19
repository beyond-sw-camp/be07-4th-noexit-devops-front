import RoomList from '@/components/RoomList.vue';
import ChatRoom from '@/components/ChatRoom.vue';
// import ChatFinal from '@/views/chat/ChatFinal.vue';
// import ChatIn from '@/views/chat/ChatIn.vue';

export const chatRouter = [
  {
    path: '/chat/rooms',
    name: 'RoomList',
    component: RoomList
  },
  {
    path: '/chat/rooms/:roomId',
    name: 'ChatRoom',
    component: ChatRoom,
    props: true
  },
  // {
  //   path: '/chat/create',
  //   name: 'CreateRoom',
  //   component: CreateRoom
  // },
  // {
  //   path: '/chat/check',
  //   name: 'ChatFinal',
  //   component: ChatFinal
  // },
  // {
  //   path: '/chat/create',
  //   name: 'ChatIn',
  //   component: ChatIn
  // }
];


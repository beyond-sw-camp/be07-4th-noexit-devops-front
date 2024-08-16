import RoomList from '@/views/chat/RoomList.vue';
import ChatRoom from '@/views/chat/ChatRoom.vue';
import CreateRoom from '@/views/chat/CreateRoom.vue';
import ChatFinal from '@/views/ChatFinal.vue';
import ChatIn from '@/views/ChatIn.vue';

export const chatRouter = [
  {
    path: '/chat/',
    name: 'RoomList',
    component: RoomList
  },
  {
    path: '/chat/create',
    name: 'CreateRoom',
    component: CreateRoom
  },
  {
    path: '/chat/room/:id',
    name: 'ChatRoom',
    component: ChatRoom,
  },
  {
    path: '/chat/check',
    name: 'ChatFinal',
    component: ChatFinal
  },
  {
    path: '/chat/create',
    name: 'ChatIn',
    component: ChatIn
  }
];


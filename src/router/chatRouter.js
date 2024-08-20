import RoomList from '@/components/RoomList.vue';
import ChatRoom from '@/components/ChatRoom.vue';

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
];


<template>
    <div class="room-list-container">
      <h2>Available Rooms</h2>
      <ul>
        <li v-for="room in rooms" :key="room.id">
          <router-link :to="{ name: 'ChatRoom', params: { id: room.id } }">{{ room.name }}</router-link>
        </li>
      </ul>
      <button @click="goToCreateRoom" class="btn">Create New Room</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState } from 'vuex';
  
  export default {
    data() {
      return {
        rooms: []
      };
    },
    computed: {
      ...mapState(['token']),
    },
    async created() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/chat/rooms`, {
          headers: {
            Authorization: `Bearer ${this.token}`  // 로그인된 사용자의 토큰 사용
          }
        });
        this.rooms = response.data;
      } catch (error) {
        console.error('Failed to load rooms:', error);
      }
    },
    methods: {
      goToCreateRoom() {
        this.$router.push('/chat/create');
      }
    }
  };
  </script>
  
  <style scoped>
  .room-list-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
    background-color: #1c1c1c;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 32px;
    font-weight: bold;
    color: #ffffff;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 15px;
  }
  
  a {
    color: #4CAF50;
    text-decoration: none;
    font-size: 20px;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  .btn {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #45a049;
  }
  </style>
  
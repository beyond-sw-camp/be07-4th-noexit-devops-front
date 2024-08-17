<template>
    <div class="create-room-container">
        <h2>Create a New Room</h2>
        <div class="input-group">
            <input v-model="roomName" placeholder="Enter room name" class="input-field" />
        </div>
        <div class="input-group">
            <input v-model="password" type="password" placeholder="Enter room password" class="input-field" />
        </div>
        <button @click="createRoom" class="btn">Create Room</button>
    </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        roomName: '',
        password: '',
      };
    },
    computed: {
      token() {
        return localStorage.getItem('token');
      },
    },
    methods: {
      async createRoom() {
        if (this.roomName.trim() === '' || this.password.trim() === '') {
          alert("Room name and password cannot be empty!");
          return;
        }
  
        try {
          await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/chat/create`, {
            name: this.roomName,
            password: this.password,
          }, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });
  
          this.$router.push('/chat/');
        } catch (error) {
          console.error('Failed to create room:', error);
          alert('Failed to create room. Please try again.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .create-room-container {
    max-width: 400px;
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
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #2a2a2a;
    color: #ffffff;
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
  
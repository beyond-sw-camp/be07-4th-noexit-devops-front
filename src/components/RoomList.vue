<template>
  <v-container>
    <!-- <v-row>
      <v-col cols="12">
        <v-text-field 
          v-model="newRoomName" 
          label="New Room Name"
          outlined
          color="white"
          background-color="#ffffff"
        ></v-text-field>
        <v-text-field 
          v-model="newRoomPassword" 
          label="Password" 
          type="password"
          outlined
          color="white"
          background-color="#ffffff"
        ></v-text-field>
        <v-btn @click="createRoom" color="white" outlined>Create Room</v-btn>
      </v-col>
    </v-row> -->
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item v-for="room in rooms" :key="room.roomId" @click="enterRoom(room.roomId)" class="white--text">
            <v-list-item-content>
              <v-list-item-title>{{ room.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      rooms: [],
      newRoomName: '',
      newRoomPassword: ''
    };
  },
  created() {
    this.fetchRooms();
  },
  methods: {
    fetchRooms() {
      axios.get(`${process.env.VUE_APP_API_BASIC_URL}/chat/myrooms`).then(response => {
        this.rooms = response.data;
        console.log(this.rooms)
      });
    },
    createRoom() {
      axios.post(`${process.env.VUE_APP_API_BASIC_URL}/chat/createRoom`, {
        name: this.newRoomName,
        password: this.newRoomPassword
      }).then(() => {
        this.fetchRooms();
      });
    },
    enterRoom(roomId) {
      this.$router.push(`/chat/rooms/${roomId}`);
    },
  }

};
</script>

<style scoped>
.v-container {
  background-color: #ffffff;
  color: #000000;
  padding: 20px;
  border-radius: 10px;
}

.v-text-field input {
  background-color: #f9f9f9;
  color: #000000;
}

.v-btn {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
}

.v-list-item {
  background-color: #f0f0f0;
  color: #000000;
  margin-bottom: 10px;
  border-radius: 5px;
}

.v-list-item:hover {
  background-color: #e0e0e0;
}

.v-list-item-content {
  color: #000000;
}

.v-list-item-title {
  color: #000000;
}
</style>

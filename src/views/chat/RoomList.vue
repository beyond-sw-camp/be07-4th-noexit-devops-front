<!-- <template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="newRoomName" label="New Room Name"></v-text-field>
        <v-text-field v-model="newRoomPassword" label="Password" type="password"></v-text-field>
        <v-btn @click="createRoom">Create Room</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item v-for="room in rooms" :key="room.roomId" @click="enterRoom(room.roomId)">
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
      axios.get('/api/chat/rooms').then(response => {
        this.rooms = response.data;
      });
    },
    createRoom() {
      axios.post('/api/chat/createRoom', {
        name: this.newRoomName,
        password: this.newRoomPassword
      }).then(() => {
        this.fetchRooms();
      });
    },
    enterRoom(roomId) {
      this.$router.push(`/chat/room/${roomId}`);
    }
  }
};
</script>

<style scoped>
/* 스타일은 자유롭게 추가 */
</style> -->

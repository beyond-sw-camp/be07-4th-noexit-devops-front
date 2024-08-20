<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center text-h5">
            예약 생성
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="reservationCreate">
              <v-text-field label="예약자 이름" v-model="resName" required></v-text-field>
              <v-text-field label="전화번호" v-model="phoneNumber" required></v-text-field>
              <v-text-field label="플레이어 수" v-model="numberOfPlayers" type="number" required></v-text-field>
              <v-date-picker label="예약 날짜" v-model="resDate" required
                :min="new Date().toISOString().substr(0, 10)"></v-date-picker>
              <v-text-field label="예약 시간" v-model="resDateTime" placeholder="예: 14:00" required></v-text-field>
              <v-text-field label="게임 ID" v-model="gameId" required></v-text-field>
              <v-btn type="submit" color="primary" block>예약 등록</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default {
  data() {
    return {
      resName: "",
      phoneNumber: "",
      numberOfPlayers: 1,
      resDate: null,
      resDateTime: "",
      gameId: "",
      memberId: "",
    };
  },
  created() {
    this.getMemberId();
  },
  methods: {
    async getMemberId() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          this.memberId = decodedToken.userId || decodedToken.sub;  // 토큰에서 memberId를 추출
        } else {
          alert('로그인이 필요합니다.');
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('회원 정보를 가져오는 데 실패했습니다.', error);
      }
    },
    async reservationCreate() {
      try {
        const reservationData = {
          resName: this.resName,
          phoneNumber: this.phoneNumber,
          numberOfPlayers: this.numberOfPlayers,
          resDate: this.resDate,  // Date 객체를 서버로 보내기 전에 문자열로 변환
          resDateTime: this.resDateTime,
          gameId: this.gameId,
        };

        console.log(reservationData)
        await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/reservation/create`, reservationData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.$router.push('/reservation/myreservation');
      } catch (e) {
        console.error(e);
        alert("예약 등록에 실패하였습니다.");
      }
    },
  }
}
</script>

<style scoped>
/* 필요한 경우 스타일을 여기에 추가할 수 있습니다 */
</style>
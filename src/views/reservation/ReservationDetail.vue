<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-center text-h5">
              예약 상세 정보
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>게임 이름</v-list-item-title>
                    <v-list-item-subtitle>{{ reservation.gameName }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>매장 이름</v-list-item-title>
                    <v-list-item-subtitle>{{ reservation.storeName }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>예약자 이름</v-list-item-title>
                    <v-list-item-subtitle>{{ reservation.resName }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>예약자 전화번호</v-list-item-title>
                    <v-list-item-subtitle>{{ reservation.phoneNumber }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>예약 날짜</v-list-item-title>
                    <v-list-item-subtitle>{{ reservation.resDate }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>예약 시간</v-list-item-title>
                    <v-list-item-subtitle>{{ reservation.resDateTime }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>예약 상태</v-list-item-title>
                    <v-list-item-subtitle>{{ reservation.reservationStatus }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="$router.go(-1)" color="primary">뒤로 가기</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        reservation: {},
      };
    },
    created() {
      this.fetchReservationDetail();
    },
    methods: {
      async fetchReservationDetail() {
        const reservationId = this.$route.params.id;
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/reservation/detail/${reservationId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.reservation = response.data.result;
        } catch (e) {
          console.error(e);
          alert("예약 상세 정보를 가져오는 데 실패하였습니다.");
        }
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  
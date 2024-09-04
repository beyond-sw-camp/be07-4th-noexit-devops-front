<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card sytle="box-shadow:none">
          <v-card-title class="text-center text-h5" style="margin-bottom:15px">
            예약 상세 정보
          </v-card-title>

          <v-row>
            <v-card-text style="border:1px solid grey; text-align:center">
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>게임 이름</v-list-item-subtitle>
                    <v-list-item-title>{{ reservation.gameName }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>매장 이름</v-list-item-subtitle>
                    <v-list-item-title>{{ reservation.storeName }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>예약자 전화번호</v-list-item-subtitle>
                    <v-list-item-title>{{ reservation.phoneNumber }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>예약 날짜</v-list-item-subtitle>
                    <v-list-item-title>{{ reservation.resDate }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>예약 시간</v-list-item-subtitle>
                    <v-list-item-title>{{ reservation.resDateTime }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>예약 상태</v-list-item-subtitle>
                    <v-list-item-title>{{ reservation.reservationStatus }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-row>


          <v-row justify="center" style="margin:30px; box-shadow:none">

            <btn class="close-btn" @click="$router.go(-1)" fab dark>
              <svg-icon type="mdi" :path="path" style="color:#ff0066"></svg-icon>
            </btn>
          </v-row>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiClose } from '@mdi/js';

export default {
  name: "my-component",
  components: {
    SvgIcon
  },
  data() {
    return {
      reservation: {},
      path: mdiClose,

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
<!-- <script>
export default {
  props: {
    reservation: {
      type: Object,
      required: true
    }
  },
  created() {
    console.log(this.reservation)
  },
  data() {
    return {
      showModal: true
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
      this.$router.push('/reservations'); // 모달 닫기 후 예약 목록으로 돌아가기
    }
  }
}
</script> -->

<style scoped>
* {
  background-color: #1b1b1b;
  color: #ffffff;
}

.close-btn {
  border-radius: 50%;
  border: 1px solid #ff0066;

  width: 40px;
  height: 40px;
  display: flex;
  color: #ff0066;
  align-items: center;
  justify-content: center;
}

.close-btn .v-icon {
  font-size: 12px;
  /* 아이콘 크기 조정 */
}
</style>
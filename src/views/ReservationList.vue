<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title class="text-center text-h5">
                        예약 목록
                    </v-card-title>
                <v-card-text>
            <v-list>
                <v-list-item
                    v-for="reservation in reservations"
                    :key="reservation.id"
                    class="mb-4"
                    :class="{'rejected-reservation': reservation.reservationStatus === 'REJECT'}"
                >
                <v-list-item-content>
                    <v-list-item-title>
                        {{ reservation.gameName }} - {{ reservation.storeName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <v-row>
                            <v-col cols="12" sm="6">
                                예약자: {{ reservation.resName }}
                            </v-col>
                            <v-col cols="12" sm="6">
                                인원: {{ reservation.numberOfPlayers }}명
                            </v-col>
                            <v-col cols="12" sm="6">
                                날짜: {{ reservation.resDate }}
                            </v-col>
                            <v-col cols="12" sm="6">
                                시간: {{ reservation.resDateTime }}
                            </v-col>
                            <v-col cols="12" sm="6">
                                상태: {{ reservation.reservationStatus }}
                            </v-col>
                        </v-row>
                    </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-list-item-action>
                    <v-btn color="primary" @click="viewReservation(reservation.id)">상세보기</v-btn>
                    <v-btn
                        v-if="reservation.reservationStatus === 'WAITING'"
                        color="red"
                        @click="cancelReservation(reservation.id)"
                    >
                        취소하기
                    </v-btn>
                    <v-btn
                        v-if="reservation.reservationStatus === 'ACCEPT' && !reservation.hasReview"
                        color="green"
                        @click="writeReview(reservation.id)"
                    >
                        리뷰 작성
                    </v-btn>
                    <v-btn
                        v-if="reservation.reservationStatus === 'ACCEPT' && reservation.hasReview"
                        color="grey"
                        disabled
                    >
                        리뷰 작성 완료
                    </v-btn>
                </v-list-item-action>
                </v-list-item>
            </v-list>
            </v-card-text>
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
            reservations: [],
        };
    },
    created() {
      this.fetchReservations();
    },
    methods: {
        async fetchReservations() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/reservation/myreservation`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data.result);
                this.reservations = response.data.result;
            } catch (e) {
                console.error(e);
                alert('예약 목록을 가져오는 데 실패하였습니다.');
            }
        },
        viewReservation(id) {
            console.log('Reservation ID:', id);
            if (id) {
                this.$router.push(`/reservation/detail/${id}`);
            } else {
                alert('예약 ID를 찾을 수 없습니다.');
            }
        },
        async cancelReservation(id) {
            try {
                await axios.put(`${process.env.VUE_APP_API_BASIC_URL}/reservation/delete/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                alert('예약이 취소되었습니다.');
                this.fetchReservations();
            } catch (e) {
                console.error(e);
                alert('예약을 취소하는 데 실패하였습니다.');
            }
        },
        writeReview(id) {
            // 리뷰 작성 페이지로 이동하거나 작성 모달을 띄우는 로직을 추가합니다.
            this.$router.push(`/review/create?reservationId=${id}`);
        }
    },
};
</script>
  
<style scoped>
    .v-list-item-subtitle {
    margin-top: 8px;
    font-size: 14px;
}

    .rejected-reservation {
        opacity: 0.5;
}
</style>

<template>
    <v-container style=" background-color: #1b1b1b; color:#ffffff;">
        <v-row>
            <v-col>
                <v-row justify="center">
                    <v-col cols="12">
                        <v-card>
                            <!-- <h2 class="font-weight-bold">
                                예약 목록 ({{ reservations.length }})
                            </h2>
                            <v-divider :thickness="6"></v-divider> -->
                            <h2 class="font-weight-bold">예약 목록 ({{ reservations.length }})</h2>
                            <v-divider :thickness="6"></v-divider>
                            <v-card-text>
                                <v-list>

                                    <v-list-item v-for="reservation in reservations" :key="reservation.id"
                                        :class="{ 'rejected-reservation': reservation.reservationStatus === 'REJECT' }">

                                        <v-row align="center">
                                            <v-col cols="9">
                                                <v-list-item-text style="font-size:16px">
                                                    {{ reservation.gameName }}
                                                </v-list-item-text>

                                                <span style="color:#919191; font-weight:500; margin-left:10px">{{
                                                    reservation.storeName
                                                }}</span>
                                                <btn prepend-icon="mdi-chevron-down" justify="end"
                                                    @click="viewReservation(reservation.id)">
                                                    <v-icon>mdi-chevron-down</v-icon>
                                                </btn>
                                                <v-list-item-subtitle>
                                                    인원: {{ reservation.numberOfPlayers }}명
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle>
                                                    {{ reservation.resDate }} {{ reservation.resDateTime }}
                                                </v-list-item-subtitle>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-list-item-action>
                                                    <v-btn v-if="reservation.reservationStatus === 'WAITING'"
                                                        class="waiting-button"
                                                        @click="cancelReservation(reservation.id)">
                                                        취소하기
                                                    </v-btn>
                                                    <v-btn
                                                        v-if="reservation.reservationStatus === 'ACCEPT' && !reservation.hasReview"
                                                        color='#ff0066' @click="writeReview(reservation.id)">
                                                        리뷰 작성
                                                    </v-btn>
                                                    <v-btn
                                                        v-if="reservation.reservationStatus === 'ACCEPT' && reservation.hasReview"
                                                        color="grey" disabled>
                                                        리뷰 작성 완료
                                                    </v-btn>
                                                </v-list-item-action>
                                            </v-col>
                                        </v-row>

                                        <v-divider :thickness="3" style="margin-top:20px"></v-divider>
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <reservation-modal v-if="showModal" :reservationId="selectedReservationId" @close="showModal = false">
        </reservation-modal>
    </v-container>
</template>

<script>
import axios from 'axios';
import ReservationModal from '@/components/ReservationModal.vue';

export default {
    components: {
        ReservationModal
    },
    data() {
        return {
            reservations: [],
            showModal: false,
            selectedReservationId: null,
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
                this.reservations = response.data.result;
            } catch (e) {
                console.error(e);
                alert('예약 목록을 가져오는 데 실패하였습니다.');
            }
        },
        // viewReservation(id) {
        //     console.log('Reservation ID:', id);
        //     if (id) {
        //         this.$router.push(`/reservation/detail/${id}`);
        //     } else {
        //         alert('예약 ID를 찾을 수 없습니다.');
        //     }
        // },
        viewReservation(id) {
            if (id) {
                this.selectedReservationId = id;
                this.showModal = true;
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
            this.$router.push(`/review/create?reservationId=${id}`);
        }
    },
};
</script>

<style scoped>
* {
    background-color: #1b1b1b;
    color: #ffffff;
}


.rejected-reservation {
    opacity: 0.5;
}

.v-list-item {
    margin: 10px;
    padding: 10px;
}

.waiting-button {
    border: 1px solid #ff0066;
    color: #ffffff;
}
</style>

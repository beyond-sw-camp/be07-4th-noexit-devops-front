<template>
    <v-dialog v-model="showModal" max-width="600px">
        <v-card>
            <v-card-title class="text-center text-h5" style="margin:15px">
                예약 상세 정보
            </v-card-title>

            <v-card-text>
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

            <v-card-actions>
                <v-btn @click="closeModal" class="close-btn" fab dark>
                    <v-icon style="font-size: 20px;color:#ff0066">mdi-close</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import { mdiClose } from '@mdi/js';

export default {
    props: {
        reservationId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            reservation: {},
            showModal: true,
            path: mdiClose
        };
    },
    created() {
        this.fetchReservationDetail();
    },
    methods: {
        async fetchReservationDetail() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/reservation/detail/${this.reservationId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.reservation = response.data.result;
            } catch (e) {
                console.error(e);
                alert("예약 상세 정보를 가져오는 데 실패하였습니다.");
            }
        },
        closeModal() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
* {
    background-color: #1b1b1b;
    color: #ffffff;
}

.v-card-text {
    text-align: center;
    border-top: 1px solid #919191;
    border-bottom: 1px solid #919191;
}

.close-btn {
    border-radius: 50%;
    border: 1px solid #ff0066;
    width: 55px;
    height: 55px;
    display: flex;
    color: #ff0066;
    align-items: center;
    justify-content: center;
}

.close-btn .v-icon {
    font-size: 12px;
}

.v-dialog>.v-overlay__content>.v-card>.v-card-actions {
    justify-content: center;
}
</style>
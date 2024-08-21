<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="10">
                <v-card style=" background-color: #1b1b1b; color:#ffffff;">
                    <h2 class="font-weight-bold">{{ isOwner ? '가게 예약 목록' : '내 예약 목록' }}</h2>
                    <v-divider :thickness="6"></v-divider>

                    <v-card-text>
                        <v-alert v-if="reservations.length === 0" type="info">
                            예약 내역이 없습니다.
                        </v-alert>
                        <div v-else>
                            <v-list style=" background-color: #1b1b1b; color:#ffffff;">
                                <v-list-item v-for="reservation in reservations" :key="reservation.id" :class="{
                                    'text-muted': reservation.reservationStatus === 'REJECT' || reservation.reservationStatus === 'CANCELLED',
                                }">
                                    <div class="custom-list-item">
                                        <v-row align="center">
                                            <v-col cols="9" style="padding-left:30px">
                                                <v-list-item-text style="font-size:16px ">
                                                    {{ reservation.gameName }}
                                                </v-list-item-text>
                                                <div style="margin-top:10px; font-weight:500;">
                                                    <v-list-item-subtitle>
                                                        인원: {{ reservation.numberOfPlayers }}명
                                                    </v-list-item-subtitle>
                                                    <v-list-item-subtitle>
                                                        {{ reservation.resDate }} {{ reservation.resDateTime }}
                                                    </v-list-item-subtitle>
                                                    <v-list-item-subtitle>
                                                        {{ reservation.phoneNumber }}
                                                    </v-list-item-subtitle>
                                                </div>

                                            </v-col>
                                            <v-col cols="3">
                                                <v-list-item-action
                                                    v-if="isOwner && reservation.delYN !== 'Y' && reservation.reservationStatus === 'WAITING'">
                                                    <v-btn style="background-color:#ff0066;"
                                                        @click="approveReservation(reservation)">
                                                        승인
                                                    </v-btn>
                                                    <v-btn @click="rejectReservation(reservation)"
                                                        style="background-color:#1b1b1b">
                                                        거절
                                                    </v-btn>
                                                </v-list-item-action>
                                                <v-list-item-action
                                                    v-if="isOwner && reservation.delYN !== 'Y' && reservation.reservationStatus === 'ACCEPT'">
                                                    <v-btn style="background-color:#919191; border:none;">
                                                        승인 완료
                                                    </v-btn>

                                                </v-list-item-action>
                                                <v-list-item-action
                                                    v-if="isOwner && reservation.delYN !== 'Y' && reservation.reservationStatus === 'REJECT'">
                                                    <v-btn style="background-color:#565656; border:none">
                                                        승인 거절
                                                    </v-btn>

                                                </v-list-item-action>
                                            </v-col>
                                        </v-row>
                                    </div>

                                    <!-- Actions for the owner -->


                                    <!-- Actions for the user -->
                                    <!-- <v-list-item-action v-if="!isOwner">
                                        <v-btn v-if="reservation.reservationStatus === 'WAITING'" color="error"
                                            @click="cancelReservation(reservation)">
                                            예약 취소
                                        </v-btn>
                                        <v-btn
                                            v-if="reservation.reservationStatus === 'ACCEPT' && !reservation.reviewWritten"
                                            color="primary" @click="goToReviewCreate(reservation)">
                                            리뷰 작성
                                        </v-btn>
                                    </v-list-item-action> -->
                                </v-list-item>
                            </v-list>
                        </div>
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
            isAuthenticated: false,
            isOwner: false,
            reservations: [],

        };
    },
    computed: {
        approvedReservations() {
            // 예약 상태가 "승인"된 것만 필터링
            return this.reservations.filter(reservation => reservation.reservationStatus === 'ACCEPT');
        },
    },
    created() {
        this.checkAuthStatus();
        if (this.isAuthenticated) {
            if (this.isOwner) {
                this.fetchOwnerReservations();
            } else {
                this.fetchUserReservations();
            }
            if (this.$route.query.afterReview) {
                this.reviewCompleted(this.$route.params.reservationId);
            }
        }
    },
    methods: {
        checkAuthStatus() {
            const token = localStorage.getItem('token');
            this.isAuthenticated = !!token;

            if (token) {
                const decodedToken = this.decodeToken(token);
                this.isOwner = decodedToken && decodedToken.role === 'OWNER';
            }
        },
        decodeToken(token) {
            if (!token) return null;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join('')
            );
            return JSON.parse(jsonPayload);
        },
        async fetchUserReservations() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/reservation/myreservation`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.reservations = response.data.result;
            } catch (error) {
                console.error('예약 목록을 불러오는 중 오류가 발생했습니다:', error);
            }
        },
        async fetchOwnerReservations() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/reservation/storeReservation`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.reservations = response.data.result;
            } catch (error) {
                console.error('예약 목록을 불러오는 중 오류가 발생했습니다:', error);
            }
        },
        async approveReservation(reservation) {
            try {
                await axios.put(
                    `${process.env.VUE_APP_API_BASIC_URL}/reservation/approval`,
                    {
                        id: reservation.id,
                        gameId: reservation.gameId,
                        resDate: reservation.resDate,
                        resDateTime: reservation.resDateTime,
                        approvalStatus: 'OK',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                alert('예약이 승인되었습니다.');
                this.fetchOwnerReservations(); // 상태를 갱신하여 UI를 업데이트합니다.
            } catch (error) {
                console.error('예약 승인 중 오류가 발생했습니다:', error.response ? error.response.data : error.message);
                alert('예약 승인 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        },
        async rejectReservation(reservation) {
            try {
                await axios.put(
                    `${process.env.VUE_APP_API_BASIC_URL}/reservation/approval`,
                    {
                        id: reservation.id, // reservationId 추가
                        gameId: reservation.gameId,
                        resDate: reservation.resDate,
                        resDateTime: reservation.resDateTime,
                        approvalStatus: 'NO',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                alert('예약이 거절되었습니다.');
                this.fetchOwnerReservations();
            } catch (error) {
                console.error('예약 거절 중 오류가 발생했습니다:', error);
            }
        },
        async cancelReservation(reservation) {
            try {
                await axios.put(
                    `${process.env.VUE_APP_API_BASIC_URL}/reservation/delete/${reservation.id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                alert('예약이 취소되었습니다.');
                this.fetchUserReservations();
            } catch (error) {
                console.error('예약 취소 중 오류가 발생했습니다:', error);
            }
        },
        goToReviewCreate(reservation) {
            this.$router.push({
                name: 'ReviewCreate',
                query: { reservationId: reservation.id }
            });
        },

        async reviewCompleted(reservationId) {
            const reservation = this.reservations.find(r => r.id === reservationId);
            if (reservation) {
                reservation.reviewWritten = true;
                console.log("Review completed for reservation: ", reservation);
            }
        }

    },
};
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}

.v-list-item {
    padding: 10px 30px;
}

.custom-list-item {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 30px;
    transition: transform 0.2s ease-in-out;
}


.v-list-item-title {
    font-weight: bold;
}

.v-list-item-subtitle {
    font-size: 14px;

}

.v-list-item-action {
    display: flex;
    gap: 10px;
}

.v-btn {
    min-width: 80px;
    border: 1px solid #ff0066;
    color: #ffffff;
}

.text-muted {
    opacity: 0.5;
}
</style>

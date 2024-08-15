<template>
    <div>
        <v-container v-if="isAuthenticated">
            <v-row justify="center">
                <v-col cols="12" md="8">
                    <v-card>
                        <v-card-title>{{ isOwner ? '가게 예약 목록' : '나의 예약 목록' }}</v-card-title>
                        <v-card-text>
                            <!-- 예약 목록 출력 -->
                            <v-list v-if="reservations.length">
                                <v-list-item
                                    v-for="reservation in reservations"
                                    :key="reservation.id"
                                >
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ reservation.gameName }} - {{ reservation.storeName }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            예약 날짜: {{ reservation.resDate }} <br>
                                            예약 시간: {{ reservation.resDateTime }} <br>
                                            예약 인원: {{ reservation.numberOfPlayers }}명
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <!-- 예약이 없을 경우 -->
                            <v-alert v-else type="info">
                                예약 내역이 없습니다.
                            </v-alert>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- 로그인하지 않은 경우 -->
        <v-container v-else>
            <v-row justify="center">
                <v-col cols="12" md="8">
                    <v-alert type="warning">로그인이 필요합니다. 로그인 후 이용해주세요.</v-alert>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            isAuthenticated: false,
            isOwner: false,
            reservations: [], // 예약 목록 저장
        };
    },
    created() {
        this.checkAuthStatus();
        if (this.isAuthenticated) {
            if (this.isOwner) {
                this.fetchOwnerReservations();
            } else {
                this.fetchUserReservations();
            }
        }
    },
    methods: {
        // 인증 상태 확인 및 역할 확인
        checkAuthStatus() {
            const token = localStorage.getItem('token');
            this.isAuthenticated = !!token;

            // 사용자 역할이 OWNER인지 확인
            const decodedToken = this.decodeToken(token);
            this.isOwner = decodedToken && decodedToken.role === 'ROLE_OWNER';

            console.log('Authenticated:', this.isAuthenticated);
            console.log('Is Owner:', this.isOwner);
        },
        // JWT 토큰 디코딩
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
        // 사용자의 예약 목록 가져오기
        async fetchUserReservations() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/reservations/mine`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.reservations = response.data.result;
            } catch (error) {
                console.error('예약 목록을 불러오는 데 실패했습니다.', error);
            }
        },
        // Owner의 가게 예약 목록 가져오기
        async fetchOwnerReservations() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/reservations/owner`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.reservations = response.data.result;
            } catch (error) {
                console.error('가게 예약 목록을 불러오는 데 실패했습니다.', error);
            }
        },
    },
};
</script>

<style scoped>
/* 스타일을 필요에 따라 추가하세요 */
</style>

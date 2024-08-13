<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title>예약 내역</v-card-title>
                    <v-card-text>
                    <v-alert v-if="reservations.length === 0" type="info">
                        예약 내역이 없습니다.
                    </v-alert>
                    <div v-else>
                        <v-list>
                            <v-list-item v-for="reservation in reservations" :key="reservation.id">
                                <v-list-item-content>
                                    <v-list-item-title>{{ reservation.gameName }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        예약일: {{ reservation.resDate }} 시간: {{ reservation.resDateTime }}
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle>예약자: {{ reservation.resName }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>상태: {{ reservation.reservationStatus }}</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action v-if="reservation.reservationStatus !== 'ACCEPT' && reservation.reservationStatus !== 'REJECT'">
                                    <v-btn color="success" @click="approveReservation(reservation)">승인</v-btn>
                                    <v-btn color="error" @click="rejectReservation(reservation)">거절</v-btn>
                                </v-list-item-action>
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
            reservations: [],
        };
    },
    created() {
        this.fetchReservations();
    },
    methods: {
        async fetchReservations() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/reservation/storeReservation`);
                this.reservations = response.data.result;
            } catch (error) {
                console.error('예약 목록을 가져오는 중 오류가 발생했습니다:', error);
            }
        },
        async approveReservation(reservation) {
            try {
                await axios.put(`${process.env.VUE_APP_API_BASIC_URL}/reservation/approval`, {
                adminEmail: this.getAdminEmailFromToken(),
                gameId: reservation.gameId,
                resDate: reservation.resDate,
                resDateTime: reservation.resDateTime,
                approvalStatus: 'OK',
                });
                alert('예약이 승인되었습니다.');
                this.fetchReservations(); // 승인 후 목록 새로 고침
            } catch (error) {
                console.error('예약 승인 중 오류가 발생했습니다:', error);
            }
        },
        async rejectReservation(reservation) {
            try {
                await axios.put(`${process.env.VUE_APP_API_BASIC_URL}/reservation/approval`, {
                adminEmail: this.getAdminEmailFromToken(),
                gameId: reservation.gameId,
                resDate: reservation.resDate,
                resDateTime: reservation.resDateTime,
                approvalStatus: 'NO',
                });
                alert('예약이 거절되었습니다.');
                this.fetchReservations(); // 거절 후 목록 새로 고침
            } catch (error) {
                console.error('예약 거절 중 오류가 발생했습니다:', error);
            }
        },
        getAdminEmailFromToken() {
            const token = localStorage.getItem('token');
            if (token) {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join('')
                );
                const decodedToken = JSON.parse(jsonPayload);
                return decodedToken.email; // JWT 토큰에서 이메일 추출
            }
            return null;
        },
    },
};
</script>

<style scoped>
.reservation-card {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.reservation-item {
  padding: 16px 0;
  border-bottom: 1px solid #eeeeee;
}

.game-name {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin-top: 4px;
}

.detail {
  font-weight: 500;
  color: #34495e;
}

.status {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-top: 10px;
}

.accepted-status {
  color: #27ae60;
}

.rejected-status {
  color: #e74c3c;
}

.v-list-item-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.action-btn {
  margin-right: 8px;
  min-width: 80px;
}

.v-btn:last-child {
  margin-right: 0;
}
</style>

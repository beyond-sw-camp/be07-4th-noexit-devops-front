<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="7" md="6">
                <v-card>
                    <v-card-title class="text-h5">리뷰 작성</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="reviewCreate">
                            <v-text-field label="내용" v-model="content" required></v-text-field>
                            <v-rating v-model="rating" label="평점" required></v-rating>
                            <v-file-input label="리뷰 이미지" v-model="reviewImage" accept="image/*"></v-file-input>

                            <!-- 후 마이페이지 > 예약내역조회 > 리뷰 작성 순으로 해서 회원정보와 예약 정보 파싱-->
                            <v-text-field label="회원 ID" v-model="memberId" required></v-text-field>       
                            <v-text-field label="예약 ID" v-model="reservationId" required></v-text-field>
                            
                            <v-btn type="submit" block>리뷰 작성</v-btn>
                        </v-form>
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
            content: "",
            rating: 0,
            reviewImage: null,
            memberId: "",
            reservationId: "",
        };
    },
    methods: {
        async reviewCreate() {
            try {
                const formData = new FormData();
                formData.append('content', this.content);
                formData.append('rating', this.rating);
                formData.append('reviewImage', this.reviewImage);
                formData.append('memberId', this.memberId);
                formData.append('reservationId', this.reservationId);

                await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/review/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                this.$router.push("/");
            } catch (e) {
                const error_message = e.response.data.error_message;
                console.error(error_message);
                alert(error_message);
            }
        }
    }
}
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다 */
</style>

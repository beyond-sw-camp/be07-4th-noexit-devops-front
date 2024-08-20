<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="8" md="8">
                <v-card style="background-color:#1b1b1b; color:#ffffff">
                    <v-card-title class="text-center text-h5">
                        리뷰 작성
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="reviewCreate">
                            <v-textarea
                                placeholder="리뷰내용"
                                v-model="content"
                                required
                                class="mb-3"
                        ></v-textarea>
                            <v-text-area label="리뷰 내용" v-model="content" required></v-text-area>
                            <v-rating label="평점" v-model="rating" required></v-rating>
                            <v-file-input label="리뷰 이미지" accept="image/*" @change="fileUpdate"></v-file-input>
                            <v-btn type="submit" color="primary" block>등록</v-btn>
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
            content: "",
            rating: 0,
            reviewImage: null,
            reservationId: "",  // 이 부분에 쿼리에서 받은 reservationId를 저장할 예정
            memberId: "",
        };
    },
    created() {
        this.getMemberId();
        this.reservationId = this.$route.query.reservationId;  // 쿼리에서 reservationId 받아오기
    },
    methods: {
        async getMemberId() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    this.memberId = decodedToken.userId || decodedToken.sub; // 토큰에서 userId를 추출
                } else {
                    alert('로그인이 필요합니다.');
                    this.$router.push('/login');
                }
            } catch (error) {
                console.error('회원 정보를 가져오는 데 실패했습니다.', error);
            }
        },
        async reviewCreate() {
            try {
                let formData = new FormData();
                formData.append("content", this.content);
                formData.append("rating", this.rating);
                formData.append("reviewImage", this.reviewImage);
                formData.append("reservationId", this.reservationId);  // reservationId 추가
                formData.append("memberId", this.memberId);

                await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/review/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.$router.push('/review/myall');
            } catch (e) {
                console.error(e);
                alert("리뷰 등록에 실패하였습니다.");
            }
        },
        fileUpdate(event) {
            this.reviewImage = event.target.files[0];
        }
    }
}

</script>

<style scoped></style>

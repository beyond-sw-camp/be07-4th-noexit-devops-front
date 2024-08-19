<template>
    <v-container style=" background-color: #1b1b1b; color:#ffffff;">
        <v-row>
            <h2 style="font-size:24px; margin-bottom:5px">Review({{ reviewList.length }})</h2>
            <v-divider :thickness="6"></v-divider>
            <v-row justify="end" class="more">
                <v-btn>더보기</v-btn>
            </v-row>
            <v-row justify="center">
                <v-col cols="12" v-for="review in reviewList" :key="review.id" class="review-item" justify="center">
                    <v-row align="center">
                        <!-- 정보 -->
                        <v-col class="review-detail">
                            <v-row no-gutters style="padding:0">
                                <v-col cols="auto" v-for="n in 5" :key="n">
                                    <v-icon color="pink" v-if="n <= review.rating">mdi-star</v-icon>
                                    <v-icon color="grey" v-else>mdi-star-outline</v-icon>
                                </v-col>
                                <span style="padding-left:10px">{{ review.rating }}</span>
                            </v-row>
                            <!-- 회원일때는 내가 쓴거여서 불필요 -->
                            <!-- <v-row>{{ review.memberNickname }}</v-row> -->
                            <v-row justify="start" class="text-sm-left" style="padding:0 10px">
                                <span text-align="center" style="color:#ffffff; font-size: 16px; padding-right: 10px;">
                                    {{ review.gameName }}
                                </span>
                                <span style="font-weight:500">
                                    {{ review.storeName }}
                                </span>
                            </v-row>
                            <v-row style="font-weight:500">{{ review.content }}</v-row>
                        </v-col>
                        <!-- 이미지 -->

                        <v-col>
                            <v-row justify="center">
                                <span style="font-weight:500; margin-bottom:10px">{{
                                    formatRelativeTime(review.createdAt)
                                }}</span>
                            </v-row>
                            <v-row>
                                <v-img :src="review.imagePath" class="review-image" contain></v-img>
                            </v-row>
                        </v-col>

                    </v-row>

                    <v-row class="mt-2">
                        <v-col cols="12">
                            <v-btn v-if="canDeleteReview(review)" color="secondary" @click="deleteReview(review.id)">
                                삭제
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider :thickness="3"></v-divider>
                </v-col>
            </v-row>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default {
    props: ['gameId', 'isUserReviews'],
    data() {
        return {
            reviewList: [],
            pageSize: 10,
            currentPage: 0,
            isLastPage: false,
            isLoading: false,
        };
    },
    created() {
        this.loadReviews();
    },
    methods: {
        async loadReviews() {
            try {
                if (this.isLoading || this.isLastPage) return;

                this.isLoading = true;
                let params = { size: this.pageSize, page: this.currentPage };

                if (this.isUserReviews) {
                    const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/review/myall`, { params });
                    this.reviewList = response.data.result.content;
                } else if (this.gameId) {
                    console.log("Game ID:", this.gameId);
                    params.gameId = this.gameId;
                    const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/review/all`, { params });
                    this.reviewList = response.data.result.content;
                }

                this.currentPage++;
                this.isLoading = false;
            } catch (e) {
                console.error(e);
                this.isLoading = false;
            }
        },

        formatRelativeTime(date) {
            return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
        },

        canDeleteReview(review) {
            const currentUserNickname = localStorage.getItem('nickname');
            return review.memberNickname === currentUserNickname;
        },
        async deleteReview(reviewId) {
            try {
                await axios.put(`${process.env.VUE_APP_API_BASIC_URL}/review/delete/${reviewId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.reviewList = this.reviewList.filter(r => r.id !== reviewId);
                alert('리뷰가 삭제되었습니다.');
            } catch (e) {
                console.error(e);
                alert('리뷰 삭제에 실패하였습니다.');
            }
        },
    },
};
</script>

<style scoped>
* {
    font-size: 14px;
}

.v-btn {
    background-color: #1b1b1b;
    color: #9d9d9d;
    margin: 20px 20px;
}

.review-detail>.v-row {
    padding-left: 10px;
    color: #9d9d9d;
}

.review-item>.v-row {
    border-radius: 10px;
    margin: 0px 30px 0;

}

.review-image {
    max-height: 150px;
    max-width: 100%;
    object-fit: cover;
    border-radius: 8px;
}
</style>

<!-- <template>
<div>
</div>
</template>
<script>
export default{
    
}
</script> -->

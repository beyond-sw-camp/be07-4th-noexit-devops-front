
<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12">
                <div v-for="review in reviewList" :key="review.id" class="review-item mb-4">
                    <v-row>
                        <v-col cols="4" class="review-image-col">
                            <v-img :src="review.imagePath" class="review-image" contain></v-img>
                        </v-col>

                        <v-col cols="8">

                            <v-row>
                                <v-col cols="8">
                                    <v-row no-gutters>
                                        <v-col cols="auto" v-for="n in 5" :key="n">
                                            <v-icon color="yellow" v-if="n <= review.rating">mdi-star</v-icon>
                                            <v-icon color="grey" v-else>mdi-star-outline</v-icon>
                                        </v-col>
                                        <span>{{ review.rating }}</span>
                                    </v-row>
                                </v-col>
                                <v-col cols="4" class="text-right">
                                    <span>{{ formatRelativeTime(review.createdAt) }}</span>
                                </v-col>
                            </v-row>

                            <v-row class="mt-2">
                                <v-col cols="12">
                                    <strong>{{ review.memberNickname }}</strong>
                                </v-col>
                            </v-row>

                            <v-row class="mt-2">
                                <v-col cols="12">
                                    <div><strong>Game:</strong> {{ review.gameName }}</div>
                                </v-col>
                            </v-row>

                            <v-row class="mt-2">
                                <v-col cols="12">
                                    <div>{{ review.content }}</div>
                                </v-col>
                            </v-row>

                            <v-row class="mt-2">
                                <v-col cols="12">
                                    <v-btn v-if="canDeleteReview(review)" color="secondary"
                                        @click="deleteReview(review.id)">
                                        삭제
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
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
.review-item {
    padding: 16px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.review-image-col {
    display: flex;
    justify-content: center;
    align-items: center;
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


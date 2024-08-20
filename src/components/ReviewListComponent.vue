<template>
    <v-container style="background-color: #1b1b1b; color:#ffffff;">
        <v-row>
            <!-- <h2 style="font-size:24px; margin-bottom:5px">Review({{ reviewList.length }})</h2>
            <v-divider :thickness="6"></v-divider> -->
            <!-- <v-row justify="end" class="more">
                <v-btn>더보기</v-btn>
            </v-row> -->
            <v-row justify="center">
                <v-col cols="12" v-for="review in reviewList" :key="review.id" class="review-item" justify="center">
                    <v-row align="center">
                        <v-col class="review-detail">
                            <v-row no-gutters style="padding:0">
                                <v-col cols="auto" v-for="n in 5" :key="n">
                                    <v-icon color="pink" v-if="n <= review.rating">mdi-star</v-icon>
                                    <v-icon color="grey" v-else>mdi-star-outline</v-icon>
                                    
                                </v-col>
                                
                                <span style="padding-left:10px">{{ review.rating }}</span> <!-- 평점 -->
                                &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-weight:500; margin-bottom:10px">{{ formatRelativeTime(review.createdAt) }}</span> <!--시간-->
                            </v-row>

                            <v-row justify="start" class="text-sm-left" style="padding:0 10px">
                                <span style="color:#ffffff; font-size: 18px; padding-right: 10px;">
                                    {{ review.gameName }}
                                </span>
                                <span style="font-weight:500 ">
                                    {{ review.storeName }}
                                </span>
                            </v-row>

                            <br>
                            <br>
                            <v-row style="font-weight:500">{{ review.content }}</v-row>
                        </v-col>

                        <v-col>
                            <v-row>
                                <v-img :src="review.imagePath" class="review-image" contain></v-img>
                            </v-row>
                        </v-col>

                        <!-- 수정/삭제 버튼 -->
                        <v-col cols="12" class="text-right">
                            <v-row justify="" class="edit-delete-buttons">
                                <v-btn v-if="canDeleteReview(review)" color="pink" @click="openEditModal(review)" class="edit-btn">
                                    수정
                                </v-btn>
                                <v-btn v-if="canDeleteReview(review)" color="dark pink" @click="deleteReview(review.id)" class="delete-btn ml-1">
                                    삭제
                                </v-btn>
                            </v-row>
                        </v-col> 
                    </v-row>
                    <v-divider :thickness="3"></v-divider>
                </v-col>
            </v-row>
        </v-row>

        <!-- 수정 모달 -->
        <v-dialog v-model="editDialog" max-width="600px">
            <v-card style="background-color: #1b1b1b; color:#ffffff; padding-top: 10px;">
                <v-card-title class="d-flex justify-end" style="padding-top: 10px; margin-right : 10px">
                    <v-btn icon @click="closeEditModal" class="modal-close-btn">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="updateReview">
                        <v-textarea
                            label=""
                            v-model="editedReview.content"
                            outlined
                            :style="{ color: '#ffffff' }"
                            required
                            class="mb-3"
                        ></v-textarea>
                        <v-rating
                            v-model="editedReview.rating"
                            background-color="grey darken-3"
                            color="pink"
                            large
                            dense
                            class="mb-3" 
                        ></v-rating>
                        <v-file-input
                            label="이미지 변경"
                            v-model="editedReview.image"
                            accept="image/*"
                            prepend-icon="mdi-camera"
                            outlined
                            :style="{ color: '#ffffff' }"
                            class="mb-4" 
                        ></v-file-input>

                        <v-row justify="end" class="mt-3">
                            <v-btn type="submit" color="pink">수정</v-btn>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
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
            editDialog: false,
            editedReview: {},
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
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const currentUserId = decodedToken.userId;
            return review.memberId === currentUserId;
        },

        async deleteReview(reviewId) {
            try {
                if (!this.canDeleteReview({ memberId: this.currentUserId })) {
                    alert('삭제 권한이 없습니다.');
                    return;
                }

                await axios.put(`${process.env.VUE_APP_API_BASIC_URL}/review/delete/${reviewId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.reviewList = this.reviewList.filter(r => r.id !== reviewId);
                alert('리뷰가 삭제되었습니다.');
                this.loadReviews();
            } catch (e) {
                console.error(e);
                alert('리뷰 삭제에 실패하였습니다.');
            }
        },

        openEditModal(review) {
            if (!this.canDeleteReview(review)) {
                alert('수정 권한이 없습니다.');
                return;
            }

            this.editedReview = { ...review };
            this.editDialog = true;
        },

        closeEditModal() {
            this.editDialog = false;
            this.editedReview = {};
        },

        async updateReview() {
            try {
                const formData = new FormData();
                formData.append('content', this.editedReview.content);
                formData.append('rating', this.editedReview.rating);

                if (this.editedReview.image) {
                    formData.append('reviewImage', this.editedReview.image); // 이름을 정확히 서버와 일치시킵니다.
                }

                // FormData 내용을 출력하여 확인
                for (let pair of formData.entries()) {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }

                await axios.put(`${process.env.VUE_APP_API_BASIC_URL}/review/update/${this.editedReview.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });

                this.closeEditModal();
                this.loadReviews();
                alert('리뷰가 수정되었습니다.');
            } catch (e) {
                console.error(e);
                alert('리뷰 수정에 실패하였습니다.');
            }
        }
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

.modal-close-btn {
    background-color: transparent;
    color: #ffffff;
    margin: -16px -16px 0 0;
}

.v-card-title {
    padding-top: 0;
}

.v-card-text .v-textarea,
.v-card-text .v-rating,
.v-card-text .v-file-input {
    color: #ffffff;
    margin-bottom: 20px;
}

</style>

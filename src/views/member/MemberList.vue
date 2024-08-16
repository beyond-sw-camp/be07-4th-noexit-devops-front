<template>
  <v-container>
    <v-row class="d-flex justify-content-between mt-5">
      <v-col>
        <v-form @submit.prevent="searchReviews">
          <v-row>
            <v-col cols="auto">
              <v-select v-model="searchType" :items="searchOptions" item-title="text" item-value="value"></v-select>
            </v-col>
            <v-col>
              <v-text-field v-model="searchValue" label="Search"></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit">검색</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="text-p text-center">{{ pageTitle }}</v-card-title>
          <v-card-text>
            <table class="table">
              <thead>
                <tr>
                  <th>이미지</th>
                  <th>평점</th>
                  <th>내용</th>
                  <th>작성자 닉네임</th>
                  <th>게임 ID</th>
                  <th v-if="isAdmin">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="review in reviewList" :key="review.id">
                  <td>
                    <v-img :src="review.imagePath" style="height:100px;width:auto;"></v-img>
                  </td>
                  <td>{{ review.rating }}</td>
                  <td>{{ review.content }}</td>
                  <td>{{ review.memberNickname }}</td>
                  <td>{{ review.gameId }}</td>
                  <td v-if="isAdmin">
                    <v-btn color="secondary" @click="deleteReview(review.id)">
                      삭제
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  props: ['isAdmin', 'pageTitle'],
  data() {
    return {
      searchType: 'optional',
      searchOptions: [
        { text: '선택', value: 'optional' },
        { text: '닉네임', value: 'nickname' },
        { text: '내용', value: 'content' },
      ],
      searchValue: "",
      reviewList: [],
      pageSize: 5,
      currentPage: 0,
      isLastPage: false,
      isLoading: false,
    };
  },
  created() {
    this.loadReviews();
    window.addEventListener('scroll', this.scrollPagination);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.scrollPagination);
  },
  methods: {
    async loadReviews() {
      try {
        if (this.isLoading || this.isLastPage) return;

        this.isLoading = true;
        const params = {
          size: this.pageSize,
          page: this.currentPage,
          gameId: this.$route.query.gameId,
          memberNickname: this.$route.query.memberNickname,
        };

        if (this.searchType === 'nickname') {
          params.nickname = this.searchValue;
        } else if (this.searchType === 'content') {
          params.content = this.searchValue;
        }

        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/reviews`, { params });
        const additionalData = response.data.content;

        if (additionalData.length === 0) {
          this.isLastPage = true;
          return;
        }

        this.reviewList = [...this.reviewList, ...additionalData];
        this.currentPage++;
        this.isLoading = false;
      } catch (e) {
        console.error(e);
      }
    },
    searchReviews() {
      this.reviewList = [];
      this.currentPage = 0;
      this.isLastPage = false;
      this.isLoading = false;
      this.loadReviews();
    },
    scrollPagination() {
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (isBottom && !this.isLastPage && !this.isLoading) {
        this.loadReviews();
      }
    },
    deleteReview(reviewId) {
      /* 삭제 기능 */
      console.log(reviewId);
    },
  },
};
</script>

<style></style>
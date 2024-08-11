<template>
    <v-container>
      <!-- 검색 및 관리자 작업 버튼 -->
      <v-row class="d-flex justify-content-between mt-5">
        <v-col>
          <v-form @submit.prevent="searchReviews">
            <v-row>
              <v-col cols="auto">
                <v-select
                  v-model="searchType"
                  :items="searchOptions"
                  item-title="text"
                  item-value="value"
                  label="검색 기준"
                ></v-select>
              </v-col>
              <v-col>
                <v-text-field v-model="searchValue" label="Search"></v-text-field>
              </v-col>
              <v-col cols="auto">
                <v-btn type="submit">
                  검색
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
        <v-col cols="auto" class="d-flex align-items-center">
          <v-btn href="/review/create" color="success">리뷰 등록</v-btn>
        </v-col>
      </v-row>
  
      <!-- 리뷰 목록 테이블 -->
      <v-row>
        <v-col>
          <v-card>
            <v-card-title class="text-p text-center">{{ pageTitle }}</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-responsive>
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-uppercase">리뷰 이미지</th>
                      <th class="text-uppercase">리뷰 내용</th>
                      <th class="text-uppercase">평점</th>
                      <th class="text-uppercase">작성자 닉네임</th>
                      <th class="text-uppercase">게임 이름</th>
                      <th v-if="isAdmin" class="text-uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in reviewList" :key="r.id">
                      <td>
                        <v-img :src="r.imagePath" class="mx-auto" contain max-height="100px" max-width="auto"></v-img>
                      </td>
                      <td>{{ r.content }}</td>
                      <td>
                        <!-- 평점 표시 -->
                        <v-row no-gutters>
                          <v-col cols="auto" v-for="n in 5" :key="n">
                            <v-icon color="yellow" v-if="n <= r.rating">mdi-star</v-icon>
                            <v-icon color="grey" v-else>mdi-star-outline</v-icon>
                          </v-col>
                        </v-row>
                      </td>
                      <td>{{ r.memberNickname }}</td>
                      <td>{{ r.gameName }}</td>
                      <td>
                        <v-btn
                          v-if="isAdmin || r.memberNickname === currentUserNickname"
                          color="secondary"
                          @click="deleteReview(r.id)"
                        >
                          삭제
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-responsive>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['isAdmin', 'pageTitle', 'currentUserNickname'], // 현재 사용자 닉네임을 props로 전달
    data() {
      return {
        searchType: 'optional',
        searchOptions: [
          { text: '선택', value: 'optional' },
          { text: '작성자 닉네임', value: 'nickname' },
          { text: '내용', value: 'content' },
        ],
        searchValue: "",
        reviewList: [],
        pageSize: 5,
        currentPage: 0,
        isLastPage: false,
        isLoading: false
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
          let params = {
            size: this.pageSize,
            page: this.currentPage,
          };
  
          if (this.searchType === 'nickname') {
            params.nickname = this.searchValue;
          } else if (this.searchType === 'content') {
            params.content = this.searchValue;
          }
  
          const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/review/all`, { params });
          const additionalData = response.data.result.content;
          console.log(response.data);
  
          if (additionalData.length === 0) {
            this.isLastPage = true;
            return;
          }
  
          this.reviewList = [...this.reviewList, ...additionalData];
          this.isLastPage = response.data.result.last;
          this.currentPage++;
          this.isLoading = false;
        } catch (e) {
          console.log(e);
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
      async deleteReview(reviewId) {
        try {
          const response = await axios.put(`${process.env.VUE_APP_API_BASIC_URL}/review/delete/${reviewId}`);
          this.reviewList = this.reviewList.filter(r => r.id !== reviewId);
          alert(response.data.status_message); // 성공 메시지 표시
        } catch (e) {
          console.log(e);
          alert("리뷰 삭제에 실패하였습니다.");
        }
      }
    }
  };
  </script>
  
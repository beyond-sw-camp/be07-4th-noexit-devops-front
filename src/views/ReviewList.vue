<template>
    <div>
        <v-container v-if="isAuthenticated">
            <ReviewListComponent :isUserReviews="true" />
            <!-- <review-list :gameId="gameId" :isUserReviews="true" /> -->
        </v-container>
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
  import ReviewListComponent from '@/components/ReviewListComponent.vue';
  
  export default {
    components: {
        ReviewListComponent,
    },
    data() {
        return {
            isAuthenticated: false, // 사용자 인증 상태를 확인하는 변수

        };
    },
    created() {
      this.checkAuthStatus();
    },
    methods: {
        checkAuthStatus() {
            const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
    console.log('Authenticated:', this.isAuthenticated); // 인증 상태 로그
        },
    },
};
</script>
  
<style scoped>
/* 필요한 스타일 추가 가능 */
</style>
  
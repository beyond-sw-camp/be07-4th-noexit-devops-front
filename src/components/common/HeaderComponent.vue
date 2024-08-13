<template>
  <v-app>
    <v-app-bar app color="white" class="custom-app-bar" elevation="2">
      <v-container>
        <!-- 상단 로고 및 검색 바 -->
        <v-row align="center" justify="space-between" class="top-row">
          <v-col cols="12" md="8" class="d-flex align-center">
            <v-img :src="logoSrc" alt="Logo" max-height="40" class="mr-4 logo-img"></v-img>
            <v-text-field
              class="mx-4 search-bar custom-search-bar"
              solo
              flat
              placeholder="무엇이 궁금하신가요?"
              prepend-inner-icon="mdi-magnify"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end align-center">
            <v-btn text v-if="!isLogin" :to="{ path: '/login' }" class="jua-regular"
              style="font-size: 20px;">로그인</v-btn>
            <v-btn text v-if="!isLogin" :to="{ path: '/member/create' }" class="jua-regular"
              style="font-size: 20px;">회원가입</v-btn>
            <v-btn text v-if="isLogin" :to="{ path: '/mypage' }" class="jua-regular"
              style="font-size: 20px;">마이페이지</v-btn>
            <v-btn text v-if="isLogin" @click="doLogout" class="jua-regular" style="font-size: 20px;">로그아웃</v-btn>
            <v-icon class="mx-2">mdi-bell</v-icon>
            <v-icon class="mx-2">mdi-cart</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- 네비게이션 메뉴 -->
    <v-main class="main-content">
      <v-container class="nav-container">
        <v-row align="center" justify="flex-start" class="nav-row">
          <v-col cols="auto" class="nav-link jua-regular" @click="navigateTo('/reservation/list')">RESERVATION</v-col>
          <v-col cols="auto" class="nav-link jua-regular" @click="navigateTo('/review/list')">REVIEW</v-col>
          <v-col cols="auto" class="nav-link jua-regular" @click="navigateTo('/board/list')">BOARD</v-col>
          <v-col cols="auto"> <router-link :to="{ path: '/findboard' }" style="cursor: pointer; text-decoration: none; color: inherit;">ESCAPE WITH ME</router-link></v-col>
        </v-row>
      </v-container>
      <v-divider class="custom-divider"></v-divider>

      
      <v-container>
        <router-view />
      </v-container>
      
    </v-main>

  </v-app>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false,
      logoSrc: require('@/assets/NoExit_Logo.png'),
    };
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLogin = true;
    }
  },
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    },
    doLogout() {
      localStorage.clear();
      window.location.reload();
    },
  },
};
</script>

<style>
@import url('https://webfontworld.github.io/gmarket/GmarketSans.css');

body {
  font-family: 'GmarketSansMedium', sans-serif;
  font-weight: 500;
}

.custom-app-bar {
  min-height: 80px; /* 앱바 높이 조정 */
  padding: 10px 24px;
  font-size: 20px;
}

.main-content {
  margin-top: 20px; /* 앱바 아래로 네비게이션 메뉴 이동 */
  min-height: calc(100vh - 100px); /* v-main 높이 조정 */
}

.top-row {
  align-items: center;
}

.custom-search-bar .v-input__control {
  border-radius: 20px; /* 검색창의 모서리를 둥글게 만듭니다 */
  height: 40px; /* 검색바 높이 조정 */
}

.custom-search-bar .v-input__slot {
  border-radius: 20px; /* 검색창 내부 슬롯의 모서리를 둥글게 만듭니다 */
  height: 40px; /* 검색바 내부 슬롯의 높이 조정 */
}

.v-text-field.search-bar input {
  background: #f8f7f7;
  border-radius: 20px;
  height: 40px; /* 검색바 높이 조정 */
  font-size: 16px; /* 글자 크기 조정 */
}

.logo-img {
  max-height: 40px; /* 로고 이미지 높이 조정 */
}

.nav-container {
  margin-top: 16px; /* 앱바와 네비게이션 메뉴 사이의 여백 추가 */
}

.nav-row {
  align-items: center;
}

.nav-link {
  font-size: 20px; /* 글자 크기 조정 */
  font-weight: 500;
  margin: 0 15px; /* 글자 간격을 조정 */
  text-decoration: none;
  color: black;
}

.nav-link:hover {
  color: #9e9e9e;
}

.custom-divider {
  background-color: black; /* 원하는 색상으로 변경 */
  height: 2px; /* 구분선의 두께 설정 */
}

</style>

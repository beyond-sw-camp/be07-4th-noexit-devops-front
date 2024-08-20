<template>
  <v-app style="background-color: #1b1b1b; color: #ffffff">
    <v-template>
      <v-row>
        <h2 class="font-weight-bold">Best 5</h2>
        <v-divider></v-divider>
        <BestGameListComponent :games="bestList" class="best-game" />
        <v-divider></v-divider>

        <!-- 로그인했을 때에만 위시리스트 표시 -->
        <v-col v-if="isLoggedIn && myWishList.length > 0">
          <v-row align="center" justify="space-between" class="wishlist-container">
            <v-col cols="auto">
              <h2 class="font-weight-bold">WishList</h2>
            </v-col>
            <v-col cols="auto">
              <v-btn :to="{ path: '/wishlist' }" v-if="myWishList.length > 4">더보기</v-btn>
            </v-col>
          </v-row>
          <GameListComponent :games="slicedWishList" />
          <v-divider></v-divider>

        </v-col>
      </v-row>
      
      <h2 class="font-weight-bold" style="margin-top:20px;">Games</h2>
      <GameListComponent
        :games="gameList"
        style="background-color: #1b1b1b; color: #ffffff"
      />
    </v-template>
  </v-app>
</template>

<script>
import BestGameListComponent from '@/components/BestGameListComponent.vue';
import GameListComponent from '@/components/GameListComponent.vue';
import axios from 'axios';

export default {
    components: {
        GameListComponent, BestGameListComponent
    },
    data() {
        return {
// <<<<<<< HEAD
//         myInfo: [],
//       gameList: [],
//       bestList: [],
//       wishList: [],
//       isWishList: false,
//       myWishList: [],
//       slicedWishList: [],
//       pageSize: 10,
//       currentPage: 0,
//       totalPages: 1,
//       isLastPage: false,
//       isLoading: false,
//     };
//   },
//   created() {
//     this.fetchMyInfo();
//     this.loadList();
//   },
//   methods: {
//     checkUser() {
      
//       if(localStorage.getItem('token')===null) {
//         this.notLoggedIn = true;
//       }else {
//         this.notLoggedIn = false;
//         this.fetchMyInfo();
//       }

//     },
//     async fetchMyInfo() {
//       try {
//         const response = await axios.get(
//           `${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`
//         );
//         this.myInfo = response.data.result;
//       } catch (e) {
        
//         console.log(e);
//       }
//     },

//     async loadList() {

//       try {


//         if (this.isLoading || this.isLastPage) return;
//         this.isLoading = true;

//         const allWishList = []; // 모든 페이지의 wishList 데이터를 저장할 배열

//         while (!this.isLastPage) {
//           let params = {
//             size: this.pageSize,
//             page: this.currentPage,
//           };

//           const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/wishlist`, { params });
//           const gameInfo = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);

//           this.bestList = gameInfo.data.result.slice(0, 5); // 최고 5개만 추출
//           this.gameList = gameInfo.data.result;

//           const additionalData = response.data.result.content;
//           if (additionalData.length === 0) {
//             this.isLastPage = true;
//           } else {
//             allWishList.push(...additionalData);
//             this.currentPage++;
//           }
// =======
            myInfo: [],
            gameList: [],
            bestList: [],
            wishList: [],
            myWishList: [],
            slicedWishList: [],
            pageSize: 10,
            currentPage: 0,
            totalPages: 1,
            isLastPage: false,
            isLoading: false,
            token: localStorage.getItem('token') || null,
            isLoggedIn: false,  // 로그인 상태 확인
        };
    },
    created() {
        if (this.token) {
            this.isLoggedIn = true;  // 토큰이 있으면 로그인 상태로 설정
            this.fetchMyInfo();
            this.loadWishList();  // 위시리스트와 관련된 로직만 호출
        } else {
            console.log("User is not logged in. Skipping wishlist and user info load.");
// >>>>>>> b389c5f9cbcd71fdd603b8fb63ba82421b8febf4
        }
        this.loadGameList(); // 로그인 여부와 상관없이 게임 리스트는 항상 로드
    },
    methods: {
        async fetchMyInfo() {
            if (!this.token) return;  // 토큰이 없으면 요청하지 않음

            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                this.myInfo = response.data.result;
            } catch (e) {
                console.error("Failed to fetch user info:", e);
            }
        },
        async loadWishList() {
            if (!this.token) return;  // 토큰이 없으면 요청하지 않음

            try {
                if (this.isLoading || this.isLastPage) return;
                this.isLoading = true;

                const allWishList = [];

                while (!this.isLastPage) {
                    let params = {
                        size: this.pageSize,
                        page: this.currentPage,
                    };

                    try {
                        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/wishlist`, {
                            params,
                            headers: { Authorization: `Bearer ${this.token}` }
                        });

                        const additionalData = response.data.result.content;
                        if (additionalData.length === 0) {
                            this.isLastPage = true;
                        } else {
                            allWishList.push(...additionalData);
                            this.currentPage++;
                        }
                    } catch (error) {
                        if (error.response && error.response.status === 403) {
                            console.log("403 Forbidden - 사용자 인증이 필요합니다. Wishlist를 건너뜁니다.");
                            this.isLastPage = true;
                            break;
                        } else {
                            throw error;
                        }
                    }
                }

                this.wishList = allWishList;
                this.isLoading = false;

                this.filterMyWishList();
            } catch (e) {
                console.error("정보가 존재하지 않습니다", e);
                this.isLoading = false;
            }
        },
        async toggleWishlist(gameId) {
            if (!this.token) {
                console.error("로그인이 필요합니다.");
                return;
            }

            try {
                const url = `${process.env.VUE_APP_API_BASIC_URL}/wishlist/${this.isInWishlist(gameId) ? 'remove' : 'add'}/${gameId}`;
                const method = this.isInWishlist(gameId) ? 'patch' : 'post';

                await axios({
                    method: method,
                    url: url,
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (this.isInWishlist(gameId)) {
                    this.wishList = this.wishList.filter(wish => wish.gameId !== gameId);
                } else {
                    this.wishList.push({ gameId, memberId: this.myInfo.id });
                }
                this.filterMyWishList(); // 위시리스트 갱신
            } catch (error) {
                console.error("위시리스트 추가/제거 하는 도중에 오류가 발생했습니다.", error);
            }
        },
        isInWishlist(gameId) {
            return this.wishList.some(wish => wish.gameId === gameId);
        },
        filterMyWishList() {
            if (this.token) {
                this.myWishList = this.gameList.filter(game =>
                    this.wishList.some(wish => wish.gameId === game.id && wish.memberId === this.myInfo.id)
                );
                this.slicedWishList = this.myWishList.slice(0, 4);
            }
        },
        async loadGameList() {
            try {
                const gameInfo = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);
                this.bestList = gameInfo.data.result.slice(0, 5);
                this.gameList = gameInfo.data.result;
            } catch (e) {
                console.error("게임 리스트를 불러오는데 실패했습니다.", e);
            }
        },
    }
};
</script>

<style scoped>
.v-btn {
  background-color: #1b1b1b;
  color: #919191;
  font-size: 12px;
}
</style>

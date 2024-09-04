<template>
  <v-app style="background-color: #1b1b1b; color: #ffffff">
    <v-container>
      <v-row>
        <h2 class="font-weight-bold">Best 5</h2>
        <v-divider></v-divider>
        <BestGameListComponent :games="bestList" class="best-game" />
        <v-divider></v-divider>

        <!-- 로그인했을 때에만 위시리스트 표시 -->
        <v-col v-if="isLoggedIn && myWishList.length > 0">
          <v-row
            align="center"
            justify="space-between"
            class="wishlist-container"
          >
            <v-col cols="auto">
              <h2 class="font-weight-bold">WishList</h2>
            </v-col>
            <v-col cols="auto">
              <v-btn :to="{ path: '/wishlist' }" v-if="myWishList.length > 4">
                더보기
              </v-btn>
            </v-col>
          </v-row>
          <GameListComponent :games="slicedWishList" />
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <h2 class="font-weight-bold" style="margin-top: 20px">Games</h2>

      <!-- 검색 기능 UI -->
      <v-row class="mb-0" style="margin-top: 20px">
        <v-col cols="auto">
          <v-select
            v-model="searchType"
            :items="searchOptions"
            item-title="text"
            item-value="value"
            dense
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field v-model="searchValue" label="Search" dense></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-btn height="60" color="pink" @click="filterGames">검색</v-btn>
        </v-col>
      </v-row>

      <GameListComponent
        :games="filteredGames"
        style="background-color: #1b1b1b; color: #ffffff"
      />

      <v-row justify="center">
        <v-btn
        v-if="!isLastPage && filteredGames.length === gameList.length"
        @click="loadMoreGames"
        :loading="isLoading"
        style="
          background-color: #1c1c1c;
          color: #d1d1d1;
          border-radius: 30px;
          padding: 15px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #3a3a3a;
          font-size: 16px;
          font-weight: bold;
          width: 600px; /* 버튼의 넓이 */
          height: 50px; /* 버튼의 높이 */
        "
      >
        More
      </v-btn>
      </v-row>

    </v-container>
  </v-app>
</template>

<script>
import BestGameListComponent from "@/components/BestGameListComponent.vue";
import GameListComponent from "@/components/GameListComponent.vue";
import axios from "axios";

export default {
  components: {
    GameListComponent,
    BestGameListComponent,
  },
  data() {
    return {
      myInfo: [],
      gameList: [],
      bestList: [],
      wishList: [],
      myWishList: [],
      slicedWishList: [],
      pageSize: 12,
      currentPage: 0,
      totalPages: 1,
      isLastPage: false,
      isLoading: false,
      token: localStorage.getItem("token") || null,
      isLoggedIn: false, // 로그인 상태 확인
      searchType: "optional", // 검색 유형
      searchValue: "", // 검색 값
      searchOptions: [
        { text: "선택", value: "optional" },
        { text: "게임 이름", value: "gameName" },
        { text: "가격", value: "price" },
        { text: "난이도", value: "difficult" },
      ],
      filteredGames: [], // 필터링된 게임 목록
      gameListAll: [],
    };
  },
  created() {
    this.fetchBestList();
    this.loadGameList(); // 로그인 여부와 상관없이 게임 리스트는 항상 로드
    if (this.token) {
      console.log("토큰이 존재합니다. 로그인 상태로 설정합니다.");
      this.isLoggedIn = true; // 토
      this.fetchMyInfo();
      this.loadWishList();
    } else {
      console.log("로그인 해주세요");
    }
    console.log("created() - 종료");
  },
  methods: {
    async fetchMyInfo() {
      if (!this.token) {
        console.log("토큰이 없어 사용자 정보를 요청하지 않습니다.");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        this.myInfo = response.data.result;
        console.log("fetchMyInfo - 사용자 정보:", this.myInfo);
      } catch (e) {
        console.error("Failed to fetch user info:", e);
      }
    },
    async loadWishList() {
      if (!this.token) {
        console.log("토큰이 없어 위시리스트를 요청하지 않습니다.");
        return;
      }

      try {
        console.log("loadWishList 호출 - 위시리스트 로딩 시작");
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/wishlist`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );

        this.wishList = response.data.result.content;
        console.log("로드된 위시리스트:", this.wishList);

        this.filterMyWishList();
      } catch (e) {
        console.error("위시리스트를 불러오는데 실패했습니다.", e);
      }
    },
    async toggleWishlist(gameId) {
      if (!this.token) {
        console.error("로그인이 필요합니다.");
        return;
      }

      try {
        const url = `${process.env.VUE_APP_API_BASIC_URL}/wishlist/${
          this.isInWishlist(gameId) ? "remove" : "add"
        }/${gameId}`;
        const method = this.isInWishlist(gameId) ? "patch" : "post";

        await axios({
          method: method,
          url: url,
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (this.isInWishlist(gameId)) {
          this.wishList = this.wishList.filter(
            (wish) => wish.gameId !== gameId
          );
        } else {
          this.wishList.push({ gameId, memberId: this.myInfo.id });
        }
        console.log("위시리스트 업데이트:", this.wishList);
        this.filterMyWishList(); // 위시리스트 갱신
      } catch (error) {
        console.error(
          "위시리스트 추가/제거 하는 도중에 오류가 발생했습니다.",
          error
        );
      }
    },
    isInWishlist(gameId) {
      return this.wishList.some((wish) => wish.gameId === gameId);
    },
    filterMyWishList() {
      if (this.token && this.wishList.length > 0) {
        this.myWishList = this.gameList.filter((game) =>
          this.wishList.some(
            (wish) =>
              wish.gameId === game.id && wish.memberId === this.myInfo.id
          )
        );
        this.slicedWishList = this.myWishList.slice(0, 4);
        console.log("필터링된 위시리스트:", this.slicedWishList);
      } else {
        this.myWishList = [];
        this.slicedWishList = [];
      }
    },
    async loadGameList() {

      if (this.isLoading || this.isLastPage) {
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/game/list`,
          { params: { page: this.currentPage, size: this.pageSize } }
        );

        const games = response.data.result.content;

        console.log("로드된 게임:", games);

        if (games.length > 0) {
          this.gameList = [...this.gameList, ...games];
          this.filteredGames = this.gameList;
        }

        this.totalPages = response.data.result.totalPages;
        this.isLastPage = this.currentPage + 1 >= this.totalPages;
        this.currentPage += 1;

      } catch (e) {
        console.error("게임 리스트를 불러오는데 실패했습니다.", e);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchBestList() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/game/list`,
          { params: { page: 0, size: 5 } }
        );
        this.bestList = response.data.result.content.slice(0, 5);
        console.log("Best 게임 리스트:", this.bestList);
      } catch (e) {
        console.error("Best 게임 리스트를 불러오는데 실패했습니다.", e);
      }
    },
    loadMoreGames() {
      console.log("더보기 버튼 클릭 - loadMoreGames 호출");
      if (!this.isLastPage) {
        this.loadGameList();
      }
    },
    async filterGames() {

      const responseAll = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/listAll`);
      const gameAll = responseAll.data.result;

      if (gameAll.length > 0) {
          this.gameListAll =[...gameAll]
          this.filteredGames = this.gameAll;
        }
      
      if (this.searchType === "optional" || this.searchValue.trim() === "") {

        // 검색 옵션을 선택하지않고 검색창에 아무것도 입력하지 않으면 페이징처리된 게임 리스트 화면이 보이게끔
        this.filteredGames = this.gameList;
      
      } else {
// 그렇지않다면 검색어에 적합하게 전체 데이터에서 검색해서 게임 리스트를 반환
        this.filteredGames = this.gameListAll.filter((game) => {

          if (this.searchType === "gameName") {
            
            return game.gameName.includes(this.searchValue);
            
          } else if (this.searchType === "price") {
            
            return game.price.toString().includes(this.searchValue);
          
          } else if (this.searchType === "difficult") {
            return (
              this.getDifficultyLevel(game.difficult) ===
              parseInt(this.searchValue, 10)
            );
          }
          return false;
        });
      }
    },
    
    getDifficultyLevel(difficulty) {
      const levels = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
      };
      return levels[difficulty?.toUpperCase()] || 1;
    },
  },
};
</script>

<style scoped>
.v-btn {
  background-color: #1b1b1b;
  color: #919191;
  font-size: 12px;
}
</style>

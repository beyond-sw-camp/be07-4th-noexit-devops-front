<template>
  <v-app style="background-color: #1b1b1b; color: #ffffff">
    <v-template>
      <v-row>
        <h2 class="font-weight-bold">Best 5</h2>
        <v-divider></v-divider>
        <BestGameListComponent :games="bestList" class="best-game" />
        <v-divider></v-divider>
        <!-- <v-col v-if="isWishList"> -->
        <v-col v-if="wishList">
          <h2 class="font-weight-bold">WishList({{ wishList.length }})</h2>
          <GameListComponent :games="myWishList" />
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <h2 class="font-weight-bold">Games</h2>
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
        myInfo: [],
      gameList: [],
      bestList: [],
      wishList: [],
      isWishList: false,
      myWishList: [],
      pageSize: 10,
      currentPage: 0,
      totalPages: 1,
      isLastPage: false,
      isLoading: false,
        };
    },
<<<<<<< HEAD
    created() {
        this.fetchMyInfo();
    this.loadList();
  },
  methods: {
    async fetchMyInfo() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`
        );
        this.myInfo = response.data.result;
      } catch (e) {
        console.log(e);
      }
=======
    async created() {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);
            const best = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);

            const token = localStorage.getItem('token');
            if (token) {
                const wishlist = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/wishlist`);
                this.wishList = wishlist.data.result;
                if (this.wishList.length > 0) this.isWishList = true;
            }


            this.gameList = response.data.result;
            this.bestList = best.data.result.slice(0, 5);   // 최고 5개만 추출
        } catch (e) {
            console.error("정보가 존재하지 않습니다", e);
        }
>>>>>>> e941dbff4431824060b66ea5221d881972f31487
    },
   
    async loadList() {

      try {
        if (this.isLoading || this.isLastPage) return;
        this.isLoading = true;

        const allWishList = []; // 모든 페이지의 wishList 데이터를 저장할 배열

        while (!this.isLastPage) {
          let params = {
            size: this.pageSize,
            page: this.currentPage,
          };

          const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/wishlist`, { params });
          const gameInfo = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);

          this.bestList = gameInfo.data.result.slice(0, 5); // 최고 5개만 추출
          this.gameList = gameInfo.data.result;

          const additionalData = response.data.result.content;
          if (additionalData.length === 0) {
          
            this.isLastPage = true;
          } else {
            allWishList.push(...additionalData);
            this.currentPage++; 
          }
        }
        this.wishList = allWishList; 
        this.isLoading = false;

        for (let i = 0; i < this.gameList.length; i++) {
            for(let j =0; j< this.wishList.length; j++) {
                if(this.wishList[j].gameId === this.gameList[i].id && this.wishList[j].memberId === this.myInfo.id) {
                    this.myWishList.push(this.gameList[i]);
                }
            }
        }

      } catch (e) {
        console.error("정보가 존재하지 않습니다", e);
      }
 
    },
  }
}
</script>


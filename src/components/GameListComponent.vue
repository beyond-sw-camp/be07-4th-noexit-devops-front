<template>
    <v-container>
        <v-row>
            <v-col v-for="game in games" :key="game.name" sm="3" md="3">
                <v-card @click="moveToDetail(game.id)" class="hover-card custom-padding-card"
                    style="background-color: #1b1b1b; color:#ffffff;">
                    <!-- 넣을 데이터 조금씩 더 추가예정 -->
                    <v-img :src="game.imagePath" height="200px"></v-img>
                    <v-card-text class="game-store">{{ game.storeName }}</v-card-text>
                    <v-card-title class="game-name">{{ game.gameName }}</v-card-title>
                    <!-- <v-card-text>{{ game.difficult }}</v-card-text> -->
                    <v-card-text class="game-price">{{ game.price }}원 부터~</v-card-text>
                    <!-- difficulty를 별료 표시했지만 원래는 평점을 별로 표시해야함 -->
                    <div class="difficulty-container">
                        <v-row>
                            <v-col class="stars">
                                <v-icon v-for="n in 5" :key="n"
                                    :color="n <= getDifficultyLevel(game.difficult) ? 'pink' : 'grey'">mdi-star</v-icon>
                                <span class="difficulty-level"> {{ getDifficultyLevel(game.difficult) }}</span>
                            </v-col>
                        </v-row>
                    </div>
                    <v-icon @click.stop="toggleWishlist(game.id)" :color="isInWishlist(game.id) ? 'red' : 'grey'"
                        class="wishlist-icon">
                        mdi-heart
                    </v-icon>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import axios from 'axios'
export default {
    props: {
        games: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            myInfo: [],
            wishlist: [],
            myWishList: [],
            pageSize: 10,
            currentPage: 0,
            notLoggedIn: false,
        }
    },
    async created() {
        this.checkUser();
        // this.fetchMyInfo();
        // this.fetchMyWishList();
    },
    
    methods: {
        checkUser() {
      
      if(localStorage.getItem('token')===null) {
        this.notLoggedIn = true;
      }else {
        this.notLoggedIn = false;
        this.fetchMyInfo();
      }

    },
        async fetchMyInfo() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`
        );
        this.myInfo = response.data.result;
        this.fetchMyWishList();
      } catch (e) {
        console.log(e);
      }
    },
        moveToDetail(id) {
            this.$router.push("/game/detail/" + id)
        },
        getDifficultyLevel(difficulty) {
            const levels = {
                one: 1,
                two: 2,
                three: 3,
                four: 4,
                five: 5
            };
            return levels[difficulty?.toLowerCase()] || 1;
        },
        async toggleWishlist(id) {
            try {
                if (this.isInWishlist(id)) {
                    await axios.patch(`${process.env.VUE_APP_API_BASIC_URL}/wishlist/delete/${id}`);
                    this.myWishList = this.myWishList.filter(item => item !== id);
                    alert("게임이 내 찜 목록에서 제거되었습니다.");
                } else {
                    await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/wishlist/add/${id}`);
                    alert("게임이 성공적으로 내 찜 목록에 저장되었습니다.");
                    // this.myWishList.push(id);
                }
                // console.log(this.myWishList)
            } catch (error) {
                console.error("위시리스트 추가/제거 하는 도중에 오류가 발생했습니다..");
            }
        },
        isInWishlist(id) {
            for(let i =0; i< this.myWishList.length; i++) {
                if(this.myWishList[i].gameId === id) {
                    return true;
                }
            }
            return false;
        },
        async fetchMyWishList() {
            this.isLoading = true;

            const allWishList = [];

            while (!this.isLastPage) {
            let params = {
                size: this.pageSize,
                page: this.currentPage,
            };

            const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/wishlist`, { params });

            const additionalData = response.data.result.content;
            if (additionalData.length === 0) {
                this.isLastPage = true;
            } else {
                allWishList.push(...additionalData);
                this.currentPage++; 
            }
        }   
            this.wishList = allWishList;

            for(let i =0; i< this.wishList.length; i++) {
                if(this.wishList[i].memberId === this.myInfo.id) {
                    this.myWishList.push(this.wishList[i]);
                }
            }
        },
    },
};
</script>

<style scoped>
.hover-card {
    transition: transform 0.2s ease;
    border-radius: 15px;

}

.hover-card:hover {
    transform: translate(0px, -5px);
}

.custom-padding-card {
    padding: 30px 20px;
}

.v-card-title {
    padding-top: 2px;
    padding-bottom: 2px;
}


.difficulty-container {
    font-size: 13px;
    padding-left: 11px;
}

.game-name {
    font-size: 17px;
}

.game-price {
    color: #919191;
    padding-bottom: 0px;
    padding-top: 0px;
    font-size: 12px;
}

.game-store {
    color: #919191;
    padding-bottom: 0px;
    font-size: 12px;

}

.difficulty-level {
    margin-left: 8px;
}

.wishlist-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 24px;
}
</style>
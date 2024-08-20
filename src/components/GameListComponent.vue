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
            isLastPage: false,
            token: localStorage.getItem('token') || null,  // 토큰을 저장
            isLoggedIn: false,  // 로그인 상태
        }
    },
    async created() {
        if (this.token) {
            this.isLoggedIn = true;
            this.fetchMyInfo();
            this.fetchMyWishList();
        } else {
            console.log("User is not logged in. Skipping wishlist and user info load.");
        }
    },
    methods: {
        async fetchMyInfo() {
            if (!this.token) return;

            try {
                const response = await axios.get(
                    `${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`,
                    { headers: { Authorization: `Bearer ${this.token}` } }
                );
                this.myInfo = response.data.result;
            } catch (e) {
                console.error("Failed to fetch user info:", e);
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
            if (!this.token) {
                alert("로그인이 필요합니다.");
                return;
            }

            try {
                const url = `${process.env.VUE_APP_API_BASIC_URL}/wishlist/${this.isInWishlist(id) ? 'delete' : 'add'}/${id}`;
                const method = this.isInWishlist(id) ? 'patch' : 'post';

                await axios({
                    method: method,
                    url: url,
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (this.isInWishlist(id)) {
                    this.myWishList = this.myWishList.filter(item => item.gameId !== id);
                } else {
                    this.myWishList.push({ gameId: id, memberId: this.myInfo.id });

                }
            } catch (error) {
                console.error("위시리스트 추가/제거 하는 도중에 오류가 발생했습니다.", error);
            }
        },
        isInWishlist(id) {
            return this.myWishList.some(wish => wish.gameId === id);
        },
        async fetchMyWishList() {
            if (!this.token) return;

            this.isLoading = true;

            const allWishList = [];

            while (!this.isLastPage) {
                let params = {
                    size: this.pageSize,
                    page: this.currentPage,
                };

                try {
                    const response = await axios.get(
                        `${process.env.VUE_APP_API_BASIC_URL}/wishlist`,
                        { params, headers: { Authorization: `Bearer ${this.token}` } }
                    );

                    const additionalData = response.data.result.content;
                    if (additionalData.length === 0) {
                        this.isLastPage = true;
                    } else {
                        allWishList.push(...additionalData);
                        this.currentPage++;
                    }
                } catch (error) {
                    console.error("Failed to fetch wishlist:", error);
                    this.isLastPage = true;
                }
            }

            this.wishList = allWishList;

            for (let i = 0; i < this.wishList.length; i++) {
                if (this.wishList[i].memberId === this.myInfo.id) {
                    this.myWishList.push(this.wishList[i]);
                }
            }

            this.isLoading = false;
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
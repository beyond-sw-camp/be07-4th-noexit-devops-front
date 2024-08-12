<template>
    <v-container>
        <v-row justify="center" class="mt-5">
            <v-col cols="12" md="10">
                <div class="game-detail-container">
                <v-row>
                    <v-col cols="12" md="5">
                        <v-img
                            :src="game.imagePath"
                            alt="Game Image"
                            class="game-image mx-auto"
                        ></v-img>
                    </v-col>

                    <v-col cols="12" md="7">
                        <div class="game-info-container">
                            <h4 class="store-name">{{ game.storeName }}</h4>
                            <h2 class="game-name">{{ game.gameName }}</h2>
                            <v-divider class="my-3"></v-divider>

                            <div class="difficulty-container">
                                <v-row>
                                    <v-col class="stars">
                                        <v-icon
                                            v-for="n in 5"
                                            :key="n"
                                            :color="n <= difficultyLevel ? 'yellow' : 'grey'"
                                        >mdi-star</v-icon>
                                        <span class="difficulty-level">{{ difficultyLevel }}</span>
                                    </v-col>
                                </v-row>
                            </div>

                            <div class="game-details">
                                <div class="price">{{ game.price }}</div>

                                <div class="running-time">
                                    <v-icon left>mdi-clock-outline</v-icon>
                                    {{ game.runningTime }}분
                                </div>

                                <div class="max-person">
                                    <v-icon left>mdi-account-group-outline</v-icon>
                                    최대 인원: {{ game.maximunPerson }}명
                                </div>

                                <div class="age-limit">
                                    <v-icon left>mdi-alert-circle-outline</v-icon>
                                    {{ getAgeLimitLabel(game.ageLimit) }}
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <v-row class="mt-4">
                    <v-col cols="12">
                    <v-divider class="my-3"></v-divider>
                    <div class="game-info-title">게임 설명</div>
                    <p class="game-info">{{ game.gameInfo }}</p>
                    </v-col>
                </v-row>
                </div>
            </v-col>
        </v-row>

        <!-- 리뷰 목록 섹션 -->
        <ReviewListComponent :gameId="gameId" />
    </v-container>
</template>
  
<script>
import axios from 'axios';
import ReviewListComponent from '@/components/ReviewListComponent.vue';

export default {
    components: {
        ReviewListComponent
    },
    data() {
        return {
            gameId: this.$route.params.id,
            game: {},
            difficultyLevel: 1
        };
    },
    created() {
        this.fetchGameDetail();
    },
    methods: {
        async fetchGameDetail() {
            const gameId = this.$route.params.id;
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/detail/${gameId}`);
                this.game = response.data.result;
                this.difficultyLevel = this.getDifficultyLevel(this.game.difficult);
            } catch (e) {
                console.error(e);
                alert('게임 정보를 불러오는 데 실패했습니다.');
            }
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
        getAgeLimitLabel(ageLimit) {
            const labels = {
                adult: "미성년자 출입금지",
                student: "전체이용가"
            };
            return labels[ageLimit?.toLowerCase()] || "전체이용가";
        }
    }
};
</script>
<style scoped>
    .game-detail-container {
    padding: 30px;
    background-color: white;
    border-radius: 10px;
    max-width: 1200px;
    margin: auto;
}

.game-image {
    border-radius: 10px;
    width: 400px;
    height: 500px;
    object-fit: cover;
}

h6.store-name {
    font-size: 24px;
    margin-bottom: 10px;
    color: #333;
}

h2.game-name {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #2c3e50;
}

.difficulty-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.stars {
    display: flex;
    align-items: center;
}

.difficulty-level {
    margin-left: 10px;
    font-size: 16px;
}

.game-details > div {
    margin-bottom: 20px;
    font-size: 24px;
    display: flex;
    align-items: center;
}

.price {
    font-size: 30px;
    margin-bottom: 20px;
}

.running-time,
.max-person,
.age-limit {
    display: flex;
    align-items: center;
}

.game-info-container {
    padding: 20px;
}

.game-info-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
}

.game-info {
    font-size: 18px;
    line-height: 1.6;
    color: #666;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin-top: 20px;
}
</style>
  
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
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
// import axios from "axios";

export default {
    props: {
        games: {
            type: Array,
            required: true
        }
    },
    created() {

    },
    methods: {
        moveToDetail(id) {
            // console.log(id);
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
</style>
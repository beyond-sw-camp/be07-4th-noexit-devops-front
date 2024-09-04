<template>
    <v-container>
        <v-row justify="center" align="center">
            <v-col v-for="game in games" :key="game.name" sm="2" md="2">
                <v-hover v-slot:default="{ isHovering, props }">
                    <v-card v-bind="props" @click="moveToDetail(game.id)" class="hover-card custom-padding-card"
                        style="background-color: #1b1b1b; color: #ffffff;">
                        <v-img :src="game.imagePath"></v-img>

                        <!-- 이미지 위에 데이터 표시 -->
                        <div v-if="isHovering" class="overlay">
                            <v-card-text class="game-store">{{ game.storeName }}</v-card-text>
                            <v-card-title class="game-name">{{ game.gameName }}</v-card-title>
                            <v-card-text class="game-price">{{ game.price }}원 부터~</v-card-text>
                            <div class="difficulty-container">
                                <v-row>
                                    <v-col class="stars">
                                        <v-icon v-for="n in 5" :key="n"
                                            :color="n <= getDifficultyLevel(game.difficult) ? 'pink' : 'grey'">
                                            mdi-star
                                        </v-icon>
                                        <span class="difficulty-level"> {{ getDifficultyLevel(game.difficult) }}</span>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: {
        games: {
            type: Array,
            required: true
        }
    },
    methods: {
        moveToDetail(id) {
            this.$router.push("/game/detail/" + id);
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
    position: relative;
}

.hover-card:hover {
    transform: translate(0px, -5px);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px;
}

.game-name {
    font-size: 17px;
}

.game-price {
    color: #919191;
    font-size: 12px;
}

.game-store {
    color: #919191;
    font-size: 12px;
}

.difficulty-level {
    margin-left: 8px;
}

.difficulty-container {
    font-size: 13px;
    padding-left: 11px;
}
</style>

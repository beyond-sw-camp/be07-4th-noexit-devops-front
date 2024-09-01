<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="10">
                <div class="game-detail-container" style="background-color: #1b1b1b; color:#ffffff;">
                    <v-row>
                        <v-col cols="12" md="5">
                            <v-img :src="game.imagePath" alt="Game Image" class="game-image mx-auto"></v-img>
                        </v-col>

                        <v-col cols="12" md="7">
                            <div class="game-info-container">
                                <h4 class="store-name">{{ game.storeName }}</h4>
                                <h2 class="game-name">{{ game.gameName }}</h2>

                                <!-- 별 -->
                                <v-col class="stars">
                                    <template v-for="n in 5" :key="n">
                                        <v-icon v-if="n <= fullStars" color="pink">
                                            mdi-star
                                        </v-icon>
                                        <v-icon v-else-if="n === fullStars + 1 && hasHalfStar" color="pink">
                                            mdi-star-half-full
                                        </v-icon>
                                        <v-icon v-else color="grey">
                                            mdi-star-outline
                                        </v-icon>
                                    </template>
                                    <span class="star-level">{{ averageRating.toFixed(1) }}</span>
                                </v-col>

                                <v-divider class="my-3"></v-divider>

                                <div class="game-details">
                                    <div class="price-container" style="display: flex; ">
                                        <span class="price">{{ game.price }} ~ </span>
                                        <v-icon @click="openPriceModal" color="pink" class="expand-icon"
                                            style="cursor: pointer; top: -8px;">
                                            mdi-chevron-down
                                        </v-icon>
                                    </div>

                                    <v-divider class="my-3"></v-divider>

                                    <br>

                                    <div class="game-info-grid" style="display: flex; justify-content: space-between;">
                                        <div class="info-item" style="text-align: center;">
                                            <v-icon size="32" color="pink">mdi-clock-outline</v-icon>
                                            <div class="info-text" style="margin-top: 5px;">{{ game.runningTime }}분
                                            </div>
                                        </div>

                                        <div class="info-item" style="text-align: center;">
                                            <v-icon size="32" color="pink">mdi-account-group-outline</v-icon>
                                            <div class="info-text" style="margin-top: 5px;"> ~ {{ game.maximunPerson }}명
                                            </div>
                                        </div>

                                        <div class="info-item" style="text-align: center;">
                                            <v-icon size="32" color="pink">mdi-alert-circle-outline</v-icon>
                                            <div class="info-text" style="margin-top: 5px;">{{
                                                getAgeLimitLabel(game.ageLimit) }}</div>
                                        </div>
                                    </div>
                                    <!-- <div></div> -->
                                    <br>
                                    <!-- 난이도 바 -->
                                    <v-progress-linear :value="difficultyLevel"
                                        :color="getDifficultyColor(difficultyLevel)" height="20"
                                        :buffer-value="bufferValue" rounded></v-progress-linear>
                                </div>
                            </div>
                        </v-col>
                    </v-row>

                    <v-row class="mt-4">
                        <v-col cols="12">
                            <v-divider class="my-3"></v-divider>
                            <br>
                            <div class="game-info-title">INFO</div>
                            <p class="game-info">{{ game.gameInfo }}</p>
                        </v-col>
                    </v-row>

                    <!-- 지도 섹션 -->
                    <v-row justify="center" class="mt-4">
                        <v-col cols="12" md="12">
                            <div id="map" style="width:100%; height:400px;"></div>
                        </v-col>
                    </v-row>

                    <!-- 예약 섹션 -->
                    <v-row justify="center" class="mt-5">
                        <v-col cols="12" md="8">
                            <v-card style="background-color: #1b1b1b; color:#ffffff;">
                                <v-card-text>
                                    <v-form @submit.prevent="reservationCreate">
                                        <v-row>
                                            <v-col cols="12" md="6">
                                                <v-text-field label="예약자 이름" v-model="resName"
                                                    :placeholder="resName || '사용자이름'" required color="pink">
                                                </v-text-field>
                                                <v-text-field label="전화번호" v-model="phoneNumber" required
                                                    color="pink" />
                                                <v-text-field label="인원 수" v-model="numberOfPlayers" type="number"
                                                    required color="pink"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-date-picker label="예약 날짜" v-model="resDate" required
                                                    :min="new Date().toISOString().substr(0, 10)"
                                                    style="max-width: 500px;" color="grey" :input-format="'HH:mm'"
                                                    class="custom-date-picker">
                                                </v-date-picker>
                                            </v-col>
                                        </v-row>

                                        <v-row class="mt-4" align="center">
                                            <v-col cols="12">
                                                <div class="time-selector">
                                                    <v-btn v-for="hour in availableHours" :key="hour"
                                                        class="time-button" @click="selectTime(hour)"
                                                        :color="hour === resDateTime ? 'pink' : 'default'" outlined
                                                        small style="width: 70px; height: 70px;">
                                                        {{ formatTime(hour) }}
                                                    </v-btn>
                                                </div>
                                            </v-col>
                                        </v-row>

                                        <v-row class="mt-4">
                                            <v-col cols="12">
                                                <v-btn type="submit" color="pink" block>예약 등록</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- 리뷰 섹션 -->
                    <v-row justify="center" class="mt-4" style="color:#ffffff">
                        <v-col cols="12" md="8">
                            <div class="reviews-summary">
                                <p>
                                    <span style="color: palevioletred;">{{ reviewCount }}</span>개의 리뷰
                                </p>
                            </div>
                            <v-divider class="my-3" style="border: 1px solid #ccc;"></v-divider>
                            <ReviewListComponent :gameId="gameId" />
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>

        <!-- 가격 모달 -->
        <v-dialog v-model="isPriceModalOpen" max-width="350px">
            <v-card class="price-modal-card">
                <v-btn icon @click="isPriceModalOpen = false" class="close-btn">
                    <v-icon small>mdi-close</v-icon>
                </v-btn>
                <v-card-title class="card-title">가격 상세</v-card-title>
                <v-card-text class="card-text">
                    <v-simple-table dense>
                        <tbody>
                            <tr v-for="price in calculatedPrices" :key="price.people">
                                <td class="table-cell">{{ price.people }}인</td>
                                <td class="table-cell">{{ price.totalPrice }}원</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
/* global kakao */
import axios from 'axios';
import ReviewListComponent from '@/components/ReviewListComponent.vue';
import { jwtDecode } from 'jwt-decode';

export default {
    components: {
        ReviewListComponent
    },
    data() {
        return {
            gameId: this.$route.params.id,
            game: {},
            difficultyLevel: 1,
            resName: "",
            phoneNumber: "",
            numberOfPlayers: 1,
            resDate: null,
            resDateTime: "",
            memberId: "",
            availableHours: [],
            reviewCount: 0,
            isPriceModalOpen: false,
            calculatedPrices: [],
            averageRating: 0,
            map: null,
            storeLat: 0,
            storeLng: 0,
        };
    },
    mounted() {
        this.fetchGameDetail();
    },
    computed: {
        fullStars() {
            return Math.floor(this.averageRating);
        },
        hasHalfStar() {
            return this.averageRating - this.fullStars >= 0.5;
        },
        bufferValue() {
            return this.difficultyLevel;
        }
    },
    created() {
        this.fetchUserInfo();
        this.fetchGameDetail();
        this.fetchAvailableHours();
        this.fetchTotalReviews();
    },
    methods: {
        async fetchGameDetail() {
            const gameId = this.$route.params.id;
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/detail/${gameId}`);
                this.game = response.data.result;
                this.difficultyLevel = this.getDifficultyLevel(this.game.difficult);
                this.averageRating = this.game.averageRating || 0;

                this.storeLat = this.game.latitude;
                this.storeLng = this.game.longitude;
                console.log('Store Latitude:', this.storeLat);
                console.log('Store Longitude:', this.storeLng);
                this.initMap();
            } catch (e) {
                console.error(e);
                alert('게임 정보를 불러오는 데 실패했습니다.');
            }
        },
        async fetchUserInfo() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    this.memberId = decodedToken.userId || decodedToken.sub;

                    if (!this.resName) {
                        this.resName = decodedToken.name || '';
                    }
                    if (!this.phoneNumber) {
                        this.phoneNumber = decodedToken.phone || '';
                    }
                } catch (error) {
                    console.error('회원 정보를 가져오는 데 실패했습니다.', error);
                    // 로그인 정보 가져오기 실패 시에도 추가적인 처리를 하고 싶다면 여기서 처리
                }
            } else {
                // 로그인이 되어 있지 않을 때에도 추가적인 처리를 할 수 있습니다.
                console.log('로그인하지 않은 상태입니다.');
                // alert('로그인이 필요합니다.'); // 이 라인을 제거하면 경고를 표시하지 않습니다.
            }
            return true;
        },

        async fetchAvailableHours() {
            const gameId = this.$route.params.id;
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/${gameId}/available-hours`);
                this.availableHours = response.data;
            } catch (e) {
                console.error(e);
            }
        },
        selectTime(hour) {
            this.resDateTime = hour;
        },
        formatTime(time) {
            return time.slice(0, 5);
        },
        async fetchTotalReviews() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/review/game/${this.gameId}`);
                this.reviewCount = response.data.reviewCount;
                this.averageRating = response.data.averageRating;
            } catch (error) {
                console.error("리뷰 개수를 불러오는 데 실패했습니다.", error);
            }
        },
        getStarColor(starNumber) {
            if (starNumber <= this.fullStars || (starNumber === this.fullStars + 1 && this.hasHalfStar)) {
                return 'pink';
            }
            return 'grey';
        },
        openPriceModal() {
            this.calculatePrices();
            this.isPriceModalOpen = true;
        },
        calculatePrices() {
            this.calculatedPrices = [];
            for (let i = 1; i <= this.game.maximunPerson; i++) {
                this.calculatedPrices.push({
                    people: i,
                    totalPrice: this.game.price * i
                });
            }
        },
        getDifficultyLevel(difficulty) {
            const levels = {
                one: 20,
                two: 40,
                three: 60,
                four: 80,
                five: 100
            };
            const levelKey = difficulty?.toLowerCase();
            return levels[levelKey] || 0;
        },
        getDifficultyColor(level) {
            if (level <= 20) return 'pink';
            if (level <= 40) return 'pink';
            if (level <= 60) return 'blue';
            if (level <= 80) return 'pink';
            return 'red';
        },

        getAgeLimitLabel(ageLimit) {
            const labels = {
                adult: "19세 제한",
                student: "전체이용가"
            };
            return labels[ageLimit?.toLowerCase()] || "전체이용가";
        },

        async reservationCreate() {
            await this.fetchUserInfo();

            if (this.numberOfPlayers > this.game.maximunPerson) {
                alert(`최대 인원수(${this.game.maximunPerson}명)보다 입력하신 인원수(${this.numberOfPlayers}명)가 많습니다. 다시 시도해주세요.`);
                return;
            }

            try {
                const selectedDate = new Date(this.resDate);
                const [hours, minutes] = this.resDateTime.split(':').map(Number);

                const resDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
                const resDateTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

                const reservationData = {
                    resName: this.resName,
                    phoneNumber: this.phoneNumber,
                    numberOfPlayers: this.numberOfPlayers,
                    resDate: resDate,
                    resDateTime: resDateTime,
                    gameId: this.gameId,
                };
                console.log(reservationData);

                await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/reservation/create`, reservationData);

                this.$router.push('/reservation/myreservation');
            } catch (e) {
                console.error(e);
                alert("예약 등록에 실패하였습니다.");
            }
        },
        initMap() {
            console.log('지도 초기화 시작');
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VUE_APP_KAKAO_API_KEY}&autoload=false`;

            document.head.appendChild(script);

            script.onload = () => {
                console.log('카카오 지도 스크립트가 로드되었습니다.');
                kakao.maps.load(() => {
                    console.log('카카오 지도 API가 초기화되었습니다.');
                    const container = document.getElementById('map');
                    console.log(document.getElementById('map'));
                    const options = {
                        center: new kakao.maps.LatLng(this.storeLat, this.storeLng),
                        level: 3
                    };
                    this.map = new kakao.maps.Map(container, options);
                    console.log('지도 객체가 생성되었습니다.');

                    const markerPosition = new kakao.maps.LatLng(this.storeLat, this.storeLng);
                    const marker = new kakao.maps.Marker({
                        position: markerPosition
                    });
                    marker.setMap(this.map);
                    console.log('마커가 지도에 추가되었습니다.');
                });
            };
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

h4.store-name {
    font-size: 24px;
    margin-bottom: 10px;
    color: #919191;
}

h2.game-name {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #ffffff;
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

.star-level {
    margin-left: 10px;
    font-size: 16px;
}

.game-details>div {
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
    color: rgb(201, 46, 72);
}

.game-info {
    font-size: 18px;
    line-height: 1.6;
    color: #666;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
}

.time-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.time-button {
    width: 80px;
    height: 80px;
    font-size: 15px;
}

.price-modal-card {
    background-color: #333;
    border: 1px solid #444;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
    color: #fff;
    padding: 16px;
}

.close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #e91e63;
    box-shadow: none;
    background-color: transparent;
    padding: 0;
}

.card-title {
    color: #fff;
    text-align: left;
    font-weight: bold;
    font-size: 20px;
    padding-bottom: 16px;
}

.card-text {
    padding-top: 8px;
    color: #ccc;
}

.table-cell {
    font-size: 20px;
    font-weight: 600;
    padding: 8px 0;
}

.table-cell:first-of-type {
    padding-right: 100px;
    text-align: left;
}

.table-cell:last-of-type {
    text-align: right;
}

.custom-date-picker .v-picker--date,
.custom-date-picker .v-picker__body {
    background-color: #333 !important;
    color: #fff;
}

.custom-date-picker .v-picker__body .v-btn {
    background-color: #444 !important;
}

.custom-date-picker .v-picker__body .v-btn:hover {
    background-color: #555 !important;
}

.custom-date-picker .v-picker__body .v-picker__day.v-picker__day--selected {
    background-color: #e91e63 !important;
}
/* #map{
    width: 100%;
    height: 400px;
} */

</style>

<template>
  <v-container class="pa-4 d-flex justify-center">
    <v-row class="d-flex justify-center" style="max-width: 1500px;">
      


      <!-- 검색 -->
      <v-col>
        <v-form >
            <v-row>
                <v-col cols="auto">
                    <v-select item-title="text" item-value="value">

                    </v-select>
                </v-col>
                <v-col>
                    <v-text-field label="Search">

                    </v-text-field>
                </v-col>
                <v-col cols="auto"><v-btn height="55" type="submit" color="pink">검색</v-btn></v-col>
            </v-row>
        </v-form>
    </v-col >

    
    
      <!-- --------------- -->
      <v-card class="pa-4" outlined rounded="lg" style="width: 98%; max-width: 1500px; background-color: #f5f5f5;">
        <div>
          <!-- 제목 입력 -->
          <v-text-field
            :rules="rules"
            hide-details="auto"
            label="제목"
            outlined
            class="mb-4"   
          ></v-text-field>
      
          <!-- 내용 입력 -->
          <v-textarea
            label="내용"
            outlined
            rows="4"
            class="mb-4"
          ></v-textarea>
      
          <!-- 날짜 및 마감 시한 선택 -->
          <v-card flat class="pa-4" style="background-color: #f5f5f5;">
            <v-row>
              <v-col cols="6">
                <v-form>
                  <label for="date">날짜 선택<br></label>
                  <input 
                    type="date" 
                    id="date" 
                    v-model="date"
                    class="mt-2"
                    style="width: 100%; max-width: 300px; padding: 8px; border-radius: 4px; border: 1px solid #ccc;"
                  />
                </v-form>
              </v-col>
              
              <v-col cols="6">
                <v-form>
                  <label for="time">마감 시한<br></label>
                  <input 
                    type="time" 
                    id="time" 
                    v-model="time"
                    class="mt-2"
                    style="width: 100%; max-width: 300px; padding: 8px; border-radius: 4px; border: 1px solid #ccc;"
                  />
                </v-form>
              </v-col>
            </v-row>
          </v-card>  
          <!-- 작성 완료 버튼 -->
          <div class="d-flex justify-center">
            <v-btn width="150" height="50" color="pink">SUBMIT</v-btn>
          </div>
        </div>
      </v-card>
      
      <br>
      <v-divider :thickness="3" color="gray"></v-divider>
<!-- ----------------------------- -->
      <v-col cols="12" v-for="f in findBoardList" :key="f.id" class="d-flex justify-center">
        <v-card 
          variant="outlined" 
          class="pa-4 d-flex align-center" 
          outlined 
          style="width: 100%; max-width: 1500px;"
          rounded="lg"
        >
          <v-col cols="2">
            <v-img 
              :src="f.imagePath"
              alt="프로필 이미지"
              contain
              width="200"
              height="200"
              class="rounded-circle"
            ></v-img>
          </v-col>
          <v-col>
            <div class="d-flex justify-space-between align-center">
              <div>
                <br>
                <div style="font-size: 30px;" ><strong>{{f.title}}</strong></div>
                <br>
                <div class="text-left" style="font-size: 18px;">{{f.contents}}</div>
                <br>

              </div>
              <div class="ml-auto text-right">
                <div
                class="text-right" 
                style="position: absolute; top: 15px; right: 26px; font-size: 18px;" 
                >글쓴이 : {{f.writer}}</div>
                <div><strong>마감 시각: {{f.expirationTime}}</strong></div>
                <v-btn width="180" height="50" color="pink" class="mt-2">particpate</v-btn>
              </div>
            </div>
            <div class="text-right mt-2">모집 인원 : {{f.totalCapacity}}</div>
            <div class="text-right mt-2">현재 인원 : {{f.currentCount}}</div>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <div v-if="loading" class="text-center my-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      date: '',
      time: '',
      findBoardList: [],
      loading: true
    };
  },
  mounted() {
    // 현재 날짜와 시간 설정
    const now = new Date();
    this.date = now.toISOString().substr(0, 10); // YYYY-MM-DD 형식
    this.time = now.toTimeString().substr(0, 5); // HH:MM 형식
  },
  created(){
    this.loadFindBoard();
  },
  methods: {

    async loadFindBoard() {
      
      this.loading = true;
      
      try {
      
        const response = await axios.get(`http://localhost:8080/findboard/list`);
        this.findBoardList = response.data.result.content;
      
      } catch (error) {
      
        console.error('Error loading findBoardList:', error);
      
      } finally {
      
        this.loading = false;
      
      }
      
    },
    async postWrite(){

    }

  }
};
</script>

<style>
@import url('https://webfontworld.github.io/gmarket/GmarketSans.css');

body, .v-card, .v-btn, .v-avatar, .v-icon {
  font-family: 'GmarketSansMedium', sans-serif;
  font-weight: 1000;
}

.v-avatar {
  background-color: #e2e2f7;
  padding: 8px;
  border-radius: 50%;
}

.v-card {
  margin-bottom: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

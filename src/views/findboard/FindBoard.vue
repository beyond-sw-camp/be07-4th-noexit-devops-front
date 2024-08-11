<template>
  <v-container class="pa-4 d-flex justify-center">
    <v-row class="d-flex justify-center" style="max-width: 1500px;">
      
      <!-- 반복되는 카드 디자인 -->
      <v-col cols="12" v-for="f in findBoardList" :key="f.id" class="d-flex justify-center">
        <v-card variant="outlined" class="pa-4 d-flex align-center" outlined style="width: 100%; max-width: 1500px;">
          <!-- 왼쪽 프로필 아이콘 -->
          
          <!-- <v-avatar size="100" class="mr-4">
            <v-icon :src="p.imagePath" large color="gray">아바타</v-icon>
          </v-avatar> -->
          <!-- 오른쪽 글 내용 -->
          <v-col>
            
            <div class="d-flex justify-space-between align-center">
              <div>
                <div>작성자 : {{f.writer}}</div>
                <div>제목 : {{f.title}}</div>
                <div>제목 : {{f.contents}}</div>
              </div>
              <div class="ml-auto text-right">
                <div><strong>마감 시각: {{f.expirationTime}}</strong></div>
                <v-btn color="primary" class="mt-2">참가 신청 버튼</v-btn>
              </div>
            </div>
            <div class="text-right mt-2">{{f.currentCount}}인원</div>
          </v-col>
        
        </v-card>
      
      </v-col>
    </v-row>
    
    <!-- 로딩 인디케이터 (데이터가 로딩 중일 때 표시) -->
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
          findBoardList: [],
          loading: true // 로딩 상태 추가
        };
      },
      created(){
        this.loadFindBoard();
      },
      methods: {

        async loadFindBoard() {
          this.loading = true; // 로딩 시작
          try {
            const response = await axios.get(`http://localhost:8080/findboard/list`);
            this.findBoardList = response.data.result.content;
          } catch (error) {
            console.error('Error loading findBoardList:', error);
          } finally {
            this.loading = false; // 로딩 종료
          }
          
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

<template>
  <v-sheet 
   class="mx-auto custom-sheet"
   elevation="8" 
   max-width="2000"
   :style="{ boxShadow: '0px 8px 24px rgba(247, 4, 4, 1.3)' }"
   >
   
   <v-slide-group 
      v-model="model" 
      class="pa-4 custom-slide-group" 
      selected-class="selected-pink" 
      show-arrows>
      
      <v-slide-group-item
        v-for="board in imminentBoards"
        :key="board.id"
        v-slot="{toggle, selectedClass }"
        
      >
        <v-card
          :class="['ma-4', selectedClass, 'custom-card']"
          outlined
          height="auto"
          width="400"
          elevation="24"
          @click="toggle"
          :style="{ backgroundColor: '#1b1b1b', color: 'white' }"
        >
          <v-row no-gutters>

            <v-col cols="3">
              <v-avatar
                style="width: 80px; height: 80px; margin-top: 50px; margin-left: 20px"
              >
                <img 
                 :src="board.imagePath"
                  alt="프로필 이미지" 
                  class="profile-image"
                  style="width: 100%; height: 100%; object-fit: cover;" 
                />
              </v-avatar>
            </v-col>

            <v-col>
              <div class="pa-4 custom-text">
                <h4>{{ board.title }}</h4>
                <p>{{ board.contents }}</p>
                <p style="text-align: right;">
                  {{ board.currentCount }} / {{ board.totalCapacity }}
                </p>
                

              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      model: 0, // 슬라이드 그룹 선택된 항목
      imminentBoards: [], // 마감 임박 게시글 리스트
    };
  },
  created() {
    this.fetchImminentBoards();
  },
  methods: {
    async fetchImminentBoards() {
      try {
        const response = await axios.get('http://localhost:8080/findboard/imminent-closing');
        this.imminentBoards = response.data.result; // 서버에서 가져온 게시글 리스트
      } catch (error) {
        console.error('마감 임박 게시글을 가져오는 중 오류 발생:', error);
      }
    },
  },
};
</script>

<style>
.custom-sheet {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3) !important;
}

.custom-slide-group {
  background-color: #1b1b1b;
}

.custom-card {
  /* 배경색과 텍스트 색상을 기본으로 설정 */
  background-color: #1b1b1b;
  color: white;
}

.custom-text {
  color: white;
}

.selected-pink {
  /* 선택된 항목의 스타일을 설정할 수 있습니다 */
}

.v-slide-group__prev .v-icon,
.v-slide-group__next .v-icon {
  color: white;
}
</style>

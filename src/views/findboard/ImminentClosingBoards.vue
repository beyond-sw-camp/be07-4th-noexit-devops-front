<template>
  <v-sheet 
   class="mx-auto"
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
          color="black"
          outlined
          height="auto"
          width="400"
          elevation="24"
          @click="toggle"
        >
          <v-row no-gutters>
            <v-col cols="4">
              <v-img
                :src="board.imagePath"
                alt="게시글 이미지"
                contain
                height="200"
                class="rounded-circle"
              ></v-img>
            </v-col>
            <v-col>
              <div class="pa-4 custom-text">
                <h3>{{ board.title }}</h3>
                <p>{{ board.contents }}</p>
                <p>모집 인원: {{ board.totalCapacity }}</p>
                <p>현재 인원: {{ board.currentCount }}</p>
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
  box-shadow: 0px 8px 24px rgba(247, 4, 4, 1.3) !important;
}

.custom-slide-group {
  background-color: black;
}

.custom-card {
  background-color: black;
  color: white;
}

.custom-text {
  color: white;
}

.selected-pink {
  
}

.v-slide-group__prev .v-icon,
.v-slide-group__next .v-icon {
  color: white;
}
</style>

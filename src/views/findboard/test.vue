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
          <div style="font-size: 30px;"><strong>{{ f.title }}</strong></div>
          <br>
          <div class="text-left" style="font-size: 18px;">{{ f.contents }}</div>
          <br>
        </div>
        <div class="ml-auto text-right">
          <div class="text-right" style="position: absolute; top: 15px; right: 26px; font-size: 18px;">
            글쓴이 : {{ f.writer }}
          </div>
          <div><strong>작성일: {{ f.createdTime.substring(0, 10) }}</strong></div>
          <div><strong>마감 시각: {{ f.expirationTime.substring(0, 10) }}</strong></div>
          <v-btn width="180" height="50" color="pink" class="mt-2">참여</v-btn>
        </div>
      </div>
      <div class="text-right mt-2">모집 인원 : {{ f.totalCapacity }}</div>
      <div class="text-right mt-2">현재 인원 : {{ f.currentCount }}</div>
      <v-btn @click="deleteFB(f.id)">삭제하기</v-btn>
      <v-btn @click="openUpdateModal(f)">수정하기</v-btn>
    </v-col>
  </v-card>
</v-col>

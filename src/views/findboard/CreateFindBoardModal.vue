<template>
  <v-dialog v-model="localIsOpen" max-width="1100px">
    <v-card class="black white--text" style="border: 2px solid white; font-family: 'GmarketSansMedium', sans-serif;">
      <v-toolbar color="pink" dark flat>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title class="text-h6 font-weight-regular">
          작성하기
        </v-card-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text>
        <v-form ref="createForm" @submit.prevent="registerFindBoard">
          <!-- 제목 대신 가게 선택 버튼 추가 -->
          <v-btn
            color="pink"
            outlined
            block
            @click="openStoreSelectModal"
            class="mb-4"
          >
            {{ selectedStoreName || '가게 선택하기' }}
          </v-btn>

          <v-textarea
            v-model="contents"
            :rules="[(v) => !!v || '내용을 입력하세요.']"
            label="내용"
            outlined
            rows="4"
            class="mb-4"
            required
          ></v-textarea>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="date"
                label="날짜 선택"
                type="date"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="time"
                label="마감 시한"
                type="time"
                outlined
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-select
            v-model="totalCapacity"
            :rules="[(v) => !!v || '희망 인원을 선택하세요.']"
            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            label="희망 인원"
            outlined
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="pink"
          @click="registerFindBoard"
          :disabled="!selectedStoreName || !contents || !totalCapacity || !time || !date"
        >작성하기
      </v-btn>
      </v-card-actions>
    </v-card>

    <!-- 가게 선택 모달 -->
    <v-dialog v-model="isStoreModalOpen" max-width="600px">
      <v-card>
        <v-card-title class="headline">가게 선택</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="store in stores"
              :key="store.id"
              @click="selectStore(store.storeName)"
            >
              <v-list-item-content>{{ store.storeName }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="pink" text @click="closeStoreSelectModal">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      localIsOpen: this.isOpen,
      contents: "",
      date: "",
      time: "",
      totalCapacity: "",
      selectedStoreName: "", // 선택된 가게 이름 저장
      stores: [], // 서버에서 불러온 가게 목록
      isStoreModalOpen: false, // 가게 선택 모달의 열림 상태
    };
  },
  watch: {
    isOpen(newVal) {
      this.localIsOpen = newVal;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async registerFindBoard() {
      if (this.$refs.createForm.validate()) {
        try {
          let expirationDateTime = new Date(`${this.date}T${this.time}`);
          expirationDateTime.setHours(expirationDateTime.getHours() + 9);
          expirationDateTime = expirationDateTime.toISOString();
          
          const requestData = {
            title: this.selectedStoreName, // 프론트에서는 가게 이름이지만 서버는 title이므로 수정 안하겟음.
            contents: this.contents,
            expirationTime: expirationDateTime,
            totalCapacity: this.totalCapacity,
          };

          await axios.post(`http://localhost:8080/findboard/create`, requestData);

          alert("작성 완료");
          this.closeModal();
          window.location.reload();
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("작성 실패");
        }
      } else {
        alert("모든 필드를 올바르게 작성해 주세요.");
      }
    },
    async fetchStores() {
      try {
        const response = await axios.get('http://localhost:8080/store/list');
        this.stores = response.data.result;
      } catch (error) {
        console.error("Error fetching stores:", error);
        alert("가게 목록을 불러오는데 실패했습니다.");
      }
    },
    openStoreSelectModal() {
      this.isStoreModalOpen = true;
      this.fetchStores();
    },
    closeStoreSelectModal() {
      this.isStoreModalOpen = false;
    },
    selectStore(storeName) {
      this.selectedStoreName = storeName;
      this.closeStoreSelectModal();
    },
  },
  mounted() {
    const now = new Date();
    this.date = now.toLocaleDateString("en-CA");
    this.time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  },
};
</script>

<style scoped>
@import url("https://webfontworld.github.io/gmarket/GmarketSans.css");

.v-card {
  font-family: 'GmarketSansMedium', sans-serif;
  font-weight: 1000;
}
</style>

<template>
  <v-dialog v-model="localIsOpen" max-width="800px" persistent>
    <v-card
      class="black white--text"
      style="
        background-color: black;
        color: white;
        border: 2px solid white;
        font-family: 'GmarketSansMedium', sans-serif;
      "
    >
      <v-toolbar color="pink" dark flat>
        <v-btn icon @click="closeModal" style="background-color: transparent;">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title class="text-h6 font-weight-regular">
          작성하기
        </v-card-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text>
        <v-form ref="createForm" @submit.prevent="registerFindBoard">
          <v-text-field
          v-model="selectedStoreName"
          label="매장 선택"
          placeholder="매장 선택하기"
          outlined
          readonly
          @click="openStoreSelectModal"
          class="mb-4"
        ></v-text-field>

          <v-text-field
          v-model="title"
          placeholder="제목"
          outlined
          rows="4"
          class="mb-4"
          required
          >

          </v-text-field>

          <v-textarea
            v-model="contents"
            :rules="[(v) => !!v || '내용을 입력하세요.']"
            placeholder="내용"
            outlined
            rows="4"
            
            style="background-color: black; color: white"
            required
          ></v-textarea>

          <v-row>
            <v-col cols="6">
<v-text-field
  v-model="date"
  label="날짜"
  type="date"
  outlined
  prepend-inner-icon="mdi-calendar"
  class="custom-date-icon"
  style="background-color: black; color: white; caret-color: white;"
  required
></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="time"
                label="마감 시간"
                type="time"
                outlined
                class="custom-time-icon"
                style="background-color: black; color: white"
                prepend-inner-icon="mdi-clock-outline"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-select
            v-model="totalCapacity"
            :rules="[(v) => !!v || '희망 인원 선택']"
            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            label="희망 인원"
            outlined
            style="background-color: black; color: white"
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions
      style="font-weight: bold; 
      padding-bottom: 40px; 
      padding-right: 30px; 
      color: white; 
      font-size: 20px;
      justify-content: center;
      "
      
    >
    <v-btn 
    color="white"
    @click="registerFindBoard"
    :disabled="
      !selectedStoreName || !contents || !totalCapacity || !time || !date
    "
    style="font-size: 20px; color: white;"
  >
    제출
  </v-btn>
    </v-card-actions>
    </v-card>

    <!-- 가게 선택 모달 -->
    <v-dialog v-model="isStoreModalOpen" max-width="400px" persistent>
      <v-card style="background-color: black; color: white">
        <v-card-title class="headline" style="text-align: center">
          STORE
        </v-card-title>
        <v-card-text style="max-height: 400px; overflow-y: auto">
          <v-list style="background-color: black; color: white">
            <v-list-item
              v-for="store in stores"
              :key="store.id"
              @click="selectStore(store.storeName)"
              style="background-color: black; color: white"
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
import axios from "axios";

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
      title: "",
      stores: [], // 서버에서 불러온 가게 목록
    
      isStoreModalOpen: false, // 가게 선택 모달의 열림 상태
    
    };
  },
  watch: {
    isOpen(newVal) {
      this.localIsOpen = newVal;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async registerFindBoard() {
      if (this.$refs.createForm.validate()) {
        try {
          let expirationDateTime = new Date(`${this.date}T${this.time}`);
          expirationDateTime.setHours(expirationDateTime.getHours() + 9);
          expirationDateTime = expirationDateTime.toISOString();

          const requestData = {
            title: this.title, // 프론트에서는 가게 이름이지만 서버는 title이므로 수정 안하겟음.
            selectedStoreName:this.selectedStoreName,
            contents: this.contents,
            expirationTime: expirationDateTime,
            totalCapacity: this.totalCapacity,
          };

          await axios.post(
            `http://localhost:8080/findboard/create`,
            requestData
          );

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
        const response = await axios.get("http://localhost:8080/store/list");
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
  font-family: "GmarketSansMedium", sans-serif;
  font-weight: 1000;
}
.custom-time-icon .v-icon,
.custom-date-icon .v-icon {
  color: white !important; /* 아이콘을 흰색으로 설정 */
}
</style>

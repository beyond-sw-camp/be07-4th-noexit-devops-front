<template>
  <v-container class="pa-4 d-flex justify-center">
    <v-row class="d-flex justify-center" style="max-width: 1500px">
      <!-- ... 기존 코드 ... -->

      <v-col
        cols="12"
        v-for="f in findBoardList"
        :key="f.id"
        class="d-flex justify-center"
      >
        <v-card
          variant="outlined"
          class="pa-4 d-flex align-center"
          outlined
          style="width: 100%; max-width: 1500px"
          rounded="lg"
        >
          <!-- 기존 게시글 렌더링 ... -->

          <v-btn @click="openUpdateModal(f)">수정하기</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center my-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <!-- Update Modal -->
    <v-dialog v-model="isUpdateModalOpen" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">게시글 수정하기</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateForm" @submit.prevent="updateFindBoard">
            <v-text-field
              v-model="updateTitle"
              :rules="[(v) => !!v || '제목을 입력하세요.']"
              hide-details="auto"
              label="제목"
              outlined
              class="mb-4"
              required
            ></v-text-field>
            <v-textarea
              v-model="updateContents"
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
                  v-model="updateDate"
                  label="날짜 선택"
                  type="date"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="updateTime"
                  label="마감 시한"
                  type="time"
                  outlined
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-select
              v-model="updateTotalCapacity"
              :rules="[(v) => !!v || '희망 인원을 선택하세요.']"
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              label="희망 인원"
              outlined
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeUpdateModal">취소</v-btn>
          <v-btn color="pink" @click="updateFindBoard">수정하기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      // 기존 데이터
      searchType: "optional",
      searchOptions: [
        { text: "선택", value: "optional" },
        { text: "제목", value: "title" },
        { text: "내용", value: "contents" },
      ],
      searchValue: "",
      title: "",
      contents: "",
      date: "",
      time: "",
      totalCapacity: "",
      findBoardList: [],
      loading: true,
      searchBy: "",
      searchTerm: "",

      // Update Modal 관련 데이터
      isUpdateModalOpen: false,
      updateId: null,
      updateTitle: "",
      updateContents: "",
      updateDate: "",
      updateTime: "",
      updateTotalCapacity: "",
    };
  },
  mounted() {
    const now = new Date();
    this.date = now.toISOString().substr(0, 10);
    this.time = now.toTimeString().substr(0, 5);
  },
  created() {
    this.loadFindBoard();
  },
  methods: {
    // 게시글 목록 로드
    async loadFindBoard() {
      this.loading = true;
      try {
        const response = await axios.get(
          `http://localhost:8080/findboard/list`
        );
        this.findBoardList = response.data.result.content;
      } catch (error) {
        console.error("Error loading findBoardList:", error);
      } finally {
        this.loading = false;
      }
    },

    // Update Modal 열기
    openUpdateModal(findBoard) {
      this.updateId = findBoard.id;
      this.updateTitle = findBoard.title;
      this.updateContents = findBoard.contents;
      this.updateDate = findBoard.createdTime.substr(0, 10);
      this.updateTime = findBoard.createdTime.substr(11, 5);
      this.updateTotalCapacity = findBoard.totalCapacity;
      this.isUpdateModalOpen = true;
    },

    // Update Modal 닫기
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },

    // 게시글 수정
    async updateFindBoard() {
      try {
        const expirationDateTime = new Date(
          `${this.updateDate}T${this.updateTime}:00`
        ).toISOString();

        const requestData = {
          title: this.updateTitle,
          contents: this.updateContents,
          expirationTime: expirationDateTime,
          totalCapacity: this.updateTotalCapacity,
        };

        const response = await axios.put(
          `http://localhost:8080/findboard/update/${this.updateId}`,
          requestData
        );
        console.log("업데이트 완료:", response.data);
        alert("업데이트 완료");
        this.closeUpdateModal();
        this.loadFindBoard(); // 목록 새로 고침
      } catch (error) {
        console.error("업데이트 실패:", error);
      }
    },
  },
};
</script>

<style>
@import url("https://webfontworld.github.io/gmarket/GmarketSans.css");

body,
.v-card,
.v-btn,
.v-avatar,
.v-icon {
  font-family: "GmarketSansMedium", sans-serif;
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

<template>
  <v-container class="pa-4 d-flex justify-center">
    <v-row
      :style="{ color: 'white' }"
      class="d-flex justify-center"
      style="max-width: 2000px"
    >
      <v-col>
        <v-form @submit.prevent="loadFindBoard">
          <v-row>
            <v-col cols="auto">
              <v-select
                v-model="searchType"
                :items="searchOptions"
                item-title="text"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="searchValue"
                label="Search"
                :rules="[required]"
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-col cols="auto">
                <v-row>
                  <v-btn height="55" type="submit" color="pink">검색</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    height="55"
                    color="pink"
                    style="margin-left: 13px"
                    @click="openCreateModal"
                    v-if="userRole == 'USER' && isLogin"
                    >작성하기</v-btn
                  >
                </v-row>

                <CreateFindBoardModal
                  :isOpen="isCreateModalOpen"
                  @close="closeCreateModal"
                />
              </v-col>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <br />
      <!-- 여기부터 글 시작 -->
      <v-divider :thickness="3" color="gray"></v-divider>

      <v-row justify="center">
        <v-col
          cols="6"
          v-for="f in findBoardList"
          :key="f.id"
          class="d-flex justify-center"
        >
          <v-card
            :style="{ color: 'white' }"
            :class="{
              'expired-card':
                getTimeDifferenceInMinutes(f.expirationTime) === '마감됨',
            }"
            variant="outlined"
            class="pa-4 d-flex align-center"
            outlined
            style="width: 100%; max-width: 2000px"
            rounded="lg"
          >
            <v-col cols="4">
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
                  <br />
                  <div style="font-size: 30px">
                    <strong>{{ f.title }}</strong>
                  </div>
                  <br />
                  <div class="text-left" style="font-size: 18px">
                    {{ f.contents }}
                  </div>
                  <br />
                </div>

                <div class="ml-auto text-right">
                  <div>
                    <strong
                      >작성 시각: {{ formatDateTime(f.createdTime) }}</strong
                    >
                  </div>
                  <div
                    class="text-right"
                    style="
                      position: absolute;
                      top: 15px;
                      right: 26px;
                      font-size: 18px;
                    "
                  >
                    작성자 : {{ f.writer }}
                  </div>
                  <br />
                  <v-btn
                    width="180"
                    height="50"
                    color="pink"
                    class="mt-2"
                    :disabled="
                      getTimeDifferenceInMinutes(f.expirationTime) <= 0
                    "
                    @click="participateInFindBoard(f.id)"
                    >PARTICIPATE</v-btn
                  >
                </div>
              </div>
              <div class="text-right mt-2">
                모집 인원 : {{ f.totalCapacity }}
              </div>
              <div class="text-right mt-2">
                현재 인원 : {{ f.currentCount }}
              </div>
              <br />
              <div
                v-if="getTimeDifferenceInMinutes(f.expirationTime) !== '마감됨'"
                style="text-align: right"
              >
                <strong
                  >마감 시각:
                  {{ getTimeDifferenceInMinutes(f.expirationTime) }}</strong
                >
              </div>
              <div v-else style="text-align: right">
                <em>FINISH</em>
              </div>

              <div v-if="f.isAuthor">
                <v-btn @click="deleteFB(f.id)">삭제하기</v-btn>
                <v-btn style="margin-left: 11px" @click="openUpdateModal(f)">수정하기</v-btn>
                <UpdateFindBoardModal
                  :isOpen="isUpdateModalOpen"
                  :findBoard="selectedFindBoard"
                  @close="closeUpdateModal"
                  @updated="loadFindBoard"
                />
                <!-- Update모달 -->
              </div>
            </v-col>
          </v-card>
        </v-col>

        <!-- 페이징 -->
        <div class="pagination-controls text-center">
          <span
            class="pagination-arrow"
            @click="prevPageRange"
            :class="{ disabled: currentPageRangeStart <= 1 }"
          >
            <v-icon small>{{
              currentPageRangeStart <= 1 ? "mdi-menu-left" : "mdi-chevron-left"
            }}</v-icon>
          </span>

          <span
            v-for="page in visiblePages"
            :key="page"
            @click="setPage(page)"
            :class="{ 'active-page': currentPage === page }"
            class="pagination-page"
          >
            {{ page }}
          </span>

          <span
            class="pagination-arrow"
            @click="nextPageRange"
            :class="{ disabled: currentPageRangeEnd >= totalPages }"
          >
            <v-icon small>{{
              currentPageRangeEnd >= totalPages
                ? "mdi-menu-right"
                : "mdi-chevron-right"
            }}</v-icon>
          </span>
        </div>
      </v-row>
    </v-row>

    <div v-if="loading" class="text-center my-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import CreateFindBoardModal from "./CreateFindBoardModal.vue";
import UpdateFindBoardModal from "./UpdateFindBoardModal.vue"; // Update 모달 컴포넌트 추가

export default {
  components: {
    CreateFindBoardModal,
    UpdateFindBoardModal, // Update 모달 컴포넌트 등록
  },
  data() {
    return {
      searchValue: "",
      searchType: "optional",
      searchOptions: [
        { text: "선택", value: "optional" },
        { text: "제목", value: "title" },
        { text: "내용", value: "contents" },
      ],

      isCreateModalOpen: false,
      isUpdateModalOpen: false,
      selectedFindBoard: null,
      loading: true,

      findBoardList: [],

      pageSize: 6,
      currentPage: 1,
      totalPages: 1,
      currentPageRangeStart: 1,
      currentPageRangeEnd: 5,
      pagesPerRange: 5,
    };
  },
  mounted() {
    const userRole = localStorage.getItem("role");
    if (userRole === "USER") {
      this.isUser = true;
    }
  },
  computed: {
    visiblePages() {
      const pages = [];
      for (
        let i = this.currentPageRangeStart;
        i <= this.currentPageRangeEnd;
        i++
      ) {
        if (i <= this.totalPages) pages.push(i);
      }
      return pages;
    },
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      this.isLogin = true;
      this.userRole = localStorage.getItem("role");
    }

    this.loadFindBoard();
    this.checkAuthor();
  },
  methods: {
    openCreateModal() {
      this.isCreateModalOpen = true;
    },
    closeCreateModal() {
      this.isCreateModalOpen = false;
    },
    openUpdateModal(findBoard) {
      this.selectedFindBoard = findBoard;
      this.isUpdateModalOpen = true;
    },
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },
    async checkAuthor() {
      try {
        const myInfo = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`
        );
        const findboardInfo = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/findboard/list`
        );

        const myNickname = myInfo.data.result.nickname;
        this.findBoardList = findboardInfo.data.result.content.map((item) => {
          return {
            ...item,
            isAuthor: item.writer === myNickname,
          };
        });
      } catch (e) {
        console.log(e);
      }
    },
    getTimeDifferenceInMinutes(expirationTime) {
      
      const now = new Date();
      const expiration = new Date(expirationTime);
      const differenceInMs = expiration - now; // 차이를 밀리초 단위로 계산
      const differenceInMinutes = Math.floor(differenceInMs / 1000 / 60); // 분 단위로 변환
      
      if (differenceInMinutes > 30) {
        // 30분 이상 남았으면 날짜만 반환
        return expirationTime.substring(0, 10); // YYYY-MM-DD 형식 반환
      } else if (differenceInMinutes > 0) {
        // 30분 이하로 남았으면 남은 시간 표시
        return `${differenceInMinutes}분 남음`;
      } else {
        // 시간이 이미 지난 경우
        return "마감됨";
      }
    },
    async searchFindBoard() {
      this.findBoardList = [];
      await this.loadFindBoard();
    },
    async loadFindBoard() {
      this.loading = true;
      try {
        let params = {
          size: this.pageSize,
          page: this.currentPage - 1,
          searchType: this.searchType,
          searchValue: this.searchValue,
        };

        const response = await axios.get(`http://localhost:8080/findboard/list`,{ params });

        this.findBoardList = response.data.result.content.map((item) => {
          return {
            ...item,
            formattedExpirationTime: this.formatDateTime(item.expirationTime),
          };
        });

        this.totalPages = Math.ceil(
          response.data.result.totalElements / this.pageSize
        );
      } catch (error) {
        console.error("Error loading findBoardList:", error);
      } finally {
        this.loading = false;
      }
    },
    formatDateTime(isoString) {
      const date = new Date(isoString);
      const formattedDate = `${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일`;
      const formattedTime = `${date
        .getHours()
        .toString()
        .padStart(2, "0")}시 ${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}분`;
      return `${formattedDate} ${formattedTime}`;
    },
    async deleteFB(fbId) {
      try {
        const response = await axios.put(
          `http://localhost:8080/findboard/delete/${fbId}`
        );
        console.log("삭제 완료:", response.data);
        alert("삭제 완료");
        window.location.reload();
        this.findBoardList = this.findBoardList.filter((fb) => fb.id !== fbId);
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    },
    async participateInFindBoard(id) {
      try {
        const response = await axios.put(
          `http://localhost:8080/findboard/participate/${id}`
        );

        if (response.data.status_code === 200) {
          alert("참여 완료");
          this.loadFindBoard(); // 업데이트된 데이터를 다시 로드
        } else {
          alert("새로고침 후 다시 시도해주세요");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert("자신의 글에는 참가 신청을 할 수 없습니다.");
        } else if (error.response && error.response.status === 404) {
          alert("게시글이 존재하지 않거나 삭제된 게시글입니다.");
        } else {
          console.error("참가 요청 실패:", error);
          alert("참가 요청에 실패했습니다.");
        }
      }
    },
    setPage(page) {
      this.currentPage = page;
      this.loadFindBoard();
    },
    prevPageRange() {
      if (this.currentPageRangeStart > 1) {
        this.currentPageRangeStart = Math.max(
          1,
          this.currentPageRangeStart - this.pagesPerRange
        );
        this.currentPageRangeEnd = Math.min(
          this.totalPages,
          this.currentPageRangeStart + this.pagesPerRange - 1
        );
        this.setPage(this.currentPageRangeStart);
      }
    },
    nextPageRange() {
      if (this.currentPageRangeEnd < this.totalPages) {
        this.currentPageRangeStart = Math.min(
          this.totalPages - this.pagesPerRange + 1,
          this.currentPageRangeStart + this.pagesPerRange
        );
        this.currentPageRangeEnd = Math.min(
          this.totalPages,
          this.currentPageRangeStart + this.pagesPerRange - 1
        );
        this.setPage(this.currentPageRangeStart);
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

/* 시간 마감 시 변경되는 색상 */
.expired-card {
  background-color: #dbaaaa; /* 연한 빨간색 배경 */
  color: #d9979d; /* 진한 빨간색 텍스트 */
}

.pagination-controls {
  text-align: center;
  display: inline-flex;
  align-items: center;
}

.pagination-arrow {
  cursor: pointer;
  margin: 0 10px;
}

.pagination-page {
  cursor: pointer;
  margin: 0 5px;
  padding: 5px 10px;
  border-radius: 20%;
  background-color: #868383;
  color: #f6f6f6;
  transition: background-color 0.3s, color 0.3s;
}

.pagination-page.active-page {
  background-color: rgb(223, 139, 139);
  color: rgb(254, 254, 254);
}

.pagination-arrow.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-arrow v-icon {
  font-size: 20px;
  vertical-align: middle;
}
</style>

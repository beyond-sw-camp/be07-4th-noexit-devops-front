<template>
  <v-container class="justify-center">
    <v-row
      :style="{ color: 'white' }"
      class="d-flex justify-center"
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
                dense
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="searchValue"
                label="Search"
                :rules="[required]"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-col cols="auto">
                <v-row>
                  <v-btn
                    height="45"
                    type="submit"
                    color="pink"
                    @click="onSearchButtonClick"
                    >검색</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn
                    height="45"
                    color="pink"
                    style="margin-left: 8px"
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

      <!-- 마감 임박 게시글 섹션 -->
      <v-col cols="12">
        <h1
          :style="{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 'bold',
          }"
        >
          마감 임박 With ME!
        </h1>
        <ImminentClosingBoards />
      </v-col>

      <br />

      <!-- 검색 결과가 없는 경우 -->
      <v-row v-if="findBoardList.length === 0">
        <v-col>
          <p>검색 결과가 없습니다.</p>
        </v-col>
      </v-row>

      <!-- 게시글 리스트 -->
      <v-row justify="center" v-else>
        <v-col
          cols="12"
          md="6"
          v-for="f in findBoardList"
          :key="f.id"
          class="d-flex justify-center"
        >
          <v-card
            :style="{
              color: 'white',
              backgroundColor: '#1b1b1b',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              marginTop: '10px',
              padding: '10px',
              height: '350px',
              width: '100%',
            }"
            :class="{
              'expired-card':
                getTimeDifferenceInMinutes(f.expirationTime) === '마감됨',
            }"
            variant="outlined"
            class="pa-2 d-flex align-center"
            outlined
            rounded="lg"
          >
            <v-col
              cols="3"
              class="d-flex flex-column align-center justify-center"
            >
              <!-- 작성자 이름 -->

              <!-- 아바타 -->
              <v-avatar size="100">
                <img
                  :src="f.imagePath"
                  alt="프로필 이미지"
                  class="profile-image"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
              </v-avatar>

              <v-row
                class="d-flex flex-column align-start"
                style="margin-top: 16px"
              >
                <!-- margin-top으로 적절한 여백만 주고, 겹침 방지 -->
                <div>
                  <span class="writer-text">
                    {{ f.writer }}
                  </span>
                </div>
              </v-row>



            </v-col>

            <v-col cols="7" style="margin-top: 0px; text-align: center">
              <v-row class="d-flex justify-center">
                <div style="font-size: 24px">
                  <strong>{{ f.selectedStoreName }}</strong>
                </div>
              </v-row>

              <v-row class="d-flex justify-center">
                <div>
                  <div style="font-size: 20px; margin-bottom: 10px">
                    <strong>{{ f.title }}</strong>
                  </div>
                  <div class="text-center" style="font-size: 16px">
                    {{ f.contents }}
                  </div>
                </div>
              </v-row>
            </v-col>

            <v-col 
            cols="2" 
            class="d-flex 
            flex-column justify-between"
            style="padding-top: 30px; margin-right: 30px;"

            >
              <v-row justify="end" style="margin-bottom: 20px;">
                <div v-if="f.isAuthor" style="margin-top: -65px">
                  <!-- 상단으로 붙이기 위해 margin-top을 음수로 설정 -->
                  <v-icon
                    style="display: inline-block; vertical-align: top"
                    @click="openUpdateModal(f)"
                    :style="{
                      color: 'gray',
                      cursor: 'pointer',
                      fontSize: '24px',
                    }"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    @click="deleteFB(f.id)"
                    :style="{
                      color: 'gray',
                      cursor: 'pointer',
                      fontSize: '24px',
                    }"
                    style="display: inline-block; vertical-align: top"
                  >
                    mdi-delete
                  </v-icon>
                  <UpdateFindBoardModal
                    :isOpen="isUpdateModalOpen"
                    :findBoard="selectedFindBoard"
                    @close="closeUpdateModal"
                    @updated="loadFindBoard"
                  />
                </div>
              </v-row>
              <!-- 마감 시각 또는 FINISH 텍스트 -->
              <v-row class="d-flex justify-center" style="margin-bottom: 20px;">
                <div
                  v-if="
                    getTimeDifferenceInMinutes(f.expirationTime) !== '마감됨'
                  "
                  style="text-align: right"
                >
                  <p>{{ getTimeDifferenceInMinutes(f.expirationTime) }}</p>
                </div>
                <div v-else style="text-align: right">
                  <em>FINISH</em>
                </div>
              </v-row>
              <!-- 날짜를 우측 하단에 배치 -->
              <!-- <v-card-actions class="justify-end mt-auto">
                <div class="text-right">
                  <p>{{ formatDateTime(f.createdTime) }}</p>
                </div>
              </v-card-actions> -->
              <!-- 참여 버튼 -->
              <v-card-actions>
                <v-btn
                  width="130"
                  height="40"
                  color="black"
                  :disabled="getTimeDifferenceInMinutes(f.expirationTime) <= 0"
                  @click="participateInFindBoard(f.id)"
                  style="background-color: #FF0066; color: white;"
                >
                  JOIN
                </v-btn>
              </v-card-actions>

              <div class="mt-4 d-flex justify-center">
                {{ f.currentCount }} / {{ f.totalCapacity }}
              </div>
            </v-col>
          </v-card>
        </v-col>

        <v-col cols="12">
          <div class="pagination-controls text-center">
            <span
              class="pagination-arrow"
              @click="prevPageRange"
              :class="{ disabled: currentPageRangeStart <= 1 }"
            >
              <v-icon small>{{
                currentPageRangeStart <= 1
                  ? "mdi-menu-left"
                  : "mdi-chevron-left"
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
        </v-col>
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
import UpdateFindBoardModal from "./UpdateFindBoardModal.vue";
import ImminentClosingBoards from "./ImminentClosingBoards.vue";
export default {
  components: {
    CreateFindBoardModal,
    UpdateFindBoardModal,
    ImminentClosingBoards,
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

    const pageFromUrl = parseInt(this.$route.query.page, 10);
    if (pageFromUrl) {
      this.currentPage = pageFromUrl;
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
    async participateInFindBoard(findBoardId) {
      try {
        // 현재 사용자 정보 가져오기 (이메일 포함)
        const myInfoResponse = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`
        );
        const userEmail = myInfoResponse.data.result.email;

        // 특정 게시글의 참가자 목록 가져오기
        const attendanceResponse = await axios.get(
          `http://localhost:8080/attendance/list/findBoard/${findBoardId}`
        );

        const attendances = attendanceResponse.data.result;

        // 특정 게시글에 대한 참가 여부 확인 (이메일을 기반으로)
        const alreadyParticipated = attendances.some(
          (attendance) => attendance.email === userEmail
        );

        if (alreadyParticipated) {
          alert("이미 이 게시글에 참가했습니다.");
          return;
        }

        // 참가 처리
        const participateResponse = await axios.put(
          `http://localhost:8080/findboard/participate/${findBoardId}`
        );

        if (participateResponse.data.status_code === 200) {
          alert("참여 완료");
          window.location.reload();
        } else {
          alert("새로고침 후 다시 시도해주세요");
        }
      } catch (error) {
        console.error("참가 요청 실패:", error);
        alert("자신의 게시글에는 참여할 수 없습니다.");
      }
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
    resetSearch() {
      this.searchType = "optional";
      this.searchValue = "";
      this.searchTriggered = false; // 검색 초기화 시 플래그 초기화
      this.loadFindBoard(); // 초기화 후 전체 리스트 로드
    },
    setPage(page) {
      this.currentPage = page;
      this.searchTriggered = false; // 페이지 이동 시 검색 상태 초기화
      this.loadFindBoard();
      this.updateUrlWithPage(page);
    },
    updateUrlWithPage(page) {
      this.$router.push({ query: { page } });
    },
    onSearchButtonClick() {
      this.searchTriggered = true;
      this.loadFindBoard();
    },
    async loadFindBoard() {
      this.loading = true;

      // 페이지 이동 시 검색이 아닌 경우를 처리
      if (!this.searchTriggered) {
        try {
          const params = {
            size: this.pageSize,
            page: this.currentPage - 1,
          };

          const response = await axios.get(
            "http://localhost:8080/findboard/list",
            { params }
          );
          const resultList = response.data.result.content;

          this.findBoardList = resultList.map((item) => ({
            ...item,
            formattedExpirationTime: this.formatDateTime(item.expirationTime),
          }));

          this.totalPages = Math.ceil(
            response.data.result.totalElements / this.pageSize
          );
        } catch (error) {
          console.error("Error loading findBoardList:", error);
        } finally {
          this.loading = false;
        }
        return;
      }

      try {
        let params = {
          size: this.pageSize,
          page: this.currentPage - 1,
        };

        // 검색 조건이 있을 경우 추가
        if (this.searchType !== "optional" && this.searchValue.trim() !== "") {
          if (this.searchType === "title") {
            params.title = this.searchValue;
          } else if (this.searchType === "contents") {
            params.contents = this.searchValue;
          }
          this.currentPage = 1; // 검색 시 페이지를 1로 리셋
        }

        const response = await axios.get(
          `http://localhost:8080/findboard/list`,
          { params }
        );

        const resultList = response.data.result.content;

        console.log("Result List:", resultList, resultList.length);
        if (resultList.length === 0) {
          alert("검색 결과가 없습니다.");
          this.searchTriggered = false;
          return;
        }

        console.log(
          "검색 결과가 있는 resultList",
          resultList.length,
          resultList
        );
        this.findBoardList = resultList.map((item) => ({
          ...item,
          formattedExpirationTime: this.formatDateTime(item.expirationTime),
        }));

        this.totalPages = Math.ceil(
          response.data.result.totalElements / this.pageSize
        );
      } catch (error) {
        console.error("Error loading findBoardList:", error);
      } finally {
        this.loading = false;
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
  /* 카드 스타일은 여기에서 설정 */
}

.expired-card {
  background-color: #dbaaaa;
  color: #d9979d;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
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

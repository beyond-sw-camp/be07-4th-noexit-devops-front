<template>
  <v-container class="pa-4 d-flex justify-center">
    <v-row class="d-flex justify-center" style="max-width: 2000px">
      <v-col>
        <v-form @submit.prevent="loadFindBoard">
          <v-row>
            <v-col cols="auto">
              <v-select
                v-model="searchType"
                :items="searchOptions"
                item-title="text"
                item-value="value"
              >
              </v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="searchValue"
                label="Search"
                :rules="[required]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-col cols="auto"
                ><v-btn height="55" type="submit" color="pink"
                  >검색</v-btn
                ></v-col
              >
            </v-col>
          </v-row>
        </v-form>
      </v-col>

      <v-card
        class="pa-4"
        outlined
        rounded="lg"
        style="width: 98%; max-width: 2000px; background-color: #f5f5f5"
      >
        <div>
          <v-form ref="form" @submit.prevent="onSubmit">
            <v-text-field
              v-model="title"
              :rules="[(v) => !!v || '제목을 입력하세요.']"
              hide-details="auto"
              label="제목"
              outlined
              class="mb-4"
              required
            ></v-text-field>
            <v-textarea
              v-model="contents"
              :rules="[(v) => !!v || '내용을 입력하세요.']"
              label="내용"
              outlined
              rows="4"
              class="mb-4"
              required
            ></v-textarea>
            <v-card flat class="pa-4" style="background-color: #f5f5f5">
              <v-row>
                <v-col cols="4">
                  <label for="date">날짜 선택<br /></label>
                  <input
                    type="date"
                    id="date"
                    v-model="date"
                    class="mt-2"
                    style="
                      width: 100%;
                      max-width: 300px;
                      padding: 8px;
                      border-radius: 4px;
                      border: 1px solid #ccc;
                    "
                    required
                  />
                </v-col>
                <v-col cols="4">
                  <label for="time">마감 시한<br /></label>
                  <input
                    type="time"
                    id="time"
                    v-model="time"
                    class="mt-2"
                    style="
                      width: 100%;
                      max-width: 300px;
                      padding: 8px;
                      border-radius: 4px;
                      border: 1px solid #ccc;
                    "
                    required
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="totalCapacity"
                    :rules="[(v) => !!v || '희망 인원을 선택하세요.']"
                    :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    label="희망 인원"
                    outlined
                    shaped
                    elevation="3"
                    prepend-icon="mdi-account"
                    style="
                      border-radius: 8px;
                      padding: 0 8px;
                      height: 2px;
                      padding: 25px;
                    "
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-card>
            <div class="d-flex justify-center">
              <v-btn
                width="150"
                height="50"
                color="pink"
                type="submit"
                :disabled="
                  !title || !contents || !totalCapacity || !time || !date
                "
                variant="elevated"
                >SUBMIT</v-btn
              >
            </div>
          </v-form>
        </div>
      </v-card>

      <br />
      <!-- 여기부터 글 시작 -->
      <v-divider :thickness="3" color="gray"></v-divider> 

      <v-row>
        <v-col
          cols="6"
          v-for="f in findBoardList"
          :key="f.id"
          class="d-flex justify-center"
        >
          <v-card
            :class="{
              'expired-card': getTimeDifferenceInMinutes(f.expirationTime) === '마감됨',
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
                    <strong>작성 시각: {{ formatDateTime(f.createdTime) }}</strong>
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
                    글쓴이 : {{ f.writer }}
                  </div>
                  <br />
                  <v-btn
                    width="180"
                    height="50"
                    color="pink"
                    class="mt-2"
                    :disabled="getTimeDifferenceInMinutes(f.expirationTime) <= 0"
                    @click="participateInFindBoard(f.id)"
                    >PARTICPATE</v-btn
                  >
                </div>
              </div>
              <div class="text-right mt-2">모집 인원 : {{ f.totalCapacity }}</div>
              <div class="text-right mt-2">현재 인원 : {{ f.currentCount }}</div>
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
      
              <v-btn @click="deleteFB(f.id)">삭제하기</v-btn>
              <v-btn @click="openUpdateModal(f)">수정하기</v-btn>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
      
    

    <div v-if="loading" class="text-center my-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
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
  // 현지 날짜를 YYYY-MM-DD 형식으로 변환
  this.date = now.toLocaleDateString('en-CA'); // 'en-CA'는 'YYYY-MM-DD' 형식을 반환합니다.
  // 현지 시간 설정
  this.time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
},
  created() {
    this.loadFindBoard();
  },
  methods: {
    // getTimeDifferenceInMinutes(expirationTime) {
    //   const now = new Date();
    //   const expiration = new Date(expirationTime);
    //   const differenceInMs = expiration - now; // 차이를 밀리초 단위로 계산
    //   const differenceInMinutes = Math.floor(differenceInMs / 1000 / 60); // 분 단위로 변환

    //   if (differenceInMinutes > 30) {
    //     // 30분 이상 남았으면 날짜만 반환
    //     return expirationTime.substring(0, 10); // YYYY-MM-DD 형식 반환
    //   } else if (differenceInMinutes > 0) {
    //     // 30분 이하로 남았으면 남은 시간 표시
    //     return `${differenceInMinutes}분 남음`;
    //   } else {
    //     // 시간이 이미 지난 경우
    //     return "마감됨";
    //   }
    // },

    getTimeDifferenceInMinutes(expirationTime) {
  const now = new Date();
  const expiration = new Date(expirationTime);

  if (isNaN(expiration.getTime())) {
    console.error("Invalid expiration time format:", expirationTime);
    return "시간 형식 오류";
  }

  const differenceInMs = expiration.getTime() - now.getTime();
  const differenceInMinutes = Math.floor(differenceInMs / 1000 / 60);

  if (differenceInMinutes <= 0) {
    return "마감됨";
  } else {
    return `${differenceInMinutes}분 남음`;
  }
},



    
    async searchFindBoard() {
      this.findBoardList = [];
      await this.loadFindBoard();
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.registerFindBoard();
      } else {
        alert("모든 필드를 올바르게 작성해 주세요.");
      }
    },
    async registerFindBoard() {
      try {
        const expirationDateTime = new Date(
          `${this.date}T${this.time}:00`
        ).toISOString();

        const requestData = {
          title: this.title,
          contents: this.contents,
          expirationTime: expirationDateTime,
          totalCapacity: this.totalCapacity,
        };

        await axios.post(`http://localhost:8080/findboard/create`, requestData);

        alert("작성 완료");
        window.location.reload();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("작성 실패");
      }
    },

    async loadFindBoard() {
      this.loading = true;
      try {
        const response = await axios.get(
          `http://localhost:8080/findboard/list`
        );
        // 데이터 변환 부분 추가
        this.findBoardList = response.data.result.content.map((item) => {
          return {
            ...item,
            formattedExpirationTime: this.formatDateTime(item.expirationTime),
          };
        });
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
        this.findBoardList = this.findBoardList.filter((fb) => fb.id !== fbId);
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    },

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
        this.loadFindBoard();
      } catch (error) {
        console.error("업데이트 실패:", error);
      }
    },

    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },

    openUpdateModal(findBoard) {
      this.updateId = findBoard.id;
      this.updateTitle = findBoard.title;
      this.updateContents = findBoard.contents;
      this.updateDate = findBoard.createdTime.substr(0, 10);
      this.updateTime = findBoard.createdTime.substr(11, 5);
      this.updateTotalCapacity = findBoard.totalCapacity;
      this.isUpdateModalOpen = true;
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
          alert("자신의 글에는 참가 신청을 할수없습니다.");
        } else if (error.response && error.response.status === 404) {
          alert("게시글이 존재하지 않거나 삭제된 게시글입니다.");
        } else {
          console.error("참가 요청 실패:", error);
          alert("참가 요청에 실패했습니다.");
        }
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
  background-color: #f8d7da; /* 연한 빨간색 배경 */
  color: #721c24; /* 진한 빨간색 텍스트 */
}
</style>

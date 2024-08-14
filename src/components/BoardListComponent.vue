<template>
  <v-container>
    <v-row class="d-flex justify-content-between mt-5">
      <v-col>
        <v-form @submit.prevent="searchBoards">
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
              <v-text-field v-model="searchValue" label="Search">
              </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit">검색 </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col cols="auto">
        <v-btn href="/board/create" color="pink">게시글 쓰기</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <!-- <v-card-title class="text-h6 text-center">{{pageTitle}}</v-card-title> -->
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th style="text-align: center;">썸네일</th>
                  <th style="text-align: center;">제목</th>
                  <th style="text-align: center;">작성자</th>
                  <th style="text-align: center;">조회수</th>
                  <th style="text-align: center;">좋아요</th>
                  <th style="text-align: center;">댓글수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in boardList" :key="b.id">
                  <td>
                    <a :href="`/board/detail/${b.id}`" style="text-decoration:none;">
                    <v-img
                      :src="b.thumbnail"
                      style="height: 70px; width: auto"
                    ></v-img>
                    </a>
                  </td>
                  <td style="width: 550px; text-align: center;"><a :href="`/board/detail/${b.id}`" style="text-decoration:none;">{{ b.title }}</a></td>
                  <td style="width: 100px; text-align: center;">{{ b.writer }}</td>
                  <td style="width: 100px; text-align: center;">{{ b.boardHits }}</td>
                  <td style="width: 100px; text-align: center;">{{ b.likes }}</td>
                  <td style="width: 100px; text-align: center;">{{ b.comments }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
        { text: "게시글유형", value: "boardType" },
      ],
      searchValue: "",
      boardList: [],
      pageSize: 10,
      currentPage:0,
      isLastPage:false,
      isLoading:false,
      selected:{}
    };
  },
  created() {
    this.loadBoard();
  },
  methods: {
    searchBoards() {
        this.boardList = [];
        this.currentPage = 0;
        this.isLastPage = false;
        this.isLoading = false;
        this.loadBoard();

    },
    async loadBoard(page = this.currentPage) {
      try {
        let params = {
            size: this.pageSize,
            page: page,
        };
        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/board/list`, {params});
        this.boardList = response.data.result.content;
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
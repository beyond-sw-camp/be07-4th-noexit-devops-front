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
                :style="{ backgroundColor: '#f8d7da' }"
              >
              </v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="searchValue"
                label="Search"
                :style="{ backgroundColor: '#f8d7da' }"
              >
              </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit">검색</v-btn>
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
        <v-card style="background-color: #1b1b1b; border: 1px solid white">
          <v-card-text>
            <v-table
              style="
                background-color: #1b1b1b;
                color: white;
                border: 1px solid white;
              "
            >
              <thead
                style="
                  background-color: #e91e63;
                  color: white;
                  border: 1px solid white;
                "
              >
                <tr>
                  <th style="text-align: center">썸네일</th>
                  <th style="text-align: center">제목</th>
                  <th style="text-align: center">작성자</th>
                  <th style="text-align: center">작성일</th>
                  <th style="text-align: center">조회수</th>
                  <th style="text-align: center">좋아요</th>
                  <th style="text-align: center">댓글수</th>
                </tr>
              </thead>
              <tbody
                style="
                  background-color: #1b1b1b;
                  color: white;
                  border: 1px solid white;
                "
              >
                <tr v-for="b in boardList" :key="b.id">
                  <td>
                    <v-icon v-if="b.thumbnail" size="30" color="white">mdi-image-outline</v-icon>
                    <!-- <v-icon v-else size="30" color="white">mdi-file-document-outline</v-icon> -->
                  </td>
                  <td style="width: 450px; text-align: center">
                    <v-chip
                      class="custom-chip"
                      :color="getChipColor(b.boardType)"
                      text-color="white"
                      style="margin-right: 8px;"
                    >
                      {{ b.boardType }}
                    </v-chip>
                    <a
                      :href="`/board/detail/${b.id}`"
                      style="text-decoration: none; color: white"
                    >
                      {{ b.title }}
                    </a>
                  </td>
                  <td style="width: 90px; text-align: center">
                    {{ b.writer }}
                  </td>
                  <td style="width: 180px; text-align: center">
                    {{ b.createdDate }}
                  </td>
                  <td style="width: 70px; text-align: center">
                    {{ b.boardHits }}
                  </td>
                  <td style="width: 70px; text-align: center">{{ b.likes }}</td>
                  <td style="width: 70px; text-align: center">
                    {{ b.comments }}
                  </td>
                </tr>
              </tbody>
            </v-table>

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
        { text: "카테고리", value: "boardType" },
      ],
      searchValue: "",
      boardList: [],
      pageSize: 10,
      currentPage: 1,
      totalPages: 1,
      currentPageRangeStart: 1,
      currentPageRangeEnd: 5,
      pagesPerRange: 5,
      isLoading: false,
    };
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
    this.loadBoard();
  },
  methods: {
    searchBoards() {
      this.boardList = [];
      this.currentPage = 1;
        this.isLastPage = false;
        this.isLoading = false;
      this.loadBoard();
    },
    async loadBoard() {
      try {
        this.isLoading = true;
        let params = {
          size: this.pageSize,
          page: this.currentPage - 1,
          // searchType: this.searchType,
          // searchValue: this.searchValue,
        };

        if(this.searchType === 'title') {
            params.searchTitle = this.searchValue;
            console.log(params.searchTitle);
        }else if(this.searchType === 'boardType') {
            params.searchBoardType = this.searchValue;
            console.log(params.searchBoardType);
        }


        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/board/list`,
          { params }
        );

        this.boardList = response.data.result.content;
        console.log(this.boardList);
        this.isLoading = false;
        this.totalPages = Math.ceil(
          response.data.result.totalElements / this.pageSize
        );
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    getChipColor(boardType) {
      switch (boardType) {
        case "FREE":
          return "#E91E63";
        case "STRATEGY":
          return "#DF8B8B";
        default:
          return "grey";
      }
    },
    setPage(page) {
      this.currentPage = page;
      this.loadBoard();
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

<style scoped>
@import url("https://webfontworld.github.io/gmarket/GmarketSans.css");

* {
  font-family: "GmarketSansMedium", sans-serif;
  font-weight: 1000;
}

.pagination-controls {
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.pagination-arrow .disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-arrow v-icon {
  font-size: 20px;
  vertical-align: middle;
}
</style>

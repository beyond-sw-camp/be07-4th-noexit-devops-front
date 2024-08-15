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
        <v-card>
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
                      <v-img
                        :src="b.thumbnail"
                        style="height: 70px; width: auto"
                      ></v-img>
                    </a>
                  </td>
                  <td style="width: 550px; text-align: center;">
                    <a :href="`/board/detail/${b.id}`" style="text-decoration:none;">
                      {{ b.title }}
                    </a>
                  </td>
                  <td style="width: 100px; text-align: center;">{{ b.writer }}</td>
                  <td style="width: 100px; text-align: center;">{{ b.boardHits }}</td>
                  <td style="width: 100px; text-align: center;">{{ b.likes }}</td>
                  <td style="width: 100px; text-align: center;">{{ b.comments }}</td>
                </tr>
              </tbody>
            </v-table>
            <div class="pagination-controls">
              <span
                class="pagination-arrow"
                @click="prevPageRange"
                :class="{ 'disabled': currentPageRangeStart <= 1 }"
              >
                « 이전
              </span>
              <span
                v-for="page in visiblePages"
                :key="page"
                @click="setPage(page)"
                :class="{ 'active-page': currentPage === page }"
              >
                {{ page }}
              </span>
              <span
                class="pagination-arrow"
                @click="nextPageRange"
                :class="{ 'disabled': currentPageRangeEnd >= totalPages }"
              >
                다음 »
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchType: 'optional',
      searchOptions: [
        { text: '선택', value: 'optional' },
        { text: '제목', value: 'title' },
        { text: '게시글유형', value: 'boardType' },
      ],
      searchValue: '',
      boardList: [],
      pageSize: 10,
      currentPage: 1,
      totalPages: 1,
      currentPageRangeStart: 1,
      currentPageRangeEnd: 5,
      pagesPerRange: 5,
      isLoading: false
    };
  },
  computed: {
    visiblePages() {
      const pages = [];
      for (let i = this.currentPageRangeStart; i <= this.currentPageRangeEnd; i++) {
        if (i <= this.totalPages) pages.push(i);
      }
      return pages;
    }
  },
  created() {
    this.loadBoard();
  },
  methods: {
    async searchBoards() {
      this.currentPage = 1;
      this.currentPageRangeStart = 1;
      this.currentPageRangeEnd = this.pagesPerRange;
      this.boardList = [];
      this.loadBoard();
    },
    async loadBoard() {
      this.isLoading = true;
      try {
        let params = {
          size: this.pageSize,
          page: this.currentPage - 1,
          searchType: this.searchType,
          searchValue: this.searchValue
        };
        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/board/list`, { params });
        this.boardList = response.data.result.content;
        this.totalPages = Math.ceil(response.data.result.totalElements / this.pageSize);
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    setPage(page) {
      this.currentPage = page;
      this.loadBoard();
    },
    prevPageRange() {
      if (this.currentPageRangeStart > 1) {
        this.currentPageRangeStart = Math.max(1, this.currentPageRangeStart - this.pagesPerRange);
        this.currentPageRangeEnd = Math.min(this.totalPages, this.currentPageRangeStart + this.pagesPerRange - 1);
        this.setPage(this.currentPageRangeStart);
      }
    },
    nextPageRange() {
      if (this.currentPageRangeEnd < this.totalPages) {
        this.currentPageRangeStart = Math.min(this.totalPages - this.pagesPerRange + 1, this.currentPageRangeStart + this.pagesPerRange);
        this.currentPageRangeEnd = Math.min(this.totalPages, this.currentPageRangeStart + this.pagesPerRange - 1);
        this.setPage(this.currentPageRangeStart);
      }
    }
  }
};
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 16px;
}

.pagination-controls span {
  margin: 0 5px;
  cursor: pointer;
}

.pagination-controls .pagination-arrow {
  font-weight: bold;
}

.pagination-controls .pagination-arrow.disabled {
  color: #aaa;
  cursor: not-allowed;
}

.pagination-controls .active-page {
  font-weight: bold;
  text-decoration: underline;
}
</style>

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
                  <th>썸네일</th>
                  <th>작성자</th>
                  <th >제목</th>
                  <th>조회수</th>
                  <th>좋아요</th>
                  <th>댓글수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in boardList" :key="b.id">
                  <td>
                    <v-img
                      :src="b.thumbNail"
                      style="height: 100px; width: auto"
                    ></v-img>
                  </td>
                  <td>{{ b.writer }}</td>
                  <td>{{ b.title }}</td>
                  <td>{{ b.boardHits }}</td>
                  <td>{{ b.likes }}</td>
                  <td>{{ b.comments }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
        <div v-if="!isLastPage">
       <button @click="loadBoard(currentPage - 1)" :disabled="currentPage === 0">이전    </button>
       <button @click="loadBoard(currentPage + 1)">다음</button>
     </div>
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
      pageSize: 5,
      currentPage:0,
      isLastPage:false,
      isLoading:false,
      selected:{}
    };
  },
  created() {
    this.loadBoard();
    window.addEventListener('scroll', this.scrollPagination)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.scrollPagination);
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
        if(this.isLoading || (page < 0) || this.isLastPage) return;
        this.isLoading = true;
        let params = {
            size: this.pageSize,
            page: page,
        };
        if(this.searchType === 'title') {
            params.title = this.searchValue;
        } else if(this.searchType === 'boardType') {
            params.boardType = this.searchValue;
        }
        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/board/list`, {params});
        const additionalData = response.data.result.content.map(b => ({...b, quantity: 0}));
        if(additionalData.length === 0) {
            this.isLastPage = true;
        } else {
            this.boardList = page === this.currentPage ? [...this.boardList, ...additionalData] : additionalData;
            this.currentPage = page;
        }
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    async loadBoard1() {
      try {
        if(this.isLoading || this.isLastPage) return;
        this.isLoading = true;
        let params = {
            size: this.pageSize,
            page: this.currentPage,
        }
        if(this.searchType === 'title') {
            params.title = this.searchValue;
        }else if(this.searchType === 'boardType') {
            params.boardType = this.searchValue;
        }
        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/board/list`, {params});
        console.log(response);
        const additionalData = response.data.result.content.map(b=>({...b, quantity:0}));
        if(additionalData.length==0) {
            this.isLastPage = true;
            return;
        }
        this.boardList = [...this.boardList, ...additionalData]
        this.currentPage++;
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    scrollPagination() {
        const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
        if(isBottom && !this.isLastPage && !this.isLoading) {
            this.loadBoard();
        }
    },
  },
};
</script>


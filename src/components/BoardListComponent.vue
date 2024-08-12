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
                      :src="b.imagePath"
                      style="height: 100px; width: auto"
                    ></v-img>
                  </td>
                  <td>{{ b.memberId }}</td>
                  <td>{{ b.title }}</td>
                  <td>{{ b.boardHits }}</td>
                  <td>{{ b.likes }}</td>
                  <td>{{ b.dislikes }}</td>
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
//   props: ["pageTitle"],
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
      // // selected 예시
      // {1:true, 2:false, 3:false, 4:true} 이런 식으로 담기게 된다
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
    async loadBoard() {
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
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/board/list`, {params});
        console.log(response)
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
        // "현재화면 + 스크롤로 이동한 화면 > 전체화면 -n"의 조건이 성립되면 추가 데이터 로드
        const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
        if(isBottom && !this.isLastPage && !this.isLoading) {
            this.loadBoard();
        }
    },
    // async createOrder() {
    //     const orderProducts = Object.keys(this.selected).filter(key=>this.selected[key])
    //     .map(key=> {
    //         const product = this.productList.find(p => p.id == key)
    //         return {productId:product.id, productCount:product.quantity};
    //     });
    //     if(orderProducts.length<1) {
    //         alert("주문대상 물건이 없습니다.");
    //         return;
    //     }
    //     const yesOrNo = confirm(`${orderProducts.length}개의 상품을 주문하시겠습니까?`);
    //     if(!yesOrNo) {
    //         console.log("주문이 취소되었습니다.")
    //         window.location.reload()
    //         return;
    //     }
    //     try{
    //         await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order/create`, orderProducts);
    //         alert("주문 완료되었습니다.")
    //         window.location.reload()
    //     }catch(e){
    //         console.log(e);
    //         alert("주문 실패되었습니다.")
    //     }
    // }
  },
};
</script>




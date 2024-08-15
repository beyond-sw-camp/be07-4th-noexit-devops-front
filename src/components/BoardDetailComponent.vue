<template>
  <v-container>
    <v-row style="margin-top: 100px">
      <v-col>
        <div style="font-size: 24px">{{ board.title }}</div>
      </v-col>
      <div>
        <div v-if="this.isAuthor" class="d-flex flex-row" style="text-align: right">
          <v-btn color="pink" @click="updateBoard">수정</v-btn>
          <v-btn color="black" @click="deleteBoard">삭제</v-btn>
        </div>
      </div>
    </v-row>
    <v-row>
      <v-col>
        <hr class="divider" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <div class="d-flex flex-column" style="text-align: left">
          <div>번호 {{ board.id }}</div>
          <div>작성자 {{ board.writer }}</div>
          <div>작성일 {{ board.createdDate }}</div>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="d-flex flex-column" style="text-align: right">
          <div>조회수 {{ board.boardHits }}</div>
          <div>추천수 {{ board.likes }}</div>
          <div v-if="board.comments">댓글수 {{ board.comments.length }}</div>
          <div v-else>0</div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <hr class="divider" />
      </v-col>
    </v-row>
    <v-row class="mt- d-flex justify-center align-center">
      <v-col>
        <div style="font-size: 24px">{{ board.contents }}</div>
        <div v-if="board.images && board.images.length">
          <div v-for="i in board.images" :key="i.id">
            <v-img :src="i.imageUrl" style="width: 500px"></v-img>
          </div>
        </div>
        <div v-else></div>
      </v-col>
    </v-row>
    <v-row style="margin-top: 150px" class="d-flex justify-center align-center">
      <v-col class="d-flex justify-center" cols="auto">
        <v-btn color="pink" @click="likeBoard">좋아요 {{ board.likes }}</v-btn>
      </v-col>
      <v-col class="d-flex justify-center" cols="auto">
        <v-btn color="black" @click="dislikeBoard"
          >싫어요 {{ board.dislikes }}</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <hr class="divider" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-table>
          <tbody>
            <tr v-for="c in board.comments" :key="c.id">
              <td style="width: 200px">{{ c.writer }}</td>
              <td style="width: 1000px">{{ c.content }}</td>
              <td style="width: 100px">{{ c.createdTime }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-row style="margin-bottom: 100px">
      <v-col>
        <v-form @submit.prevent="createComment">
          <v-row>
            <v-col>
              <v-text-field v-model="commentContent"> </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn color="pink" type="submit">댓글 등록</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      board: {},
      commentContent: "",
      isLastPage: false,
      isLoading: false,
      isAuthor: false, // 게시글 작성자 여부 확인 상태
    };
  },
  async created() {
    this.checkAuthor(),
    this.loadBoard();
  },
  methods: {
    async loadBoard() {
      try {
        if (this.isLoading || this.isLastPage) return;
        this.isLoading = true;

          const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/board/detail/${this.id}`);
          this.board = response.data.result;
          this.isLoading = false;
        } catch (e) {
          console.log(e);
        }
    },
    async createComment() {
      const newComment = {
        boardId: this.board.id,
        content: this.commentContent,
      };
      try {
        await axios.post(
          `${process.env.VUE_APP_API_BASIC_URL}/comment/create`,
          newComment
        );
        alert("댓글이 성공적으로 작성되었습니다.");
        await this.loadBoard(); // 댓글 작성 후 게시글 새로 고침
      } catch (e) {
        console.log(e);
        alert("댓글이 작성되지 않았습니다.");
      }
    },
    async likeBoard() {
      try {
        await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/board/like/${this.board.id}`
        );
        alert("게시글을 좋아합니다.");
        await this.loadBoard(); // 좋아요 클릭 후 게시글 새로 고침
      } catch (e) {
        console.log(e);
        alert("좋아요 실패했습니다.");
      }
    },
    async checkAuthor() {
      try{
      const myInfo = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`);
      const boardInfo = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/board/detail/${this.id}`);
        if(myInfo.data.result.nickname === boardInfo.data.result.writer) {
          this.isAuthor = true;
        }
      }catch(e) {
        console.log(e);
      }
    },
    async dislikeBoard() {
      try {
        await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/board/dislike/${this.board.id}`
        );
        alert("게시글을 싫어합니다.");
        await this.loadBoard(); // 싫어요 클릭 후 게시글 새로 고침
      } catch (e) {
        console.log(e);
        alert("싫어요 실패했습니다.");
      }
    },
    updateBoard() {
      try {
          this.$router.push(`/board/update/${this.board.id}`);
        } catch (e) {
          console.log(e);
          alert("게시글 수정 실패했습니다.");
        }
      
    },
    async deleteBoard() {
      const confirmed = confirm("정말로 삭제하시겠습니까?");
      if (confirmed) {
        try {
          await axios.patch(
            `${process.env.VUE_APP_API_BASIC_URL}/board/delete/${this.board.id}`
          );
          alert("게시글이 삭제되었습니다.");
          this.$router.push("/board/list");
        } catch (e) {
          console.log(e);
          alert("게시글 삭제 실패했습니다.");
        }
      }
    },
  },
};
</script>

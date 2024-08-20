<template>
  <v-container style="color:#ffffff">
    <v-row>
      <v-col>
        <div style="font-size: 24px">{{ board.title }}</div>
      </v-col>
      <div>
        <div
          v-if="isAuthor"
          class="d-flex flex-row"
          style="text-align: right"
        >
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
          <div>작성일 {{ board.createdTime }}</div>
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
        <div style="font-size: 16px">{{ board.contents }}</div>
        <br>
        <div v-if="board.images && board.images.length">
          <div v-for="i in board.images" :key="i.id">
            <v-img :src="i.imageUrl" style="width: 500px"></v-img>
            <br>
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
        <v-btn color="black" @click="dislikeBoard">싫어요 {{ board.dislikes }}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <hr class="divider" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-table style="background-color: #1b1b1b;">
          <tbody>
            <tr style="background-color: #1b1b1b; color: #ffffff;" v-for="c in board.comments" :key="c.id">
              <td style="width: 150px">{{ c.writer }}</td>
              <td style="width: 800px">
                <template v-if="isCommentAuthor(c.writer) && editingCommentId === c.id">
                  <v-text-field
                    v-model="editedContents"
                    multiline
                    rows="3"
                  ></v-text-field>
                </template>
                <template v-else>
                  {{ c.contents }}
                </template>
              </td>
              <td style="width: 200px">{{ c.createdTime }}</td>
              <td style="width: 200px;">
                <div>
                  <v-icon small color="blue-lighten-2" @click="likeComment(c.id)" style="margin-right: 5px;">mdi-thumb-up</v-icon>{{ c.likes }}
                  <v-icon small color="red-lighten-2" @click="dislikeComment(c.id)" style="margin-left: 10px; margin-right: 5px;">mdi-thumb-down</v-icon>{{ c.dislikes }}
                </div>
              </td>
              <td v-if="isCommentAuthor(c.writer)" style="width: 200px; text-align: right">
                <div v-if="editingCommentId === c.id">
                  <v-btn color="pink" @click="saveComment(c.id)">저장</v-btn>
                  <v-btn color="grey" @click="cancelEditing">취소</v-btn>
                </div>
                <div v-else>
                  <v-icon small color="white" @click="startEditing(c)" style="margin-right: 10px;">mdi-pencil</v-icon>
                  <v-icon small color="white" @click="deleteComment(c.id)" style="margin-right: 10px;">mdi-delete</v-icon>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-row style="margin-bottom: 100px">
      <v-col>
        <v-form v-if="!isAuthor" @submit.prevent="createComment">
          <v-row>
            <v-col>
              <v-text-field v-model="commentContents"></v-text-field>
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
      myInfo: {},
      commentContents: "",
      isLastPage: false,
      isLoading: false,
      isAuthor: false,
      editingCommentId: null,
      editedContents: "",
    };
  },
  async created() {
    await this.fetchMyInfo();
    await this.checkAuthor();
    await this.loadBoard();
  },
  methods: {
    async fetchMyInfo() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`
        );
        this.myInfo = response.data.result;
      } catch (e) {
        console.log(e);
      }
    },
    async checkAuthor() {
      try {
        const boardInfo = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/board/detail/${this.id}`
        );
        if (this.myInfo.nickname === boardInfo.data.result.writer) {
          this.isAuthor = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async loadBoard() {
      try {
        if (this.isLoading || this.isLastPage) return;
        this.isLoading = true;

        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/board/detail/${this.id}`
        );
        this.board = response.data.result;
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },

    async likeBoard() {
      try {
        const response = await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/board/like/${this.board.id}`
        );
        this.board.likes += response.data.result ? 1 : -1; // 게시글 좋아요 수 업데이트
        alert(response.data.result ? "게시글을 좋아합니다." : "좋아요를 취소합니다.");
      } catch (e) {
        console.log(e);
        alert("오류");
      }
  },

      async dislikeBoard() {
      try {
        const response = await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/board/dislike/${this.board.id}`
        );
        this.board.dislikes += response.data.result ? 1 : -1; // 게시글 좋아요 수 업데이트
        alert(response.data.result ? "게시글을 싫어합니다." : "싫어요를 취소합니다.");
      } catch (e) {
        console.log(e);
        alert("오류");
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
    async createComment() {
      const newComment = {
        boardId: this.board.id,
        contents: this.commentContents,
      };
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASIC_URL}/comment/create`,
          newComment
        );
        this.board.comments.push(response.data.result); // 댓글 추가
        this.commentContents = ""; // 댓글 입력란 비우기
        alert("댓글이 성공적으로 작성되었습니다.");
      } catch (e) {
        console.log(e);
        alert("댓글이 작성되지 않았습니다.");
      }
    },

    isCommentAuthor(commentWriter) {
      return this.myInfo.nickname === commentWriter;
    },
 
    async deleteComment(commentId) {
      const confirmed = confirm("정말로 삭제하시겠습니까?");
      if (confirmed) {
        try {
          await axios.patch(
            `${process.env.VUE_APP_API_BASIC_URL}/comment/delete/${commentId}`
          );
          this.board.comments = this.board.comments.filter(c => c.id !== commentId); // 댓글 삭제
          alert("댓글이 삭제되었습니다.");
        } catch (e) {
          console.log(e);
          alert("댓글 삭제 실패했습니다.");
        }
      }
    },

    startEditing(comment) {
      this.editingCommentId = comment.id;
      this.editedContents = comment.contents; // 현재 댓글 내용을 가져와서 수정 필드에 표시
    },
    async saveComment(commentId) {
      try {
        await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/comment/update/${commentId}`,
          {
            contents: this.editedContents,
          }
        );
        const comment = this.board.comments.find(c => c.id === commentId);
        if (comment) {
          comment.contents = this.editedContents; // 댓글 내용 업데이트
        }
        this.editingCommentId = null; // 수정 모드 종료
        alert("댓글이 수정되었습니다.");
      } catch (e) {
        console.error("댓글 수정 실패", e);
        alert("댓글 수정에 실패했습니다.");
      }
    },
    cancelEditing() {
      this.editingCommentId = null; // 수정 모드 종료
    },
    async likeComment(commentId) {
      try {
        const response = await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/comment/like/${commentId}`
        );
        const comment = this.board.comments.find(c => c.id === commentId);
        if (comment) {
          comment.likes += response.data.result ? 1 : -1; // 댓글 좋아요 수 업데이트
        }
        alert(response.data.result ? "댓글을 좋아합니다." : "좋아요를 취소합니다.");
      } catch (e) {
        console.log(e);
        alert("오류");
      }
    },
    async dislikeComment(commentId) {
      try {
        const response = await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/comment/dislike/${commentId}`
        );
        const comment = this.board.comments.find(c => c.id === commentId);
        if (comment) {
          comment.dislikes += response.data.result ? 1 : -1; // 댓글 싫어요 수 업데이트
        }
        alert(response.data.result ? "댓글을 싫어합니다." : "싫어요를 취소합니다.");
      } catch (e) {
        console.log(e);
        alert("오류");
      }
    },
  },
};
</script>

<style>
@import url("https://webfontworld.github.io/gmarket/GmarketSans.css");

* {
  font-family: "GmarketSansMedium", sans-serif;
  font-weight: 1000;
}
</style>

<template>
  <v-container>
    <v-row class="d-flex justify-content-between mt-5">
      <v-col>
        <v-form>
          <v-row>
            <v-col>
              <v-select
                style="width: 100px"
                v-model="editedBoardType"
                :items="categoryOptions"
                item-title="text"
                item-value="value"
                :style="{ backgroundColor: '#f8d7da' }"
              >
              </v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="editedTitle" required
                style="width: 700px;  height: 10px"
                :style="{ backgroundColor: '#f8d7da', height: '10px' }"
              >
              </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn color="pink" @click="saveEditing"
                >수정하기</v-btn
              >
              <v-btn color="grey" @click="cancelEditing"
                >취소하기</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
               <table>
          <tbody>
            <tr v-for="i in filteredFiles" :key="i.id">
              <td style="color: white">{{ i.imageUrl }}</td>
              <v-icon small color="white" @click="deleteImg(i.id)" style="margin-left: 12px;">mdi-delete</v-icon>
            </tr>
          </tbody>
        </table>
        <v-file-input 
        :style="{ backgroundColor: '#565656', color: '#000' }"
    label="첨부 이미지" 
    accept="image/*" 
    multiple
    @change="fileUpdate"
    >
        </v-file-input>
        <v-textarea
          v-model="editedContents"
          style="width: 1200px; height: 700px"
          :style="{ backgroundColor: '#f8d7da' }"
        >
        </v-textarea>
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
      editedTitle: "",
      editedContents: "",
      editedBoardType: "",
      category: "카테고리",
      categoryOptions: [
        { text: "FREE", value: "FREE" },
        { text: "STRATEGY", value: "STRATEGY" },
      ],
      editedFiles: [],
      deletedFiles: [],
      files: [],
    };
  },
async created() {
    await this.fetchBoardInfo();
  },
  computed: {
    filteredFiles() {
      return this.editedFiles.filter(file => !this.deletedFiles.includes(file.id));
      
    }
  },
  methods: {
    async fetchBoardInfo() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/board/detail/${this.id}`
        );
        this.board = response.data.result;
        this.editedTitle = this.board.title;
        this.editedContents = this.board.contents;
        this.editedBoardType = this.board.boardType;
        this.editedFiles = this.board.images || [];
      } catch (error) {
        console.error("Failed to fetch board info:", error);
      }
    },

    async saveEditing() {
      try {
        let editedBoard = new FormData();
        const data = {
          title: this.editedTitle,
          contents: this.editedContents,
          removeImgs: this.deletedFiles,
          boardType: this.editedBoardType,
        };

        editedBoard.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );

                this.files.forEach((file) => {
          editedBoard.append("file", file, file.name);
        });

        await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/board/update/${this.board.id}`,
          editedBoard,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("게시글이 수정되었습니다.");
        this.$router.push(`/board/detail/${this.board.id}`);
      } catch (e) {
        console.error("게시글 수정 실패", e);
        alert("게시글 수정에 실패했습니다.");
      }
    },
    cancelEditing() {
      this.$router.push(`/board/detail/${this.board.id}`);
    },
        fileUpdate(event) {
      this.files = Array.from(event.target.files);

    },
    async deleteImg(id) {
      try {
        await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/boardimg/delete/${id}`
        );
        alert("사진이 삭제되었습니다");
        this.deletedFiles.push(id);
        console.log(this.editedFiles);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }

  },
};
</script>

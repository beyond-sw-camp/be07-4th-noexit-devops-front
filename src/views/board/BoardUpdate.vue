<template>
  <v-container>
    <div>
      <v-row class="d-flex justify-content-between mt-5">
      <v-col>
        <v-form>
          <v-row align="center" class="mb-4">
            <v-col cols="auto">
              <v-select
              v-model="editedBoardType"
              :items="categoryOptions"
                item-title="text"
                item-value="value"
                class="custom-select"
              >
              </v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="editedTitle"
                class="custom-text-field"
              >
              </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn height="60" color="pink" @click="saveEditing"
                >수정하기</v-btn
              >
              <v-btn height="60" color="grey" @click="cancelEditing"
                >취소하기</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    </div>






    <!-- <div>
      <v-row>
        <v-col>
            <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="fileUpdate"/>    
            <v-row>
                <v-col v-for="i in filteredFiles" :key="i.id" cols="auto" style="margin-right: 10px">
                  <img :src="i.imageUrl" alt="Selected Image" style=" width: 100px; height: 100px; object-fit: cover; display: block;" @click="deleteImg(i.id)"/>
                </v-col>
                <template v-if="filteredFiles.length < 5">
                  <v-icon @click="triggerFileInput" color="white" size="150" style="cursor: pointer; margin-right: 10px;">mdi-image-outline</v-icon>
                </template>
            </v-row>
          </v-col>
      </v-row>
    </div> -->

    <div>
      <v-row>
        <v-col>
            <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="fileUpdate"/>    
            <v-row>
                <v-col v-for="image in previewImages" :key="image.src" cols="auto" style="margin-right: 10px">
                    <img :src="image.src" alt="Selected Image" style="width: 100px; height: 100px; object-fit: cover; display: block;" @click="deleteImg(image.src)" />
                </v-col>
                <template v-if="files.length < 5">
                  <v-icon @click="triggerFileInput" color="white" size="150" style="cursor: pointer; margin-right: 10px;">mdi-image-outline</v-icon>
                </template>
            </v-row>

          </v-col>
      </v-row>
    </div>




<div>
 <v-row>
      <v-col>
        <v-textarea
          v-model="editedContents"
          placeholder=""
          class="custom-textarea"
          style="margin-top: 10px;"
        ></v-textarea>
      </v-col>
    </v-row>
</div>
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
      editedFiles: [], // 기존에 저장된 imageDto 객체 배열
      deletedFiles: [], // 삭제된 imageDto 객체 배열
      files: [], // 새로 추가하는 File 객체 배열
      previewImages: [] // 사용자 눈에 보이는 화면, imageDto + File
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
      triggerFileInput() {
      this.$refs.fileInput.click();
    },
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
        for (let i = 0; i < this.editedFiles.length; i++) {
          this.createImagePreviewFromUrl(this.editedFiles[i].imageUrl);
        }

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
// fileUpdate() {
//       const file = event.target.files[0]; // Get the first selected file
//       this.files.push(file);
//     },
    // async deleteImg(id) {
    //   try {
    //     await axios.patch(
    //       `${process.env.VUE_APP_API_BASIC_URL}/boardimg/delete/${id}`
    //     );
    //     this.deletedFiles.push(id);
    //   } catch (error) {
    //     console.error("Failed to delete image:", error);
    //   }
    // },
      fileUpdate(event) {
    const file = event.target.files[0];
    if (file) {
      this.files.push(file);
      this.createImagePreview(file); 
    }
  },
createImagePreviewFromUrl(imageUrl) {
  this.previewImages.push({ src: imageUrl });
},

  createImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target.result;
      this.previewImages.push({ file, src: imageSrc });
    };
    reader.readAsDataURL(file);
  },

  async deleteImg(imageSrc) {
    try {
      const indexToRemove = this.previewImages.findIndex(item => item.src === imageSrc);
      if (indexToRemove !== -1) {
        const fileToRemove = this.previewImages[indexToRemove].file;
        this.previewImages.splice(indexToRemove, 1);
        for (let i = 0; i < this.editedFiles.length; i++) {
          if(imageSrc==this.editedFiles[i].imageUrl){
            this.deletedFiles.push(this.editedFiles[i].id);
            await axios.patch(
           `${process.env.VUE_APP_API_BASIC_URL}/boardimg/delete/${this.editedFiles[i].id}`);
          }else{
            this.files = this.files.filter(file => file !== fileToRemove);
          }
        }
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  }

  },
};
</script>
<style scoped>
/* Custom Select Style */
.custom-select {
  background-color: #565656;
  color: #ffffff;
  border-radius: 5px;
  height: 70px;
}

/* Custom Text Field Style */
.custom-text-field {
  background-color: #565656;
  color: #fff;
  border-radius: 5px;
  height: 70px; /* Adjust the height as needed */
}

/* Custom File Input Style */
.custom-file-input {
  background-color: #787878;
  color: #fff;
  border-radius: 5px;
  margin-bottom: 20px; /* Adjust margin as needed */
}

/* Custom Textarea Style */
.custom-textarea {
  background-color: #787878;
  color: #fff;
  border-radius: 5px;
  height: 700px; /* Adjust height as needed */
  width: 100%;
}
</style>

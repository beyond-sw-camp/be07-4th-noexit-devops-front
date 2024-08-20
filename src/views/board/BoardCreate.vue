<template>
  <v-container>
    <div>
    <v-row class="d-flex justify-content-between mt-5">
      <v-col>
        <v-form>
          <v-row align="center" class="mb-4">
            <v-col cols="auto">
              <v-select
                v-model="category"
                :items="categoryOptions"
                item-title="text"
                item-value="value"
                class="custom-select"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="titleValue"
                label="제목을 입력해주세요."
                class="custom-text-field"
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn height="60" color="pink" @click="createBoard">등록하기</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    </div>



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
          v-model="contentValue"
          placeholder="내용을 입력해주세요."
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
  data() {
    return {
      titleValue: "",
      contentValue: "",
      boardType: "",
      category: "카테고리",
      categoryOptions: [
        { text: "FREE", value: "FREE" },
        { text: "STRATEGY", value: "STRATEGY" },
      ],
      files: [], 
    previewImages: [] 
    };
  },
  computed: {},
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async createBoard() {
      try {
        if (this.category == "FREE") {
          this.boardType = "FREE";
        } else if (this.category == "STRATEGY") {
          this.boardType = "STRATEGY";
        }

        let newBoard = new FormData();
        const data = {
          title: this.titleValue,
          contents: this.contentValue,
          boardType: this.boardType,
        };

        newBoard.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );

        this.files.forEach((file) => {
          newBoard.append("file", file, file.name);
        });

        await axios.post(
          `${process.env.VUE_APP_API_BASIC_URL}/board/create`,
          newBoard,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("게시글이 성공적으로 작성되었습니다.");
        window.location.href = "/board/list";
      } catch (e) {
        console.log(e);
        alert("게시글이 작성되지 않았습니다.");
      }
    },
   fileUpdate(event) {
    const file = event.target.files[0];
    if (file) {
      this.files.push(file);
      this.createImagePreview(file); 
    }
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
        this.files = this.files.filter(file => file !== fileToRemove);
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
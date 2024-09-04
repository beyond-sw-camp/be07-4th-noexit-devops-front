<template>
  <v-dialog v-model="localIsOpen" max-width="600px" persistent>
    <v-card style="background-color: black; color: white;">
      <v-card-title style="text-align: center;">
        <span class="text-h5">게시글 수정하기</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="updateForm" @submit.prevent="updateFindBoard">
          <!-- 제목 대신 가게 선택 버튼 추가 -->
          <v-text-field
          v-model="updateselectedStoreName"
          label="매장 선택"
          outlined
          readonly
          @click="openStoreSelectModal"
          class="mb-4"
          :style="{ color: updateselectedStoreName}"
        ></v-text-field>
        

          <v-text-field
          v-model="updatetitle"
          placeholder="제목"
          outlined
          rows="4"
          class="mb-4"
          required
          >

          </v-text-field>

          <v-textarea
            v-model="updateContents"
            :rules="[(v) => !!v || '내용을 입력하세요.']"
            placeholder="내용"
            outlined
            rows="4"
            class="mb-4"
            required
          ></v-textarea>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="updateDate"
                label="날짜 선택"
                type="date"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="updateTime"
                label="마감 시한"
                type="time"
                outlined
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-select
            v-model="updateTotalCapacity"
            :rules="[(v) => !!v || '희망 인원을 선택하세요.']"
            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            label="희망 인원"
            outlined
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="#FF0066" text @click="closeModal">취소</v-btn>
        <v-btn
          color="white"
          @click="updateFindBoard"
          :disabled="
            !updateselectedStoreName || !updateContents || !updateTotalCapacity || !updateTime || !updateDate
          "
        >
          수정하기
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog 
    v-model="isStoreModalOpen" max-width="600px" persistent>
    <v-card style="background-color: black; color: white;">
      <v-card-title class="headline" style="text-align: center;">
        가게 선택
      </v-card-title>
      <v-card-text style="max-height: 700px; overflow-y: auto;">
        <v-list style="background-color: black; color: white;">
          <v-list-item
            v-for="store in stores"
            :key="store.id"
            @click="selectStore(store.storeName)"
            style="background-color: black; color: white;"
          >
            <v-list-item-content>{{ store.storeName }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="#FF0066" text @click="closeStoreSelectModal">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  

  </v-dialog>
</template>


<script>
import axios from "axios";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    findBoard: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localIsOpen: this.isOpen,
      updateContents: "",
      updateDate: "",
      updateTime: "",
      updateTotalCapacity: "",
      updateselectedStoreName: "", // 선택된 가게 이름 저장
      stores: [], // 서버에서 불러온 가게 목록
      isStoreModalOpen: false, // 가게 선택 모달의 열림 상태
      updatetitle:"",
    };
  },
  watch: {
    isOpen(newVal) {
      this.localIsOpen = newVal;
      if (newVal) {
        this.populateFields();
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    populateFields() {
      if (this.findBoard) {
        this.updatetitle = this.findBoard.title;
        this.updateselectedStoreName = this.findBoard.selectedStoreName;
        this.updateContents = this.findBoard.contents;

        // 서버에서 받은 UTC 시간을 로컬 시간으로 변환
        const expirationDateTime = new Date(this.findBoard.expirationTime);

        // 9시간 추가 (시간대 보정)
        expirationDateTime.setHours(expirationDateTime.getHours() + 9);

        // ISO 문자열로 변환 후 날짜와 시간 분리
        this.updateDate = expirationDateTime.toISOString().substr(0, 10);
        this.updateTime = expirationDateTime.toISOString().substr(11, 5);

        this.updateTotalCapacity = this.findBoard.totalCapacity;
      }
    },
    async updateFindBoard() {
      try {
        // 사용자가 입력한 날짜와 시간으로부터 Date 객체 생성
        const updateExpirationDateTime = new Date(
          `${this.updateDate}T${this.updateTime}:00`
        );

        // 입력된 시간에 9시간을 추가 (로컬 시간이므로, 서버에 저장할 때는 UTC로 변환됨)
        updateExpirationDateTime.setHours(
          updateExpirationDateTime.getHours() + 9
        );

        const requestData = {
          
          title: this.updatetitle,
          selectedStoreName: this.updateselectedStoreName,
          contents: this.updateContents,
          expirationDate: updateExpirationDateTime.toISOString(), // 서버에 전송할 데이터
          totalCapacity: this.updateTotalCapacity,
        
        };

        console.log('Request Data:', requestData); 

        const response = await axios.put(
          `http://localhost:8080/findboard/update/${this.findBoard.id}`,
          requestData
        );
        console.log("업데이트 완료:", response.data);
        alert("업데이트 완료");
        this.closeModal();
        this.$emit("updated");

        // 페이지 전환 후, 데이터를 다시 로드하여 권한 상태를 반영
        window.location.reload();
      } catch (error) {
        console.error("업데이트 실패:", error);
        alert("업데이트 실패");
      }
    },
    async fetchStores() {
      try {
        const response = await axios.get("http://localhost:8080/store/list");
        this.stores = response.data.result;
      } catch (error) {
        console.error("Error fetching stores:", error);
        alert("가게 목록을 불러오는데 실패했습니다.");
      }
    },
    openStoreSelectModal() {
      this.isStoreModalOpen = true;
      this.fetchStores();
    },
    closeStoreSelectModal() {
      this.isStoreModalOpen = false;
    },
    selectStore(storeName) {
      this.updateselectedStoreName = storeName;
      this.closeStoreSelectModal();
    },
  },
};
</script>

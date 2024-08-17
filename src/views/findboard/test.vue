import CreateFindBoardModal from "./CreateFindBoardModal.vue"; // 모달 컴포넌트 import


components: {
    CreateFindBoardModal,
  },

  // 모달 제어를 위한 데이터
  isCreateModalOpen: false,

  openCreateModal() {
    this.isCreateModalOpen = true;
  },
  closeCreateModal() {
    this.isCreateModalOpen = false;
  },
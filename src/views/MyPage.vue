<template>
    <v-container>
        <v-row>


            <MypageHeaderComponent />
            <v-col>
                <v-card-text>
                    <v-col cols="3" class="d-flex align-center">
                        <v-avatar size="80" class="mr-3">
                            <img :src="memberInfoList.find(item => item.key === 'profileImage')?.value" alt="프로필 이미지"
                                @click="selectImage" />
                        </v-avatar>
                        <input type="file" ref="fileInput" @change="onImageChange" accept="image/*"
                            style="display: none;" />
                        <v-btn color="primary" v-if="isEditing" @click="updateMember">
                            저장
                        </v-btn>
                        <v-btn color="primary" v-if="!isEditing" @click="updaetIsEditing">
                            프로필 수정
                        </v-btn>
                        <v-btn color="secondary" v-if="isEditing" @click="updaetIsEditing">
                            취소
                        </v-btn>
                    </v-col>
                    <!-- 이미지는 dto에 존재하지 않아서 어떻게 가져와야할지 추후 수정필요 -->
                    <!-- <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" v-if="isEditing" @click="updateMember">
                            저장
                        </v-btn>
                        <v-btn color="primary" v-if="!isEditing" @click="updaetIsEditing">
                            프로필 수정
                        </v-btn>
                        <v-btn color="secondary" v-if="isEditing" @click="updaetIsEditing">
                            취소
                        </v-btn>
                    </v-card-actions> -->
                    <v-form v-for="element in memberInfoList" :key="element.id">
                        <v-text-field :label="element.key" v-model="element.value"></v-text-field>
                    </v-form>
                </v-card-text>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import MypageHeaderComponent from '@/components/MypageSideBarComponent.vue'
export default {
    components: {
        MypageHeaderComponent
    },
    data() {
        return {
            memberInfo: {},
            memberInfoList: [],
            isEditing: false,
        }
    },
    async created() {
        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`);
        this.memberInfo = response.data.result;
        this.memberInfoList = [
            // { key: "프로필이미지", value: this.memberInfo.image },
            { key: "username", value: this.memberInfo.username },
            { key: "nickname", value: this.memberInfo.nickname },
            { key: "phone_number", value: this.memberInfo.phone_number },
            { key: "age", value: this.memberInfo.age },
        ];
    },
    methods: {
        async updateMember() {
            try {
                console.log(this.memberInfoList);
                // 수정된 정보로 업데이트
                const updateData = {};
                this.memberInfoList.forEach(element => {
                    updateData[element.key] = element.value;
                });
                await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/member/update`, updateData);
                window.location.reload();
            } catch (e) {
                const error_message = e.response.data.error_message
                console.error(error_message);
                alert(error_message);
            }
        },
        updaetIsEditing() {
            this.isEditing = !this.isEditing
        },
        selectImage() {
            this.$refs.fileInput.click();
        },
        onImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const profileImage = this.memberInfoList.find(item => item.key === 'profileImage');
                    if (profileImage) {
                        profileImage.value = e.target.result; // Update profile image in the list
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }
}
</script>
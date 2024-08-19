<template>
    <v-container style="color:#ffffff;">
        <v-row justify="center">
            <MypageSideBarComponent />
            <v-col>
                <v-row justify="center">
                    <v-col cols="12" md="8">
                        <v-card-text>
                            <v-row class="d-flex align-center justify-space-between">
                                <v-col cols="auto" class="d-flex align-center img-area">
                                    <v-avatar size="80" class="mr-3">
                                        <img :src="memberInfoList.find(item => item.key === 'profileImage')?.value"
                                            alt="프로필 이미지" @click="selectImage" class="profile-image" display="none" />
                                    </v-avatar>
                                    <input type="file" @change="onImageChange" accept="image/*"
                                        style="display: none;" />
                                </v-col>
                                <v-col cols="auto" class="d-flex justify-end">
                                    <v-btn v-if="!isEditing" @click="updateMember" class="update-btn">
                                        프로필 수정
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <v-form v-for=" element in memberInfoList" :key="element.id" class="form-area">
                                <v-text-field v-if="element.key !== 'profileImage'" :label="element.key"
                                    v-model="element.value" class="custom-text-field"></v-text-field>
                            </v-form>
                        </v-card-text>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>


</template>

<script>
import axios from 'axios';
import MypageSideBarComponent from '@/components/common/MypageSideBarComponent.vue'
export default {
    components: {
        MypageSideBarComponent,
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
            { key: "profileImage", value: this.memberInfo.profile_image },
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
                        profileImage.value = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }
}
</script>

<style>
.v-card-text>.v-form>.v-text-field {
    all: unset;
}

.img-area {
    margin-bottom: 30px;
}

.update-btn {
    color: #ffffff;
    background-color: #FF0066;
}

.custom-text-field .v-input__control {
    height: 60px;
}

.v-field__input {
    padding-top: 10px;
}

.profile-image {
    width: 130%;
    height: 140%;
    object-fit: cover;
}
</style>
import MemberCreate from '@/views/MemberCreate.vue'
import LoginPage from '@/views/LoginPage.vue'

export const memberRouter = [
    {
        path: '/member/create',
        name: 'MemberCreate',
        component: MemberCreate
    },
    {
        path: '/doLogin',
        name: 'LoginPage',
        component: LoginPage
    }



]
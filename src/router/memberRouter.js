import MemberCreate from '@/views/member/MemberCreate.vue'
import LoginPage from '@/views/member/LoginPage.vue'
import MyPage from '@/views/member/MyPage.vue'
import WishList from '@/views/member/WishList.vue'
import HomeComponent from '@/views/HomeComponent.vue'
import MemberRanking from '@/views/member/MemberRanking.vue'

export const memberRouter = [
    {
        path: '/member/create',
        name: 'MemberCreate',
        component: MemberCreate
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/mypage',
        name: 'MyPage',
        component: MyPage
    },

    {
        path: '/wishList',
        name: 'WishList',
        component: WishList
    },
    {
        path: '/',
        name: 'HomeComponent',
        component: HomeComponent
    },
    {
        path: '/ranking',
        name: 'MemberRanking',
        component: MemberRanking

    }





]
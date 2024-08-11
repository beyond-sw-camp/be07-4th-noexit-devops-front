import MemberCreate from '@/views/MemberCreate.vue'
import LoginPage from '@/views/LoginPage.vue'
import MyPage from '@/views/MyPage.vue'
import MemberReviewList from '@/views/MemberReviewList.vue'
import WishList from '@/views/WishList.vue'

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
        path: '/review/myall',
        name: 'MemberReviewList',
        component: MemberReviewList
    },
    {
        path: '/wishList',
        name: 'WishList',
        component: WishList
    }




]
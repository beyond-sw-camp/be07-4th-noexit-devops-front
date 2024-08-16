import BoardCreate from '@/views/board/BoardCreate.vue'
import BoardList from '@/views/board/BoardList.vue'
import BoardDetail from '@/views/board/BoardDetail.vue'
import BoardUpdate from '@/views/board/BoardUpdate.vue'

export const boardRouter = [
    {
        path: '/board/create',
        name: 'BoardCreate',
        component: BoardCreate
    },
    {
        path: '/board/list',
        name: 'BoardList',
        component: BoardList
    },
    {
        path: '/board/detail/:id',
        name: 'BoardDetail',
        component: BoardDetail,
        props: true
    },
    {
        path: '/board/update/:id',
        name: 'BoardUpdate',
        component: BoardUpdate,
        props: true
    },



]
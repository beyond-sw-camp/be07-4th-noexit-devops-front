
import GameList from '@/views/game/GameList.vue'
import GameDetail from '@/views/game/GameDetail.vue'

export const gameRouter = [
    {
        path: '/game/list',
        name: 'GameList',
        component: GameList
    },
    {
        path: '/game/detail/:id',
        name: 'GameDetail',
        component: GameDetail
    },
]
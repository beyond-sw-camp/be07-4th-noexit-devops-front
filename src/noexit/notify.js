function initState() {
    return {
        productsInCart: JSON.parse(localStorage.getItem('notifyList')) || [], //장바구니에 담겨있는 상품들
        totalQuantity: JSON.parse(localStorage.getItem('totalNotification')) || 0,   // 총 갯수

    }
}

const practice = {
    state: initState,
    mutations: {
        addCart(state, product) {
            //기존에 이미 장바구니에 존재하던 물품들의 갯수에 더해줘야함
            // state.productsInCart = [...state.productsInCart, ...products]

            const existProduct = state.notifyList.find(p => p.id == product.id);
            if (existProduct) {
                // 이미 장바구니에 존재한다면
                existProduct.quantity += product.quantity;
            } else {
                // 존재하지 않는다면 product 자체를 추가
                state.productsInCart.push(product);
            }
            // state.totalQuantity += product.quantity;
            state.totalQuantity = parseInt(state.totalQuantity) + product.quantity;

            // localStorage에 저장 -> 저장 안하면 새로고침하면 안녕..
            // localStorage에 역직렬화하여 삽입
            // updateLocalStorage(state.productsInCart, state.totalQuantity);
            localStorage.setItem("productsInCart", JSON.stringify(state.productsInCart));
            localStorage.setItem("totalQuantity", state.totalQuantity);
        },
        clearCart(state) {
            state.productsInCart = [];
            state.totalQuantity = 0;
            localStorage.removeItem("productsInCart");
            localStorage.removeItem("totalQuantity");
        },
    },
    actions: {
        addCart(context, product) {
            context.commit('addCart', product);
        },
        clearCart(context) {
            context.commit('clearCart');
        },
    },
    getters: {
        getTotalQuantity: state => state.totalQuantity,
        getCarts: state => state.productsInCart,
    },
}

export default practice;

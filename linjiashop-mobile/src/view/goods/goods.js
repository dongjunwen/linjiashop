import goods from '@/api/goods'
import cart from '@/api/cart'
import {
    Cell,
    CellGroup,
    Col,
    GoodsAction,
    GoodsActionButton,
    GoodsActionIcon,
    Icon,
    Sku,
    Swipe,
    SwipeItem,
    Tabbar,
    TabbarItem,
    Tag,
    Toast
} from 'vant';

const baseApi = process.env.VUE_APP_BASE_API

export default {
    components: {
        [Tag.name]: Tag,
        [Col.name]: Col,
        [Icon.name]: Icon,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        [GoodsAction.name]: GoodsAction,
        [GoodsActionIcon.name]: GoodsActionIcon,
        [GoodsActionButton.name]: GoodsActionButton,
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem,
        [Sku.name]: Sku
    },

    data() {
        return {
            showSku:false,
            sku: {
                tree: [
                ],

                list: [
                ],
                price: '0', // 默认价格（单位元）
                stock_num: 20, // 商品总库存
                collection_id: 0, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
                none_sku: false, // 是否无规格商品
                hide_stock: false // 是否隐藏剩余库存
            },
            goods: {
                name: '',
                price: 0,
                express: '免运费',
                remain: 0,
                thumb: []
            }
        };
    },
    created() {
        console.log('init')
        this.init()
    },
    computed: {
        cartCount() {
            return 2
        }
    },
    methods: {
        init() {
            let id = this.$route.params.id
            goods.getGoods(id).then(response => {
                let goods = response.data.goods
                let sku = response.data.sku
                sku.price = (sku.price / 100).toFixed(2)
                this.sku = sku
                goods.thumb = new Array()
                goods.picture = baseApi + '/file/getImgStream?idFile=' +goods.pic
                const gallery = goods.gallery.split(',')
                for (var index in gallery) {
                    goods.thumb.push(baseApi + '/file/getImgStream?idFile=' + gallery[index])
                }
                this.goods = goods
            }).catch((err) => {
                console.log('err',err)
                Toast(err)
            })
        },
        toHome() {
            this.$router.push('/index')
        },
        formatPrice() {
            return '¥' + (this.goods.price / 100).toFixed(2)
        },

        goToCart() {
            this.$router.push('/cart');
        },
        addCart() {
            this.showSku = true
        },
        buy() {
            this.showSku = true
        },
        sorry() {
            Toast('敬请期待...')
        },
        onBuyClicked(skuData) {
            let cartData = {idGoods:skuData.goodsId,idSku:this.sku.none_sku?'':skuData.selectedSkuComb.id,count:skuData.selectedNum}
            cart.add(cartData).then( response => {
                this.$router.push('/cart');
                this.showSku = false
            })
        },
        onAddCartClicked(skuData) {
            let cartData = {idGoods:skuData.goodsId,idSku:this.sku.none_sku?'':skuData.selectedSkuComb.id,count:skuData.selectedNum}
            cart.add(cartData).then( response => {
                console.log(response)
                Toast.success('已加入到购物车')
                this.showSku = false
            })

        }
    }
};

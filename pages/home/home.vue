<template>
  <view>
    <view class="search-box">
        <yy-search @click="gotoSearch"></yy-search>
    </view>
   <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src" ></image>
        </navigator>
      </swiper-item>
    </swiper>
    
   <!-- 分类导航区域 -->
   <view class="nav-list">
     <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
       <image :src="item.image_src" class="nav-img" ></image>
     </view>
   </view>
  </view>
  
  <!-- 楼层区域 -->
    <view class="floor-list">
        <view class="floor-item" v-for="(item, i) in floorList" :key="i">
          <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!--  楼层的图片区域 -->
            <view class="floor-img-box">
        <!--  左侧大图片的盒子 -->
              <navigator class="left-img-box" :url="item.product_list[0].url">
             <image :src="item.product_list[0].image_src"  :style="{width: item.product_list[0].image_width + 'rpx' }" mode="widthFix"></image>
            </navigator>
           <!-- 右侧4个小图片的盒子 -->
           <view class="right-img-box">
             <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-show="i2 !== 0 " :url="item2.url">
               <image :src="item2.image_src" :style="{width: item2.image_width + 'rpx' }" mode="widthFix"></image>
             </navigator> 
           </view>
          </view>
        </view>
      </view>
</template>


<script>
  export default {
    data() {
      return {
        //轮播图的数据列表
        swiperList: [],
        //首页分类选项的列表
        navList: [],
        //楼层数据的列表
        floorList: []
      };
    },
    onLoad() {
      //在刚加载时获取数据
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      async getSwiperList() {
        const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status !== 200) return uni.$showMsg()
        
        this.swiperList = res.message
      },
      async getNavList() {
        const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) return uni.$showMsg()
        
         this.navList = res.message
      },
      navClickHandler(item) {
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
     async getFloorList() {
       const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
         if (res.meta.status !== 200) return uni.$showMsg()
      
          //对数据进行处理,因为数据接口的路径与实际不同
          res.message.forEach(floor => {//第一个循环拿到外部的楼层信息
            floor.product_list.forEach(prod => {//第二个循环拿到每个图片的信息对象
              prod.url ='/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
            })
          })
          this.floorList = res.message
          console.log(this.floorList)
     },
     gotoSearch() {
       uni.navigateTo({
         url:'/subpkg/search/search'
       })
     }
    }
  }
</script>

<style lang="scss">
swiper{
  height: 330rpx;
  .swiper-item,
  image{
    width: 100%;
    height: 100%;
  }
}

.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

.floor-title {
  width: 100%;
  height: 60rpx;
}

.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
//吸顶效果
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
  }
</style>
<template>
  <view>
    <view class="search-box">
   <uni-search-bar type="search" @input="input" :radius="100" placeholder="请输入搜索内容" cancelButton="none" :focus="true"></uni-search-bar>
    </view>
     
   <!-- 搜索建议列表 -->
   <view class="sugg-list" v-if="kw.length !== 0">
     <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
       <view class="goods-name">{{ item.goods_name }}</view>
        <uni-icons type="forward" size="16"></uni-icons>
     </view>
   </view>
   
  <!-- 搜索历史 -->
  <view class="history-box" v-if="kw.length == 0">
    <!-- 标题区域 -->
    <view class="history-title">
      <text>搜索历史</text>
      <uni-icons type="trash" size="17" @click="clean"></uni-icons>
    </view>
    <!-- 列表区域 -->
    <view class="history-list">
      <uni-tag :text="item" v-for="(item, i) in  histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
    </view>
  </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //延时器
        timer: null,
        kw: '',
        //搜索结果列表
        searchResults :[],
        //搜索历史的数组
        historyList: []
      }
    },
    methods: {
      //input输入事件
      input(e) {
        clearTimeout(this.timer)//执行前的清空
      //防抖
        this.timer = setTimeout(() => {
           this.kw = e
           this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        if(this.kw.length === 0) {
          this. searchResults = []
          return
        }
        
        const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', { query:this.kw })
          if (res.meta.status !== 200) return uni.$showMsg()
          this.searchResults = res.message
          
          this.saveSearchHistory()
      },
      gotoDetail(item) {
        console.log( item.goods_id )
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      saveSearchHistory() {
        // this.historyList.push(this.kw)!!!解决关键词重复的问题
        //1.将 Array 数组转化为 Set 对象
        const set = new Set(this.historyList)
        //2.调用 Set 对象的 delete 和 add 方法，删增元素
        set.delete(this.kw)
        set.add(this.kw)
        //3.将 Set 对象转化为 Array 数组
        this.historyList = Array.from(set)
        //将搜索历史存储到本地
        uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      clean() {
        this.historyList = []
        uni.setStorageSync('kw', '[]')
      },
      gotoGoodsList(kw) {
        console.log(kw)
        uni.navigateTo({
          url:'subpkg/gooods_list/gooods_list?query='+kw
        })
      }
    },
    onload() {
      this.historyList = JSON.parse(uni.getStorageSync('kw')||'[]')
    },
    //前后顺序问题
    computed: {
      histories() {
      return [...this.historyList].reverse()
      }
    },
  }
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999
  }

.sugg-list {
  padding: 0 15px;
  .sugg-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    
    .goods-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.history-box{
  padding: 0 5px;
  .history-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: #efefef 1px solid;
  }
  .history-list{
    dispaly: flex;
    flex-wrap: warp;
    margin-top: 5px;
    .uni-tag{
      margin-top: 5px;
      margin-right: 5px;
      background-color: #efefef;
      color: #111;
      border: 1px solid #efefef;
    }
  }
}
</style>

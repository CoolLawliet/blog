<template>
  <div>
    <!-- 用户喜欢的文章列表 -->
    <div class="card border-0 g-mb-15">
      <!-- Panel Header -->
      <div class="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15">
        <h3 class="h6 mb-0">
          <i class="icon-bubbles g-pos-rel g-top-1 g-mr-5"></i> 喜欢的文章 <small v-if="datalist">(共 {{ count }} 篇, {{ page_total }} 页)</small>
        </h3>
        <div class="dropdown g-mb-10 g-mb-0--md">
          <span class="d-block g-color-primary--hover g-cursor-pointer g-mr-minus-5 g-pa-5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="icon-options-vertical g-pos-rel g-top-1"></i>
          </span>
          <div class="dropdown-menu dropdown-menu-right rounded-0 g-mt-10">


            <router-link :to="{ path: $route.path, query: { page: 1, per_page: 5 }}" class="dropdown-item g-px-10">
              <i class="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 5 篇
            </router-link>
            <router-link :to="{ path: $route.path, query: { page: 1, per_page: 10 }}" class="dropdown-item g-px-10">
              <i class="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 10 篇
            </router-link>

            <div class="dropdown-divider"></div>

            <router-link :to="{ path: $route.path, query: { page: 1, per_page: 20 }}" class="dropdown-item g-px-10">
              <i class="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 20 篇
            </router-link>

          </div>
        </div>
      </div>
      <!-- End Panel Header -->

      <!-- Panel Body -->
      <div v-if="datalist" class="card-block g-pa-0" >

        <div class="media g-brd-around g-brd-gray-light-v4 g-brd-left-1 g-pa-20 g-mb-20"
          v-for="(post, index) in datalist" :key="index">

          <router-link :to="{ path: `/user/${post.author.id}` }" :title="post.author.name || post.author.username">
            <span v-if="post.is_new" class="d-inline-block g-pos-rel">
              <span class="u-badge-v2--xs u-badge--top-left g-bg-red g-mt-7 g-ml-7"></span>
              <img class="d-flex g-brd-around g-brd-gray-light-v3 g-pa-2 g-width-40 g-height-40 rounded-circle rounded mCS_img_loaded g-mt-3 g-mr-15" :src="post.author.avatar" :alt="post.author.name || post.author.username">
            </span>
            <img v-else class="d-flex g-brd-around g-brd-gray-light-v3 g-pa-2 g-width-40 g-height-40 rounded-circle rounded mCS_img_loaded g-mt-3 g-mr-15" :src="post.author.avatar" :alt="post.author.name || post.author.username">
          </router-link>

          <div class="media-body">
            <div class="g-mb-15">
              <h5 class="h5 g-color-gray-dark-v1 mb-0">
                <small class="g-font-size-12 g-color-aqua g-mr-5">你喜欢了</small>
                <router-link :to="{ path: `/user/${post.author.id}` }" class="g-text-underline--none--hover">{{ post.author.name || post.author.username }}</router-link>
                <span class="h6 g-color-aqua">的文章<router-link :to="{ name: 'PostDetail', params: { id: post.id } }" class="g-text-underline--none--hover">《{{ post.title }}》</router-link></span>
              </h5>
              <span class="g-color-gray-dark-v4 g-font-size-12">{{ $moment(post.timestamp).format('YYYY年MM月DD日 HH:mm:ss') }}</span>
            </div>

            <!-- vue-markdown 开始解析markdown，它是子组件，通过 props 给它传值即可
            v-highlight 是自定义指令，用 highlight.js 语法高亮 -->
            <vue-markdown
              :source="post.summary"
              class="markdown-body g-mb-15"
              v-highlight>
            </vue-markdown>

            <div class="d-flex justify-content-start">
              <ul class="list-inline mb-0">
                <li class="list-inline-item g-mr-20">
                  <a class="g-color-gray-dark-v5 g-text-underline--none--hover" href="javascript:;">
                    <i class="icon-eye g-pos-rel g-top-1 g-mr-3"></i> {{ post.views }}
                  </a>
                </li>
                <li class="list-inline-item g-mr-20">
                  <router-link :to="{ path: `/post/${post.id}#like-post` }" class="g-color-gray-dark-v5 g-text-underline--none--hover">
                    <i class="icon-heart g-pos-rel g-top-1 g-mr-3"></i> {{ post.likers_count }}
                  </router-link>
                </li>
                <li class="list-inline-item g-mr-20">
                  <router-link :to="{ path: `/post/${post.id}#comment-list-wrap` }" class="g-color-gray-dark-v5 g-text-underline--none--hover">
                    <i class="icon-bubble g-pos-rel g-top-1 g-mr-3"></i> {{ post.comments_count }}
                  </router-link>
                </li>
              </ul>
              <ul class="list-inline mb-0 ml-auto">

              </ul>
            </div>
          </div>
        </div>

      </div>
      <!-- End Panel Body -->
    </div>

    <!-- Pagination #04 -->
    <div v-if="datalist">
      <pagination
       :cur-page="page"
        :per-page="per_page"
        :total-pages="page_total">
      </pagination>
    </div>
    <!-- End Pagination #04 -->
  </div>
</template>

<script>
import store from '../../store'
import Post from '../../components/Post'
// 导入 vue-markdown 组件解析 markdown 原文为　HTML
import VueMarkdown from 'vue-markdown'
import Pagination from '../../components/Pagination'
export default {
  name: 'Posts',  // this is the name of the component
  components: {
    Post,
    VueMarkdown,
    Pagination
  },
  data () {
    return {
          page :1,
      per_page: 5,

      count:0,
      page_total:0,
      sharedState: store.state,
      posts: '',
        datalist:[]
    }
  },
  methods: {
    getUserLikedPosts (id) {
      if (typeof this.$route.query.page != 'undefined') {
        this.page = this.$route.query.page
      }

      if (typeof this.$route.query.per_page != 'undefined') {
        this.per_page = this.$route.query.per_page
      }

      const path = `/api/users/${id}/liked-posts/?page=${this.page}&per_page=${this.per_page}/`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.posts = response.data
              this.datalist = response.data.results
          this.posts = response.data.data
          this.count=response.data.count
          this.page_total = Math.ceil(this.count/this.per_page)
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    }
  },
  created () {
    const user_id = this.$route.params.id || this.sharedState.user_id
    this.getUserLikedPosts(user_id)
  },
  // 当路由变化后(比如变更查询参数 page 和 per_page)重新加载数据
  beforeRouteUpdate (to, from, next) {
    next()
    const user_id = to.params.id || this.sharedState.user_id
    this.getUserLikedPosts(user_id)
  }
}
</script>

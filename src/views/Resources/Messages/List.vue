<template>
  <div>
    <!-- 用户发送的私信列表 -->
    <div class="card border-0 g-mb-15">
      <!-- Panel Header -->
      <div class="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15">
        <h3 class="h6 mb-0">
          <i class="icon-bubbles g-pos-rel g-top-1 g-mr-5"></i> Sent Messages <small v-if="messages">(共 {{ count }} 条, {{page_total }} 页)</small>
        </h3>
        <div class="dropdown g-mb-10 g-mb-0--md">
          <span class="d-block g-color-primary--hover g-cursor-pointer g-mr-minus-5 g-pa-5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="icon-options-vertical g-pos-rel g-top-1"></i>
          </span>
          <div class="dropdown-menu dropdown-menu-right rounded-0 g-mt-10">

           <router-link :to="{ path: $route.path, query: { page: 1, per_page: 5 }}" class="dropdown-item g-px-10">
                  <i class="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 5 条顶层评论
                </router-link>
                <router-link :to="{ path: $route.path, query: { page: 1, per_page: 10 }}" class="dropdown-item g-px-10">
                  <i class="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 10 条顶层评论
                </router-link>

                <div class="dropdown-divider"></div>

                <router-link :to="{ path: $route.path, query: { page: 1, per_page: 20 }}" class="dropdown-item g-px-10">
                  <i class="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 20 条顶层评论
                </router-link>

          </div>
        </div>
      </div>
      <!-- End Panel Header -->

      <!-- Panel Body -->
      <div class="d-flex justify-content-start g-brd-around g-brd-gray-light-v4 g-brd-left-1 g-pa-20 g-mb-10"
        v-for="(message, index) in messages_list" :key="index">
        <div class="g-mt-2">
          <router-link :to="{ path: `/user/${message.recipient.id}` }">
            <span v-if="message.is_new" class="d-inline-block g-pos-rel">
              <span class="u-badge-v2--xs u-badge--top-left g-bg-red g-mt-7 g-ml-7"></span>
              <img class="g-brd-around g-brd-gray-light-v4 g-pa-2 g-width-50 g-height-50 rounded-circle" :src="message.recipient.avatar" :alt="message.recipient.name || message.recipient.username">
            </span>
            <img v-else class="g-brd-around g-brd-gray-light-v4 g-pa-2 g-width-50 g-height-50 rounded-circle" :src="message.recipient.avatar" :alt="message.recipient.name || message.recipient.username">
          </router-link>
        </div>
        <div class="align-self-center g-px-10">
          <h5 class="h5 g-color-gray-dark-v1 mb-0">
            <small class="g-font-size-12 g-color-aqua g-mr-5">你给</small>
            <router-link :to="{ path: `/user/${message.recipient.id}` }" class="g-text-underline--none--hover">
              <span class="g-mr-5">{{ message.recipient.name || message.recipient.username }}</span>
            </router-link>
            <small class="g-font-size-12 g-color-aqua g-mr-5">发送了 {{ message.total_count }} 条私信, </small> <small v-if="message.new_count" class="g-font-size-12 g-color-deeporange"> {{ message.new_count }}条未读</small>
          </h5>
          <p class="m-0">{{ $moment(message.timestamp).format('YYYY年MM月DD日 HH:mm:ss') }}</p>
        </div>
        <div class="align-self-center ml-auto">
          <router-link :to="{ name: 'MessagesHistoryResource', query: { from: message.recipient.id } }">
            <button class="btn btn-block u-btn-outline-primary g-rounded-20 g-px-10">聊天记录</button>
          </router-link>
        </div>
      </div>
      <!-- End Panel Body -->
    </div>

    <!-- Pagination #04 -->
    <div v-if="messages">
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
import store from '../../../store'
import Pagination from '../../../components/Pagination'

export default {
  name: 'MessagesResource',  // this is the name of the component
  components: {
    Pagination
  },
  data () {
    return {
         page :1,
      per_page: 5,
      count:0,
       page_total:0,
      sharedState: store.state,
      messages: '',
        messages_list:[],
    }
  },
  methods: {
    getUserMessagesRecipients (id) {  // 用户给哪些人发送过私信
       if (typeof this.$route.query.page != 'undefined') {
        this.page = this.$route.query.page
      }

      if (typeof this.$route.query.per_page != 'undefined') {
        this.per_page = this.$route.query.per_page
      }



      const path = `/api/users/${id}/messages-recipients/?page=`+this.page+'&per_page='+this.per_page
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.messages = response.data.results
          this.messages_list = response.data.results


        this.count=response.data.count

          this.page_total = Math.floor(this.count/this.per_page)
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    }
  },
  created () {
    this.getUserMessagesRecipients(this.sharedState.user_id)
  },
  // 当路由变化后(比如变更查询参数 page 和 per_page)重新加载数据
  beforeRouteUpdate (to, from, next) {
    next()
    this.getUserMessagesRecipients(this.sharedState.user_id)
  }
}
</script>

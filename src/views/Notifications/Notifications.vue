<template>
  <div class="container g-pt-20">
    <div class="row">
      <!-- 左边菜单栏 -->
      <div class="col-lg-3 g-mb-50">
        <aside class="g-brd-around g-brd-gray-light-v4 rounded g-px-20 g-py-30">
          <!-- 用户头像 -->
          <div v-if="user" class="text-center g-pos-rel g-mb-30">
            <div class="g-width-100 g-height-100 mx-auto mb-3">

              <img class="img-fluid rounded-circle g-brd-around g-brd-gray-light-v4 g-pa-2" :src="user.avatar" :alt="user.name || user.username">

            </div>

            <span class="d-block g-font-weight-500">{{ user.name || user.username }}</span>

            <router-link :to="{ path: `/user/${sharedState.user_id}` }">
              <span class="u-icon-v3 u-icon-size--xs g-color-white--hover g-bg-primary--hover rounded-circle g-pos-abs g-top-0 g-right-15 g-cursor-pointer" title="Go To Your Profile"
                    data-toggle="tooltip"
                    data-placement="top">
                <i class="icon-finance-067 u-line-icon-pro"></i>
              </span>
            </router-link>
          </div>
          <!-- End 用户头像 -->

          <hr class="g-brd-gray-light-v4 g-my-30">

          <!-- 菜单列表 -->
          <ul class="list-unstyled mb-0">
            <li class="g-pb-3">
              <router-link :to="{ name: 'RecivedComments' }" :active-class="'active g-color-primary--active g-bg-gray-light-v5--active'" class="d-block align-middle u-link-v5 g-color-text g-color-primary--hover g-bg-gray-light-v5--hover rounded g-pa-3">
                <span class="u-icon-v1 g-color-gray-dark-v5 mr-2"><i class="icon-finance-206 u-line-icon-pro"></i></span>
                评论
                 <span v-if="notifications.unread_recived_comments_count" class="u-label g-font-size-11 g-bg-pink g-rounded-20 g-px-8 g-ml-15">{{ notifications.unread_recived_comments_count }}</span>
              </router-link>
            </li>
            <li class="g-py-3">

             <router-link :to="{ name: 'MessagesIndex' }" :active-class="'active g-color-primary--active g-bg-gray-light-v5--active'" class="d-block align-middle u-link-v5 g-color-text g-color-primary--hover g-bg-gray-light-v5--hover rounded g-pa-3">

                <span class="u-icon-v1 g-color-gray-dark-v5 mr-2"><i class="icon-communication-154 u-line-icon-pro"></i></span>
               私信
                <span v-if="notifications.unread_messages_count" class="u-label g-font-size-11 g-bg-pink g-rounded-20 g-px-8 g-ml-15">{{ notifications.unread_messages_count }}</span>


              </router-link>
            </li>
            <li class="g-py-3">
              <router-link :to="{ name: 'Follows' }" :active-class="'active g-color-primary--active g-bg-gray-light-v5--active'" class="d-block align-middle u-link-v5 g-color-text g-color-primary--hover g-bg-gray-light-v5--hover rounded g-pa-3">
                <span class="u-icon-v1 g-color-gray-dark-v5 mr-2"><i class="icon-finance-067 u-line-icon-pro"></i></span>
                粉丝

                <span v-if="notifications.unread_follows_count" class="u-label g-font-size-11 g-bg-pink g-rounded-20 g-px-8 g-ml-15">{{ notifications.unread_follows_count }}</span>

              </router-link>
            </li>
            <li class="g-py-3">
              <router-link :to="{ name: 'CommentsLikes' }" :active-class="'active g-color-primary--active g-bg-gray-light-v5--active'" class="d-block align-middle u-link-v5 g-color-text g-color-primary--hover g-bg-gray-light-v5--hover rounded g-pa-3">
                <span class="u-icon-v1 g-color-gray-dark-v5 mr-2"><i class="icon-medical-008 u-line-icon-pro"></i></span>
                赞
                <span v-if="notifications.unread_comments_likes_count" class="u-label g-font-size-11 g-bg-pink g-rounded-20 g-px-8 g-ml-15">{{ notifications.unread_comments_likes_count  }}</span>

              </router-link>
            </li>

            <li class="g-py-3">
             <router-link :to="{ name: 'PostsLikes' }" :active-class="'active g-color-primary--active g-bg-gray-light-v5--active'" class="d-block align-middle u-link-v5 g-color-text g-color-primary--hover g-bg-gray-light-v5--hover rounded g-pa-3">
                <span class="u-icon-v1 g-color-gray-dark-v5 mr-2"><i class="icon-christmas-056 u-line-icon-pro"></i></span>
                文章被喜欢
                <span v-if="notifications.unread_posts_likes_count" class="u-label g-font-size-11 g-bg-pink g-rounded-20 g-px-8 g-ml-15">{{ notifications.unread_posts_likes_count }}</span>
              </router-link>
             </li>
          </ul>
          <!-- End 菜单列表 -->
        </aside>
      </div>
      <!-- End 左边菜单栏 -->

      <!-- 右边子路由匹配后，显示对应的组件 -->
      <div class="col-lg-9 g-mb-50">

        <router-view></router-view>

      </div>
      <!-- End 嵌套路由 -->
    </div>
  </div>
</template>

<script>
import store from '../../store'

export default {
  name: 'Notifications',  // this is the name of the component
  data () {
    return {
      sharedState: store.state,
      user: '',
      notifications: {
        unread_recived_comments_count: 0,
        unread_follows_count: 0,
        unread_comments_likes_count: 0,
        // unread_followeds_posts_count: 0
          unread_messages_count: 0,
            unread_posts_likes_count: 0,
      }
    }
  },
  methods: {
    getUser (id) {
      const path = `/api/users/${id}/`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.user = response.data.data
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },

      getUserNotifications (id) {
      let since = 0
      const path = `/api/users/${id}/notifications/?since=${since}`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          const len = response.data.data.length
          for(var i = 0; i < len; i++) {
            switch (response.data.data[i].name) {
              case 'unread_recived_comments_count':
                this.notifications.unread_recived_comments_count = parseInt(response.data.data[i].payload_json)
                break

              case 'unread_follows_count':
                this.notifications.unread_follows_count = parseInt(response.data.data[i].payload_json)
                break

              case 'unread_comments_likes_count':
                this.notifications.unread_comments_likes_count = parseInt(response.data.data[i].payload_json)
                break

              // case 'unread_followeds_posts_count':
              //   this.notifications.unread_followeds_posts_count = response.data[i].payload_json
              //   break
                     case 'unread_messages_count':
                this.notifications.unread_messages_count = parseInt(response.data.data[i].payload_json)
                break

                case 'unread_posts_likes_count':
                this.notifications.unread_posts_likes_count = parseInt(response.data.data[i].payload_json)
                break
            }
            since = response.data.data[i].timestamp
          }
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    }
  },
  created () {
    // const user_id = this.sharedState.user_id
    // this.getUser(this.sharedState.user_id)
      this.getUserNotifications(this.sharedState.user_id)
    // tooltip
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    })
       },
  // 当路由变化后(比如变更查询参数 page 和 per_page)重新加载数据
  beforeRouteUpdate (to, from, next) {
    next()
    this.getUserNotifications(this.sharedState.user_id)
  }
}
</script>

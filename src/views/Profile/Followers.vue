<template>
  <div>
    <div class="card border-0 g-mb-15">
      <!-- Panel Header -->
      <div class="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15">
        <h3 class="h6 mb-0">
          <i class="icon-people g-pos-rel g-top-1 g-mr-5"></i> 粉丝 {{ user.name || user.username }} <small v-if="followers">(共 {{ count }} 个, {{page_total}}页)</small>
        </h3>
        <div class="dropdown g-mb-10 g-mb-0--md">
          <span class="d-block g-color-primary--hover g-cursor-pointer g-mr-minus-5 g-pa-5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="icon-options-vertical g-pos-rel g-top-1"></i>
          </span>
          <div class="dropdown-menu dropdown-menu-right rounded-0 g-mt-10">

            <router-link :to="{ path: $route.path, query: { page: 1, per_page: 5 }}" class="dropdown-item g-px-10">
              <i class="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 5 个
            </router-link>
            <router-link :to="{ path: $route.path, query: { page: 1, per_page: 10 }}" class="dropdown-item g-px-10">
              <i class="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 10 个
            </router-link>

            <div class="dropdown-divider"></div>

            <router-link :to="{ path: $route.path, query: { page: 1, per_page: 20 }}" class="dropdown-item g-px-10">
              <i class="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 20 个
            </router-link>

          </div>
        </div>
      </div>
      <!-- End Panel Header -->

      <!-- Panel Body -->
      <div v-if="followers" class="card-block g-pa-0" >

        <member v-for="(follower, index) in followers" :key="index"
          :member="follower"
          @follow-user="onFollowUser(follower)"
          @unfollow-user="onUnfollowUser(follower)">
        </member>

      </div>
      <!-- End Panel Body -->
    </div>

    <!-- Pagination #04 -->

     <div v-if="followers">
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
import Member from '../../components/Member'
import Pagination from '../../components/Pagination'

export default {
  name: 'Followers',  //this is the name of the component
  components: {
    Member,
    Pagination
  },
  data () {
    return {

        page :1,
      per_page: 5,

      count:0,
      page_total:0,

      followers: [],
      user: '',

    }
  },
  methods: {
    getUser (id) {
      const path = `/api/users/${id}/`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.user = response.data
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    getUserFollowers (id) {
       if (typeof this.$route.query.page != 'undefined') {
        this.page = this.$route.query.page
      }

      if (typeof this.$route.query.per_page != 'undefined') {
        this.per_page = this.$route.query.per_page
      }
      const path = '/api/users/'+id+'/followers/?page='+this.page+'&per_page='+this.per_page

      this.$axios.get(path)
        .then((response) => {
          // handle success
           this.count=response.data.count
          this.page_total = Math.ceil(this.count/this.per_page)
          this.followers = response.data.results

        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    onFollowUser (follower) {
      const path = `/api/follow/${follower.id}/`
      this.$axios.get(path)
        .then((response) => {
          // handle success
           this.$toasted.success(response.data.message, { icon: 'fingerprint' })
          this.getUserFollowers(this.$route.params.id)
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    onUnfollowUser (follower) {
      const path = `/api/unfollow/${follower.id}/`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.getUserFollowers(this.$route.params.id|| this.sharedState.user_id)
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    }
  },
  created () {
    const user_id = this.$route.params.id || this.sharedState.user_id
    this.getUser(user_id)
    this.getUserFollowers(user_id)
  },
  // 进入子路由后重新加载数据
  beforeRouteUpdate (to, from, next) {
    next()
      const user_id = to.params.id || this.sharedState.user_id
    this.getUser(user_id)
    this.getUserFollowers(user_id)
  }
}
</script>

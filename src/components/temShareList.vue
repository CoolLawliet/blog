
<template>
  <div class="container">

    <!-- Modal: Edit Post -->
    <div class="modal fade" id="editPostModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editPostModalTitle">Update Post</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            <form id="editPostForm" @submit.prevent="onSubmitUpdatePost" @reset.prevent="onResetUpdatePost">
              <div class="form-group" :class="{'u-has-error-v1': editPostForm.titleError}">
                <input type="text" v-model="editPostForm.title" class="form-control" id="editPostFormTitle" placeholder="标题">
                <small class="form-control-feedback" v-show="editPostForm.titleError">{{ editPostForm.titleError }}</small>
              </div>
              <div class="form-group">
        <input type="text" v-model="editPostForm.summary" class="form-control" id="postFormSummary" placeholder="摘要">
        <small class="form-control-feedback" v-show="editPostForm.summaryError">{{ editPostForm.summaryError }}</small>

      </div>


      <div class="form-group">

<el-select v-model="editPostForm.category">
<el-option v-for="(item,index) in classListObj"
:label="item.name"
  :key="item.name"
:value="item.id"
  >
  </el-option>

  </el-select>

        <small class="form-control-feedback" v-show="editPostForm.categoryError">{{ editPostForm.categoryError }}</small>

              </div>

              <div class="form-group">
                <textarea v-model="editPostForm.body" class="form-control" id="editPostFormBody" rows="5" placeholder=" 内容"></textarea>
                <small class="form-control-feedback" v-show="editPostForm.bodyError">{{ editPostForm.bodyError }}</small>
              </div>
              <button type="reset" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Update</button>
            </form>

          </div>
        </div>
      </div>
    </div>


    <div class="card border-0 g-mb-15">
      <!-- Panel Header -->
       <div class="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15">
        <h3 class="h6 mb-0">
          <i class="icon-bubbles g-pos-rel g-top-1 g-mr-5"></i> All Posts <small v-if="datalist">(共 {{ count }} 篇, {{page_total}}页)</small>
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

        <post v-for="(post, index) in datalist" :key="index"
          :post="post"
          @edit-post="onEditPost(post)"
          @delete-post="onDeletePost(post)">
        </post>

      </div>


      <!-- End Panel Body -->
    </div>

    <!-- Pagination #04 -->
    <div v-if="datalist && count > 1">
      <pagination
        :cur-page="page"
        :per-page="per_page"
        :classId="classId"
        :total-pages="page_total">
        :classId
      </pagination>
    </div>
    <!-- End Pagination #04 -->


  </div>
</template>




<script>
import store from '../store'
import Post from './Post'
import Pagination from './PaginationShare'
// bootstrap-markdown 编辑器依赖的 JS 文件，初始化编辑器在组件的 created() 方法中，同时它需要 JQuery 支持哦

import '../assets/bootstrap-markdown/js/bootstrap-markdown.js'
import '../assets/bootstrap-markdown/js/bootstrap-markdown.zh.js'
import '../assets/bootstrap-markdown/js/marked.js'




export default {
  name: "Share", //this is the name of the component
  components: {
    Post,
    Pagination
  },
  data () {
    return {
        classId:"",
      page :1,
      per_page: 5,
      sharedState: store.state,
      count:0,
      page_total:0,
      posts: '',
      datalist:[],
        classListObj:'',
      postForm: {
        title: '',
        summary: '',
        body: '',

        errors: 0,  // 表单是否在前端验证通过，0 表示没有错误，验证通过
        titleError: null,
        bodyError: null
      },
      editPostForm: {
        title: '',
        summary: '',
        body: '',
            category:'',
        errors: 0,  // 表单是否在前端验证通过，0 表示没有错误，验证通过
        titleError: null,
        bodyError: null,
            categoryError:null,
          summaryError:null,
      }
    }
  },
  methods: {


  ArtClassData () {


      const path = '/api/posts/classList/'
      this.$axios.get(path)
        .then((response) => {
          // handle success
            this.classListObj = response.data.data

        })
        .catch((error) => {
          // handle error
          console.log(error.response.data)

          // this.$toasted.error(error.response.data.message, { icon: 'fingerprint' })
        })
    },

    getPosts () {

      if (typeof this.$route.query.page != 'undefined') {
        this.page = this.$route.query.page
      }

      if (typeof this.$route.query.per_page != 'undefined') {
        this.per_page = this.$route.query.per_page
      }
      this.classId=this.$route.query.classId



      const path = '/api/category/?classId='+this.classId+'&page='+this.page+'&per_page='+this.per_page
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.datalist = response.data.results
          this.posts = response.data.data
          this.count=response.data.count
          this.page_total = Math.ceil(this.count/this.per_page)
          console.log(this.page_total)
        })
        .catch((error) => {
          // handle error
          console.log(error.response.data)

          // this.$toasted.error(error.response.data.message, { icon: 'fingerprint' })
        })
    },
// 好奇怪,不知道为啥要放在前面一些,也就是watch
routeChange:function(){
 // this.classId=this.$route.query.classId
                this.getPosts();
            },

    onEditPost (post) {
      // 不要使用对象引用赋值： this.editForm = post
      // 这样是同一个 post 对象，用户在 editform 中的操作会双向绑定到该 post 上， 你会看到 modal 下面的博客也在变
      // 如果用户修改了一些数据，但是点了 cancel，你就必须在 onResetUpdate() 中重新加载一次博客列表，不然用户会看到修改后但未提交的不对称信息
      // this.editForm = Object.assign({}, post)

       // 不要使用对象引用赋值： this.editPostForm = post
      // 这样是同一个 post 对象，用户在 editPostForm 中的操作会双向绑定到该 post 上， 你会看到 modal 下面的博客也在变
      // 如果用户修改了一些数据，但是点了 cancel，你就必须在 onResetUpdatePost() 中重新加载一次博客列表，不然用户会看到修改后但未提交的不对称信息
      this.editPostForm = Object.assign({}, post)
    },
    // onSubmitUpdate () {
    //   this.editForm.errors = 0  // 重置
    onSubmitUpdatePost () {
      this.editPostForm.errors = 0  // 重置
      // 每次提交前先移除错误，不然错误就会累加
      // $('.form-control-feedback').remove()
      // $('.form-group.u-has-error-v1').removeClass('u-has-error-v1')

       $('#editPostForm .form-control-feedback').remove()
      $('#editPostForm .form-group.u-has-error-v1').removeClass('u-has-error-v1')


      // if (!this.editForm.title) {
      //   this.editForm.errors++
      //   this.editForm.titleError = 'Title is required.'
        if (!this.editPostForm.title) {
        this.editPostForm.errors++
        this.editPostForm.titleError = '标题不能为空.'
        // boostrap4 modal依赖jQuery，不兼容 vue.js 的双向绑定。所以要手动添加警示样式和错误提示
        // $('#editform_title').closest('.form-group').addClass('u-has-error-v1')  // Bootstrap 4
        // $('#editform_title').after('<small class="form-control-feedback">' + this.editForm.titleError + '</small>')

           $('#editPostFormTitle').closest('.form-group').addClass('u-has-error-v1')  // Bootstrap 4
        $('#editPostFormTitle').after('<small class="form-control-feedback">' + this.editPostForm.titleError + '</small>')
      } else {
        // this.editForm.titleError = null
           this.editPostForm.titleError = null
      }



       if (!this.editPostForm.summary) {
        this.editPostForm.errors++
        this.editPostForm.summaryError = 'Summary is required.'
      } else {
        this.editPostForm.summaryError = null
      }

         if (!this.editPostForm.category) {
        this.editPostForm.errors++
        this.editPostForm.categoryError = 'Category is required.'
      } else {
        this.editPostForm.categoryError = null
      }

      if (!this.editPostForm.body) {
        this.editPostForm.errors++
        this.editPostForm.bodyError = '内容不能为空.'
        // boostrap4 modal依赖jQuery，不兼容 vue.js 的双向绑定。所以要手动添加警示样式和错误提示
        // 给 bootstrap-markdown 编辑器内容添加警示样式，而不是添加到 #post_body 上
        // $('.md-editor').closest('.form-group').addClass('u-has-error-v1')  // Bootstrap 4
        // $('.md-editor').after('<small class="form-control-feedback">' + this.editForm.bodyError + '</small>')
          $('#editPostForm .md-editor').closest('.form-group').addClass('u-has-error-v1')  // Bootstrap 4
        $('#editPostForm .md-editor').after('<small class="form-control-feedback">' + this.editPostForm.bodyError + '</small>')
      } else {
        // this.editForm.bodyError = null
         this.editPostForm.bodyError = null
      }

        if (this.editPostForm.errors > 0) {
        // 表单验证没通过时，不继续往下执行，即不会通过 axios 调用后端API
        return false
      }

      // 先隐藏 Modal
       $('#editPostModal').modal('hide')


       const path = `/api/posts/${this.editPostForm.id}/`
      const payload = {
          title: this.editPostForm.title,
        summary: this.editPostForm.summary,
        body: this.editPostForm.body,
           category:this.editPostForm.category,
      }
      this.$axios.put(path, payload)
        .then((response) => {
          // handle success
          this.getPosts()
          this.$toasted.success('Successed update the post.', { icon: 'fingerprint' })
           this.editPostForm.title = '',
          this.editPostForm.summary = '',
          this.editPostForm.body = ''
          this.editPostForm.category = ''
        })
        .catch((error) => {
          // handle error
          console.log(error)
          // this.$toasted.error(error.response.data.message, { icon: 'fingerprint' })
        })
    },
     onResetUpdatePost () {
      // 先移除错误
      $('#editPostForm .form-control-feedback').remove()
      $('#editPostForm .form-group.u-has-error-v1').removeClass('u-has-error-v1')
      // 再隐藏 Modal
       $('#editPostModal').modal('hide')
      // this.getPosts()
      this.$toasted.info('Cancelled, the post is not update.', { icon: 'fingerprint' })
    },
    onDeletePost (post) {
      this.$swal({
        title: "Are you sure?",
        text: "该操作将彻底删除 [ " + post.title + " ], 请慎重",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
      }).then((result) => {
        if(result.value) {
          const path = `/api/posts/${post.id}/`
          this.$axios.delete(path)
            .then((response) => {
              // handle success
              this.$swal('Deleted', 'You successfully deleted this post', 'success')
              // this.$toasted.success('Successed delete the post.', { icon: 'fingerprint' })
              this.getPosts()
            })
            .catch((error) => {
              // handle error
              console.log(error.response.data)
            })
        } else {
          this.$swal('Cancelled', 'The post is safe :)', 'error')
        }
      })
    }
  },

   // 路由变化了执行


     watch: {
           // 如果路由有变化，会再次执行该方法
         '$route':'routeChange',

         },


  created () {
       this.classId=this.$route.query.classId
      this.ArtClassData()
    this.getPosts()
    // 初始化 bootstrap-markdown 插件
    $(document).ready(function() {
       $("#postFormBody, #editPostFormBody").markdown({
        autofocus:false,
        savable:false,
        iconlibrary: 'fa',  // 使用Font Awesome图标
        language: 'zh'
      })
    })
  },
  // 当查询参数 page 或 per_page 变化后重新加载数据
  beforeRouteUpdate (to, from, next) {
    // 注意：要先执行 next() 不然 this.$route.query 还是之前的
    next()
       this.classId=this.$route.query.classId
  this.ArtClassData()

    this.getPosts()
  }
}
</script>


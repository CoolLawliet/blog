import Vue from 'vue'
import Router from 'vue-router'
// 导入 vue-scrollto，跳转到锚点时支持平滑过渡
import VueScrollTo from 'vue-scrollto'

Vue.use(Router);
// scrollBehavior:
// - only available in html5 history mode
// - defaults to no scroll behavior
// - return false to prevent scroll
//在点击浏览器的“前进/后退”，或者切换导航的时候触发。
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
      // 重要: 延迟1秒等待 DOM 生成，不然跳转到对应的锚点时会提示找不到 DOM
      setTimeout(() => {
        VueScrollTo.scrollTo(to.hash, 500)
      }, 1000)
      position.selector = to.hash
    }
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some(m => m.meta.scrollToTop)) {
      // cords will be used if no selector is provided,
      // or if the selector didn't match any element.
      position.x = 0
      position.y = 0
    }
    // if the returned position is falsy or an empty object,
    // will retain current scroll position.
    return position
  }
}

const router = new Router({
  mode: 'history',  // 文章详情页 TOC 的锚点以数字开头，会被报错不合法: [Vue warn]: Error in nextTick: "SyntaxError: Failed to execute 'querySelector' on 'Document': '#13-git-clone' is not a valid selector."
  scrollBehavior,  // 不用这个，在需要跳转的改用 vue-scrollto

  routes: [
    {
      path: '/',
      component: ()=>import('./views/Home'),
      meta: {
        auth: true
      },
      name: 'Home'
    }, //首页


    {
      path: '/Share',
      component: ()=>import('./views/pages/Share.vue'),
      meta: {
        auth: true
      },
      name: 'Share'
    }, //分类

    {
      path: '/Aboutme',
      component: ()=>import('./views/pages/Aboutme'),
      meta: {
        auth: true
      },
      name: 'Aboutme'
    }, //关于

    {
      path: '/Reward',
      component: ()=>import('./views/pages/Reward.vue'),
      meta: {
        auth: true
      },
      name: 'Reward'
    }, //赞赏
    {
      path: '/Time',
      component: ()=>import('./views/pages/Time.vue'),
      meta: {
        auth: true
      },
      name: 'Time'
    }, //关于
    {
      // 博客文章详情页
      path: '/post/:id',
      name: 'PostDetail',
      component: ()=>import('./views/PostDetail')
    },
    {
      path: '/login',
      name: 'Login',
      component: ()=>import('./views/Auth/Login')
    },
    {
      path: '/register',
      name: 'Register',
      component: ()=>import('./views/Auth/Register')
    },
    {
      path: '/user/:id',
      // name: 'User',
      component: ()=>import('./views/Profile/User'),
      children: [
        // Overview will be rendered inside User's <router-view>
        // when /user/:id is matched
        // 注意： 要有默认子路由，父路由不能指定 name
        { path: '', component: ()=>import('./views/Profile/Overview') },
        { path: 'overview', name: 'UserOverview', component: ()=>import('./views/Profile/Overview')},

        // Followers will be rendered inside User's <router-view>
        // when /user/:id/followers is matched
        { path: 'followers', name: 'UserFollowers', component: ()=>import('./views/Profile/Followers') },

        // Following will be rendered inside User's <router-view>
        // when /user/:id/following is matched
        { path: 'following', name: 'UserFollowing', component: ()=>import('./views/Profile/Following') },

        // UserPostsList will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        { path: 'posts', name: 'UserPosts', component: ()=>import('./views/Profile/Posts') },
        // UserFollowedsPostsList will be rendered inside User's <router-view>
        // when /user/:id/followeds-posts is matched
        { path: 'following-posts', name: 'UserFollowingPosts', component: ()=>import('./views/Profile/FollowingPosts') }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      // 用户修改自己的个人信息
      path: '/settings',
      component: ()=>import('./views/Settings/Settings'),
      children: [
        { path: '', component: ()=>import('./views/Settings/Profile')},
        { path: 'profile', name: 'SettingProfile', component: ()=>import('./views/Settings/Profile') },
        { path: 'account', name: 'SettingAccount', component: ()=>import('./views/Settings/Account') },
        { path: 'email', name: 'SettingEmail', component: ()=>import('./views/Settings/Email') },
        { path: 'notification', name: 'SettingNotification', component: ()=>import('./views/Settings/Notification') }
      ],
      meta: {
        requiresAuth: true
      }
    },

    {
      // 用户的资源
      path: '/resource',
      component: ()=>import('./views/Resources/Resource'),
      children: [
        { path: '', component: ()=>import('./views/Resources/PostsResource') },
        { path: 'posts', name: 'PostsResource', component: ()=>import('./views/Resources/PostsResource') },
        { path: 'following-posts', name: 'FollowingPostsResource', component: ()=>import('./views/Resources/FollowingPostsResource') },
        { path: 'comments', name: 'CommentsResource', component: ()=>import('./views/Resources/CommentsResource') },
        { path: 'liked-posts', name: 'LikedPostsResource', component: ()=>import('./views/Resources/LikedPosts') },
        {
          path: 'messages',
          component: ()=>import('./views/Resources/Messages/Index'),
          children: [
            // 默认匹配，你给哪些人发送过私信
            { path: '', name: 'MessagesIndexResource', component: ()=>import('./views/Resources/Messages/List') },
            // 与某个用户之间的全部历史对话记录
            { path: 'history', name: 'MessagesHistoryResource', component: ()=>import('./views/Resources/Messages/History') }
          ]
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      // 通知
      path: '/notifications',
      component: ()=>import('./views/Notifications/Notifications') ,
      children: [
        { path: '', component: ()=>import('./views/Notifications/RecivedComments') },
        { path: 'comments', name: 'RecivedComments', component: ()=>import('./views/Notifications/RecivedComments') },
        { path: 'follows', name: 'Follows', component: ()=>import('./views/Notifications/Follows') },
        { path: 'comments-likes', name: 'CommentsLikes', component: ()=>import('./views/Notifications/CommentsLikes') },

        {
          path: 'messages',
          component: ()=>import('./views/Notifications/Messages/Index'),
          children: [
            // 默认匹配，哪些人给你发送过私信
            { path: '', name: 'MessagesIndex', component: ()=>import('./views/Notifications/Messages/List') },
            // 与某个用户之间的全部历史对话记录
            { path: 'history', name: 'MessagesHistory', component: ()=>import('./views/Notifications/Messages/History') }
          ]
        },
        { path: 'posts-likes', name: 'PostsLikes', component: ()=>import('./views/Notifications/PostsLikes') },
        { path: 'following-posts', name: 'FollowingPosts', component: ()=>import('./views/Profile/FollowingPosts')  }
      ],
      meta: {
        requiresAuth: true
      }
    },

    {
      // 全文搜索结果页
      path: '/search',
      name: 'SearchResult',
      component: ()=>import('./views/SearchResult')
    },

    {
      path: '/ping',
      name: 'Ping',
      component: ()=>import('./views/Ping')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('yk-token');
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    Vue.toasted.show('Please log in to access this page.', { icon: 'fingerprint' });
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (token && to.name === 'Login') {
    // 用户已登录，但又去访问登录页面时不让他过去
    next({
      path: from.fullPath
    })
  } else if (to.matched.length === 0) {  // 要前往的路由不存在时
    Vue.toasted.error('404: Not Found', { icon: 'fingerprint' });
    if (from.name) {
      next({
        name: from.name
      })
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
  }
});

export default router

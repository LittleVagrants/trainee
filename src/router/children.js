// 用户管理
const userManagement = () =>
  import ( /* webpackChunkName: "body" */ '@/components/userManagement')
// 角色管理
const roleManagement = () =>
  import ( /* webpackChunkName: "body" */ '@/components/roleManagement')
// 权限管理
const rbacManagement = () =>
  import ( /* webpackChunkName: "body" */ '@/components/rbacManagement')
// 文字管理
const jobSeekerManagement = () =>
  import ( /* webpackChunkName: "body" */ '@/components/jobSeekerManagement')
// 相册管理
const albumManagement = () =>
  import ( /* webpackChunkName: "body" */ '@/components/albumManagement')
// 标签管理
const labelManagement = () =>
  import ( /* webpackChunkName: "body" */ '@/components/labelManagement')
// 职位管理
const postManagement = () =>
  import ( /* webpackChunkName: "body" */ '@/components/postManagement')



export default [{
    path: 'userManagement',
    name: 'userManagement',
    component: userManagement,
    meta: {
      title: '用户管理'
    }
  },
  {
    path: 'roleManagement',
    name: 'roleManagement',
    component: roleManagement,
    meta: {
      title: '角色管理'
    }
  },
  {
    path: 'rbacManagement',
    name: 'rbacManagement',
    component: rbacManagement,
    meta: {
      title: '权限管理'
    }
  },
  {
    path: 'jobSeekerManagement',
    name: 'jobSeekerManagement',
    component: jobSeekerManagement,
    meta: {
      title: '求职管理'
    }
  },
  {
    path: 'albumManagement',
    name: 'albumManagement',
    component: albumManagement,
    meta: {
      title: '相册管理'
    }

  },
  {
    path: 'labelManagement',
    name: 'labelManagement',
    component: labelManagement,
    meta: {
      title: '相册管理'
    }
  },
  {
    path: 'postManagement',
    name: 'postManagement',
    component: postManagement,
    meta: {
      title: '职位管理'
    }
  }
]

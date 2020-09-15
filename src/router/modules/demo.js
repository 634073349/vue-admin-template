import Layout from '@/layout'

const demoRouter = {
  path: '/demo',
  component: Layout,
  redirect: '/demo/demo',
  name: 'Demo',
  meta: {
    title: 'Demo',
    icon: 'table'
  },
  children: [{
    path: 'list',
    component: () => import('@/views/demo/list'),
    name: 'List',
    meta: {
      title: '列表测试'
    }
  }, {
    path: 'list1',
    component: () => import('@/views/demo/list'),
    name: 'List',
    meta: {
      title: '列表测试1'
    }
  }]
}

export default demoRouter

import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview';
import Util from './libs/util';

Vue.use(VueRouter);

const routers = [
	{ 
		path: '*', 
		component: (resolve) => require(['./views/error404.vue'], resolve) 
	},
	{
	    path: '/',
	    meta: {
	        title: 'smallsnail-wh'
	    },
	    component: (resolve) => require(['./views/index.vue'], resolve)
	},
	{
	    path: '/index',
	    meta: {
	        title: 'smallsnail-wh'
	    },
	    component: (resolve) => require(['./views/index.vue'], resolve)
	},
	{
	    path: '/test',
	    meta: {
	        title: 'test'
	    },
	    component: (resolve) => require(['./views/template/index.vue'], resolve)
	},
	{
	    path: '/base',
	    meta: {
	        title: 'base',
	        requiresAuth: true
	    },
	    component: (resolve) => require(['./views/base/base.vue'], resolve),
	    children: [
	    	{
	    		path: 'welcome',
                name: 'welcome',
                component: (resolve) => require(['./views/sys/welcome.vue'], resolve),
                meta: {
                    title:"welcome"
                }
	    	},
	    	{
	    		path: 'user',
                name: 'user',
                component: (resolve) => require(['./views/sys/user.vue'], resolve),
                meta: {
                    title:"user"
                }
	    	},
	    	{
	    		path: 'userstatistics',
                name: 'userstatistics',
                component: (resolve) => require(['./views/sys/userstatistics.vue'], resolve),
                meta: {
                    title:"userstatistics"
                }
	    	},
	    	{
	    		path: 'publishers',
                name: 'publishers',
                component: (resolve) => require(['./views/sys/publishers.vue'], resolve),
                meta: {
                    title:"publishers"
                }
	    	},
            {
                path: 'ordinaryusers',
                name: 'ordinaryusers',
                component: (resolve) => require(['./views/sys/ordinaryusers.vue'], resolve),
                meta: {
                    title:"ordinaryusers"
                }
            },
	    	{
	    		path: 'userquery',
                name: 'userquery',
                component: (resolve) => require(['./views/sys/userquery.vue'], resolve),
                meta: {
                    title:"userquery"
                }
	    	},
	    	{
	    		path: 'incomestatistics',
                name: 'incomestatistics',
                component: (resolve) => require(['./views/sys/incomestatistics.vue'], resolve),
                meta: {
                    title:"incomestatistics"
                }
	    	},
	    	{
	    		path: 'receivestatistics',
                name: 'receivestatistics',
                component: (resolve) => require(['./views/sys/receivestatistics.vue'], resolve),
                meta: {
                    title:"receivestatistics"
                }
	    	},
	    	{
	    		path: 'releasetotal',
                name: 'releasetotal',
                component: (resolve) => require(['./views/sys/releasetotal.vue'], resolve),
                meta: {
                    title:"releasetotal"
                }
	    	},
	    	{
	    		path: 'withdrawdeposit',
                name: 'withdrawdeposit',
                component: (resolve) => require(['./views/sys/withdrawdeposit.vue'], resolve),
                meta: {
                    title:"withdrawdeposit"
                }
	    	},
	    	{
	    		path: 'largess',
                name: 'largess',
                component: (resolve) => require(['./views/sys/largess.vue'], resolve),
                meta: {
                    title:"largess"
                }
	    	},
	    	{
	    		path: 'menu',
                name: 'menu',
                component: (resolve) => require(['./views/sys/menu.vue'], resolve),
                meta: {
                    title:"menu"
                }
	    	},
	    	{
	    		path: 'role',
                name: 'role',
                component: (resolve) => require(['./views/sys/role.vue'], resolve),
                meta: {
                    title:"role"
                }
	    	},
	    	{
	    		path: 'test4',
                name: 'test4',
                component: (resolve) => require(['./views/test/test4.vue'], resolve),
                meta: {
                    title:"test4"
                }
	    	},
	    	{
	    		path: 'test5',
                name: 'test5',
                component: (resolve) => require(['./views/test/test5.vue'], resolve),
                meta: {
                    title:"test5"
                }
	    	},
	    	{
	    		path: 'test6',
                name: 'test6',
                component: (resolve) => require(['./views/test/test6.vue'], resolve),
                meta: {
                    title:"test6"
                }
	    	},
	    ]
	}
];

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    let token = window.localStorage.getItem('currentUser_token')
    if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
        next({
          path: '/',
          query: { redirect: to.fullPath }
        })
    }/* else {
        next()
        console.log("next");
    }*/
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;
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
                path: 'secondredpacket',
                name: 'secondredpacket',
                component: (resolve) => require(['./views/sys/secondredpacket.vue'], resolve),
                meta: {
                    title:"secondredpacket"
                }
            },
            {
                path: 'level',
                name: 'level',
                component: (resolve) => require(['./views/sys/level.vue'], resolve),
                meta: {
                    title:"level"
                }
            },
            {
                path: 'userticheng',
                name: 'userticheng',
                component: (resolve) => require(['./views/sys/userticheng.vue'], resolve),
                meta: {
                    title:"userticheng"
                }
            },
            {
                path: 'salesticheng',
                name: 'salesticheng',
                component: (resolve) => require(['./views/sys/salesticheng.vue'], resolve),
                meta: {
                    title:"salesticheng"
                }
            },
            {
                path: 'banner',
                name: 'banner',
                component: (resolve) => require(['./views/sys/banner.vue'], resolve),
                meta: {
                    title:"banner"
                }
            },
            {
                path: 'publish',
                name: 'publish',
                component: (resolve) => require(['./views/sys/publish.vue'], resolve),
                meta: {
                    title:"publish"
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
                path: 'adminuser',
                name: 'adminuser',
                component: (resolve) => require(['./views/sys/adminuser.vue'], resolve),
                meta: {
                    title:"adminuser"
                }
            },
            {
                path: 'leavemess',
                name: 'leavemess',
                component: (resolve) => require(['./views/sys/leavemess.vue'], resolve),
                meta: {
                    title:"leavemess"
                }
            },
            {
                path: 'salesmen',
                name: 'salesmen',
                component: (resolve) => require(['./views/sys/salesmen.vue'], resolve),
                meta: {
                    title:"salesmen"
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
                path: 'notification',
                name: 'notification',
                component: (resolve) => require(['./views/sys/system_notification.vue'], resolve),
                meta: {
                    title:"notification"
                }
            }
	    ]
	}
];

// 路由配置
const RouterConfig = {
    base: '/console/',
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
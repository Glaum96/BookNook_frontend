export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "app",
	appPath: "app",
	assets: new Set([".DS_Store",".nojekyll","404.html","avdelingstur-program/index.html","booknook_full_logo.png","favicon.png","footer/egg.png","footer/gh_springboot_icon.svg","footer/gh_svelte_icon.svg","footer/linkedin.png","include_past.png","info.png","robots.txt"]),
	mimeTypes: {".html":"text/html",".png":"image/png",".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: {"start":"app/immutable/entry/start.stV3g2l8.js","app":"app/immutable/entry/app.BVr_r7xN.js","imports":["app/immutable/entry/start.stV3g2l8.js","app/immutable/chunks/entry.t9JCv9IL.js","app/immutable/chunks/scheduler.DkUGhlvm.js","app/immutable/chunks/index.CuKoY1RR.js","app/immutable/entry/app.BVr_r7xN.js","app/immutable/chunks/scheduler.DkUGhlvm.js","app/immutable/chunks/index.C7iCkZ2n.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/minside",
				pattern: /^\/minside\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

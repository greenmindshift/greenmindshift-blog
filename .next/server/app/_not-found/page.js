(()=>{var e={};e.id=409,e.ids=[409],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3112:(e,t,n)=>{"use strict";n.r(t),n.d(t,{GlobalError:()=>d.a,__next_app__:()=>f,originalPathname:()=>p,pages:()=>u,routeModule:()=>c,tree:()=>l}),n(7352),n(5866),n(2029);var r=n(3191),o=n(8716),i=n(7922),d=n.n(i),a=n(5231),s={};for(let e in a)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(s[e]=()=>a[e]);n.d(t,s);let l=["",{children:["/_not-found",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(n.t.bind(n,5866,23)),"next/dist/client/components/not-found-error"]}]},{}]},{layout:[()=>Promise.resolve().then(n.bind(n,2029)),"/home/greenmindshift/greenmindshift-blog/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(n.t.bind(n,5866,23)),"next/dist/client/components/not-found-error"]}],u=[],p="/_not-found/page",f={require:n,loadChunk:()=>Promise.resolve()},c=new r.AppPageRouteModule({definition:{kind:o.x.APP_PAGE,page:"/_not-found/page",pathname:"/_not-found",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},5125:(e,t,n)=>{Promise.resolve().then(n.t.bind(n,2994,23)),Promise.resolve().then(n.t.bind(n,6114,23)),Promise.resolve().then(n.t.bind(n,9727,23)),Promise.resolve().then(n.t.bind(n,9671,23)),Promise.resolve().then(n.t.bind(n,1868,23)),Promise.resolve().then(n.t.bind(n,4759,23))},5303:()=>{},6399:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{isNotFoundError:function(){return o},notFound:function(){return r}});let n="NEXT_NOT_FOUND";function r(){let e=Error(n);throw e.digest=n,e}function o(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===n}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7352:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{PARALLEL_ROUTE_DEFAULT_PATH:function(){return o},default:function(){return i}});let r=n(6399),o="next/dist/client/components/parallel-route-default.js";function i(){(0,r.notFound)()}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2029:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>o});var r=n(9510);function o({children:e}){return(0,r.jsxs)("html",{children:[r.jsx("head",{children:r.jsx("style",{children:`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, sans-serif; }
          .min-h-screen { min-height: 100vh; }
          .bg-black { background-color: #000000; }
          .bg-white { background-color: #ffffff; }
          .p-8 { padding: 2rem; }
          .rounded-lg { border-radius: 0.5rem; }
          .overflow-hidden { overflow: hidden; }
          
          .bento-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, 200px);
            grid-template-rows: repeat(auto-fit, 200px);
            gap: 1rem;
            max-width: 1200px;
            margin: 0 auto;
            justify-content: center;
          }
          
          .bento-item {
            min-width: 200px;
            min-height: 200px;
          }
          
          .bento-small {
            width: 200px;
            height: 200px;
          }
          
          .bento-wide {
            width: 416px;
            height: 200px;
          }
          
          .bento-tall {
            width: 200px;
            height: 416px;
          }
          
          @media (max-width: 1280px) {
            .bento-grid {
              max-width: 1000px;
            }
          }
          
          @media (max-width: 1080px) {
            .bento-grid {
              max-width: 800px;
            }
          }
          
          @media (max-width: 880px) {
            .bento-grid {
              max-width: 600px;
            }
          }
          
          @media (max-width: 680px) {
            .bento-grid {
              max-width: 400px;
            }
          }
          
          @media (max-width: 480px) {
            .bento-grid {
              grid-template-columns: 200px;
              max-width: 200px;
            }
          }
        `})}),r.jsx("body",{children:e})]})}}};var t=require("../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),r=t.X(0,[276,471],()=>n(3112));module.exports=r})();
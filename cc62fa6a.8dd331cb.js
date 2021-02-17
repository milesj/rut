(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{100:function(e,n,t){"use strict";var r=t(0),a=t.n(r),o=t(94),c=t(91),l=t(55),i=t.n(l),s=37,u=39;n.a=function(e){var n=e.lazy,t=e.block,l=e.defaultValue,p=e.values,d=e.groupId,m=e.className,b=Object(o.a)(),f=b.tabGroupChoices,g=b.setTabGroupChoices,O=Object(r.useState)(l),j=O[0],v=O[1],y=r.Children.toArray(e.children);if(null!=d){var h=f[d];null!=h&&h!==j&&p.some((function(e){return e.value===h}))&&v(h)}var x=function(e){v(e),null!=d&&g(d,e)},E=[];return a.a.createElement("div",null,a.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:Object(c.a)("tabs",{"tabs--block":t},m)},p.map((function(e){var n=e.value,t=e.label;return a.a.createElement("li",{role:"tab",tabIndex:0,"aria-selected":j===n,className:Object(c.a)("tabs__item",i.a.tabItem,{"tabs__item--active":j===n}),key:n,ref:function(e){return E.push(e)},onKeyDown:function(e){!function(e,n,t){switch(t.keyCode){case u:!function(e,n){var t=e.indexOf(n)+1;e[t]?e[t].focus():e[0].focus()}(e,n);break;case s:!function(e,n){var t=e.indexOf(n)-1;e[t]?e[t].focus():e[e.length-1].focus()}(e,n)}}(E,e.target,e)},onFocus:function(){return x(n)},onClick:function(){x(n)}},t)}))),n?Object(r.cloneElement)(y.filter((function(e){return e.props.value===j}))[0],{className:"margin-vert--md"}):a.a.createElement("div",{className:"margin-vert--md"},y.map((function(e,n){return Object(r.cloneElement)(e,{key:n,hidden:e.props.value!==j})}))))}},101:function(e,n,t){"use strict";var r=t(0),a=t.n(r);n.a=function(e){var n=e.children,t=e.hidden,r=e.className;return a.a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},85:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return i})),t.d(n,"metadata",(function(){return s})),t.d(n,"toc",(function(){return u})),t.d(n,"default",(function(){return d}));var r=t(3),a=t(7),o=(t(0),t(90)),c=t(100),l=t(101),i={title:"ESLint"},s={unversionedId:"tooling/eslint",id:"tooling/eslint",isDocsHomePage:!1,title:"ESLint",description:"Install the eslint-plugin-rut package as a dev dependency.",source:"@site/docs/tooling/eslint.mdx",slug:"/tooling/eslint",permalink:"/docs/tooling/eslint",editUrl:"https://github.com/milesj/rut/edit/master/website/docs/tooling/eslint.mdx",version:"current",sidebar:"docs",previous:{title:"Element",permalink:"/docs/api/element"},next:{title:"Jest",permalink:"/docs/tooling/jest"}},u=[{value:"Rules",id:"rules",children:[{value:"<code>consistent-event-type</code>",id:"consistent-event-type",children:[]},{value:"<code>no-act</code>",id:"no-act",children:[]},{value:"<code>no-internals</code>",id:"no-internals",children:[]},{value:"<code>require-render-generics</code>",id:"require-render-generics",children:[]}]}],p={toc:u};function d(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},p,t,{components:n,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Install the ",Object(o.b)("inlineCode",{parentName:"p"},"eslint-plugin-rut")," package as a dev dependency."),Object(o.b)(c.a,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"NPM",value:"npm"}],mdxType:"Tabs"},Object(o.b)(l.a,{value:"yarn",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-bash"},"yarn add --dev eslint-plugin-rut\n"))),Object(o.b)(l.a,{value:"npm",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-bash"},"npm install --save-dev eslint-plugin-rut\n")))),Object(o.b)("p",null,"Once installed, add the recommended config to your ",Object(o.b)("inlineCode",{parentName:"p"},".eslintrc.js")," file. By default this will target\nall test files using ESLint overrides in the format of ",Object(o.b)("inlineCode",{parentName:"p"},"*.test.(ts|js)x?"),"."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-js",metastring:'title=".eslintrc.js"',title:'".eslintrc.js"'},"module.exports = {\n  extends: ['plugin:rut/recommended'],\n};\n")),Object(o.b)("p",null,"If you prefer to manage the targets yourself, something like the following will suffice."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-js",metastring:'title=".eslintrc.js"',title:'".eslintrc.js"'},"module.exports = {\n  overrides: [\n    {\n      files: ['*.spec.ts', '*.spec.js'],\n      plugins: ['rut'],\n      rules: {\n        'rut/no-act': 'error',\n      },\n    },\n  ],\n};\n")),Object(o.b)("h2",{id:"rules"},"Rules"),Object(o.b)("h3",{id:"consistent-event-type"},Object(o.b)("inlineCode",{parentName:"h3"},"consistent-event-type")),Object(o.b)("p",null,"Verify and enforce the correct event types are used when mocking or dispatching events."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-tsx"},"// Invalid\nimport { mockEvent, mockSyntheticEvent } from 'rut-dom';\n\nmockEvent('onKeyDown');\nmockSyntheticEvent('keydown');\n")),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-tsx"},"// Valid\nimport { mockEvent, mockSyntheticEvent } from 'rut-dom';\n\nmockEvent('keydown');\nmockSyntheticEvent('onKeyDown');\n")),Object(o.b)("h3",{id:"no-act"},Object(o.b)("inlineCode",{parentName:"h3"},"no-act")),Object(o.b)("p",null,"Disallow usage of React's ",Object(o.b)("inlineCode",{parentName:"p"},"act()")," within tests. This functionality is provided by Rut and shouldn't\nbe necessary."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-tsx"},"// Invalid\nimport { render } from 'rut-dom';\nimport { act } from 'react-test-renderer';\nimport Example from '../src/Example';\n\nconst { update } = render(<Example id={1} />);\n\nact(() => {\n  update({ id: 2 });\n});\n")),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-tsx"},"// Valid\nimport { render } from 'rut-dom';\nimport Example from '../src/Example';\n\nconst { update } = render(<Example id={1} />);\n\nupdate({ id: 2 });\n")),Object(o.b)("h3",{id:"no-internals"},Object(o.b)("inlineCode",{parentName:"h3"},"no-internals")),Object(o.b)("p",null,"Disallow import and usage of Rut's internal APIs. Accessing these directly is a code smell."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-tsx"},"// Invalid\nimport { render } from 'rut-dom';\nimport debug from 'rut/lib/internals/debug';\nimport Example from '../src/Example';\n\nconst { root } = render(<Example id={1} />);\n\ndebug(root);\n")),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-tsx"},"// Valid\nimport { render } from 'rut-dom';\nimport Example from '../src/Example';\n\nconst { debug, root } = render(<Example id={1} />);\n\ndebug();\n// Or\nroot.debug();\n")),Object(o.b)("h3",{id:"require-render-generics"},Object(o.b)("inlineCode",{parentName:"h3"},"require-render-generics")),Object(o.b)("p",null,"Require TypeScript generics for ",Object(o.b)("inlineCode",{parentName:"p"},"render()")," and ",Object(o.b)("inlineCode",{parentName:"p"},"renderAndWait()")," functions."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-tsx"},"// Invalid\nimport { render } from 'rut-dom';\nimport Example from '../src/Example';\n\nconst { root } = render(<Example id={1} />);\n")),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-tsx"},"// Valid\nimport { render } from 'rut-dom';\nimport Example, { ExampleProps } from '../src/Example';\n\nconst { root } = render<ExampleProps>(<Example id={1} />);\n")),Object(o.b)("blockquote",null,Object(o.b)("p",{parentName:"blockquote"},"Does not apply to host (DOM) elements.")))}d.isMDXComponent=!0},90:function(e,n,t){"use strict";t.d(n,"a",(function(){return p})),t.d(n,"b",(function(){return b}));var r=t(0),a=t.n(r);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function c(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?c(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=a.a.createContext({}),u=function(e){var n=a.a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},p=function(e){var n=u(e.components);return a.a.createElement(s.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},m=a.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),p=u(t),m=r,b=p["".concat(c,".").concat(m)]||p[m]||d[m]||o;return t?a.a.createElement(b,l(l({ref:n},s),{},{components:t})):a.a.createElement(b,l({ref:n},s))}));function b(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,c=new Array(o);c[0]=m;var l={};for(var i in n)hasOwnProperty.call(n,i)&&(l[i]=n[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,c[1]=l;for(var s=2;s<o;s++)c[s]=t[s];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},91:function(e,n,t){"use strict";function r(e){var n,t,a="";if("string"==typeof e||"number"==typeof e)a+=e;else if("object"==typeof e)if(Array.isArray(e))for(n=0;n<e.length;n++)e[n]&&(t=r(e[n]))&&(a&&(a+=" "),a+=t);else for(n in e)e[n]&&(a&&(a+=" "),a+=n);return a}n.a=function(){for(var e,n,t=0,a="";t<arguments.length;)(e=arguments[t++])&&(n=r(e))&&(a&&(a+=" "),a+=n);return a}},94:function(e,n,t){"use strict";var r=t(0),a=t(95);n.a=function(){var e=Object(r.useContext)(a.a);if(null==e)throw new Error("`useUserPreferencesContext` is used outside of `Layout` Component.");return e}},95:function(e,n,t){"use strict";var r=t(0),a=Object(r.createContext)(void 0);n.a=a}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{80:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return p}));var a=n(3),o=n(7),r=(n(0),n(90)),c={title:"Mocks"},i={unversionedId:"mocks",id:"mocks",isDocsHomePage:!1,title:"Mocks",description:"What is testing without mocks? The following mock functions can be used for easier testing.",source:"@site/docs/mocks.md",slug:"/mocks",permalink:"/docs/mocks",editUrl:"https://github.com/milesj/rut/edit/master/website/docs/mocks.md",version:"current",sidebar:"docs",previous:{title:"Matchers",permalink:"/docs/matchers"},next:{title:"Predicates",permalink:"/docs/predicates"}},l=[{value:"Shared",id:"shared",children:[{value:"<code>mockFetch()</code>",id:"mockfetch",children:[]}]},{value:"DOM",id:"dom",children:[{value:"<code>mockEvent()</code>",id:"mockevent",children:[]},{value:"<code>mockSyntheticEvent()</code>",id:"mocksyntheticevent",children:[]}]}],b={toc:l};function p(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(r.b)("wrapper",Object(a.a)({},b,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"What is testing without mocks? The following mock functions can be used for easier testing."),Object(r.b)("h2",{id:"shared"},"Shared"),Object(r.b)("h3",{id:"mockfetch"},Object(r.b)("inlineCode",{parentName:"h3"},"mockFetch()")),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},"mockFetch(matcher: MockMatcher, response: MockResponse | MockResponseFunction, options?:\nMockOptions): FetchMockStatic")),Object(r.b)("p",null,"Generates and mocks the global ",Object(r.b)("inlineCode",{parentName:"p"},"fetch()")," with pre-defined responses, using the robust\n",Object(r.b)("a",{parentName:"p",href:"http://www.wheresrhys.co.uk/fetch-mock/"},"fetch-mock")," library."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-tsx"},"import { renderAndWait, mockFetch } from 'rut-dom';\nimport UserProfile, { UserProfileProps } from '../src/UserProfile';\n\ndescribe('<Form />', () => {\n  beforeEach(() => {\n    mockFetch('/users/1', {\n      id: 1,\n      name: 'Rut',\n      status: 'active',\n    });\n  });\n\n  it('loads a users profile', async () => {\n    const { root } = await renderAndWait<UserProfileProps>(<UserProfile id={1} />);\n\n    expect(root).toContainNode('Rut');\n  });\n});\n")),Object(r.b)("p",null,"To match all requests, provide a wildcard ",Object(r.b)("inlineCode",{parentName:"p"},"*")," route, and a response of ",Object(r.b)("inlineCode",{parentName:"p"},"200"),"."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-ts"},"mockFetch('*', 200);\n")),Object(r.b)("p",null,"Since this mock returns a ",Object(r.b)("inlineCode",{parentName:"p"},"fetch-mock")," instance, all upstream API methods are available. For\nexample, we can easily mock multiple requests using a fluent interface."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-ts"},"mockFetch('/', 200)\n  .get('/users/1', 200)\n  .get('/users/2', 404)\n  .post('/users', 200);\n")),Object(r.b)("p",null,"If you are using Jest and would like to spy on all ",Object(r.b)("inlineCode",{parentName:"p"},"fetch()")," calls, you can use a combination of\n",Object(r.b)("inlineCode",{parentName:"p"},"jest.spyOn()")," and ",Object(r.b)("inlineCode",{parentName:"p"},"global"),". The spy needs to be created ",Object(r.b)("em",{parentName:"p"},"after")," the mock."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-ts"},"const spy = jest.spyOn(global, 'fetch');\n")),Object(r.b)("p",null,"Lastly, if ",Object(r.b)("em",{parentName:"p"},"not")," using the ",Object(r.b)("a",{parentName:"p",href:"/docs/tooling/jest"},"Jest")," integration, you'll need to unmock the fetch\nafter every test using ",Object(r.b)("inlineCode",{parentName:"p"},"restore()"),"."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-ts"},"let mock: MockFetchResult;\n\nbeforeEach(() => {\n  mock = mockFetch('/users/1', {\n    id: 1,\n    name: 'Rut',\n    status: 'active',\n  });\n});\n\nafterEach(() => {\n  mock.restore();\n});\n")),Object(r.b)("h2",{id:"dom"},"DOM"),Object(r.b)("h3",{id:"mockevent"},Object(r.b)("inlineCode",{parentName:"h3"},"mockEvent()")),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},"mockEvent<T = Event",">","(type: string, options?: EventOptions): T")),Object(r.b)("p",null,"If for some reason you need to mock a native DOM event, ",Object(r.b)("inlineCode",{parentName:"p"},"mockEvent()")," will do just that. Based on\nthe defined event type, an appropriate sub-class will be used. For example, if the ",Object(r.b)("inlineCode",{parentName:"p"},"type")," is\n",Object(r.b)("inlineCode",{parentName:"p"},"click"),", then a ",Object(r.b)("inlineCode",{parentName:"p"},"MouseEvent")," will be used."),Object(r.b)("p",null,"If using TypeScript, it's encouraged to type the event using generics."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-ts"},"import { mockEvent } from 'rut-dom';\n\nconst event = mockEvent<MouseEvent>('click');\n")),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},"Event type format must match the native host format, usually lower case. For example, ",Object(r.b)("inlineCode",{parentName:"p"},"click"),"\ninstead of ",Object(r.b)("inlineCode",{parentName:"p"},"onClick"),".")),Object(r.b)("h4",{id:"options"},"Options"),Object(r.b)("p",null,"All options are ",Object(r.b)("em",{parentName:"p"},"optional"),"."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"currentTarget")," (",Object(r.b)("inlineCode",{parentName:"li"},"HTMLElement"),") - Partial element in which the event was bound to."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"target")," (",Object(r.b)("inlineCode",{parentName:"li"},"HTMLElement"),") - Partial element that triggered the event. If ",Object(r.b)("inlineCode",{parentName:"li"},"currentTarget")," is not\ndefined, this will be used for both fields."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"AnimationEvent"),Object(r.b)("ul",{parentName:"li"},Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"animationName")," (",Object(r.b)("inlineCode",{parentName:"li"},"string"),") - Name of the animation being triggered."))),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"MouseEvent, KeyboardEvent, TouchEvent"),Object(r.b)("ul",{parentName:"li"},Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"altKey")," ( ",Object(r.b)("inlineCode",{parentName:"li"},"boolean"),") - The alt key was pressed."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"ctrlKey")," (",Object(r.b)("inlineCode",{parentName:"li"},"boolean"),") - The control key was pressed."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"key")," (",Object(r.b)("inlineCode",{parentName:"li"},"string"),") - The key that was pressed."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"keyCode")," (",Object(r.b)("inlineCode",{parentName:"li"},"number"),") - The key that was pressed, as a numerical code."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"metaKey")," (",Object(r.b)("inlineCode",{parentName:"li"},"boolean"),") - The command key was pressed (Mac only)."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"shiftKey")," (",Object(r.b)("inlineCode",{parentName:"li"},"boolean"),") - The shift key was pressed."))),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"TransitionEvent"),Object(r.b)("ul",{parentName:"li"},Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"propertyName")," (",Object(r.b)("inlineCode",{parentName:"li"},"string"),") - Name of the property that triggered the transition.")))),Object(r.b)("h3",{id:"mocksyntheticevent"},Object(r.b)("inlineCode",{parentName:"h3"},"mockSyntheticEvent()")),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},"mockSyntheticEvent<T = React.SyntheticEvent",">","(type: EventType, options?: EventOptions): T")),Object(r.b)("p",null,"Generates ",Object(r.b)("inlineCode",{parentName:"p"},"React.SyntheticEvent")," and native ",Object(r.b)("inlineCode",{parentName:"p"},"Event")," mocks for use within event dispatching. Based on\nthe defined event type, an appropriate sub-class will be used. For example, if the ",Object(r.b)("inlineCode",{parentName:"p"},"type")," is\n",Object(r.b)("inlineCode",{parentName:"p"},"onClick"),", then a ",Object(r.b)("inlineCode",{parentName:"p"},"React.MouseEvent")," (with a native ",Object(r.b)("inlineCode",{parentName:"p"},"MouseEvent")," of type ",Object(r.b)("inlineCode",{parentName:"p"},"click"),") will be used."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-tsx"},"import { render, mockSyntheticEvent } from 'rut-dom';\nimport Form, { FormProps } from '../src/Form';\n\ndescribe('<Form />', () => {\n  it('triggers click', () => {\n    const spy = jest.fn();\n    const { root } = render<FormProps>(<Form onClick={spy} />);\n\n    root.findOne('button').dispatch('onClick', mockSyntheticEvent('onClick'));\n\n    expect(spy).toHaveBeenCalled();\n  });\n});\n")),Object(r.b)("p",null,"When using TypeScript, the ",Object(r.b)("inlineCode",{parentName:"p"},"T")," generic will infer the event type based on the ",Object(r.b)("inlineCode",{parentName:"p"},"dispatch()")," event\nbeing dispatched. In the above example, the ",Object(r.b)("inlineCode",{parentName:"p"},"T")," would resolve to\n",Object(r.b)("inlineCode",{parentName:"p"},"React.MouseEvent<HTMLButtonElement, MouseEvent>"),". However, this only works when the mock is created\nwithin ",Object(r.b)("inlineCode",{parentName:"p"},"dispatch()"),"s signature. If the event is created outside of it, the type will need to be\nexplicitly defined."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-tsx"},"const event = mockSyntheticEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>('onClick');\nconst spy = jest.spyOn(event, 'preventDefault');\n\nroot.findOne('button').dispatch('onClick', event);\n")),Object(r.b)("p",null,"Supports the same ",Object(r.b)("a",{parentName:"p",href:"#options"},"options")," as ",Object(r.b)("a",{parentName:"p",href:"#mockevent"},Object(r.b)("inlineCode",{parentName:"a"},"mockEvent()")),"."),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},"Event type format must match the prop it's based on. For example, ",Object(r.b)("inlineCode",{parentName:"p"},"onClick")," instead of ",Object(r.b)("inlineCode",{parentName:"p"},"click"),".")))}p.isMDXComponent=!0},90:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return u}));var a=n(0),o=n.n(a);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var b=o.a.createContext({}),p=function(e){var t=o.a.useContext(b),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=p(e.components);return o.a.createElement(b.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,c=e.parentName,b=l(e,["components","mdxType","originalType","parentName"]),s=p(n),d=a,u=s["".concat(c,".").concat(d)]||s[d]||m[d]||r;return n?o.a.createElement(u,i(i({ref:t},b),{},{components:n})):o.a.createElement(u,i({ref:t},b))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,c=new Array(r);c[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var b=2;b<r;b++)c[b]=n[b];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);
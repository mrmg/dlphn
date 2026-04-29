var Re=(i,s)=>()=>(s||i((s={exports:{}}).exports,s),s.exports);import"./modulepreload-polyfill-B5Qt9EMX.js";import{d as be,f as ye,c as ae,q as de,o as xe,g as le,l as We,w as ke,a as we,s as Se}from"./firebase-B9nF9Wnp.js";import{d as j}from"./firebase-DCXdnt5d.js";var tt=Re((rt,ie)=>{var ie={};(function i(s,n,u,m){var f=!!(s.Worker&&s.Blob&&s.Promise&&s.OffscreenCanvas&&s.OffscreenCanvasRenderingContext2D&&s.HTMLCanvasElement&&s.HTMLCanvasElement.prototype.transferControlToOffscreen&&s.URL&&s.URL.createObjectURL),S=typeof Path2D=="function"&&typeof DOMMatrix=="function",$=function(){if(!s.OffscreenCanvas)return!1;try{var t=new OffscreenCanvas(1,1),e=t.getContext("2d");e.fillRect(0,0,1,1);var r=t.transferToImageBitmap();e.createPattern(r,"no-repeat")}catch{return!1}return!0}();function T(){}function L(t){var e=n.exports.Promise,r=e!==void 0?e:s.Promise;return typeof r=="function"?new r(t):(t(T,T),null)}var B=function(t,e){return{transform:function(r){if(t)return r;if(e.has(r))return e.get(r);var d=new OffscreenCanvas(r.width,r.height),l=d.getContext("2d");return l.drawImage(r,0,0),e.set(r,d),d},clear:function(){e.clear()}}}($,new Map),q=function(){var t=Math.floor(16.666666666666668),e,r,d={},l=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(e=function(c){var p=Math.random();return d[p]=requestAnimationFrame(function o(h){l===h||l+t-1<h?(l=h,delete d[p],c()):d[p]=requestAnimationFrame(o)}),p},r=function(c){d[c]&&cancelAnimationFrame(d[c])}):(e=function(c){return setTimeout(c,t)},r=function(c){return clearTimeout(c)}),{frame:e,cancel:r}}(),w=function(){var t,e,r={};function d(l){function c(p,o){l.postMessage({options:p||{},callback:o})}l.init=function(o){var h=o.transferControlToOffscreen();l.postMessage({canvas:h},[h])},l.fire=function(o,h,b){if(e)return c(o,null),e;var x=Math.random().toString(36).slice(2);return e=L(function(y){function k(I){I.data.callback===x&&(delete r[x],l.removeEventListener("message",k),e=null,B.clear(),b(),y())}l.addEventListener("message",k),c(o,x),r[x]=k.bind(null,{data:{callback:x}})}),e},l.reset=function(){l.postMessage({reset:!0});for(var o in r)r[o](),delete r[o]}}return function(){if(t)return t;if(!u&&f){var l=["var CONFETTI, SIZE = {}, module = {};","("+i.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{t=new Worker(URL.createObjectURL(new Blob([l])))}catch(c){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",c),null}d(t)}return t}}(),U={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function V(t,e){return e?e(t):t}function X(t){return t!=null}function g(t,e,r){return V(t&&X(t[e])?t[e]:U[e],r)}function W(t){return t<0?0:Math.floor(t)}function M(t,e){return Math.floor(Math.random()*(e-t))+t}function F(t){return parseInt(t,16)}function ne(t){return t.map(Y)}function Y(t){var e=String(t).replace(/[^0-9a-f]/gi,"");return e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),{r:F(e.substring(0,2)),g:F(e.substring(2,4)),b:F(e.substring(4,6))}}function D(t){var e=g(t,"origin",Object);return e.x=g(e,"x",Number),e.y=g(e,"y",Number),e}function N(t){t.width=document.documentElement.clientWidth,t.height=document.documentElement.clientHeight}function Q(t){var e=t.getBoundingClientRect();t.width=e.width,t.height=e.height}function K(t){var e=document.createElement("canvas");return e.style.position="fixed",e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",e.style.zIndex=t,e}function Z(t,e,r,d,l,c,p,o,h){t.save(),t.translate(e,r),t.rotate(c),t.scale(d,l),t.arc(0,0,1,p,o,h),t.restore()}function ee(t){var e=t.angle*(Math.PI/180),r=t.spread*(Math.PI/180);return{x:t.x,y:t.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:t.startVelocity*.5+Math.random()*t.startVelocity,angle2D:-e+(.5*r-Math.random()*r),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:t.color,shape:t.shape,tick:0,totalTicks:t.ticks,decay:t.decay,drift:t.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:t.gravity*3,ovalScalar:.6,scalar:t.scalar,flat:t.flat}}function G(t,e){e.x+=Math.cos(e.angle2D)*e.velocity+e.drift,e.y+=Math.sin(e.angle2D)*e.velocity+e.gravity,e.velocity*=e.decay,e.flat?(e.wobble=0,e.wobbleX=e.x+10*e.scalar,e.wobbleY=e.y+10*e.scalar,e.tiltSin=0,e.tiltCos=0,e.random=1):(e.wobble+=e.wobbleSpeed,e.wobbleX=e.x+10*e.scalar*Math.cos(e.wobble),e.wobbleY=e.y+10*e.scalar*Math.sin(e.wobble),e.tiltAngle+=.1,e.tiltSin=Math.sin(e.tiltAngle),e.tiltCos=Math.cos(e.tiltAngle),e.random=Math.random()+2);var r=e.tick++/e.totalTicks,d=e.x+e.random*e.tiltCos,l=e.y+e.random*e.tiltSin,c=e.wobbleX+e.random*e.tiltCos,p=e.wobbleY+e.random*e.tiltSin;if(t.fillStyle="rgba("+e.color.r+", "+e.color.g+", "+e.color.b+", "+(1-r)+")",t.beginPath(),S&&e.shape.type==="path"&&typeof e.shape.path=="string"&&Array.isArray(e.shape.matrix))t.fill($e(e.shape.path,e.shape.matrix,e.x,e.y,Math.abs(c-d)*.1,Math.abs(p-l)*.1,Math.PI/10*e.wobble));else if(e.shape.type==="bitmap"){var o=Math.PI/10*e.wobble,h=Math.abs(c-d)*.1,b=Math.abs(p-l)*.1,x=e.shape.bitmap.width*e.scalar,y=e.shape.bitmap.height*e.scalar,k=new DOMMatrix([Math.cos(o)*h,Math.sin(o)*h,-Math.sin(o)*b,Math.cos(o)*b,e.x,e.y]);k.multiplySelf(new DOMMatrix(e.shape.matrix));var I=t.createPattern(B.transform(e.shape.bitmap),"no-repeat");I.setTransform(k),t.globalAlpha=1-r,t.fillStyle=I,t.fillRect(e.x-x/2,e.y-y/2,x,y),t.globalAlpha=1}else if(e.shape==="circle")t.ellipse?t.ellipse(e.x,e.y,Math.abs(c-d)*e.ovalScalar,Math.abs(p-l)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI):Z(t,e.x,e.y,Math.abs(c-d)*e.ovalScalar,Math.abs(p-l)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI);else if(e.shape==="star")for(var v=Math.PI/2*3,C=4*e.scalar,E=8*e.scalar,P=e.x,R=e.y,_=5,H=Math.PI/_;_--;)P=e.x+Math.cos(v)*E,R=e.y+Math.sin(v)*E,t.lineTo(P,R),v+=H,P=e.x+Math.cos(v)*C,R=e.y+Math.sin(v)*C,t.lineTo(P,R),v+=H;else t.moveTo(Math.floor(e.x),Math.floor(e.y)),t.lineTo(Math.floor(e.wobbleX),Math.floor(l)),t.lineTo(Math.floor(c),Math.floor(p)),t.lineTo(Math.floor(d),Math.floor(e.wobbleY));return t.closePath(),t.fill(),e.tick<e.totalTicks}function Ie(t,e,r,d,l){var c=e.slice(),p=t.getContext("2d"),o,h,b=L(function(x){function y(){o=h=null,p.clearRect(0,0,d.width,d.height),B.clear(),l(),x()}function k(){u&&!(d.width===m.width&&d.height===m.height)&&(d.width=t.width=m.width,d.height=t.height=m.height),!d.width&&!d.height&&(r(t),d.width=t.width,d.height=t.height),p.clearRect(0,0,d.width,d.height),c=c.filter(function(I){return G(p,I)}),c.length?o=q.frame(k):y()}o=q.frame(k),h=y});return{addFettis:function(x){return c=c.concat(x),b},canvas:t,promise:b,reset:function(){o&&q.cancel(o),h&&h()}}}function ue(t,e){var r=!t,d=!!g(e||{},"resize"),l=!1,c=g(e,"disableForReducedMotion",Boolean),p=f&&!!g(e||{},"useWorker"),o=p?w():null,h=r?N:Q,b=t&&o?!!t.__confetti_initialized:!1,x=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,y;function k(v,C,E){for(var P=g(v,"particleCount",W),R=g(v,"angle",Number),_=g(v,"spread",Number),H=g(v,"startVelocity",Number),Ae=g(v,"decay",Number),ze=g(v,"gravity",Number),Ee=g(v,"drift",Number),he=g(v,"colors",ne),Pe=g(v,"ticks",Number),me=g(v,"shapes"),Le=g(v,"scalar"),Fe=!!g(v,"flat"),ve=D(v),fe=P,oe=[],He=t.width*ve.x,Oe=t.height*ve.y;fe--;)oe.push(ee({x:He,y:Oe,angle:R,spread:_,startVelocity:H,color:he[fe%he.length],shape:me[M(0,me.length)],ticks:Pe,decay:Ae,gravity:ze,drift:Ee,scalar:Le,flat:Fe}));return y?y.addFettis(oe):(y=Ie(t,oe,h,C,E),y.promise)}function I(v){var C=c||g(v,"disableForReducedMotion",Boolean),E=g(v,"zIndex",Number);if(C&&x)return L(function(H){H()});r&&y?t=y.canvas:r&&!t&&(t=K(E),document.body.appendChild(t)),d&&!b&&h(t);var P={width:t.width,height:t.height};o&&!b&&o.init(t),b=!0,o&&(t.__confetti_initialized=!0);function R(){if(o){var H={getBoundingClientRect:function(){if(!r)return t.getBoundingClientRect()}};h(H),o.postMessage({resize:{width:H.width,height:H.height}});return}P.width=P.height=null}function _(){y=null,d&&(l=!1,s.removeEventListener("resize",R)),r&&t&&(document.body.contains(t)&&document.body.removeChild(t),t=null,b=!1)}return d&&!l&&(l=!0,s.addEventListener("resize",R,!1)),o?o.fire(v,P,_):k(v,P,_)}return I.reset=function(){o&&o.reset(),y&&y.reset()},I}var re;function pe(){return re||(re=ue(null,{useWorker:!0,resize:!0})),re}function $e(t,e,r,d,l,c,p){var o=new Path2D(t),h=new Path2D;h.addPath(o,new DOMMatrix(e));var b=new Path2D;return b.addPath(h,new DOMMatrix([Math.cos(p)*l,Math.sin(p)*l,-Math.sin(p)*c,Math.cos(p)*c,r,d])),b}function Be(t){if(!S)throw new Error("path confetti are not supported in this browser");var e,r;typeof t=="string"?e=t:(e=t.path,r=t.matrix);var d=new Path2D(e),l=document.createElement("canvas"),c=l.getContext("2d");if(!r){for(var p=1e3,o=p,h=p,b=0,x=0,y,k,I=0;I<p;I+=2)for(var v=0;v<p;v+=2)c.isPointInPath(d,I,v,"nonzero")&&(o=Math.min(o,I),h=Math.min(h,v),b=Math.max(b,I),x=Math.max(x,v));y=b-o,k=x-h;var C=10,E=Math.min(C/y,C/k);r=[E,0,0,E,-Math.round(y/2+o)*E,-Math.round(k/2+h)*E]}return{type:"path",path:e,matrix:r}}function Ce(t){var e,r=1,d="#000000",l='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof t=="string"?e=t:(e=t.text,r="scalar"in t?t.scalar:r,l="fontFamily"in t?t.fontFamily:l,d="color"in t?t.color:d);var c=10*r,p=""+c+"px "+l,o=new OffscreenCanvas(c,c),h=o.getContext("2d");h.font=p;var b=h.measureText(e),x=Math.ceil(b.actualBoundingBoxRight+b.actualBoundingBoxLeft),y=Math.ceil(b.actualBoundingBoxAscent+b.actualBoundingBoxDescent),k=2,I=b.actualBoundingBoxLeft+k,v=b.actualBoundingBoxAscent+k;x+=k+k,y+=k+k,o=new OffscreenCanvas(x,y),h=o.getContext("2d"),h.font=p,h.fillStyle=d,h.fillText(e,I,v);var C=1/r;return{type:"bitmap",bitmap:o.transferToImageBitmap(),matrix:[C,0,0,C,-x*C/2,-y*C/2]}}n.exports=function(){return pe().apply(this,arguments)},n.exports.reset=function(){pe().reset()},n.exports.create=ue,n.exports.shapeFromPath=Be,n.exports.shapeFromText=Ce})(function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}}(),ie,!1);const te=ie.exports;ie.exports.create;const De={"east-sussex":{quiz:{slug:"east-sussex",title:"East Sussex Quiz",topic:"Local History & Geography",isActive:!0},questions:[{id:"q1",order:1,text:"What year was the Battle of Hastings?",hint:"Think about the Norman Conquest",options:[{id:"a",text:"1066"},{id:"b",text:"1666"},{id:"c",text:"1966"},{id:"d",text:"1016"}],correctOptionId:"a",explanation:"The Battle of Hastings was fought on 14 October 1066."},{id:"q2",order:2,text:"Who won the Battle of Hastings?",hint:'He later became known as "the Conqueror"',options:[{id:"a",text:"King Harold"},{id:"b",text:"William of Normandy"},{id:"c",text:"Henry VIII"},{id:"d",text:"Julius Caesar"}],correctOptionId:"b",explanation:"William of Normandy (later William the Conqueror) defeated King Harold."},{id:"q3",order:3,text:"Which shield shape is most closely linked with the Saxons?",media:{type:"image",url:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Anglo-Saxon_Shield_%28composite%29.png/800px-Anglo-Saxon_Shield_%28composite%29.png",altText:"A round Anglo-Saxon shield",caption:"Anglo-Saxon shield design"},options:[{id:"a",text:"Round"},{id:"b",text:"Kite-shaped"},{id:"c",text:"Square"},{id:"d",text:"Triangular"}],correctOptionId:"a",explanation:"Saxon warriors used round wooden shields, often with a metal boss in the centre."},{id:"q4",order:4,text:"Which army was known for kite-shaped shields?",options:[{id:"a",text:"Saxons"},{id:"b",text:"Normans"},{id:"c",text:"Romans"},{id:"d",text:"Vikings"}],correctOptionId:"b",explanation:"The Normans used long kite-shaped shields that protected their legs while on horseback."},{id:"q5",order:5,text:"What famous picture-story tells of the Norman conquest?",media:{type:"image",url:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bayeux_Tapestry_scene57_Harold_death.jpg/1024px-Bayeux_Tapestry_scene57_Harold_death.jpg",altText:"A section of the Bayeux Tapestry showing the battle",caption:"The Bayeux Tapestry tells the story of the Norman conquest"},options:[{id:"a",text:"Bayeux Tapestry"},{id:"b",text:"Rosetta Stone"},{id:"c",text:"Domesday Book"},{id:"d",text:"Magna Carta"}],correctOptionId:"a",explanation:"The Bayeux Tapestry is a 70-metre-long embroidered cloth depicting the events leading to the conquest."},{id:"q6",order:6,text:"What was the Battle of Hastings fought over?",options:[{id:"a",text:"Who invented chips"},{id:"b",text:"Who would be king of England"},{id:"c",text:"Who owned the land"},{id:"d",text:"Who had the best horse"}],correctOptionId:"b",explanation:"Both William and Harold claimed the English throne after King Edward the Confessor died."},{id:"q7",order:7,text:"Where exactly was the Battle of Hastings fought?",hint:"It is not actually in Hastings town itself",options:[{id:"a",text:"On Hastings Pier"},{id:"b",text:"Near what is now Battle"},{id:"c",text:"On the beach at Hastings"},{id:"d",text:"In Hastings Castle"}],correctOptionId:"b",explanation:"The battle was fought about 7 miles northwest of Hastings, near the present-day town of Battle."},{id:"q8",order:8,text:"What building marks the site of the battle today?",media:{type:"image",url:"",altText:"Battle Abbey in East Sussex",caption:"The high altar of Battle Abbey marks where King Harold fell"},options:[{id:"a",text:"Battle Abbey"},{id:"b",text:"Bodiam Castle"},{id:"c",text:"Herstmonceux Castle"},{id:"d",text:"Lewes Priory"}],correctOptionId:"a",explanation:"William the Conqueror built Battle Abbey on the site, with the high altar marking where Harold fell."},{id:"q9",order:9,text:"What appeared in the sky in 1066 and was seen as an omen?",options:[{id:"a",text:"A solar eclipse"},{id:"b",text:"Halley's Comet"},{id:"c",text:"The Northern Lights"},{id:"d",text:"A shooting star"}],correctOptionId:"b",explanation:"Halley's Comet appeared in 1066 and was seen as a bad omen for King Harold. It is depicted on the Bayeux Tapestry."},{id:"q10",order:10,text:"The Bayeux Tapestry is technically what?",options:[{id:"a",text:"An embroidered cloth"},{id:"b",text:"A woven tapestry"},{id:"c",text:"A stone carving"},{id:"d",text:"A painted scroll"}],correctOptionId:"a",explanation:"Despite its name, the Bayeux Tapestry is actually an embroidered cloth, not a woven tapestry."},{id:"q11",order:11,text:"What is the county town of East Sussex?",options:[{id:"a",text:"Brighton"},{id:"b",text:"Lewes"},{id:"c",text:"Eastbourne"},{id:"d",text:"Hastings"}],correctOptionId:"b",explanation:"Lewes is the county town of East Sussex, famous for its castle and bonfire celebrations."},{id:"q12",order:12,text:"Which famous white cliffs are in East Sussex?",media:{type:"image",url:"",altText:"The Seven Sisters cliffs in East Sussex",caption:"The iconic white chalk cliffs of the Seven Sisters"},options:[{id:"a",text:"White Cliffs of Dover"},{id:"b",text:"Seven Sisters"},{id:"c",text:"Beachy Head"},{id:"d",text:"Old Harry Rocks"}],correctOptionId:"b",explanation:"The Seven Sisters are a series of chalk cliffs between Seaford and Eastbourne in East Sussex."},{id:"q13",order:13,text:"Which seaside resort in East Sussex has a famous pier and Royal Pavilion?",options:[{id:"a",text:"Hastings"},{id:"b",text:"Brighton"},{id:"c",text:"Eastbourne"},{id:"d",text:"Bexhill-on-Sea"}],correctOptionId:"b",explanation:"Brighton is famous for its Royal Pavilion, pier, and vibrant seafront."},{id:"q14",order:14,text:"What castle in East Sussex is surrounded by a moat and looks like something from a fairy tale?",media:{type:"image",url:"",altText:"Bodiam Castle with its wide moat",caption:"Bodiam Castle, a 14th-century moated castle near Robertsbridge"},options:[{id:"a",text:"Bodiam Castle"},{id:"b",text:"Arundel Castle"},{id:"c",text:"Lewes Castle"},{id:"d",text:"Hastings Castle"}],correctOptionId:"a",explanation:"Bodiam Castle is a stunning 14th-century moated castle near Robertsbridge, built by Sir Edward Dalyngrigge."},{id:"q15",order:15,text:"What is the highest point in East Sussex?",options:[{id:"a",text:"Beachy Head"},{id:"b",text:"Ditchling Beacon"},{id:"c",text:"Crowborough Beacon"},{id:"d",text:"Ashdown Forest"}],correctOptionId:"b",explanation:"Ditchling Beacon is the highest point in East Sussex at 248 metres, offering views across the South Downs."},{id:"q16",order:16,text:"Which famous children's author lived in Ashdown Forest and set his stories there?",options:[{id:"a",text:"A.A. Milne"},{id:"b",text:"J.K. Rowling"},{id:"c",text:"Roald Dahl"},{id:"d",text:"Enid Blyton"}],correctOptionId:"a",explanation:"A.A. Milne wrote the Winnie-the-Pooh stories, set in Ashdown Forest in East Sussex."},{id:"q17",order:17,text:"What natural landmark in Hastings was formed by erosion and has a famous hole through it?",media:{type:"image",url:"",altText:"Photo question — natural rock arch",caption:"A natural arch formed by coastal erosion"},options:[{id:"a",text:"Durdle Door"},{id:"b",text:"The Needles"},{id:"c",text:"The Stade"},{id:"d",text:"Ecclesbourne Glen"}],correctOptionId:"c",explanation:"The Stade is Hastings' famous shingle beach and home to Europe's largest fleet of beach-launched fishing boats."},{id:"q18",order:18,text:"What annual event in Lewes is famous for its fiery processions?",options:[{id:"a",text:"Lewes Bonfire Night"},{id:"b",text:"Brighton Festival"},{id:"c",text:"Hastings Pirate Day"},{id:"d",text:"Glyndebourne Opera"}],correctOptionId:"a",explanation:"Lewes Bonfire Night is the UK's biggest 5th November celebration, with spectacular fire processions through the town."},{id:"q19",order:19,text:"What ancient trackway runs across the South Downs through East Sussex?",options:[{id:"a",text:"The Ridgeway"},{id:"b",text:"The South Downs Way"},{id:"c",text:"The Pilgrims' Way"},{id:"d",text:"Hadrian's Wall Path"}],correctOptionId:"b",explanation:"The South Downs Way is a 160km National Trail running from Winchester to Eastbourne across the South Downs."},{id:"q20",order:20,text:"In the Battle of Hastings, roughly how many soldiers fought altogether?",options:[{id:"a",text:"Around 2,000"},{id:"b",text:"Around 7,000–14,000"},{id:"c",text:"Around 50,000"},{id:"d",text:"Around 100,000"}],correctOptionId:"b",explanation:"Historians estimate roughly 7,000–14,000 soldiers fought at Hastings — William had about 7,000 and Harold about 7,000."}]},"space-explorers":{quiz:{slug:"space-explorers",title:"Space Explorers Quiz",topic:"Science",isActive:!1},questions:[{id:"sq1",order:1,text:"Which planet is known as the Red Planet?",options:[{id:"a",text:"Mars"},{id:"b",text:"Venus"},{id:"c",text:"Saturn"},{id:"d",text:"Jupiter"}],correctOptionId:"a",explanation:"Mars appears red because of iron oxide (rust) on its surface."},{id:"sq2",order:2,text:"What force keeps planets in orbit around the sun?",options:[{id:"a",text:"Magnetism"},{id:"b",text:"Gravity"},{id:"c",text:"Wind pressure"},{id:"d",text:"Friction"}],correctOptionId:"b",explanation:"Gravity is the force that pulls objects toward each other, keeping planets in orbit."},{id:"sq3",order:3,text:"What do you call a rock that enters Earth's atmosphere and burns up?",media:{type:"image",url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Leonid_Meteor.jpg/1024px-Leonid_Meteor.jpg",altText:"A meteor streaking across the night sky",caption:"A meteor burning up in Earth's atmosphere"},options:[{id:"a",text:"Meteor"},{id:"b",text:"Asteroid"},{id:"c",text:"Comet"},{id:"d",text:"Planetoid"}],correctOptionId:"a",explanation:"When a meteoroid enters the atmosphere, the streak of light it creates is called a meteor (shooting star)."}]}};function ge(i){const s=De[i];return s?{quiz:s.quiz,questions:s.questions}:null}async function Ne(i){try{const s=be(j,"kvpQuizzes",i),n=await ye(s);if(!n.exists())return ge(i);const u={id:n.id,...n.data()},m=ae(j,"kvpQuizzes",i,"questions"),f=de(m,xe("order","asc")),$=(await le(f)).docs.map(T=>({id:T.id,...T.data()}));return{quiz:u,questions:$}}catch(s){return console.warn("Failed to load Firestore quiz, using fallback if available.",s),ge(i)}}function Me(i,s){const n=[];let u=0;for(const S of i){const $=s[S.id]||null,T=$===S.correctOptionId;T&&(u+=1),n.push({questionId:S.id,selectedOptionId:$,isCorrect:T})}const m=i.length,f=m>0?Math.round(u/m*100):0;return{answers:n,score:u,maxScore:m,percentage:f}}async function Qe({quizSlug:i,quizTitle:s,playerName:n,scoring:u}){const m=ae(j,"kvpQuizzes",i,"submissions"),f={playerType:"parent",name:n||"",quizSlug:i,quizTitleSnapshot:s,answers:u.answers,score:u.score,maxScore:u.maxScore,percentage:u.percentage,createdAt:Se()};return(await we(m,f)).id}async function Ke({quizSlug:i,quizTitle:s,scoring:n}){const u=ae(j,"kvpQuizzes",i,"submissions"),m={playerType:"kids",name:"Kids Team",quizSlug:i,quizTitleSnapshot:s,answers:n.answers,score:n.score,maxScore:n.maxScore,percentage:n.percentage,createdAt:Se()};return(await we(u,m)).id}async function _e(i,s){const n=be(j,"kvpQuizzes",i,"submissions",s),u=await ye(n);return u.exists()?{id:u.id,...u.data()}:null}async function Te(i){const s=ae(j,"kvpQuizzes",i,"submissions"),n=de(s,ke("playerType","==","kids"),xe("createdAt","desc"),We(1)),u=await le(n);if(u.empty)return null;const m=u.docs[0];return{id:m.id,...m.data()}}async function je(i){const s=ae(j,"kvpQuizzes",i,"submissions"),n=de(s,ke("playerType","==","parent")),m=(await le(n)).docs.map(w=>({id:w.id,...w.data()})),f=m.length,S=m.reduce((w,U)=>w+(Number(U.score)||0),0),$=f?Math.max(...m.map(w=>Number(w.score)||0)):0,T=f?Math.min(...m.map(w=>Number(w.score)||0)):0,L=f?S/f:0,B=m.sort((w,U)=>{var g,W;const V=((g=w.createdAt)==null?void 0:g.seconds)||0;return(((W=U.createdAt)==null?void 0:W.seconds)||0)-V}).slice(0,10),q=await Te(i);return{parentCount:f,parentAverageScore:Number(L.toFixed(2)),parentHighestScore:$,parentLowestScore:T,recentParents:B,kidsLatest:q}}const A="/kids-vs-parents",O="east-sussex",a={loading:!1,error:"",info:"",submitted:!1,submissionId:"",name:"",currentIndex:0,selectedByQuestionId:{},quiz:null,questions:[],route:null,resultSubmission:null,kidsLatest:null,adminSummary:null,confettiFired:!1};function qe(i){const n=(i.startsWith(A)?i.slice(A.length):"/").split("/").filter(Boolean),[u,m="",f=""]=n;return{mode:u||"home",quizSlug:m,routeId:f}}function J(i){a.error=i}function se(i){a.info=i}function Ue(){a.error="",a.info="",a.submitted=!1,a.submissionId="",a.currentIndex=0,a.selectedByQuestionId={},a.resultSubmission=null,a.kidsLatest=null,a.adminSummary=null,a.confettiFired=!1}async function Ve(){const i=qe(window.location.pathname);a.route=i;const s=i.quizSlug||O;Ue(),a.loading=!0,z();const n=await Ne(s);if(!n||!n.quiz||!Array.isArray(n.questions)||n.questions.length===0){J(`No quiz data found for "${s}".`),a.quiz=null,a.questions=[],a.loading=!1,z();return}a.quiz=n.quiz,a.questions=n.questions;try{i.mode==="result"&&i.routeId&&(a.resultSubmission=await _e(s,i.routeId),a.kidsLatest=await Te(s),a.resultSubmission||J(`Result "${i.routeId}" was not found.`)),i.mode==="admin"&&(a.adminSummary=await je(s))}catch(u){J(`Failed to load route data: ${u.message}`)}a.loading=!1,z()}function Ye(i,s){a.selectedByQuestionId={...a.selectedByQuestionId,[i]:s};const n=document.querySelector("#app");if(!n)return;n.querySelectorAll(`[data-choice-question="${i}"]`).forEach(m=>{m.dataset.choiceOption===s?m.classList.add("kvp-choice--selected"):m.classList.remove("kvp-choice--selected")});const u=n.querySelector("[data-submit]");u&&(ce()?u.removeAttribute("disabled"):u.setAttribute("disabled",""))}function ce(){return a.questions.every(i=>a.selectedByQuestionId[i.id])}async function Ze(){if(!a.quiz||!a.route)return;if(!ce()){J("Please answer every question before submitting."),z();return}J(""),se("");const i=Me(a.questions,a.selectedByQuestionId);a.loading=!0,z();try{const s=a.quiz.slug||a.quiz.id||O;let n="";a.route.mode==="kids"?(n=await Ke({quizSlug:s,quizTitle:a.quiz.title||"Dolphin Kids vs Parents Quiz",scoring:i}),se("Kids team score saved.")):n=await Qe({quizSlug:s,quizTitle:a.quiz.title||"Dolphin Kids vs Parents Quiz",playerName:a.name,scoring:i}),a.submitted=!0,a.submissionId=n}catch(s){J(`Unable to save submission: ${s.message}`)}finally{a.loading=!1,z()}}function Ge(i){return i?i.type==="image"?`
      <div class="kvp-media kvp-media--image">
        <img src="${i.url}" alt="${i.altText||"Question image"}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="kvp-media-fallback" style="display:none;">
          <span>🖼️ Image failed to load</span>
        </div>
      </div>
    `:i.type==="audio"?`
      <div class="kvp-media kvp-media--audio">
        <div class="kvp-media-placeholder">
          <span style="font-size:2rem;">🎵</span>
          <span>${i.caption||"Audio clip"}</span>
        </div>
      </div>
    `:i.type==="video"?`
      <div class="kvp-media kvp-media--video">
        <div class="kvp-media-placeholder">
          <span style="font-size:2rem;">🎬</span>
          <span>${i.caption||"Video clip"}</span>
        </div>
      </div>
    `:"":""}function Je(){const i=a.currentIndex+1,s=a.questions.length,n=Math.round(i/s*100);return`
    <div class="kvp-progress">
      <div class="kvp-progress-text">Question ${i} of ${s}</div>
      <div class="kvp-progress-bar">
        <div class="kvp-progress-fill" style="width:${n}%"></div>
      </div>
    </div>
  `}function Xe(i){a.confettiFired||(a.confettiFired=!0,setTimeout(()=>{i==="win"?(te({particleCount:150,spread:100,origin:{y:.5},colors:["#FFD700","#FF6B6B","#4ECDC4","#45B7D1"]}),te({particleCount:75,spread:120,origin:{y:.6},angle:60,colors:["#FFD700","#FF6B6B"]}),te({particleCount:75,spread:120,origin:{y:.6},angle:120,colors:["#FFD700","#FF6B6B"]})):i==="draw"?te({particleCount:100,spread:80,origin:{y:.5},colors:["#FFD700","#C0C0C0","#CD7F32"]}):i==="lose"&&te({particleCount:50,spread:60,origin:{y:.6},colors:["#87CEEB","#98FB98"]})},300))}function z(){var V,X,g,W;const i=document.querySelector("#app");if(!i)return;const s=a.route||qe(window.location.pathname),n=new URLSearchParams(window.location.search),u=n.get("player")||"parent",m=n.get("key")||"",f=s.mode==="quiz"&&u!=="kids",S=s.mode==="kids",$=s.mode==="admin",T=s.mode==="result",L=!f&&!S&&!$&&!T,q=S||$?m==="DEMO":!1,w=a.questions[a.currentIndex];if(a.submitted&&Me(a.questions,a.selectedByQuestionId),L){i.innerHTML=`
      <div class="kvp-landing">
        <section class="kvp-hero">
          <span class="kvp-hero-icon">🛡️</span>
          <h1>Dolphin Kids vs Parents</h1>
          <p class="kvp-hero-subtitle">East Sussex Quiz &mdash; Can the grown-ups beat the kids?</p>
          <div class="kvp-hero-meta">
            <span class="kvp-hero-badge">🏰 Local History</span>
            <span class="kvp-hero-badge">🗺️ East Sussex</span>
          </div>
        </section>

        <div class="kvp-roles">
          <a class="kvp-role-btn kvp-role-btn--parent" href="${A}/quiz/${O}">
            <span class="kvp-role-icon">👔</span>
            <span>Parent Quiz &mdash; Take the challenge!</span>
          </a>
          <a class="kvp-role-btn kvp-role-btn--kid" href="${A}/kids/${O}?key=DEMO">
            <span class="kvp-role-icon">🔒</span>
            <span>Kids Team Entry &mdash; Admin key required</span>
          </a>
          <a class="kvp-role-btn" href="${A}/admin/${O}?key=DEMO">
            <span class="kvp-role-icon">⚙️</span>
            <span>Admin Dashboard</span>
          </a>
        </div>

        <details style="margin-top:2rem;opacity:0.5;font-size:0.8rem;color:var(--kvp-parchment);max-width:300px;">
          <summary>Route Debug</summary>
          <p><strong>Path:</strong> <code>${window.location.pathname}</code></p>
          <p><strong>Mode:</strong> <code>${s.mode}</code></p>
          <p><strong>Slug:</strong> <code>${s.quizSlug||"none"}</code></p>
          <p><strong>Player:</strong> <code>${u}</code></p>
        </details>
      </div>
    `;return}if(a.loading){i.innerHTML=`
      <div class="kvp-container">
        <div class="kvp-loading">
          <div class="kvp-loading-spinner"></div>
          <p class="kvp-loading-text">Loading quiz data...</p>
        </div>
      </div>
    `;return}if(a.error&&!a.quiz){i.innerHTML=`
      <div class="kvp-container">
        <div class="kvp-error">
          <p>${a.error}</p>
          <button class="kvp-btn kvp-btn--primary" onclick="window.location.reload()">Retry</button>
        </div>
      </div>
    `;return}if((f||S)&&w&&(f||q)){i.innerHTML=`
      <div class="kvp-container kvp-quiz">
        ${Je()}

        <section class="kvp-quiz-card">
          <div class="kvp-question-number">${a.currentIndex+1}</div>
          ${Ge(w.media)}
          <p class="kvp-question">${w.text}</p>
          <div class="kvp-choices">
            ${(w.options||[]).map(M=>`
                <button
                  class="kvp-choice ${a.selectedByQuestionId[w.id]===M.id?"kvp-choice--selected":""}"
                  data-choice-question="${w.id}"
                  data-choice-option="${M.id}"
                  type="button"
                >
                  ${M.text}
                </button>
              `).join("")}
          </div>
          <div class="kvp-btn-row">
            <button class="kvp-btn kvp-btn--back" type="button" data-back ${a.currentIndex===0?"disabled":""}>Back</button>
            ${a.currentIndex<a.questions.length-1?`
              <button class="kvp-btn kvp-btn--primary" type="button" data-next>Next Question →</button>
            `:`
              <button class="kvp-btn kvp-btn--primary" type="button" data-submit ${ce()?"":"disabled"}>${S?"Save Kids Score":"Submit Answers"}</button>
            `}
          </div>
        </section>

        ${a.error?`<div class="kvp-error">${a.error}</div>`:""}
        ${a.info?`<div class="kvp-success">${a.info}</div>`:""}

        ${f?`
          <div class="kvp-name-input-wrapper">
            <label class="kvp-name-label" for="playerName">Your name (optional)</label>
            <input id="playerName" data-player-name class="kvp-name-input" value="${a.name}" placeholder="Enter your name" />
          </div>
        `:""}

        ${S&&!q?'<div class="kvp-error">Add a valid <code>?key=...</code> for Kids Team entry.</div>':""}
      </div>
    `;return}if($){(V=a.quiz)!=null&&V.slug||(X=a.quiz)!=null&&X.id,i.innerHTML=`
      <div class="kvp-admin">
        <div class="kvp-admin-header">
          <h2 class="kvp-admin-title">Admin Dashboard</h2>
        </div>

        ${q?"":'<div class="kvp-error">Admin key missing or invalid.</div>'}

        ${q&&a.adminSummary?`
          <div class="kvp-admin-stats">
            <div class="kvp-admin-stat">
              <div class="kvp-admin-stat-value">${a.adminSummary.parentCount}</div>
              <div class="kvp-admin-stat-label">Parent Submissions</div>
            </div>
            <div class="kvp-admin-stat">
              <div class="kvp-admin-stat-value">${a.adminSummary.parentAverageScore}</div>
              <div class="kvp-admin-stat-label">Average Score</div>
            </div>
            <div class="kvp-admin-stat">
              <div class="kvp-admin-stat-value">${a.adminSummary.parentHighestScore}</div>
              <div class="kvp-admin-stat-label">Highest</div>
            </div>
            <div class="kvp-admin-stat">
              <div class="kvp-admin-stat-value">${a.adminSummary.parentLowestScore}</div>
              <div class="kvp-admin-stat-label">Lowest</div>
            </div>
          </div>

          <h3 class="kvp-admin-section-title">📊 Latest Kids Score</h3>
          <p style="color:var(--kvp-parchment);margin-bottom:1.5rem;">
            ${a.adminSummary.kidsLatest?`${a.adminSummary.kidsLatest.score} / ${a.adminSummary.kidsLatest.maxScore}`:"Not submitted yet"}
          </p>

          <h3 class="kvp-admin-section-title">📋 Quick Actions</h3>
          <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;">
            <button class="kvp-btn" data-copy-parent-link>Copy Parent Link</button>
            <button class="kvp-btn" data-copy-kids-link>Copy Kids Entry Link</button>
          </div>

          <h3 class="kvp-admin-section-title">📜 Recent Submissions</h3>
          <div class="kvp-admin-list">
            <div class="kvp-admin-list-header">
              <span>Name</span>
              <span>Score</span>
              <span>%</span>
              <span>Date</span>
            </div>
            ${(a.adminSummary.recentParents||[]).map(M=>`
              <div class="kvp-admin-list-row">
                <span>${M.name||"Anonymous"}</span>
                <span>${M.score} / ${M.maxScore}</span>
                <span>${M.percentage||0}%</span>
                <span>${M.createdAt?new Date(M.createdAt.seconds*1e3).toLocaleDateString():"-"}</span>
              </div>
            `).join("")||'<div class="kvp-admin-list-row"><span>No parent submissions yet.</span></div>'}
          </div>
        `:""}

        ${a.info?`<div class="kvp-success" style="margin-top:1rem;">${a.info}</div>`:""}
      </div>
    `;return}if(T&&a.resultSubmission){const M=a.resultSubmission.score,F=a.resultSubmission.maxScore,ne=a.resultSubmission.percentage;let Y="",D="",N="",Q="",K="";if(a.kidsLatest){const Z=a.kidsLatest.score,ee=a.kidsLatest.maxScore,G=M-Z;G>0?(Y="kvp-result--win",D="Victory!",N="🏆",Q=`You scored ${M}/${F}. The Kids scored ${Z}/${ee}. You beat the Kids by ${G} points. Suspicious. Very suspicious. The Witan may need to investigate.`,K="win"):G===0?(Y="kvp-result--draw",D="Standoff!",N="⚖️",Q=`You scored ${M}/${F}. The Kids scored ${Z}/${ee}. A tense standoff on the battlefield. No one breaks the shield wall today.`,K="draw"):(Y="kvp-result--lose",D="Defeated!",N="🛡️",Q=`You scored ${M}/${F}. The Kids scored ${Z}/${ee}. The Kids beat you by ${Math.abs(G)} points. The shield wall holds. Back to history class with you.`,K="lose")}else D="Pending",N="⏳",Q=`You scored ${M}/${F}. The Kids' official score has not been entered yet. Check back later for your battlefield result.`;K&&Xe(K),i.innerHTML=`
      <div class="kvp-container">
        <section class="kvp-result ${Y}">
          <div class="kvp-result-badge">${N}</div>
          <h2 class="kvp-result-title">${D}</h2>
          <div class="kvp-result-score">${ne}%</div>
          <div style="color:var(--kvp-text-light);font-size:0.9rem;margin-bottom:1rem;">${M} / ${F}</div>
          <p class="kvp-result-message">${Q}</p>
          <div style="display:flex;gap:0.75rem;justify-content:center;margin-top:1.5rem;">
            <a class="kvp-btn kvp-btn--primary" href="${A}/quiz/${((g=a.quiz)==null?void 0:g.slug)||((W=a.quiz)==null?void 0:W.id)||O}">Try Again</a>
            <a class="kvp-btn kvp-btn--ghost" href="${A}">Back to Home</a>
          </div>
        </section>
      </div>
    `;return}if(T&&!a.resultSubmission){i.innerHTML=`
      <div class="kvp-container">
        <div class="kvp-error">
          <p>Result not found.</p>
          <a class="kvp-btn kvp-btn--primary" href="${A}">Back to Home</a>
        </div>
      </div>
    `;return}if(S&&!q){i.innerHTML=`
      <div class="kvp-container">
        <div class="kvp-error">
          <p>🔒 Kids Team Entry requires an admin key.</p>
          <p>Add <code>?key=YOUR_KEY</code> to the URL.</p>
          <a class="kvp-btn kvp-btn--primary" href="${A}">Back to Home</a>
        </div>
      </div>
    `;return}i.innerHTML=`
    <div class="kvp-container">
      <div class="kvp-error"><p>No quiz data loaded.</p></div>
      <a class="kvp-btn kvp-btn--primary" href="${A}">Back to Home</a>
    </div>
  `}function et(){const i=document.querySelector("#app");i&&(i.addEventListener("click",async s=>{var u,m,f,S,$,T,L;const n=s.target;if(n instanceof HTMLElement){if(n.matches("[data-choice-question]")){const B=n.dataset.choiceQuestion,q=n.dataset.choiceOption;if(!B||!q)return;Ye(B,q);return}if(n.matches("[data-next]")){a.currentIndex=Math.min(a.currentIndex+1,a.questions.length-1),z();return}if(n.matches("[data-back]")){a.currentIndex=Math.max(a.currentIndex-1,0),z();return}if(n.matches("[data-submit]")&&(await Ze(),((u=a.route)==null?void 0:u.mode)==="quiz"&&a.submissionId)){const B=((m=a.quiz)==null?void 0:m.slug)||((f=a.quiz)==null?void 0:f.id)||O;window.location.href=`${A}/result/${B}/${a.submissionId}`}if(n.matches("[data-copy-parent-link]")){const B=((S=a.quiz)==null?void 0:S.slug)||(($=a.quiz)==null?void 0:$.id)||O,q=`${window.location.origin}${A}/quiz/${B}`;navigator.clipboard.writeText(q).then(()=>{se("Parent link copied!"),z(),setTimeout(()=>{a.info="",z()},3e3)})}if(n.matches("[data-copy-kids-link]")){const B=((T=a.quiz)==null?void 0:T.slug)||((L=a.quiz)==null?void 0:L.id)||O,w=`${window.location.origin}${A}/kids/${B}?key=DEMO`;navigator.clipboard.writeText(w).then(()=>{se("Kids entry link copied!"),z(),setTimeout(()=>{a.info="",z()},3e3)})}}}),i.addEventListener("input",s=>{const n=s.target;n instanceof HTMLInputElement&&n.matches("[data-player-name]")&&(a.name=n.value)}))}et();Ve()});export default tt();

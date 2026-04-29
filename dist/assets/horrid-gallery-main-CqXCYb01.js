import"./modulepreload-polyfill-B5Qt9EMX.js";import{i as ge,e as he,b as O,h as me,c as ye,q as pe,o as ue,g as fe,f as we,d as be}from"./firebase-B9nF9Wnp.js";import{g as xe,l as Ce}from"./index.esm2017-CznT6drP.js";const ve={apiKey:"AIzaSyD-35jua6EQ5md0fL1f7Bd4nnpz2wKXlUU",authDomain:"dolphin-thursday.firebaseapp.com",projectId:"dolphin-thursday",storageBucket:"dolphin-thursday.firebasestorage.app",messagingSenderId:"885293763604",appId:"1:885293763604:web:5f87d5cfcce0a43c33eb01"},I=ge(ve),T=he(I);O(I);const Ee=xe(I);function d(m,h={}){try{Ce(Ee,m,{...h,page:"character_gallery",timestamp:new Date().toISOString()}),console.log("Analytics event:",m,h)}catch(g){console.warn("Analytics tracking error:",g)}}function _e(){d("page_view",{page_title:"Character Gallery",page_location:"/horrid/gallery"})}document.addEventListener("DOMContentLoaded",()=>{_e();const m=document.getElementById("loading"),h=document.getElementById("error"),g=document.getElementById("gallery"),_=document.getElementById("emptyGallery"),y=document.getElementById("imageModal"),B=document.getElementById("modalImage"),z=document.getElementById("modalPrompt"),R=document.querySelector(".close-button"),U=document.getElementById("recreateBtn"),H=document.getElementById("printBtn"),q=document.getElementById("downloadBtn"),j=document.getElementById("shareBtn"),k=document.getElementById("deleteBtn"),f=document.getElementById("prevModalBtn"),w=document.getElementById("nextModalBtn"),J=document.getElementById("pagination"),S=document.getElementById("prevBtn"),D=document.getElementById("nextBtn"),K=document.getElementById("pageInfo"),P=document.getElementById("currentGalleryName");let r=[],t=null,s=-1,b=[],c="choose";const p=8;async function Q(){try{const e=localStorage.getItem("horrid_galleries");e?b=JSON.parse(e):(b=[{id:"choose",name:"CHOOSE",created:new Date().toISOString()},{id:"default",name:"Default",created:new Date().toISOString()},{id:"monster",name:"Monster",created:new Date().toISOString()}],localStorage.setItem("horrid_galleries",JSON.stringify(b))),await W(),updateGallerySelectors()}catch(e){console.error("Error loading galleries:",e)}}async function W(){try{const e=await we(be(T,"settings","currentGallery"));e.exists()?c=e.data().galleryId||"choose":c="choose",A()}catch(e){console.error("Error loading current gallery:",e),c="choose",A()}}function A(){if(c==="choose")P.textContent="CHOOSE";else{const e=b.find(a=>a.id===c);P.textContent=e?e.name:c.toUpperCase()}}let l=1,x=1;async function Y(){try{ie(),se();const e=ye(T,"characterQueries"),a=pe(e,ue("timestamp","desc")),i=await fe(a);if(r=[],i.forEach(o=>{const n=o.data();n.status==="completed"&&n.imageUrl&&(c==="choose"||c==="default"&&(!n.gallery||n.gallery==="default")||c==="monster"&&n.gallery==="monster"||c!=="default"&&c!=="monster"&&n.gallery===c)&&r.push({id:o.id,...n})}),G(),r.length===0)$();else{u();const n=new URLSearchParams(window.location.search).get("view");if(n){const L=r.find(E=>E.id===n);if(L){const E=r.findIndex(de=>de.id===n);E!==-1&&(l=Math.floor(E/p)+1,u()),setTimeout(()=>{C(L)},500)}}}}catch(e){console.error("Error loading characters:",e),G(),le("Failed to load characters. Please try again!")}}function u(){g.innerHTML="",x=Math.ceil(r.length/p);const e=(l-1)*p,a=e+p;r.slice(e,a).forEach(o=>{const n=ee(o);g.appendChild(n)}),V(),g.style.display="grid",_.style.display="none",J.style.display=r.length>p?"flex":"none"}function V(){K.textContent=`Page ${l} of ${x}`,S.disabled=l===1,D.disabled=l===x}function X(){l>1&&(l--,u(),d("character_gallery_pagination",{action:"previous",page:l,event_category:"gallery_actions"}))}function Z(){l<x&&(l++,u(),d("character_gallery_pagination",{action:"next",page:l,event_category:"gallery_actions"}))}function ee(e){const a=document.createElement("div");a.className="character-card",a.onclick=()=>C(e);const i=document.createElement("img");i.src=e.imageUrl,i.alt="Character Image",i.className="character-image",i.loading="lazy";const o=document.createElement("div");return o.className="character-creator",o.style.textAlign="center",o.style.fontSize="1.2em",o.style.fontWeight="bold",o.innerHTML=`<div style="color: #2196F3;">Created by:</div><div style="color: #F44336; font-size: 1.5em">${e.creatorName||"Anonymous"}</div>`,a.appendChild(i),a.appendChild(o),a}function C(e){t=e,s=r.findIndex(o=>o.id===e.id),B.src=e.imageUrl,B.alt="Character Image",z.textContent=e.characterDescription||"No description available",d("character_gallery_view",{character_id:e.id,has_creator_name:!!e.creatorName,event_category:"gallery_actions"});const a=document.querySelector(".modal-prompt-label");e.creatorName&&e.creatorName!=="Anonymous"?a.textContent=`${e.creatorName}`:a.textContent="Anonymous",k.style.display="none",te(),y.style.display="block",document.body.style.overflow="hidden";const i=`${window.location.pathname}?view=${e.id}`;window.history.pushState({},"",i)}function v(){y.style.display="none",document.body.style.overflow="auto",t=null,s=-1;const e=new URL(window.location);e.searchParams.delete("view"),window.history.pushState({},"",e)}function te(){if(s===-1){f.disabled=!0,w.disabled=!0;return}f.disabled=s===0,w.disabled=s===r.length-1}function N(){if(s>0){const e=r[s-1];C(e),d("character_gallery_navigate",{direction:"previous",character_id:e.id,event_category:"gallery_actions"})}}function M(){if(s<r.length-1){const e=r[s+1];C(e),d("character_gallery_navigate",{direction:"next",character_id:e.id,event_category:"gallery_actions"})}}function ae(){if(t&&t.characterDescription){const e=t.characterDescription;localStorage.setItem("characterDescription",e),localStorage.setItem("recreateMode","true"),window.location.href="/horrid"}}function re(){if(t){const e=window.open("","_blank"),a=`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Character Print - ${t.characterDescription}</title>
                    <style>
                        body {
                            font-family: 'Dacherry', sans-serif;
                            margin: 0;
                            padding: 20px;
                            background-color: white;
                            text-align: center;
                        }
                        .character-container {
                            max-width: 600px;
                            margin: 0 auto;
                        }
                        .character-image {
                            width: 100%;
                            max-width: 500px;
                            height: auto;
                            border: 6px solid #000;
                            border-radius: 20px;
                            margin: 20px 0;
                            box-shadow: 0 8px 0 #000;
                        }
                        .character-prompt {
                            background-color: #FFF3E0;
                            border: 4px solid #FF9800;
                            border-radius: 20px;
                            padding: 30px;
                            margin: 20px 0;
                            font-size: 1.5em;
                            font-weight: normal;
                            color: #E65100;
                            position: relative;
                            text-align: center;
                        }
                        .character-prompt::before {
                            content: '"';
                            font-size: 4em;
                            color: #FF9800;
                            position: absolute;
                            top: -20px;
                            left: 30px;
                        }
                        .character-prompt::after {
                            content: '"';
                            font-size: 4em;
                            color: #FF9800;
                            position: absolute;
                            bottom: -30px;
                            right: 30px;
                        }
                        .character-title {
                            color: #2196F3;
                            font-size: 2.5em;
                            font-weight: normal;
                            text-shadow: 3px 3px 0 #000;
                            margin-bottom: 20px;
                        }
                        .character-subtitle {
                            color: #9C27B0;
                            font-size: 1.2em;
                            font-weight: normal;
                            text-shadow: 1px 1px 0 #000;
                            margin-bottom: 30px;
                        }
                        @media print {
                            body { margin: 0; padding: 10px; }
                            .character-container { max-width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="character-container">
                        <h1 class="character-title">HORRIBLE HENRY'S CHARACTER</h1>
                        <p class="character-subtitle">Created by: ${t.creatorName||"Anonymous"}</p>
                        <img src="${t.imageUrl}" alt="Character Image" class="character-image">
                        <div class="character-prompt">${t.characterDescription}</div>
                    </div>
                </body>
                </html>
            `;e.document.write(a),e.document.close(),e.focus(),e.print()}}function oe(){if(t){const e=document.createElement("a");e.href=t.imageUrl,e.download=`horrible-henry-character-${t.id}.png`,document.body.appendChild(e),e.click(),document.body.removeChild(e)}}function ne(){if(t){const e=`${window.location.origin}/horrid/gallery?view=${t.id}`;navigator.share?navigator.share({title:"Check out this amazing character!",text:`Created by ${t.creatorName||"Anonymous"}: "${t.characterDescription}"`,url:e}).catch(a=>{console.log("Error sharing:",a),F(e)}):F(e),d("character_gallery_share",{character_id:t.id,event_category:"gallery_actions"})}}function F(e){navigator.clipboard.writeText(e).then(()=>{alert("Link copied to clipboard! Share it with others to view this character directly.")}).catch(()=>{prompt("Copy this link to share the character:",e)})}async function ce(){if(t&&confirm("Are you sure you want to delete this character? This action cannot be undone!"))try{d("character_gallery_delete_start",{character_id:t.id,event_category:"gallery_actions"});const e=O();await me(e,"deleteCharacter")({characterId:t.id}),d("character_gallery_delete_success",{character_id:t.id,event_category:"gallery_actions"}),r=r.filter(i=>i.id!==t.id),r.length===0?$():u(),v(),console.log("Character deleted successfully!")}catch(e){console.error("Error deleting character:",e)}}R.onclick=v,U.onclick=ae,H.onclick=re,q.onclick=oe,j.onclick=ne,k.onclick=ce,f.onclick=N,w.onclick=M,S.onclick=X,D.onclick=Z,y.onclick=e=>{e.target===y&&v()},document.addEventListener("keydown",e=>{y.style.display==="block"&&(e.key==="Escape"?v():e.key==="ArrowLeft"&&!f.disabled?N():e.key==="ArrowRight"&&!w.disabled&&M())});function ie(){m.style.display="block",g.style.display="none",_.style.display="none"}function G(){m.style.display="none"}function le(e){h.textContent=e,h.style.display="block"}function se(){h.style.display="none"}function $(){_.style.display="block",g.style.display="none"}localStorage.getItem("recreateMode")==="true"&&localStorage.removeItem("recreateMode"),Q(),Y()});

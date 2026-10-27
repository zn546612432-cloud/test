import {btn,demo} from '../../system/ui.js';
export const manifest={id:'aomi',name:'澳觅',glyph:'澳',tone:'#e6bb66',defaultRoute:'/',kicker:'LOCAL LIFE'};
export const render=()=>`<div class="page-pad"><div class="aomi-hero"><span>澳</span><h1>今晚食啲咩？</h1><p>澳门的夜，还有很多选择。</p></div>${btn('aomi-browse','看看附近','button-primary wide')}<div class="centered">${demo()}</div></div>`;
export const handle=(a,t,c)=>{if(a==='aomi-browse')c.router.open({appId:'maps',route:'/'});};

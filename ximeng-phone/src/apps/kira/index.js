import {btn,demo,esc,empty} from '../../system/ui.js';
import {HACKER_BOUNTY_ID,HACKER_MAIL_ID,HACKER_TARGET,phishingThemes,advanceHackerMission} from '../mirage/mission.js';
export const manifest={id:'kira',name:'KIRA',icon:10,defaultRoute:'/',supportsDeepLink:true,kicker:'ENCRYPTED MAIL'};
function missionSteps(mail){const step=mail.missionStep||1;return `<section class="kira-mission"><h3>任务步骤</h3><p>1. 浏览器搜索 ${esc(HACKER_TARGET)} ${step>=2?'✓':''}</p>${btn('kira-mission-browser','打开浏览器 ↗','button-quiet wide',`data-id="${HACKER_BOUNTY_ID}"`)}<p>2. 编辑并发送一条钓鱼邮件 ${step>=3?'✓':''}</p>${btn('kira-mission-compose',step>=3?'查看已发送内容':'选择邮件主题 ↗','button-quiet wide',`data-id="${HACKER_BOUNTY_ID}" ${step<2?'disabled':''}`)}<p>3. 防火墙密钥重组</p>${btn('kira-mission-ghost','打开 GHOST 工具箱 ↗','button-quiet wide',`data-id="${HACKER_BOUNTY_ID}" ${step<3?'disabled':''}`)}</section>`;}
function composeMission(s){const mail=s.content.mail.find(m=>m.id===HACKER_MAIL_ID);if(!mail)return empty('请先在 MIRAGE 接受悬赏');if((mail.missionStep||1)<2)return empty('先在浏览器查看目标');const theme=phishingThemes.find(x=>x.id===mail.selectedTheme);return `<div class="page-pad kira-compose"><span class="eyebrow">KIRA / 任务邮件</span><h2>编辑钓鱼邮件</h2><p>选择与目标有关的主题：</p><div class="kira-choices">${phishingThemes.map(x=>btn('kira-mission-theme',esc(x.label),theme?.id===x.id?'is-selected':'button-quiet wide',`data-theme="${x.id}"`)).join('')}</div>${theme?`<div class="kira-draft"><small>自动编入预设 · 仅本机模拟</small><strong>主题：${esc(theme.subject)}</strong><p>收件人：${esc(HACKER_TARGET)}（剧情目标）</p><p>正文：请查阅与董事会会议有关的资料。</p></div>${btn('kira-mission-send',mail.missionStep>=3?'已发送':'发送邮件','button-quiet wide',mail.missionStep>=3?'disabled':'')}`:''}</div>`;}
export function render({store},loc){
 const s=store.get();
 if(loc.route==='/compose/'+HACKER_BOUNTY_ID)return composeMission(s);
 if(loc.route.startsWith('/mail/')){
  const m=s.content.mail.find(m=>m.id===loc.route.slice(6));
  return m?`<div class="page-pad"><span class="eyebrow">KIRA MAIL ${m.demo?demo():''}</span><h2>${esc(m.subject)}</h2><p class="muted">${esc(m.from)}</p><div class="mail-body">${esc(m.body)}</div>${m.id===HACKER_MAIL_ID?missionSteps(m):btn('kira-attachment','查看附件　↗','button-quiet wide',`data-id="${esc(m.id)}"`)}</div>`:empty('邮件不存在');
 }
 return `<div class="page-pad"><span class="eyebrow">ENCRYPTED MAIL ${demo()}</span><div class="large-title">KIRA</div><div class="surface-list">${s.content.mail.map(m=>btn('kira-mail',`<span class="file-symbol">✉</span><span class="list-copy"><strong>${esc(m.subject)}</strong><small>${esc(m.from)} · ${esc(m.body)}</small></span><span>›</span>`,'list-row',`data-id="${esc(m.id)}"`)).join('')}</div></div>`;
}
export function handle(a,t,c){
 if(a==='kira-mail')c.router.open({appId:'kira',route:'/mail/'+t.dataset.id});
 if(a==='kira-attachment')c.router.open({appId:'files',route:'/attachment',params:{mailId:t.dataset.id}});
 if(a==='kira-mission-browser')c.router.open({appId:'browser',route:'/mission-search',params:{orderId:HACKER_BOUNTY_ID}});
 if(a==='kira-mission-compose')c.router.open({appId:'kira',route:'/compose/'+HACKER_BOUNTY_ID});
 if(a==='kira-mission-theme'){
  const selected=phishingThemes.find(x=>x.id===t.dataset.theme);
  if(!selected?.correct){c.toast('主题与目标不符，请重新选择');return;}
  c.store.update(s=>{const mail=s.content.mail.find(m=>m.id===HACKER_MAIL_ID);if(mail)mail.selectedTheme=selected.id;});
 }
 if(a==='kira-mission-send'){
  const mail=c.store.get().content.mail.find(m=>m.id===HACKER_MAIL_ID);
  if(!phishingThemes.find(x=>x.id===mail?.selectedTheme)?.correct)return;
  advanceHackerMission(c.store,3);
  c.toast('邮件已发送 · 下一步：GHOST');
  c.router.open({appId:'kira',route:'/mail/'+HACKER_MAIL_ID});
 }
 if(a==='kira-mission-ghost')c.router.open({appId:'ghost',route:'/contract',params:{orderId:HACKER_BOUNTY_ID}});
}

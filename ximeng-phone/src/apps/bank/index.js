import {dateLabel} from '../../services/calendar.js';
import {card,demo} from '../../system/ui.js';
export const manifest={id:'bank',name:'Pacific',icon:11,defaultRoute:'/',kicker:'PRIVATE ACCOUNT'};
export const render=({store})=>`<div class="page-pad bank-page"><span class="eyebrow">PACIFIC BANK ${demo()}</span><div class="large-title">账户概览</div><div class="bank-visual"><span>PACIFIC <i>◈</i></span><strong>MOP 1,200.00</strong><small>••••　2086</small></div><div class="section-heading">最近记录</div>${card(`<div class="line-between"><span>WALL-83-R · 平台结算</span><strong>+1,200</strong></div><small>${dateLabel({...store.get(),day:17})} · 演示记录</small>`)}</div>`;

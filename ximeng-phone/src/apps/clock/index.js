import {btn} from '../../system/ui.js';
export const manifest={id:'clock',name:'时钟',glyph:'◴',tone:'#293244',defaultRoute:'/',kicker:'WORLD CLOCK'};
export const render=({store})=>`<div class="page-pad"><div class="large-title">时钟</div><div class="clock-face-display">${store.get().clock}</div><div class="surface-list"><div class="list-row"><span class="list-copy"><strong>澳门</strong><small>游戏内时间</small></span><strong>${store.get().clock}</strong></div></div></div>`;

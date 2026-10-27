import {uid} from '../../services/id.js';
import {btn} from '../../system/ui.js';
export const manifest={id:'music',name:'音乐',icon:14,defaultRoute:'/',supportsDeepLink:true,kicker:'NOW PLAYING'};
let audio=null;
export const render=({store})=>`<div class="music-page"><div class="album-image"></div><span class="eyebrow">ON THIS PHONE</span><h1>夜航</h1><p>原创氛围音 · 本机曲目</p><div class="track-bar"><span></span></div><div class="music-controls">${btn('music-toggle',store.get().musicPlaying?'Ⅱ':'▶','play-button','aria-label="播放或暂停"')}${btn('music-share','↗','share-button','aria-label="分享歌曲"')}</div></div>`;
export function handle(a,t,c){if(a==='music-toggle'){if(!audio){audio=new Audio('/assets/night.wav');audio.loop=true;}if(c.store.get().musicPlaying)audio.pause();else audio.play().catch(()=>c.toast('音频播放失败'));c.store.update(s=>s.musicPlaying=!s.musicPlaying);}if(a==='music-share'){c.store.update(s=>s.content.conversations.noapp[0].messages.push({id:uid(),from:'me',text:'分享音乐：夜航',kind:'text',time:s.clock,actual:true}));c.router.open({appId:'noapp',route:'/chat/tai'});}}

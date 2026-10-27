import {btn,esc,demo} from '../../system/ui.js';
import {reminders,toggleReminder,addReminder} from '../../services/reminders.js';
export const manifest={id:'reminders',name:'提醒事项',glyph:'☑',tone:'#dce9ec',defaultRoute:'/',kicker:'TODAY'};
export function render({store}) {
  const items=reminders(store.get());
  return `<div class="page-pad"><div class="large-title">提醒事项</div><div class="reminder-summary">${items.filter(r=>!r.done).length} 项待办</div><div class="surface-list">${items.map(r=>`<div class="list-row reminder-row">${btn('reminder-toggle',r.done?'✓':'','reminder-check '+(r.done?'checked':''),`data-id="${esc(r.id)}" aria-label="${r.done?'标为未完成':'标为完成'}：${esc(r.title)}" aria-pressed="${r.done}"`)}<span class="list-copy ${r.done?'completed':''}"><strong>${esc(r.title)}</strong>${r.demo?demo():''}</span>${btn('reminder-delete','×','reminder-delete',`data-id="${esc(r.id)}" aria-label="删除：${esc(r.title)}"`)}</div>`).join('')||'<p class="centered muted">暂无提醒事项</p>'}</div><form data-form="add-reminder" class="reminder-form"><input name="title" placeholder="新提醒事项" aria-label="新提醒事项" maxlength="120" required><button type="submit" aria-label="添加提醒事项">＋</button></form></div>`;
}
export function handle(a,t,c) {
  if(a==='reminder-toggle')toggleReminder(c.store,t.dataset.id);
  if(a==='reminder-delete')c.store.update(s=>{s.content.reminders=reminders(s).filter(r=>r.id!==t.dataset.id);});
}
export function submit(form,c) { if(form.dataset.form==='add-reminder')addReminder(c.store,new FormData(form).get('title')||''); }

import test from 'node:test';
import assert from 'node:assert/strict';
import {batteryLevel,status} from '../src/system/shell.js';
import {initialState} from '../src/services/storage.js';

test('status bar shows a numeric battery value and keeps it in range',()=>{
 const state=initialState();
 assert.equal(batteryLevel(state),82);
 assert.match(status(state),/aria-label="电量 82%"/);
 assert.match(status(state),/<span class="status-battery"/);
 assert.match(status(state),/status-network">5G/);
 assert.equal(batteryLevel({...state,batteryPercent:139}),100);
 assert.equal(batteryLevel({...state,batteryPercent:-3}),0);
});

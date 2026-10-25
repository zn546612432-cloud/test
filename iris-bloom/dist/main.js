/* FLORA · In full bloom — a camera-controlled sculptural iris.
   Flower geometry and every visual effect are drawn locally in Three.js.
   Only a hand-tracking model is downloaded; camera frames are never sent to a server. */
const $ = (id) => document.getElementById(id);
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const hypot = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

let bloom = 0.72;
let targetBloom = 0.72;
let animationTime = 0;
let three = null;
let render = () => {};
let stopCamera = () => {};
let manualUntil = 0;
let toastTimer;

function toast(message, duration = 3200) {
  const t = $('toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

function updateReadout() {
  const val = Math.round(bloom * 100);
  $('bloomRange').value = String(val);
  $('bloomOutput').textContent = `${val}%`;
  $('bloomTop').textContent = `${val}%`;
}

function setTarget(value, manual = false) {
  targetBloom = clamp(value);
  if (manual) manualUntil = performance.now() + 2100;
}

$('bloomRange').addEventListener('input', e => {
  setTarget(Number(e.target.value) / 100, true);
});
$('resetBtn').addEventListener('click', () => {
  setTarget(.72, true);
  three?.resetView();
  toast('花朵回到了最初的姿态');
});
$('helpBtn').addEventListener('click', () => $('helpOverlay').classList.add('open'));
$('closeHelp').addEventListener('click', () => $('helpOverlay').classList.remove('open'));
$('helpOverlay').addEventListener('click', e => {
  if (e.target === $('helpOverlay')) $('helpOverlay').classList.remove('open');
});

async function start3D() {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  const canvas = $('stage');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.8));
  renderer.setClearColor(0xf7f5f0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 40);
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const petalObjects = [];

  const petalVertex = /* glsl */`
    varying vec2 vUv; varying vec3 vN; varying vec3 vPos;
    void main(){vUv=uv;vN=normalize(normalMatrix*normal);vPos=position;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
  `;
  const petalFragment = /* glsl */`
    precision highp float;
    uniform float uKind; varying vec2 vUv; varying vec3 vN; varying vec3 vPos;
    float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    void main(){
      float x=vUv.x-.5; float y=vUv.y;
      vec3 pale=vec3(.807,.688,.886);
      vec3 mid=vec3(.668,.515,.790);
      vec3 deep=vec3(.424,.281,.585);
      vec3 cream=vec3(.961,.818,.639);
      vec3 gold=vec3(.936,.655,.316);
      float veining=pow(max(0.0,cos(x*(120.0-20.0*y)+sin(y*13.0)*3.0)),22.0);
      float longVein=pow(max(0.0,cos(x*47.0 + y*3.7)),22.0);
      float grain=(h21(floor(vUv*vec2(440.0,460.0)))-.5)*.075;
      float edge=smoothstep(.36,.5,abs(x));
      vec3 col=mix(mid,pale,smoothstep(.07,.94,y)*.72);
      col=mix(col,deep,veining*(.06+.18*smoothstep(.12,.8,y)));
      col=mix(col,deep,longVein*.085);
      col=mix(col,pale,edge*.37);
      float throat=1.0-smoothstep(.07,uKind>.5?.36:.29,y);
      float central=1.0-smoothstep(.09,.35,abs(x));
      col=mix(col,cream,throat*(uKind>.5?.60:.91));
      col=mix(col,gold,throat*central*(uKind>.5?.37:.7));
      float spot=pow(max(0.0,sin(x*71.0+y*39.0)),16.0)*smoothstep(.1,.3,y)*(1.0-smoothstep(.48,.9,y));
      col=mix(col,vec3(.48,.31,.6),spot*(uKind>.5?.06:.16));
      float light=.73 + .26*abs(dot(normalize(vN),normalize(vec3(-.42,.72,1.0))));
      float translucent=.07*pow(1.0-abs(dot(normalize(vN),vec3(0.0,0.0,1.0))),2.0);
      col=(col+grain+translucent)*light;
      gl_FragColor=vec4(col,1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `;

  function petalPoint(kind, t, s, spread, index) {
    const open = clamp(spread);
    let width, radius, h;
    if (kind === 'fall') {
      const profile = Math.pow(Math.max(0, Math.sin(Math.PI * (.035 + .77 * t))), .67) * Math.pow(t, .39);
      width = 1.04 * profile * (.16 + .84 * open);
      radius = .075 + t * (.25 + 1.04 * open) + .18 * t * t * open;
      h = .23 + t * (.76 + .13 * (1 - open)) - t * t * (.32 + 1.30 * open);
    } else {
      const profile = Math.pow(Math.max(0, Math.sin(Math.PI * (.025 + .79 * t))), .72) * Math.pow(t, .38);
      width = .86 * profile * (.12 + .88 * open);
      radius = .075 + t * (.13 + .38 * open) + t * t * (.13 * open);
      h = .28 + t * 1.43 - t * t * (.09 + .13 * open);
    }
    // The petal surface is vaulted at its midrib and pleated at its edges.
    let lateral = s * width;
    const crease = (1 - s*s) * .12 * Math.sin(Math.PI * t);
    const edgeWave = open * Math.pow(Math.abs(s), 4) * Math.pow(t, 1.5);
    h += crease + edgeWave * (.049*Math.sin(25*t+index*1.9+s*8.5)+.031*Math.sin(44*t+s*13));
    radius += .16 * s*s * Math.sin(Math.PI*t) + edgeWave*.043*Math.cos(33*t);
    lateral += edgeWave*.037*Math.sin(21*t+index);
    // Petals are arranged around the vertical stem, with their backs visible as well.
    const angle = (kind === 'fall' ? (index*2*Math.PI/3) : ((index+.5)*2*Math.PI/3));
    return [lateral*Math.cos(angle)+radius*Math.sin(angle), h, radius*Math.cos(angle)-lateral*Math.sin(angle)];
  }

  function makePetal(kind, index) {
    const horizontal=38, vertical=46;
    const vertices = new Float32Array((horizontal+1)*(vertical+1)*3);
    const tex = new Float32Array((horizontal+1)*(vertical+1)*2);
    const faces=[];
    for(let row=0;row<=vertical;row++){
      for(let col=0;col<=horizontal;col++){
        const i=row*(horizontal+1)+col;
        tex[i*2]=col/horizontal;
        tex[i*2+1]=row/vertical;
        if(row<vertical&&col<horizontal){
          const a=i,b=i+1,c=i+horizontal+1,d=c+1;
          faces.push(a,c,b,b,c,d);
        }
      }
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    geo.setAttribute('uv',new THREE.BufferAttribute(tex,2));
    geo.setIndex(faces);
    const mat=new THREE.ShaderMaterial({vertexShader:petalVertex,fragmentShader:petalFragment,side:THREE.DoubleSide,uniforms:{uKind:{value:kind==='standard'?1:0}}});
    const mesh=new THREE.Mesh(geo,mat);
    mesh.frustumCulled=false;
    sculpture.add(mesh);
    const item={kind,index,geo,vertices,horizontal,vertical};
    petalObjects.push(item);
    return item;
  }
  // Standards stand upright; falls spill down and out — the six parts of a true iris.
  for(let i=0;i<3;i++) makePetal('standard',i);
  for(let i=0;i<3;i++) makePetal('fall',i);

  function tube(points,radius,material,segments=44,radial=7){
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    return new THREE.Mesh(new THREE.TubeGeometry(curve,segments,radius,radial,false),material);
  }
  const green=new THREE.MeshStandardMaterial({color:0x5a7741,roughness:.9,side:THREE.DoubleSide});
  const olive=new THREE.MeshStandardMaterial({color:0x829051,roughness:.88,side:THREE.DoubleSide});
  const gold=new THREE.MeshStandardMaterial({color:0xdca256,roughness:.62,metalness:.03});
  const peach=new THREE.MeshStandardMaterial({color:0xf6d39b,roughness:.84});
  scene.add(new THREE.AmbientLight(0xffffff,2.25));
  const sun=new THREE.DirectionalLight(0xfff3e7,2.6);sun.position.set(-3,6,7);scene.add(sun);
  const fill=new THREE.DirectionalLight(0xcdbbea,1.5);fill.position.set(5,2,-3);scene.add(fill);

  sculpture.add(tube([[0,-2.45,0],[.03,-1.8,.03],[-.03,-1.05,-.01],[0,-.25,0],[0,.27,0]],.068,green,50,10));
  // Narrow pale-green sheaths wrap the point where the petals meet.
  for(let i=0;i<3;i++){
    const angle=i*2*Math.PI/3;
    const sheath=new THREE.Mesh(new THREE.ConeGeometry(.2,.70,8,1),i===0?olive:green);
    sheath.position.set(Math.sin(angle)*.035,-.12,Math.cos(angle)*.035);
    sheath.rotation.z=.085*Math.sin(angle); sheath.rotation.x=.085*Math.cos(angle);
    sculpture.add(sheath);
  }
  const leafMat=new THREE.MeshStandardMaterial({color:0x69844b,roughness:.88,side:THREE.DoubleSide});
  function leaf(angle, y, scale){
    const ps=[],idx=[];
    const rot=(x,z)=>[x*Math.cos(angle)+z*Math.sin(angle),z*Math.cos(angle)-x*Math.sin(angle)];
    for(let i=0;i<=17;i++){
      const t=i/17;
      const radius=(.03+1.25*t)*scale;
      const height=y+(t*1.25-.09*t*t)*scale;
      const w=.17*Math.pow(Math.sin(Math.PI*t),.8)*scale;
      for(let j=0;j<3;j++){
        const s=j-1,[x,z]=rot(s*w,radius);
        ps.push(x,height+(1-s*s)*.06*Math.sin(Math.PI*t),z);
        if(i<17&&j<2){const a=i*3+j;idx.push(a,a+3,a+1,a+1,a+3,a+4);}
      }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.setIndex(idx);g.computeVertexNormals();
    sculpture.add(new THREE.Mesh(g,leafMat));
  }
  leaf(-1.4,-1.82,.8); leaf(1.95,-1.4,.69); leaf(3.3,-1.08,.42);

  // Honey-yellow central beards glow among the lavender falls.
  for(let i=0;i<3;i++){
    const a=i*2*Math.PI/3;
    for(let k=-2;k<=2;k++){
      const spread=k*.026;
      const hair=tube([
        [Math.sin(a)*.07+spread*Math.cos(a),.34,Math.cos(a)*.07-spread*Math.sin(a)],
        [Math.sin(a)*.25+spread*Math.cos(a),.39,Math.cos(a)*.25-spread*Math.sin(a)],
        [Math.sin(a)*.4+spread*Math.cos(a),.29,Math.cos(a)*.4-spread*Math.sin(a)]
      ],.013+(k===0?.008:0),k%2===0?gold:peach,18,5);
      sculpture.add(hair);
    }
  }
  for(let i=0;i<3;i++){
    const a=i*2*Math.PI/3;
    const tip=new THREE.Mesh(new THREE.SphereGeometry(.065,12,8),peach);
    tip.position.set(Math.sin(a)*.12,.42,Math.cos(a)*.12);sculpture.add(tip);
  }

  const look={x:-.08,y:.13,z:0};
  const wanted={...look};
  function resetView(){wanted.x=-.08;wanted.y=.13;wanted.z=0;}
  three={resetView,rotateBy:(dx,dy)=>{
    wanted.y=clamp(wanted.y+dx,-1.7,1.7);
    wanted.x=clamp(wanted.x+dy,-.65,.45);
  },setHandDirection:(x,y)=>{
    if(!drag.active){wanted.y=lerp(wanted.y,clamp((x-.5)*1.2,-.85,.85),.025);wanted.x=lerp(wanted.x,clamp((.5-y)*.24,-.25,.15),.025);}
  }};

  function updatePetals(spread){
    for(const item of petalObjects){
      const {kind,index,horizontal,vertical,geo,vertices}=item;
      let ptr=0;
      for(let row=0;row<=vertical;row++){
        const t=row/vertical;
        for(let col=0;col<=horizontal;col++){
          const s=col/horizontal*2-1;
          const v=petalPoint(kind,t,s,spread,index);
          vertices[ptr++]=v[0];vertices[ptr++]=v[1];vertices[ptr++]=v[2];
        }
      }
      geo.attributes.position.needsUpdate=true;
      geo.computeVertexNormals();
    }
  }

  function resize(){
    const rect=$('flowerArea').getBoundingClientRect();
    const w=Math.max(1,rect.width),h=Math.max(1,rect.height);
    camera.aspect=w/h;
    camera.fov=w/h<.72?39:34;
    camera.position.set(0,.08,w/h<.72?8.7:7.45);
    camera.lookAt(0,-.13,0);
    camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);
  }
  window.addEventListener('resize',resize,{passive:true});
  resize();
  $('loading').classList.add('hidden');

  let lastFrame=performance.now();
  render=(now)=>{
    const dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;
    animationTime+=dt;
    bloom=lerp(bloom,targetBloom,1-Math.exp(-dt*6.1));
    const subtle=bloom+Math.sin(animationTime*.9)*.0035;
    if(!document.hidden){
      updatePetals(subtle);
      look.x=lerp(look.x,wanted.x,1-Math.exp(-dt*4));
      look.y=lerp(look.y,wanted.y,1-Math.exp(-dt*4));
      sculpture.rotation.x=look.x;
      sculpture.rotation.y=look.y + Math.sin(animationTime*.19)*.017;
      sculpture.position.y=Math.sin(animationTime*.6)*.012;
      renderer.render(scene,camera);
    }
    updateReadout();
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

const drag={active:false,x:0,y:0};
const area=$('flowerArea');
area.addEventListener('pointerdown',e=>{
  if(!three)return;
  drag.active=true;drag.x=e.clientX;drag.y=e.clientY;area.setPointerCapture(e.pointerId);
});
area.addEventListener('pointermove',e=>{
  if(!drag.active || !three)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  drag.x=e.clientX;drag.y=e.clientY;
  // Continuous direct manipulation independent of camera controls.
  three.rotateBy(dx*.006,dy*.004);
});
area.addEventListener('pointerup',()=>drag.active=false);
area.addEventListener('pointercancel',()=>drag.active=false);

// Camera gesture detection (browser-local MediaPipe Gesture Recognizer).
const video=$('camVideo');
const overlay=$('landmarks');
const pen=overlay.getContext('2d');
const connections=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
let stream=null,recognizer=null,cameraActive=false,cameraBusy=false,lastVideoTime=-1,lastDetected=0;

async function loadRecognizer(){
  if(recognizer)return recognizer;
  const versions=[
    ['https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/vision_bundle.mjs','https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm'],
    ['https://unpkg.com/@mediapipe/tasks-vision@1.0.1/vision_bundle.mjs','https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm']
  ];
  let lastError;
  for(const [moduleUrl,wasmRoot] of versions){
    try{
      const mp=await import(moduleUrl);
      const vision=await mp.FilesetResolver.forVisionTasks(wasmRoot);
      const baseOptions={modelAssetPath:'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task'};
      try{
        recognizer=await mp.GestureRecognizer.createFromOptions(vision,{baseOptions:{...baseOptions,delegate:'GPU'},runningMode:'VIDEO',numHands:2});
      }catch(e){
        console.warn('MediaPipe GPU fallback to CPU:',e);
        recognizer=await mp.GestureRecognizer.createFromOptions(vision,{baseOptions:{...baseOptions,delegate:'CPU'},runningMode:'VIDEO',numHands:2});
      }
      return recognizer;
    }catch(e){lastError=e;console.warn('Hand tracking source failed',e);}
  }
  throw lastError||Error('无法下载手势模型');
}

function drawHands(hands){
  const w=overlay.width=video.videoWidth||640,h=overlay.height=video.videoHeight||480;
  pen.clearRect(0,0,w,h);
  for(let n=0;n<hands.length;n++){
    const points=hands[n];
    pen.strokeStyle=n?'#eac194':'#c9edca';pen.lineWidth=Math.max(2,w/240);pen.lineCap='round';pen.lineJoin='round';
    for(const [a,b] of connections){pen.beginPath();pen.moveTo(points[a].x*w,points[a].y*h);pen.lineTo(points[b].x*w,points[b].y*h);pen.stroke();}
    points.forEach((p,i)=>{
      pen.beginPath();pen.arc(p.x*w,p.y*h,i===4||i===8?Math.max(5,w/130):Math.max(2.1,w/250),0,Math.PI*2);
      pen.fillStyle=i===4||i===8?'#fff6b2':'#82e6b1';pen.fill();
    });
    pen.strokeStyle='#fff3d4';pen.lineWidth=Math.max(1.8,w/260);
    pen.beginPath();pen.arc(points[4].x*w,points[4].y*h,Math.max(5,w/120),0,Math.PI*2);pen.stroke();
    pen.beginPath();pen.arc(points[8].x*w,points[8].y*h,Math.max(5,w/120),0,Math.PI*2);pen.stroke();
  }
}

function processHands(hands,now){
  if(!hands.length){
    $('camScore').textContent='寻找手掌…';
    if(now-lastDetected>1700)$('stageNote').textContent='请将手掌完整放进画面';
    return;
  }
  lastDetected=now;
  let spread=0;
  for(const hand of hands){
    const palmWidth=Math.max(hypot(hand[5],hand[17]),.035);
    const pinch=hypot(hand[4],hand[8])/palmWidth;
    spread+=clamp((pinch-.19)/1.03);
  }
  spread/=hands.length;
  if(now>manualUntil)setTarget(spread);
  $('camScore').textContent=`${hands.length} HAND${hands.length>1?'S':''}`;
  $('stageNote').textContent=spread<.2?'指尖靠近 · 花朵正在合拢':spread>.75?'指尖舒展 · 花朵盛放':'随着指尖距离，花瓣轻轻舒展';
  const palm=hands[0][9];
  three?.setHandDirection(palm.x,palm.y);
}

function detectLoop(now){
  if(!cameraActive)return;
  if(video.readyState>=2&&now-lastVideoTime>52){
    try{
      const result=recognizer.recognizeForVideo(video,now);
      const hands=result.landmarks||[];
      drawHands(hands);
      processHands(hands,now);
      lastVideoTime=now;
    }catch(e){
      console.warn('Frame recognition:',e);
      $('camScore').textContent='识别重试中';
    }
  }
  requestAnimationFrame(detectLoop);
}

stopCamera=()=>{
  cameraActive=false;
  if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
  video.srcObject=null;
  pen.clearRect(0,0,overlay.width,overlay.height);
  $('camPanel').classList.remove('show');
  $('cameraBtn').classList.remove('live');
  $('cameraText').textContent='开启手势互动';
  $('stageNote').textContent='拖动旋转花朵 · 触摸下方滑杆控制开合';
};

async function startCamera(){
  if(cameraBusy)return;
  if(cameraActive){stopCamera();return;}
  if(!navigator.mediaDevices?.getUserMedia){toast('请在 HTTPS 页面中使用 Safari 或 Chrome 打开',6000);return;}
  cameraBusy=true;
  $('cameraText').textContent='启动中…';
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:24,max:30}}});
    video.srcObject=stream;
    await video.play();
    $('camPanel').classList.add('show');
    $('camScore').textContent='加载模型…';
    toast('首次开启正在下载手势识别模型，稍等片刻',3600);
    await loadRecognizer();
    cameraActive=true;
    lastVideoTime=-1;lastDetected=performance.now();
    $('cameraBtn').classList.add('live');
    $('cameraText').textContent='关闭摄像头';
    $('stageNote').textContent='将拇指和食指对着摄像头，缓慢张合';
    toast('手势追踪已开启 · 用指尖让花绽放 ✦',3200);
    requestAnimationFrame(detectLoop);
  }catch(e){
    console.error('Camera start failed:',e);
    stopCamera();
    const reason=e?.name==='NotAllowedError'?'需要允许摄像头权限，Safari 地址栏可重新授权':
      e?.name==='NotFoundError'?'没有检测到可用摄像头':
      '手势初始化失败。可继续用下方滑杆试玩，请检查网络或更换 Safari。';
    toast(reason,6200);
  }finally{cameraBusy=false;}
}
$('cameraBtn').addEventListener('click',startCamera);
window.addEventListener('pagehide',()=>stopCamera());

try {
  await start3D();
} catch(e) {
  console.error('3D unavailable:',e);
  $('loading').classList.add('hidden');
  $('fallback').style.display='flex';
  $('stage').style.display='none';
}

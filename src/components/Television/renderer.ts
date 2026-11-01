import {projects} from './content';
import {CARD_W, CARD_H, BOARD_LAYOUT, WORLD_W, WORLD_H, type BoardTile, directionalTile, draggedFocusView, type CameraView, interpolateView, fullscreenHeroView, boardTiles, entrance, anchoredCamera, wheelInput, clampZoom, hitTile, screenToScene} from './math';
import {fragmentShader, vertexShader} from './shaders';

export function createTelevision(canvas: HTMLCanvasElement, onChannel: (channel: number) => void, onHeroFocus: (focused: boolean) => void) {
  const gl = canvas.getContext('webgl', {alpha: false, antialias: false, powerPreference: 'low-power'});
  if (!gl) throw new Error('WebGL unavailable');
  const scene = document.createElement('canvas');
  const ctx = scene.getContext('2d')!;
  const program = gl.createProgram()!;
  const shaders = [vertexShader, fragmentShader].map((source, index) => {
    const shader = gl.createShader(index ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER)!;
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader); gl.deleteShader(shader);
      throw new Error(error || 'TV shader failed');
    }
    gl.attachShader(program, shader); return shader;
  });
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('TV program failed');
  gl.useProgram(program);
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const uniforms = Object.fromEntries(['resolution','time','interference','power','effects'].map(name => [name, gl.getUniformLocation(program, name)]));
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = media.matches;
  let width = 0, height = 0, scale = 1, ratio = 1;
  let camera = {x: 0, y: 0}, velocity = {x: 0, y: 0};
  let zoom = 1, channel = 0, power = true, effects = true;
  let openedAt = Infinity;
  let heroFocused = false;
  let focusedTile: BoardTile | null = null;
  let dragView: CameraView | null = null;
  let dragSpeed = {x:0,y:0};
  let dragDelta = {x:0,y:0};
  let dragOffset = {x:0,y:0};
  let wheelView: CameraView | null = null;
  let wheelDelta = {x:0,y:0};
  let wheelTimer: ReturnType<typeof setTimeout> | null = null;
  let returnView: CameraView = {x:0,y:0,zoom:1};
  let flight: {from: CameraView; to: CameraView; start: number; duration: number; pullback?: boolean} | null = null;
  let burst = 0, last = 0, frame = 0, disposed = false, dirty = true;
  let hovered: number | null = null;
  const pointers = new Map<number, {x: number; y: number}>();
  let start = {x: 0, y: 0}, previous = {x: 0, y: 0}, moved = false;
  let wheelAt = -Infinity, wheelMode: 'pan' | 'zoom' | 'pinch' = 'pan';
  let lastPointerAt = 0;
  const images = projects.map(project => {
    const image = new Image(); image.onload = () => {dirty = true;};
    if (project.preview) image.src = project.preview;
    return image;
  });

  const heroImage = new Image();
  heroImage.onload = () => {dirty=true;};
  heroImage.src = '/img/hero/arce-studio.webp';
  const heroReady = heroImage.decode().catch(() => {});
  Promise.race([heroReady, new Promise(resolve => setTimeout(resolve, 900))]).then(() => {
    if (!disposed) {
      openedAt=performance.now();
      if(!reduced&&!focusedTile) {
        const full=fullscreenHeroView(width,height,scale);
        camera={x:full.x,y:full.y};zoom=full.zoom;
        flight={from:full,to:{x:0,y:0,zoom:1},start:openedAt+1500,duration:1150};
      }
      dirty=true;canvas.dispatchEvent(new Event('tv-ready'));
    }
  });

  function resize() {
    width = canvas.clientWidth; height = canvas.clientHeight;
    ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    scene.width = canvas.width; scene.height = canvas.height;
    scale = Math.min(width / 1350, height / 760);
    // Keep projects readable on portrait screens while preserving the full board.
    if (width < height) scale = width / 800;
    if(focusedTile) {
      const full=focusView(focusedTile);
      camera={x:full.x,y:full.y};zoom=full.zoom;flight=null;
    }
    gl!.viewport(0, 0, canvas.width, canvas.height); dirty = true;
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize();

  function rounded(x: number, y: number, w: number, h: number, radius = 20) {
    ctx.beginPath(); ctx.roundRect(x,y,w,h,radius);
  }
  function imageCover(image: HTMLImageElement, x: number, y: number, w: number, h: number, contain = false) {
    if (!image.complete || !image.naturalWidth) return;
    const factor = (contain ? Math.min : Math.max)(w / image.naturalWidth, h / image.naturalHeight);
    const iw = image.naturalWidth * factor, ih = image.naturalHeight * factor;
    ctx.drawImage(image, x + (w-iw)/2, y + (h-ih)/2, iw, ih);
  }
  function introSplash(cx: number, cy: number, radius: number, color: string) {
    ctx.save();ctx.translate(cx,cy);ctx.scale(radius,radius);
    const points = [
      [-1.08,-.5],[-.67,-.57],[-.54,-.96],[-.12,-.73],
      [.3,-.94],[.48,-.58],[.96,-.65],[.85,-.2],
      [1.14,.02],[.83,.28],[.94,.76],[.46,.65],
      [.2,1],[-.12,.74],[-.61,.93],[-.67,.49],
      [-1.09,.4],[-.9,.03],[-1.14,-.17],
    ];
    ctx.beginPath();
    points.forEach(([x,y],i) => {
      const previous=points[(i+points.length-1)%points.length];
      const next=points[(i+1)%points.length];
      const startX=x+(previous[0]-x)*.12,startY=y+(previous[1]-y)*.12;
      if(i===0) ctx.moveTo(startX,startY);else ctx.lineTo(startX,startY);
      ctx.quadraticCurveTo(x,y,x+(next[0]-x)*.12,y+(next[1]-y)*.12);
    });
    ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.restore();
  }
  function text(value: string, x: number, y: number, size: number, color = '#f3f0df', align: CanvasTextAlign = 'left') {
    ctx.fillStyle=color; ctx.font=`900 ${size}px "Arial Black", "PingFang SC", sans-serif`; ctx.textAlign=align;
    ctx.fillText(value,x,y);
  }
  function hero(x: number, y: number, elapsed: number) {
    const backdrop = entrance(elapsed, 300, 560);
    const splashScale = entrance(elapsed, 0, 440);
    const copyScale = entrance(elapsed, 100, 440);
    const logoScale = entrance(elapsed, 240, 480);
    ctx.save(); rounded(x,y,CARD_W,CARD_H,30); ctx.clip();
    ctx.globalAlpha=Math.max(0,Math.min(1,backdrop));
    ctx.fillStyle='#cacabe'; ctx.fillRect(x,y,CARD_W,CARD_H);
    ctx.filter='contrast(1.05)';
    imageCover(heroImage,x,y,CARD_W,CARD_H);
    ctx.filter='none';
    ctx.fillStyle='#1010101a'; ctx.fillRect(x,y,CARD_W,CARD_H);
    ctx.globalAlpha=1;
    const portraitFocus=width<height&&(heroFocused||flight)?Math.max(0,Math.min(1,(zoom-1)/(fullscreenHeroView(width,height,scale).zoom-1))):0;
    ctx.save();
    ctx.translate(x+154+226*portraitFocus,y+170+75*portraitFocus);
    ctx.scale(1-.35*portraitFocus,1-.35*portraitFocus);
    ctx.translate(-x-154,-y-170);
    ctx.save();ctx.translate(x+154,y+170);ctx.scale(splashScale,splashScale);introSplash(0,0,98,'#eeeedd');ctx.restore();
    ctx.save();ctx.translate(x+154,y+170);ctx.scale(copyScale,copyScale);ctx.translate(-x-154,-y-170);
    text("HELLO, I'M",x+154,y+132,10,'#25251e','center');
    ctx.restore();
    ctx.save();ctx.translate(x+156,y+185);ctx.rotate(-.07);ctx.scale(logoScale,logoScale);
    ctx.font='900 italic 50px "Arial Black", sans-serif';ctx.textAlign='center';ctx.lineWidth=6;ctx.strokeStyle='#181a12';ctx.strokeText('ARCE',0,0);ctx.fillStyle='#f1f14c';ctx.fillText('ARCE',0,0);ctx.restore();
    ctx.restore();ctx.restore();
  }
  function projectTile(index: number, x: number, y: number, w = CARD_W, h = CARD_H) {
    const project = projects[index];
    ctx.save();rounded(x,y,w,h,22);ctx.clip();
    ctx.fillStyle=index===0?'#e5e5da':index===1?'#8aa7ce':'#272827';ctx.fillRect(x,y,w,h);
    imageCover(images[index],x,y,w,h,index<2);
    ctx.restore();
  }
  function paint(time: number) {
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.fillStyle='#111213';ctx.fillRect(0,0,width,height);
    const s=scale*zoom;
    ctx.save();ctx.translate(width/2,height/2);ctx.scale(s,s);ctx.translate(-camera.x,-camera.y);
    const halfW=width/s/2, halfH=height/s/2;
    ctx.fillStyle='#55585655';
    const left=camera.x-halfW, top=camera.y-halfH;
    for(let x=Math.floor(left/24)*24;x<camera.x+halfW;x+=24) for(let y=Math.floor(top/24)*24;y<camera.y+halfH;y+=24) ctx.fillRect(x,y,1.4,1.4);
    const elapsed = reduced ? 2000 : Math.max(0, time - openedAt);
    for (const tile of boardTiles(left,top,camera.x+halfW,camera.y+halfH,projects.length+1)) {
      const {index,w,h,angle}=tile;
      const reveal=index===0?1:entrance(elapsed,160+(index%4)*65,550);
      ctx.save();ctx.translate(tile.x,tile.y);ctx.rotate(angle);ctx.scale(reveal,reveal);
      const x=-w/2,y=-h/2;
      if(index===0) hero(x,y,elapsed); else {
        projectTile(index-1,x,y,w,h);
        text(projects[index-1].title,0,y+h+30,13,'#ecebd9','center');
        text(projects[index-1].category,0,y+h+54,10,'#9b9c93','center');
      }
      if(!focusedTile&&index===hovered) {rounded(x-7,y-7,w+14,h+14,27);ctx.strokeStyle='#f5f246';ctx.lineWidth=3;ctx.stroke();}
      ctx.restore();
    }
    ctx.restore();
    gl!.useProgram(program);gl!.bindTexture(gl!.TEXTURE_2D,texture);
    gl!.texImage2D(gl!.TEXTURE_2D,0,gl!.RGBA,gl!.RGBA,gl!.UNSIGNED_BYTE,scene);
    gl!.uniform2f(uniforms.resolution,canvas.width,canvas.height);
    gl!.uniform1f(uniforms.time,reduced?0:time/1000);
    gl!.uniform1f(uniforms.interference,burst);
    gl!.uniform1f(uniforms.power,power?1:0);
    gl!.uniform1f(uniforms.effects,effects?1:0);
    gl!.drawArrays(gl!.TRIANGLES,0,6);
  }
  function animate(time: number) {
    frame=requestAnimationFrame(animate);
    if(document.hidden) return;
    const dt=Math.min((time-last)/16.667,3);last=time;
    if(flight) {
      const progress=(time-flight.start)/flight.duration;
      const view=interpolateView(flight.from,flight.to,progress);
      if(flight.pullback) view.zoom*=1-.18*Math.sin(Math.PI*Math.max(0,Math.min(1,progress)))**2;
      camera={x:view.x,y:view.y};zoom=view.zoom;dirty=true;
      if(progress>=1) flight=null;
    }
    const coasting=!flight&&!focusedTile&&pointers.size===0&&(Math.abs(velocity.x)+Math.abs(velocity.y)>.08);
    if(coasting) {camera.x-=velocity.x*dt;camera.y-=velocity.y*dt;velocity.x*=Math.pow(.9,dt);velocity.y*=Math.pow(.9,dt);dirty=true;}
    if(burst>0) {burst=Math.max(0,burst-dt*.055);dirty=true;}
    if(!dirty&&(reduced||!power)) return;
    paint(time);dirty=false;
  }
  frame=requestAnimationFrame(animate);
  function focusView(tile: BoardTile): CameraView {
    if(tile.index===0) {
      const full=fullscreenHeroView(width,height,scale);
      return {x:tile.x+full.x,y:tile.y,zoom:full.zoom};
    }
    return {x:tile.x,y:tile.y+28,zoom:Math.min(width*.76/tile.w,height*.68/(tile.h+65))/scale};
  }
  function stopWheel() {
    if(wheelTimer) clearTimeout(wheelTimer);
    wheelTimer=null;wheelView=null;wheelDelta={x:0,y:0};
  }
  function focusTile(tile: BoardTile) {
    const changing=focusedTile!==null&&(focusedTile.x!==tile.x||focusedTile.y!==tile.y);
    if(!focusedTile) returnView={...camera,zoom};
    stopWheel();focusedTile=tile;channel=tile.index;heroFocused=channel===0;
    hovered=null;onChannel(channel);onHeroFocus(heroFocused);
    flyTo(focusView(tile),650,changing);
  }
  function tileNear(index: number): BoardTile {
    const [x,y,w,h,angle]=BOARD_LAYOUT[index];
    return {index,x:x+Math.round((camera.x-x)/WORLD_W)*WORLD_W,y:y+Math.round((camera.y-y)/WORLD_H)*WORLD_H,w,h,angle};
  }
  function select(next: number) {
    const index=(next+projects.length+1)%(projects.length+1);
    if(index===0) {
      stopWheel();focusedTile=null;heroFocused=false;channel=0;
      onHeroFocus(false);onChannel(0);flyTo(returnView,650);
    } else focusTile(tileNear(index));
  }
  function navigate(dx: number, dy: number) {
    if(focusedTile) focusTile(directionalTile(focusedTile,dx,dy,projects.length+1));
  }
  function settleDrag(dx: number, dy: number, cancelled = false) {
    if(!focusedTile) return;
    const speed=performance.now()-lastPointerAt<100?dragSpeed:{x:0,y:0};
    if(!cancelled&&(Math.hypot(dx,dy)>Math.min(width,height)*.07||Math.hypot(speed.x,speed.y)>.45)) {
      const x=dx+speed.x*120,y=dy+speed.y*120;
      // Content follows the hand; the new card enters from the revealed side.
      navigate(Math.abs(x)>Math.abs(y)?-x:0,Math.abs(y)>=Math.abs(x)?-y:0);
    } else flyTo(focusView(focusedTile),420);
    dragView=null;dragSpeed={x:0,y:0};
  }
  function flyTo(to: CameraView, duration = 750, pullback = false) {
    velocity={x:0,y:0};
    if(reduced) {camera={x:to.x,y:to.y};zoom=to.zoom;flight=null;}
    else flight={from:{...camera,zoom},to,start:performance.now(),duration,pullback};
    dirty=true;
  }
  function toggleHero() {
    if(focusedTile) select(0);else focusTile(tileNear(0));
  }
  function reset() {select(0);flyTo({x:0,y:0,zoom:1});}
  function interruptOpening() {
    if(flight&&!focusedTile) {flight=null;dirty=true;}
  }
  function locate(clientX: number, clientY: number) {
    const box=canvas.getBoundingClientRect();const p=screenToScene(clientX-box.left,clientY-box.top,width,height);
    return {x:(p.x-width/2)/(scale*zoom)+camera.x,y:(p.y-height/2)/(scale*zoom)+camera.y};
  }
  function sceneAnchor(point: {x: number; y: number}) {
    const box=canvas.getBoundingClientRect();
    const p=screenToScene(point.x-box.left,point.y-box.top,width,height);
    return {x:p.x-width/2,y:p.y-height/2};
  }
  function transform(from: {x: number; y: number}, to: {x: number; y: number}, requestedZoom: number) {
    const next=anchoredCamera(camera,zoom,requestedZoom,sceneAnchor(from),sceneAnchor(to),scale);
    camera={x:next.x,y:next.y};zoom=next.zoom;dirty=true;
  }
  function midpoint(a: {x: number; y: number}, b: {x: number; y: number}) {
    return {x:(a.x+b.x)/2,y:(a.y+b.y)/2};
  }
  function down(event: PointerEvent) {
    if(!power||event.button!==0||pointers.size>=2) return;
    interruptOpening();stopWheel();
    if(focusedTile) {
      flight=null;dragView={...camera,zoom};dragSpeed={x:0,y:0};
      dragOffset=pointers.size?dragDelta:{x:0,y:0};dragDelta={...dragOffset};
    }
    canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    start=previous={x:event.clientX,y:event.clientY};moved=pointers.size===2;velocity={x:0,y:0};lastPointerAt=performance.now();
    if(pointers.size===2&&focusedTile) {const points=[...pointers.values()];start=previous=midpoint(points[0],points[1]);}
  }
  function move(event: PointerEvent) {
    if(!power) return;
    if(pointers.has(event.pointerId)) {
      const before=[...pointers.values()];
      const dx=event.clientX-previous.x,dy=event.clientY-previous.y;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(pointers.size===2) {
        const after=[...pointers.values()];
        const distance=Math.hypot(before[0].x-before[1].x,before[0].y-before[1].y);
        const nextDistance=Math.hypot(after[0].x-after[1].x,after[0].y-after[1].y);
        if(!focusedTile&&distance>0) transform(midpoint(before[0],before[1]),midpoint(after[0],after[1]),zoom*nextDistance/distance);
        if(focusedTile&&dragView) {
          const center=midpoint(after[0],after[1]);
          const dx=center.x-start.x,dy=center.y-start.y;
          dragDelta={x:dragOffset.x+dx,y:dragOffset.y+dy};
          const view=draggedFocusView(dragView,dx,dy,width,height,scale);
          camera={x:view.x,y:view.y};zoom=view.zoom;
        }
        moved=true;velocity={x:0,y:0};
      } else if(focusedTile&&dragView) {
        const now=performance.now(),elapsed=Math.max(1,now-lastPointerAt);
        dragSpeed={x:dragSpeed.x*.4+dx/elapsed*.6,y:dragSpeed.y*.4+dy/elapsed*.6};
        const dragX=event.clientX-start.x,dragY=event.clientY-start.y;
        dragDelta={x:dragOffset.x+dragX,y:dragOffset.y+dragY};
        const view=draggedFocusView(dragView,dragX,dragY,width,height,scale);
        camera={x:view.x,y:view.y};zoom=view.zoom;
      } else if(!focusedTile) {
        transform(previous,{x:event.clientX,y:event.clientY},zoom);
        velocity=reduced?{x:0,y:0}:{x:dx/(scale*zoom),y:dy/(scale*zoom)};
      }
      lastPointerAt=performance.now();
      if(Math.hypot(event.clientX-start.x,event.clientY-start.y)>6) moved=true;
      previous={x:event.clientX,y:event.clientY};canvas.style.cursor='grabbing';dirty=true;
    } else {
      const p=locate(event.clientX,event.clientY);const next=!focusedTile?hitTile(p.x,p.y,projects.length+1):null;
      if(next!==hovered) {hovered=next;dirty=true;}
      canvas.style.cursor=next!==null?'pointer':'grab';
    }
  }
  function up(event: PointerEvent) {
    if(!pointers.has(event.pointerId)) return;
    const wasPinch=pointers.size>1;pointers.delete(event.pointerId);
    if(event.type==='pointerup'&&!moved&&!wasPinch) {
      const p=locate(event.clientX,event.clientY);const index=hitTile(p.x,p.y,projects.length+1);
      if(focusedTile) select(0);else if(index!==null) focusTile(tileNear(index));
    }
    if(focusedTile&&dragView&&moved&&pointers.size===0) settleDrag(dragDelta.x,dragDelta.y,event.type==='pointercancel');
    moved=true;canvas.style.cursor='grab';
    if(wasPinch||event.type==='pointercancel'||performance.now()-lastPointerAt>80) velocity={x:0,y:0};
    if(pointers.size===1) {
      previous=[...pointers.values()][0];
      if(focusedTile) {start=previous;dragView={...camera,zoom};dragOffset={...dragDelta};dragSpeed={x:0,y:0};}
    }
  }
  function wheel(event: WheelEvent) {
    event.preventDefault();if(!power||pointers.size>0) return;
    interruptOpening();
    const input=wheelInput(event,height),now=performance.now();
    if(now-wheelAt>180||input.mode==='pinch'||wheelMode==='pinch') wheelMode=input.mode;
    wheelAt=now;velocity={x:0,y:0};
    if(focusedTile) {
      if(wheelMode==='pinch') {select(0);return;}
      if(!wheelView) {flight=null;wheelView={...camera,zoom};wheelDelta={x:0,y:0};}
      wheelDelta.x+=input.x;wheelDelta.y+=input.y;
      const view=draggedFocusView(wheelView,-wheelDelta.x,-wheelDelta.y,width,height,scale);
      camera={x:view.x,y:view.y};zoom=view.zoom;dirty=true;
      if(wheelTimer) clearTimeout(wheelTimer);
      wheelTimer=setTimeout(()=>{
        const {x,y}=wheelDelta;stopWheel();
        if(Math.hypot(x,y)>35) navigate(Math.abs(x)>Math.abs(y)?x:0,Math.abs(y)>=Math.abs(x)?y:0);
        else if(focusedTile) flyTo(focusView(focusedTile),420);
      },140);
      return;
    }
    if(wheelMode==='pan') {
      // Trackpads already supply momentum deltas; adding our drag inertia
      // would move the board twice after the fingers leave the trackpad.
      camera.x+=input.x/(scale*zoom);camera.y+=input.y/(scale*zoom);dirty=true;
    } else {
      const delta=wheelMode==='pinch'?input.y:Math.max(-100,Math.min(100,input.y));
      const point={x:event.clientX,y:event.clientY};
      transform(point,point,zoom*Math.exp(-delta*(wheelMode==='pinch'?.012:.0022)));
    }
  }
  function key(event: KeyboardEvent) {
    if(event.ctrlKey||event.metaKey||event.altKey) return;
    if(event.key.startsWith('Arrow')) {
      event.preventDefault();
      if(focusedTile) navigate(event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0,event.key==='ArrowDown'?1:event.key==='ArrowUp'?-1:0);
      else {interruptOpening();flyTo({x:camera.x+(event.key==='ArrowRight'?200:event.key==='ArrowLeft'?-200:0),y:camera.y+(event.key==='ArrowDown'?150:event.key==='ArrowUp'?-150:0),zoom},350);}
    } else if(event.key==='Home'||event.key==='Escape') {event.preventDefault();reset();}
    else if(event.key==='PageDown'||event.key==='PageUp') {event.preventDefault();select(channel+(event.key==='PageDown'?1:-1));}
    else if(event.key==='+'||event.key==='='||event.key==='-') {event.preventDefault();if(heroFocused) toggleHero();else {interruptOpening();zoom=clampZoom(zoom*(event.key==='-'?.85:1.15));dirty=true;}}
    else if(event.key==='Enter'||event.key===' ') {event.preventDefault();if(heroFocused) toggleHero();else if(focusedTile) select(0);else {const tile=hitTile(camera.x,camera.y,projects.length+1);if(tile===0) toggleHero();else if(tile!==null) select(tile);}}
  }
  function motionChange() {reduced=media.matches;burst=0;velocity={x:0,y:0};dirty=true;}
  function contextLost(event: Event) {event.preventDefault();cancelAnimationFrame(frame);canvas.dispatchEvent(new Event('tv-unavailable'));}
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  canvas.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('keydown',key);
  canvas.addEventListener('webglcontextlost',contextLost);media.addEventListener('change',motionChange);
  return {
    select,reset,toggleHero,
    zoomBy(factor: number) {if(heroFocused) {toggleHero();return;}interruptOpening();zoom=clampZoom(zoom*factor);dirty=true;},
    togglePower() {power=!power;if(power) {openedAt=performance.now();reset();}burst=0;dirty=true;return power;},
    toggleEffects() {effects=!effects;dirty=true;return effects;},
    dispose() {
      if(disposed) return;disposed=true;stopWheel();cancelAnimationFrame(frame);observer.disconnect();media.removeEventListener('change',motionChange);
      canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);
      canvas.removeEventListener('wheel',wheel);canvas.removeEventListener('keydown',key);canvas.removeEventListener('webglcontextlost',contextLost);
      heroImage.onload=null;images.forEach(image=>{image.onload=null;});gl!.deleteTexture(texture);gl!.deleteBuffer(buffer);shaders.forEach(shader=>gl!.deleteShader(shader));gl!.deleteProgram(program);
    },
  };
}

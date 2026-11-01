// Run: node --experimental-strip-types --test tests/television.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {screenToScene, hitTile, boardTiles, BOARD_LAYOUT, WORLD_W, WORLD_H, entrance, fullscreenHeroView, interpolateView, anchoredCamera, wheelInput, clampZoom, CARD_W} from '../src/components/Television/math.ts';

test('curved screen hit testing keeps the center and mirrored edges aligned', () => {
  for (const [w,h] of [[1280,720],[390,844],[1024,768]]) {
    assert.deepEqual(screenToScene(w/2,h/2,w,h),{x:w/2,y:h/2});
    const a=screenToScene(w*.1,h*.2,w,h),b=screenToScene(w*.9,h*.8,w,h);
    assert.ok(Math.abs(a.x+b.x-w)<1e-8);
    assert.ok(Math.abs(a.y+b.y-h)<1e-8);
    // Project a world point onto the curved screen by numerically inverting
    // its sampling map, then verify the pointer resolves the same project.
    const target={x:w*.72,y:h*.5};
    let x=target.x;
    for(let i=0;i<30;i++) x-=(screenToScene(x,target.y,w,h).x-target.x)*.6;
    assert.ok(Math.abs(screenToScene(x,target.y,w,h).x-target.x)<.001);
  }
});

test('scattered, rotated cards share drawing and hit geometry across repeated worlds', () => {
  BOARD_LAYOUT.forEach(([x,y,w,h,angle],index) => {
    for(const [dx,dy] of [[0,0],[-WORLD_W,-WORLD_H],[WORLD_W,WORLD_H]]) {
      assert.equal(hitTile(x+dx,y+dy,15),index);
      const insideX=w*.45*Math.cos(angle),insideY=w*.45*Math.sin(angle);
      assert.equal(hitTile(x+dx+insideX,y+dy+insideY,15),index);
      const tiles=boardTiles(x+dx-1,y+dy-1,x+dx+1,y+dy+1,15);
      assert.ok(tiles.some(t=>t.index===index&&t.w===w&&t.h===h&&t.angle===angle));
    }
  });
  assert.equal(hitTile(CARD_W/2+1,0,15),null);
  assert.ok(new Set(BOARD_LAYOUT.map(p=>p[2])).size>5);
});

test('opening layers remain hidden until their cue, overshoot, and settle', () => {
  for(const delay of [0,100,240,300]) {
    assert.equal(entrance(delay-1,delay),0);
    assert.equal(entrance(delay,delay),0);
    assert.ok(entrance(delay+300,delay)>1);
    assert.equal(entrance(delay+440,delay),1);
    assert.equal(entrance(2000,delay),1);
  }
});

test('mouse wheel and pinch zoom remain within navigable bounds', () => {
  assert.equal(clampZoom(.001),.45);
  assert.equal(clampZoom(999),1.8);
  assert.equal(clampZoom(1.2),1.2);
});

test('trackpad scrolling pans while pinch and physical mouse wheel zoom', () => {
  assert.deepEqual(wheelInput({deltaX:12,deltaY:30,deltaMode:0,ctrlKey:false,wheelDeltaY:-90},844),{x:12,y:30,mode:'pan'});
  assert.equal(wheelInput({deltaX:0,deltaY:-2,deltaMode:0,ctrlKey:true},844).mode,'pinch');
  assert.equal(wheelInput({deltaX:0,deltaY:100,deltaMode:0,ctrlKey:false,wheelDeltaY:-120},844).mode,'zoom');
  assert.deepEqual(wheelInput({deltaX:0,deltaY:3,deltaMode:1,ctrlKey:false},844),{x:0,y:48,mode:'zoom'});
});

test('two-finger translation and pinch keep the touched world point anchored', () => {
  const camera={x:340,y:-170},oldZoom=.8,scale=.6;
  const from={x:-92,y:134},to={x:43,y:189};
  for(const requestedZoom of [.001,.8,1.1,999]) {
    const next=anchoredCamera(camera,oldZoom,requestedZoom,from,to,scale);
    assert.ok(Math.abs(camera.x+from.x/(scale*oldZoom)-next.x-to.x/(scale*next.zoom))<1e-8);
    assert.ok(Math.abs(camera.y+from.y/(scale*oldZoom)-next.y-to.y/(scale*next.zoom))<1e-8);
  }
  const pan=anchoredCamera(camera,oldZoom,oldZoom,from,to,scale);
  assert.equal(pan.zoom,oldZoom);
  assert.ok(pan.x<camera.x&&pan.y<camera.y);
  const unchanged=anchoredCamera(camera,oldZoom,oldZoom,from,from,scale);
  assert.ok(Math.abs(unchanged.x-camera.x)<1e-8&&Math.abs(unchanged.y-camera.y)<1e-8);
});

test('hero fullscreen covers the glass and the shared camera flight returns exactly to the board', () => {
  for(const [width,height,scale] of [[1280,720,1],[390,844,390/760],[1600,900,1.25]]) {
    const full=fullscreenHeroView(width,height,scale),board={x:0,y:0,zoom:1};
    assert.ok(620*full.zoom*scale>=width-.001);
    assert.ok(340*full.zoom*scale>=height-.001);
    const start=interpolateView(full,board,-1),end=interpolateView(full,board,2);
    assert.ok(Math.abs(start.zoom-full.zoom)<1e-8);
    assert.deepEqual(end,board);
    const middle=interpolateView(full,board,.5);
    assert.ok(middle.zoom>1&&middle.zoom<full.zoom);
    const reverse=interpolateView(board,full,.5);
    assert.ok(Math.abs(middle.zoom-reverse.zoom)<1e-8);
  }
});

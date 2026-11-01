export const CURVE = 0.0875;
export const FIT = 0.94;
export const WORLD_W = 3200;
export const WORLD_H = 2200;
// Deliberately composed pins: center x/y, width/height, rotation in radians.
export const BOARD_LAYOUT = [
  [0, 0, 620, 340, 0],
  [680, -45, 280, 280, -.035],
  [-600, 70, 240, 300, .045],
  [-370, -620, 560, 320, -.025],
  [380, -530, 350, 230, .04],
  [980, 470, 480, 270, -.03],
  [180, 620, 420, 290, .025],
  [-700, 600, 310, 220, -.05],
  [-1120, -440, 360, 250, .025],
  [1150, -630, 430, 300, -.04],
  [-1160, 180, 360, 210, -.025],
  [-1050, 890, 370, 230, .035],
  [700, 920, 300, 190, -.045],
  [1250, 20, 330, 230, .035],
  [50, -1000, 460, 170, -.02],
] as const;

export function boardTiles(left: number, top: number, right: number, bottom: number, count: number) {
  const tiles: {index: number; x: number; y: number; w: number; h: number; angle: number}[] = [];
  for (let col = Math.floor(left / WORLD_W) - 1; col <= Math.ceil(right / WORLD_W) + 1; col++) {
    for (let row = Math.floor(top / WORLD_H) - 1; row <= Math.ceil(bottom / WORLD_H) + 1; row++) {
      BOARD_LAYOUT.slice(0, count).forEach(([cx, cy, w, h, angle], index) => {
        const x = cx + col * WORLD_W, y = cy + row * WORLD_H;
        if (x + w/2 + 65 >= left && x - w/2 - 65 <= right && y + h/2 + 65 >= top && y - h/2 - 65 <= bottom) tiles.push({index, x, y, w, h, angle});
      });
    }
  }
  return tiles;
}

export function entrance(elapsed: number, delay: number, duration = 440) {
  const t = Math.max(0, Math.min(1, (elapsed - delay) / duration));
  // Overshoot, then settle: the reference uses separate comic-style reveals.
  return t === 0 || t === 1 ? t : 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
}
export const CARD_W = 620;
export const CARD_H = 340;

// Mirrors the fragment shader: screen position -> unwarped scene position.
export function screenToScene(x: number, y: number, width: number, height: number) {
  const norm = Math.hypot(width / height, 1) / Math.SQRT2;
  const ax = width / height / norm;
  const ay = 1 / norm;
  const cx = (x / width * 2 - 1) * ax;
  const cy = (y / height * 2 - 1) * ay;
  const factor = (1 + CURVE * (cx * cx + cy * cy)) * FIT;
  return {x: (cx * factor / ax * .5 + .5) * width, y: (cy * factor / ay * .5 + .5) * height};
}

export function hitTile(x: number, y: number, count: number) {
  const tiles = boardTiles(x, y, x, y, count);
  for (let i = tiles.length - 1; i >= 0; i--) {
    const tile = tiles[i], dx = x - tile.x, dy = y - tile.y;
    const localX = dx * Math.cos(tile.angle) + dy * Math.sin(tile.angle);
    const localY = -dx * Math.sin(tile.angle) + dy * Math.cos(tile.angle);
    if (Math.abs(localX) <= tile.w / 2 && Math.abs(localY) <= tile.h / 2) return tile.index;
  }
  return null;
}

export function clampZoom(value: number) { return Math.max(.45, Math.min(1.8, value)); }

// One transform for touch pinch and wheel zoom: the old anchor stays under
// the new midpoint, including when zoom reaches its limits.
export function anchoredCamera(camera: {x: number; y: number}, oldZoom: number, requestedZoom: number, from: {x: number; y: number}, to: {x: number; y: number}, scale: number) {
  const zoom = clampZoom(requestedZoom);
  return {
    x: camera.x + from.x / (scale * oldZoom) - to.x / (scale * zoom),
    y: camera.y + from.y / (scale * oldZoom) - to.y / (scale * zoom),
    zoom,
  };
}

export function wheelInput(event: {deltaX: number; deltaY: number; deltaMode: number; ctrlKey: boolean; wheelDeltaY?: number}, height: number) {
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
  const trackpad = event.wheelDeltaY ? Math.abs(event.wheelDeltaY + 3 * event.deltaY) < 1.5 : event.deltaMode === 0;
  return {x: event.deltaX * unit, y: event.deltaY * unit, mode: event.ctrlKey ? 'pinch' : trackpad ? 'pan' : 'zoom'} as const;
}

export type CameraView = {x: number; y: number; zoom: number};

export function interpolateView(from: CameraView, to: CameraView, progress: number): CameraView {
  const t = Math.max(0, Math.min(1, progress));
  const ease = t * t * (3 - 2 * t);
  // Geometric zoom keeps the perceived rate of magnification even.
  return {x: from.x + (to.x-from.x)*ease, y: from.y + (to.y-from.y)*ease, zoom: Math.exp(Math.log(from.zoom)+(Math.log(to.zoom)-Math.log(from.zoom))*ease)};
}

export function fullscreenHeroView(width: number, height: number, scale: number): CameraView {
  return {x: width < height ? 70 : 0, y: 0, zoom: Math.max(width / CARD_W, height / CARD_H) / scale};
}

let PIXI
if (typeof window !== 'undefined') {
  PIXI = require('pixi.js')
}

/**
 * Canvasへの壁画を行うライブラリであるPIXI.jsを用いるのに有用なヘルパー関数群を提供します。
 * @module pixiHelpers
 * @author Ritsuki KOKUBO
 */

/**
 * PIXIの初期化を行い、壁画オブジェクトを追加できる状態にします。
 * @param {HTMLCanvasElement} element  - 壁画を行うCanvas要素
 * @return {PIXI.Application} - 初期化済みのPIXI.Applicationオブジェクト
 */
export function initPixi(element) {
  let rect = { width: 0, height: 0 };
  try {
    rect = element.getBoundingClientRect();
  } catch (e) {
    throw new Error("指定されたCanvas要素の高さ・幅を取得できませんでした。");
  }
  const pixi = new PIXI.Application({
    width: rect.width,
    height: rect.height,
    antialias: true,
    transparent: true,
    resolution: 1,
    view: element
  })
  pixi.renderer.autoResize = true;
  return pixi;
}
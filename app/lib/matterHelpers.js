let Matter
if (typeof window !== 'undefined') {
  Matter = require('matter-js')
}

/**
 * オブジェクトの動作を司る物理演算を行うライブラリであるmatter.jsを用いるのに有用なヘルパー関数群を提供します。本モジュールの関数群はブラウザ環境でのみ動作します。
 * @module matterHelpers
 * @author Ritsuki KOKUBO
 * @see {@link https://brm.io/matter-js/docs/index.html}
 */

/**
 * @typedef {Object} MatterInitObject
 * @property {Matter.Engine} engine - matterのエンジン
 * @property {Matter.Runner} runner - matterのランナー
 */

/**
 * matterの初期化を行い、演算オブジェクトを追加できる状態にします。
 * @return {MatterInitObject} - 初期化済みのmatterのEngineとRunnerが入ったオブジェクト
 */
export function initMatter() {
  const engine = Matter.Engine.create()
  const world = engine.world
  world.gravity.y = 0
  const runner = Matter.Runner.create()
  Matter.Runner.run(runner, engine)
  return { engine, runner }
}

export function stopMatter(runner) {
  Matter.Runner.stop(runner)
}

/**
 * matterのデバッグ用レンダラーオブジェクトの初期化を行います。
 * @param {HTMLCanvasElement} element - 壁画を行うCanvas要素
 * @param {Matter.Engine} engine - matterのエンジンオブジェクト, このエンジンオブジェクトで演算されている内容が可視化されます
 * @return {Matter.Render} - 初期化済みのmatterのレンダラーオブジェクト
 */
export function initMatterRenderer(element, engine) {
  let rect = { width: 0, height: 0 }
  try {
    rect = element.getBoundingClientRect()
  } catch (e) {
    throw new Error('指定されたCanvas要素の高さ・幅を取得できませんでした。')
  }
  const renderer = Matter.Render.create({
    element: element,
    engine: engine,
    options: {
      width: rect.width,
      height: rect.height,
      showAngleIndicator: true,
      showCollisions: true,
      showVelocity: true
    }
  })
  Matter.Render.lookAt(renderer, {
    min: { x: rect.width * 0, y: rect.height * 0 },
    max: { x: rect.width * 1, y: rect.height * 1 }
  })
  Matter.Render.run(renderer)
  return renderer
}

export function registerUpdateCb(engine, fns) {
  if (!fns || !engine) {
    return
  }
  Matter.Events.on(engine, 'beforeUpdate', () => {
    if (fns == null) {
      return
    }
    fns.forEach((f) => {
      f()
    })
  })
}

let PIXI
if (typeof window !== 'undefined') {
  PIXI = require('pixi.js')
}

export let loader = null

/**
 * Canvasへの描画を行うライブラリであるPIXI.jsを用いるのに有用なヘルパー関数群を提供します。本モジュールの関数群はブラウザ環境でのみ動作します。
 * @module pixiHelpers
 * @author Ritsuki KOKUBO
 */

/**
 * @typedef {Object} TextParam
 * @property {number} fontSize - フォントサイズ
 * @property {number} fontWeight - フォントの太さ
 * @property {boolean} wrap - 改行するか
 */

/**
 * @typedef {Object} ImageParam
 * @property {number} [alpha] - 透明度
 * @property {number} [width] - 幅
 * @property {number} [height] - 高さ
 */

/**
 * @typedef {Object} Size
 * @property {number} width
 * @property {number} height
 */

/**
 * PIXIの初期化を行い、描画オブジェクトを追加できる状態にします。
 * @param {HTMLCanvasElement} element  - 描画を行うCanvas要素
 * @return {PIXI.Application} - 初期化済みのPIXI.Applicationオブジェクト
 */
export function initPixi(element) {
  let rect = { width: 0, height: 0 }
  try {
    rect = element.getBoundingClientRect()
  } catch (e) {
    throw new Error('指定されたCanvas要素の高さ・幅を取得できませんでした。')
  }
  const pixi = new PIXI.Application({
    width: rect.width,
    height: rect.height,
    antialias: true,
    transparent: true,
    resolution: 1,
    view: element
  })
  pixi.renderer.autoResize = true
  pixi.stage.interactive = true
  loader = new PIXI.Loader()
  return pixi
}

/**
 * グラデーションのテクスチャを貼り付けたSpriteを生成します。
 * @param {number} width  - 幅
 * @param {number} height - 高さ
 * @param {string} colorFrom - 開始色
 * @param {string} colorTo  - 終了色
 * @param {'horizontal' | 'vertical' | 'diagonal'} [direction] - グラデーションの方向, 指定しない場合'horizontal'(横向き)とします
 * @return {PIXI.Sprite} - 生成したSprite
 */
export function createGradient(width, height, colorFrom, colorTo, direction) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  let grx = 0
  let gry = 0
  switch (direction) {
    case 'horizontal':
      grx = width
      gry = 0
      break
    case 'vertical':
      grx = 0
      gry = height
      break
    case 'diagonal':
      grx = width
      gry = height
      break
    default:
      grx = width
      gry = 0
      break
  }
  const gradient = ctx.createLinearGradient(0, 0, grx, gry)
  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)
  gradient.addColorStop(0, colorFrom)
  gradient.addColorStop(1, colorTo)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  const sprite = PIXI.Sprite.from(canvas)
  sprite.x = 0
  sprite.y = 0
  return sprite
}

/**
 * テキストを描画した場合の大きさを調べます
 * @param {string} text - 描画する文字列
 * @param {TextParam} param - テキストのパラメータ
 * @return {Size} - テキストの大きさ
 */
export function calcTextSize(text, param) {
  if (!text) {
    return {
      width: 0,
      height: 0
    }
  }
  let testTextStyle = {
    fontSize: param.fontSize,
    fontWeight: param.fontWeight
  }
  if (param.wrap) {
    if (!Number.isInteger(param.width)) {
      throw new Error('折り返しを有効にするテキストのサイズの計算には幅の指定が必要です。')
    }
    Object.assign(testTextStyle, {
      wordWrap: true,
      wordWrapWidth: param.width,
      breakWords: true
    })
  }
  const testText = new PIXI.Text(text, testTextStyle)
  return {
    width: testText.width,
    height: testText.height
  }
}

/**
 * 改行を有効にしたPIXIのTextオブジェクトを生成します
 *
 * `param` はPIXI.TextStyleオブジェクトですが、一行の幅( `wordWrapWidth` )は `width` プロパティにしてあります。
 * @param {string} text - 描画するテキスト
 * @param {PIXI.TextStyle} param - テキスト描画のPIXIのパラメータ
 * @return {PIXI.Text} - 生成したTextオブジェクト
 */
export function wrapedText(text, param) {
  return new PIXI.Text(
    text,
    Object.assign(param, {
      wordWrap: true,
      wordWrapWidth: param.width,
      breakWords: true
    })
  )
}

/**
 * アスペクト比を保存するように大きさを調整した画像のSpriteを生成します
 * @param {string} path - 描画する画像のパス
 *
 * 画像は予めPIXI.Loaderにより読み込まれている必要があります
 * @param {ImageParam} param - 画像のプロパティ
 *
 * 高さ( `height` )または幅( `width` )どちらかのみを指定した場合、アスペクト比を保存するように指定していない方の値を決定します
 * @return {PIXI.Sprite} - 生成した画像が貼り付けてあるSpriteオブジェクト
 */
export function aspectSaveImageSprite(path, param) {
  const image = new PIXI.Sprite(loader.resources[path].texture)
  image.alpha = param.alpha | 1
  if (param.height && param.width) {
    image.height = param.height
    image.width = param.width
  } else if (param.height) {
    const heightRatio = param.height / image.height
    image.height = param.height
    image.width = image.width * heightRatio
  } else if (param.width) {
    const widthRatio = param.width / image.width
    image.width = param.width
    image.height = image.height * widthRatio
  }
  return image
}

/**
 * 画像がpixiに読み込まれるまで待機するPromiseを生成します
 * @async
 * @param {Object[]} imagePaths - 画像のパス
 * @example
 * await loadImages({
 *   userIcon1: "/icon/user1.png"
 * })
 */
export function loadImages(imagePaths) {
  const keys = Object.keys(imagePaths)
  return new Promise((resolve, rehject) => {
    let l = loader
    keys.forEach((key) => {
      l = l.add(key, imagePaths[key])
    })
    l.load(() => {
      resolve()
    })
  })
}

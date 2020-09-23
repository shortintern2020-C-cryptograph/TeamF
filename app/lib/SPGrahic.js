let PIXI
let Matter
if (typeof window !== 'undefined') {
  PIXI = require('pixi.js')
  Matter = require('matter-js')
}
const easing = require('easing-utils')

import { createGradient, calcTextSize, wrapedText, aspectSaveImageSprite, loadImages, loader } from '../lib/pixiHelpers'

/**
 * 物理演算により動かしつつセリフ等のデータを表示する事を行うクラスを提供します。データを表示する本モジュールのクラス群はブラウザ環境でのみ動作します。
 * @module SPGrahic
 * @author Ritsuki KOKUBO
 */

/**
 * @typedef {Object} Size
 * @property {number} width
 * @property {number} height
 */

/**
 * 物理演算とCanvas壁画を連携させるための基底クラスです。
 * @author Ritsuki KOKUBO
 */
class GrahicObject {
  /**
   * 横方向の初期位置
   * @type {number}
   * @access private
   */
  _x
  /**
   * 縦方向の初期位置
   * @type {number}
   * @access private
   */
  _y
  /**
   * 幅, コンテンツに応じて計算される
   * @type {number}
   * @access private
   */
  _width
  /**
   * 高さ, コンテンツに応じて計算される
   * @type {number}
   * @access private
   */
  _height
  /**
   * 面積, コンテンツに応じて計算される
   *
   * 物理演算用モデルにおいてスケールイン・スケールアウトのアニメーションを行うために内部的に利用
   * @type {number}
   * @access private
   */
  _area
  /**
   * 壁画するデータを保持するオブジェクト (子クラスで規定)
   * @type {Object}
   * @access private
   */
  _content
  /**
   * 壁画や動作に関するオプションを保持するオブジェクト (子クラスで規定)
   * @type {Object}
   * @access private
   */
  _options
  /**
   * Canvasへの壁画を行うPIXIのオブジェクト
   *
   * このオブジェクトをPIXIのステージに追加することで要素が壁画される
   * @type {PIXI.Container}
   */
  presentation
  /**
   * 内包するPIXIの各パーツ（テキスト、アイコン）のオブジェクトを保持するオブジェクト,
   * 高さを変更する際に各パーツの高さを変更するために内部的に利用
   * @type {PIXI.Container}
   * @access private
   */
  _presentationParts
  /**
   * 物理演算を行うmatter.jsのオブジェクト,
   * このオブジェクトをmatterのWorldに追加することで物理演算が行われる,
   * 基本的に実際に表示されている領域を包み込むような単純な四角形の物理モデルを用いる
   * @type {Matter.Body}
   */
  model
  /**
   * オブジェクト追加時のアニメーションが終了したか,
   * 追加時のアニメーションと特定ポイントへ重力を発生させるアニメーションの演算を同時に行うと処理落ちするため、どちらかのみに絞るためフラグとして利用
   * @type {boolean}
   */
  initFinished

  /**
   * コンストラクタ,
   * オブジェクトを生成しただけでは、壁画・物理演算は行われません。
   * @param {number} x - 横方向の初期位置
   * @param {number} y - 縦方向の初期位置
   * @param {Object} contents - 壁画するデータを保持するオブジェクト (子クラスで規定)
   * @param {Object} options - 壁画や動作に関するオプションを保持するオブジェクト (子クラスで規定)
   */
  constructor(x, y, contents, options) {
    this._x = x
    this._y = y
    this._options = options
    this._content = contents
    this.initFinished = false
    this._initPresentation()
    this._initModel()
  }

  /**
   * 高さ
   * @type {number}
   * @readonly
   */
  get width() {
    return this._width
  }
  /**
   * 幅
   * @type {number}
   * @readonly
   */
  get height() {
    return this._height
  }
  /**
   * 壁画や動作に関するオプションを保持するオブジェクト
   * @type {Object}
   * @readonly
   */
  get options() {
    return this._options
  }
  /**
   *
   * @param {Object} options
   */
  get content() {
    return this._content
  }

  get x() {
    return this._x
  }
  get y() {
    return this._y
  }
  set x(nx) {
    this._x = nx
    this.normalMoveRender(this._x, this._y)
  }
  set y(ny) {
    this._y = ny
    this.normalMoveRender(this._x, this._y)
  }

  /**
   * オプションの上書き更新, `options`内に存在しないプロパティについては現在の内容を保持します
   * @param {Object} options - 壁画や動作に関するオプションを保持するオブジェクト
   */
  updateOption(options) {
    Object.assign(this._options, options)
  }

  /**
   * 壁画オブジェクトを生成します,
   * この関数内でPIXIの壁画オブジェクトが生成されて`presentation`にセットされます,
   * またその際、壁画オブジェクトから高さ, 幅を計算して`_width`, `_height`がセットされ, 物理演算モデルを作成する際に用いられます
   * 子クラスはこの関数をオーバーライドしてそれぞれの壁画を行います
   * @access private
   */
  _initPresentation() {
    this.presentation = new PIXI.Container()
    this._width = this._height = this._area = 0
  }

  /**
   * 物理演算モデルを生成します,
   * `_initPresentation()`で壁画する内容から壁画オブジェクトを生成した際に決定される幅・高さを用います,
   * そのため`_initPresentation()`が呼ばれるより前にこの関数を呼んでは**いけません**。
   * @access private
   */
  _initModel() {
    const options = {
      restitution: 0, // 弾性係数 0-1
      density: 0.001, // 密度
      friction: 0 // 摩擦
    }
    const model = Matter.Bodies.rectangle(
      this._x,
      this._y,
      this._width + this._options.margin,
      this._height + this._options.margin,
      options
    )
    this._area = model.area
    this.model = model
  }

  /**
   * 物理演算モデルの位置と壁画オブジェクトの位置を同期します,
   * 物理演算エンジンの計算処理終了後のフックメソッド内で呼ばれることを想定しています,
   * この関数が呼ばれない限り物理演算エンジンによりモデルの位置が移動しても壁画には反映されません
   */
  syncPosition() {
    const m = this.model
    const p = this.presentation
    if (p) {
      p.position.set(m.position.x, m.position.y)
    }
  }

  /**
   * アニメーションを付けずに壁画・物理演算モデルを追加します
   * @param {PIXI.Application} app - 壁画オブジェクトを追加するPIXIのApplicationオブジェクト
   * @param {Matter.World} world  - 物理演算モデルを追加するmatterのWorldオブジェクト
   */
  normalInitRender(app, world) {
    app.stage.addChild(this.presentation)
    Matter.World.add(world, this.model)
    this.initFinished = true
  }

  /**
   * 壁画・物理演算モデルを追加し、滑らかにスケールインするようなアニメーションを付けます
   * @async
   * @param {PIXI.Application} app - 壁画オブジェクトを追加するPIXIのApplicationオブジェクト
   * @param {Matter.World} world  - 物理演算モデルを追加するmatterのWorldオブジェクト
   */
  easingInitRender(app, world) {
    return new Promise((resolve, reject) => {
      const m = this.model
      const p = this.presentation
      p.scale.set(0, 0)
      app.stage.addChild(p)
      Matter.Body.scale(m, 0.00001, 0.00001)
      Matter.World.add(world, m)
      const startTimeMs = Date.now().valueOf()
      const transionMs = 800
      const transionFn = () => {
        const currentMs = Date.now().valueOf()
        const diffMs = currentMs - startTimeMs
        if (diffMs > transionMs) {
          this.initFinished = true
          resolve()
          return
        }
        let transionRatio = easing.easeOutCubic(diffMs / transionMs)

        const currentArea = m.area
        const desireArea = this._area * transionRatio
        const relativeRatio = Math.sqrt(desireArea / currentArea)

        p.scale.set(transionRatio, transionRatio)
        Matter.Body.scale(m, relativeRatio, relativeRatio)
        requestAnimationFrame(transionFn)
      }
      requestAnimationFrame(transionFn)
    })
  }

  /**
   * 大きさを変更します
   * @param {module:SPGrahic~Size} size - 変更後の大きさ
   * @deprecated この関数は作成途中です
   */
  normalSizeChangeRender(size) {
    const offsetX = -(size.width / 2)
    const offsetY = -(size.height / 2)

    const m = this.model
    const p = this.presentation
    const pp = this._presentationParts
    const bg = pp.bg
    const mask = pp.mask
    bg.width = size.width
    mask.width = size.width
    bg.height = size.height
    mask.height = size.height
    bg.position.set(offsetX, offsetY)
    mask.position.set(offsetX, offsetY)

    Matter.Body.scale(m, size.width / this._width, size.height / this._height)
    this._width = size.width
    this._height = size.height
    this._area = m.area
  }

  /**
   * 描画オブジェクトおよび物理演算モデルを削除します
   * @param {PIXI.Application} app - 壁画オブジェクトが追加されていたPIXIのApplicationオブジェクト
   * @param {Matter.World} world  - 物理演算モデルが追加されていたmatterのWorldオブジェクト
   */
  normalRemoveRender(app, world) {
    const m = this.model
    const p = this.presentation
    app.stage.removeChild(p)
    Matter.World.remove(world, m)
    this.model = null
    this.presentation = null
  }

  /**
   * 描画オブジェクトおよび物理演算モデルを特定の位置に移動します
   * @param {number} x - 移動先の位置(x)
   * @param {number} y - 移動先の位置(y)
   */
  normalMoveRender(x, y) {
    const m = this.model
    const p = this.presentation
    const desiredPosition = {
      x: x,
      y: y
    }
    p.position.set(desiredPosition.x, desiredPosition.y)
    Matter.Body.setPosition(m, {
      x: desiredPosition.x,
      y: desiredPosition.y
    })
  }

  /**
   * 描画オブジェクトおよび物理演算モデルを特定の位置にアニメーション付きで移動します
   * @async
   * @param {number} x - 移動先の位置(x)
   * @param {number} y - 移動先の位置(y)
   */
  easingMoveRender(x, y) {
    return new Promise((resolve, reject) => {
      const m = this.model
      const p = this.presentation
      // pixiの.positionは常に値を取得した瞬間の位置を返すので、値を保存しておくには以下のようにする必要がある
      // NG: const originalPosition = p.position
      const originalPosition = {
        x: p.position.x,
        y: p.position.y
      }
      const desiredPosition = {
        x: x,
        y: y
      }
      const positionDiff = {
        x: desiredPosition.x - originalPosition.x,
        y: desiredPosition.y - originalPosition.y
      }
      const startTimeMs = Date.now().valueOf()
      const transionMs = 1000
      const transionFn = () => {
        const currentMs = Date.now().valueOf()
        const diffMs = currentMs - startTimeMs
        if (diffMs > transionMs) {
          resolve()
          return
        }
        const transionRatio = easing.easeOutCubic(diffMs / transionMs)
        p.position.set(
          originalPosition.x + positionDiff.x * transionRatio,
          originalPosition.y + positionDiff.y * transionRatio
        )
        Matter.Body.setPosition(m, {
          x: originalPosition.x + positionDiff.x * transionRatio,
          y: originalPosition.y + positionDiff.y * transionRatio
        })
        requestAnimationFrame(transionFn)
      }
      requestAnimationFrame(transionFn)
    })
  }
}

/**
 * セリフの壁画を行うクラスです
 * @author Ritsuki KOKUBO
 */
export class Dialog extends GrahicObject {
  /**
   * コンストラクタ,
   * オブジェクトを生成しただけでは、壁画・物理演算は行われません。
   * @param {number} x - 横方向の初期位置
   * @param {number} y - 縦方向の初期位置
   * @param {module:SPGraphic~DialogContents} contents - 壁画するデータを保持するオブジェクト
   * @param {module:SPGraphic~GraphicObjectOptions} options - 壁画や動作に関するオプションを保持するオブジェクト
   */
  constructor(x, y, contents, options) {
    const defaultOptions = {
      color: false,
      margin: 20,
      movement: {
        mode: 'Center', // "Center" | "Around" | "OutOfRange"
        context: {}
      }
    }
    const defaultContents = {
      dialog: 'セリフ',
      cite: '著作権表示'
    }
    super(x, y, Object.assign(defaultContents, contents), Object.assign(defaultOptions, options))
  }

  /**
   * 壁画オブジェクトを生成します,
   * この関数内でPIXIの壁画オブジェクトが生成されて`presentation`にセットされます,
   * またその際、壁画オブジェクトから高さ, 幅を計算して`_width`, `_height`がセットされ, 物理演算モデルを作成する際に用いられます
   * 子クラスはこの関数をオーバーライドしてそれぞれの壁画を行います
   * @access private
   */
  _initPresentation() {
    // パラメータ
    const quotIconParam = {
      height: 40,
      margin: 10,
      alpha: 0.6
    }
    const dialogParam = {
      margin: 20,
      fontSize: 30,
      fontWeight: 800,
      maxWidth: 500
    }
    const citeParam = {
      margin: 20,
      fontSize: 16,
      fontWeight: 800,
      maxWidth: 500,
      alpha: 0.6
    }

    // 改行しないで表示した場合の大きさを調べる
    const dialogOriginalWidth =
      calcTextSize(this._content.dialog, {
        fontSize: dialogParam.fontSize,
        fontWeight: dialogParam.fontWeight
      }).width +
      dialogParam.margin * 2

    // 幅の決定
    this._width = dialogParam.maxWidth > dialogOriginalWidth ? dialogOriginalWidth : dialogParam.maxWidth

    // セリフ
    const dialogStyle = {
      fontSize: dialogParam.fontSize,
      fontWeight: dialogParam.fontWeight,
      fill: 'white',
      wordWrap: true,
      wordWrapWidth: this._width - dialogParam.margin * 2,
      breakWords: true
    }
    const dialog = new PIXI.Text(this._content.dialog, dialogStyle)

    // 引用
    const citeStyle = {
      fontSize: citeParam.fontSize,
      fontWeight: citeParam.fontWeight,
      fill: 'white',
      wordWrap: true,
      wordWrapWidth: this._width - citeParam.margin * 2,
      breakWords: true,
      align: 'right'
    }
    const cite = new PIXI.Text(this._content.cite, citeStyle)

    // 高さの決定
    this._height = quotIconParam.height + dialog.height + citeParam.margin + cite.height + quotIconParam.height / 2

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    const offsetX = -(this._width / 2)
    const offsetY = -(this._height / 2)

    // 全体マスク
    const mask = new PIXI.Graphics()
    mask.beginFill(0x000000)
    mask.drawRoundedRect(0, 0, this._width, this._height, 30)
    mask.endFill()

    // 背景
    const bg = createGradient(this._width, this._height, '#FF00E5', '#BD00FF')

    // 引用符
    const quotIcon = new PIXI.Sprite(loader.resources['quotation_white'].texture)
    quotIcon.alpha = quotIconParam.alpha
    const heightRatio = quotIconParam.height / quotIcon.height
    quotIcon.height = quotIconParam.height
    quotIcon.width = quotIcon.width * heightRatio

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    bg.position.set(offsetX, offsetY)
    mask.position.set(offsetX, offsetY)
    quotIcon.position.set(offsetX + quotIconParam.margin, offsetY + quotIconParam.margin)
    dialog.position.set(offsetX + dialogParam.margin, offsetY + quotIcon.height)
    cite.position.set(offsetX + citeParam.margin, dialog.position.y + dialog.height + citeParam.margin)

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    let container = new PIXI.Container()
    container.addChild(bg)
    container.addChild(mask)
    container.addChild(quotIcon)
    container.addChild(dialog)
    container.addChild(cite)
    container.mask = mask
    container.position.set(this._x, this._y)

    this._presentationParts = {
      bg: bg,
      mask: mask,
      quotIcon: quotIcon,
      dialog: dialog,
      cite: cite
    }
    this.presentation = container
    this.presentation.interactive = true
  }
}

/**
 * セリフ詳細の壁画を行うクラスです
 * @author Ritsuki KOKUBO
 */
export class DialogDetail extends GrahicObject {
  /**
   * コンストラクタ,
   * オブジェクトを生成しただけでは、壁画・物理演算は行われません。
   * @param {number} x - 横方向の初期位置
   * @param {number} y - 縦方向の初期位置
   * @param {module:SPGraphic~DialogDetailContents} contents - 壁画するデータを保持するオブジェクト
   * @param {module:SPGraphic~GraphicObjectOptions} options - 壁画や動作に関するオプションを保持するオブジェクト
   */
  constructor(x, y, contents, options) {
    const defaultOptions = {
      movement: {
        mode: 'Center', // "Center" | "Around" | "OutOfRange"
        context: {}
      },
      margin: 0
    }
    const defaultContents = {
      author: '発話者',
      title: '作品名',
      source: '商品リンク',
      cite: 'サンプルな著作権表示'
    }
    super(x, y, Object.assign(defaultContents, contents), Object.assign(defaultOptions, options))
  }

  /**
   * 壁画オブジェクトを生成します,
   * この関数内でPIXIの壁画オブジェクトが生成されて`presentation`にセットされます,
   * またその際、壁画オブジェクトから高さ, 幅を計算して`_width`, `_height`がセットされ, 物理演算モデルを作成する際に用いられます
   * 子クラスはこの関数をオーバーライドしてそれぞれの壁画を行います
   * @access private
   */
  _initPresentation() {
    // 幅を決定
    const margin = 20
    this._width = 500
    const marchantImagePath = null
    const marchantIconWidth = marchantImagePath ? 100 : 0
    const infoAreaWidth = this._width - marchantIconWidth - margin
    const offsetX = -(this._width / 2)
    const infoAreaX = offsetX + marchantIconWidth + margin

    // パラメータ
    const authorIconParam = {
      height: 30
    }
    const textParams = {
      author: {
        fontSize: 26
      },
      title: {
        fontSize: 30
      },
      source: {
        fontSize: 16
      },
      cite: {
        fontSize: 16
      }
    }
    Object.keys(textParams).forEach((key) => {
      const tp = textParams[key]
      tp.width = infoAreaWidth
      tp.fontWeight = 800
    })

    // 作者アイコン
    const authorIcon = aspectSaveImageSprite('author', { height: authorIconParam.height })

    // 作者テキスト
    const text = {}
    Object.keys(textParams).forEach((key) => {
      text[key] = wrapedText(this._content[key], textParams[key])
    })

    // 高さ決定
    let textHeightSum = 0
    Object.keys(text).forEach((key) => {
      textHeightSum += text[key].height
    })
    this._height = textHeightSum + margin * 5
    const offsetY = -(this._height / 2)

    // 全体マスク
    const mask = new PIXI.Graphics()
    mask.beginFill(0x000000)
    mask.drawRoundedRect(0, 0, this._width, this._height, 30)
    mask.endFill()

    // 背景
    const bg = createGradient(this._width, this._height, '#FFFFFF', '#E4E4E4', 'vertical')

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    bg.position.set(offsetX, offsetY)
    mask.position.set(offsetX, offsetY)
    authorIcon.position.set(infoAreaX + margin, offsetY + margin)
    text.author.position.set(infoAreaX + margin + authorIcon.width + 10, offsetY + margin)
    text.title.position.set(infoAreaX + margin, text.author.y + text.author.height + margin)
    text.source.position.set(infoAreaX + margin, text.title.y + text.title.height + margin)
    text.cite.position.set(infoAreaX + margin, text.source.y + text.source.height + margin)

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    let container = new PIXI.Container()
    container.addChild(bg)
    container.addChild(mask)
    container.addChild(authorIcon)
    container.addChild(text.author)
    container.addChild(text.title)
    container.addChild(text.source)
    container.addChild(text.cite)
    container.mask = mask
    // container.filters = [new PIXI.filters.DropShadowFilter({
    //   rotation: 90,
    //   distance: 3
    // })];
    container.position.set(this._x, this._y)

    this.presentation = container

    // 商品画像
    console.log(marchantImagePath)
    if (marchantImagePath) {
      const marchantImage = aspectSaveImageSprite(marchantImagePath, { width: marchantIconWidth })

      const marchantMask = new PIXI.Graphics()
      marchantMask.beginFill(0x000000)
      marchantMask.drawRoundedRect(0, 0, marchantImage.width, marchantImage.height, 10)
      marchantMask.endFill()

      container.addChild(marchantMask)
      container.addChild(marchantImage)
      marchantImage.position.set(offsetX + margin, offsetY + (this._height - marchantImage.height) / 2)
      marchantMask.position.set(offsetX + margin, offsetY + (this._height - marchantImage.height) / 2)
      marchantImage.mask = marchantMask
    }
  }

  /**
   * 物理演算モデルを生成します,
   * `_initPresentation()`で壁画する内容から壁画オブジェクトを生成した際に決定される幅・高さを用います,
   * そのため`_initPresentation()`が呼ばれるより前にこの関数を呼んでは**いけません**。
   * @access private
   */
  _initModel() {
    const options = {
      restitution: 0, // 弾性係数 0-1
      density: 0.001, // 密度
      friction: 0 // 摩擦
    }
    const eclipse = Matter.Bodies.rectangle(this._x, this._y + this._height / 2, this._width, this._height / 2, options)

    this._area = eclipse.area
    this.model = eclipse
  }
}

/**
 * コメントの壁画を行うクラスです
 * @author Ritsuki KOKUBO
 */
export class Comment extends GrahicObject {
  /**
   * コンストラクタ,
   * オブジェクトを生成しただけでは、壁画・物理演算は行われません。
   * @param {number} x - 横方向の初期位置
   * @param {number} y - 縦方向の初期位置
   * @param {module:SPGraphic~CommentContents} contents - 壁画するデータを保持するオブジェクト
   * @param {module:SPGraphic~GraphicObjectOptions} options - 壁画や動作に関するオプションを保持するオブジェクト
   */
  constructor(x, y, contents, options) {
    const defaultOptions = {
      color: false,
      margin: 20,
      movement: {
        mode: 'Center', // "Center" | "Around" | "OutOfRange"
        context: {}
      }
    }
    const defaultContents = {
      comment: 'コメントコメントコメントコメントコメントコメントコメントコメントコメント',
      userName: 'ユーザ名',
      userPhoto: '',
      time: '●分前'
    }
    super(x, y, Object.assign(defaultContents, contents), Object.assign(defaultOptions, options))
  }

  /**
   * 壁画オブジェクトを生成します,
   * この関数内でPIXIの壁画オブジェクトが生成されて`presentation`にセットされます,
   * またその際、壁画オブジェクトから高さ, 幅を計算して`_width`, `_height`がセットされ, 物理演算モデルを作成する際に用いられます
   * 子クラスはこの関数をオーバーライドしてそれぞれの壁画を行います
   * @access private
   */
  _initPresentation() {
    // パラメータ
    this._width = 400
    const margin = this._options.margin
    const userIconParam = {
      size: 50
    }
    const commentWidth = this._width - userIconParam.size - margin
    const textParam = {
      comment: {
        fontSize: 20,
        fontWeight: 500,
        width: commentWidth - margin * 2
      },
      userName: {
        fontSize: 20,
        fontWeight: 800
      },
      time: {
        fontSize: 16,
        fontWeight: 800
      }
    }

    const metaTextKeys = ['userName', 'time']
    const allTextKeys = Object.keys(textParam)

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    // ユーザ名, 時刻
    const text = []
    metaTextKeys.forEach((key) => {
      text[key] = new PIXI.Text(this._content[key], textParam[key])
    })

    // コメント
    text.comment = wrapedText(this._content.comment, textParam.comment)

    // 高さ決定
    let heightSum = 0
    allTextKeys.forEach((key) => {
      heightSum += text[key].height
    })
    heightSum += margin * 2
    this._height = heightSum

    // コメントマスク
    const triWidth = 40
    const commentHeight = text.comment.height + margin * 2
    const commentMask = new PIXI.Container()

    const commentMaskRec = new PIXI.Graphics()
    commentMaskRec.beginFill(0x000000)
    commentMaskRec.drawRoundedRect(0, 0, commentWidth, commentHeight, 30)
    commentMaskRec.endFill()

    const commentMaskTri = new PIXI.Graphics()
    commentMaskTri.beginFill(0x000000)
    commentMaskTri.moveTo(0, 40)
    commentMaskTri.lineTo(triWidth, 30)
    commentMaskTri.lineTo(triWidth, 0)
    commentMaskTri.lineTo(0, 40)
    commentMaskTri.endFill()
    commentMaskTri.position.set(-15, commentHeight - commentMaskTri.height)

    commentMask.addChild(commentMaskRec)
    commentMask.addChild(commentMaskTri)

    // コメント背景
    const commentBg = createGradient(commentWidth + margin, commentHeight, '#FFFFFF', '#E4E4E4', 'vertical')
    commentBg.mask = commentMask
    // commentBg.filters = [new PIXI.filters.DropShadowFilter({
    //   rotation: 90,
    //   distance: 3
    // })];

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    const offsetX = -(this._width / 2)
    const offsetY = -(this._height / 2)

    commentMask.position.set(offsetX + (this._width - commentWidth), offsetY)
    commentBg.position.set(offsetX + (this._width - commentWidth) - margin, offsetY)
    text.comment.position.set(offsetX + (this._width - commentWidth) + margin, offsetY + margin)
    text.userName.position.set(offsetX + userIconParam.size + margin, offsetY + commentHeight + margin)
    text.time.position.set(
      offsetX + userIconParam.size + text.userName.width + margin * 2,
      offsetY + commentHeight + margin + (text.userName.height - text.time.height) / 2
    )

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    let container = new PIXI.Container()
    container.addChild(commentMask)
    container.addChild(commentBg)
    container.addChild(text.comment)
    container.addChild(text.userName)
    container.addChild(text.time)

    this.presentation = container

    const userIcon = aspectSaveImageSprite('userIcon', { width: userIconParam.size })

    const mask = new PIXI.Graphics()
    mask.beginFill(0x000000)
    mask.drawRoundedRect(0, 0, userIconParam.size, userIconParam.size, 10)
    mask.endFill()

    container.addChild(mask)
    container.addChild(userIcon)
    userIcon.position.set(offsetX, offsetY + (this._height - userIcon.height))
    mask.position.set(offsetX, offsetY + (this._height - userIcon.height))
    userIcon.mask = mask
  }
}

/**
 * オブジェクトの運動の様子を制御します
 * @param {SPGrahic[]} targets
 */
export function moveVectorAdjust(targets) {
  const delta = Math.sin(Date.now() * 5000) * 10
  if (!targets) {
    return
  }
  targets.forEach((target) => {
    const m = target.model
    const WORLD_WIDTH = window.innerWidth
    const WORLD_HEIGHT = window.innerHeight
    const CENTER_X = WORLD_WIDTH / 2
    const CENTER_Y = WORLD_HEIGHT / 2
    let possub
    if (!target.initFinished) {
      target.syncPosition()
      return
    }
    if (!target.options.movement) {
      return
    }
    if (!target.options.movement.context) {
      target.options.movement.context = {}
    }
    switch (
      target.options.movement.mode // "Center" | "Around" | "OutOfRange"
    ) {
      case 'Center':
        possub = Matter.Vector.sub({ x: CENTER_X + delta / 4, y: CENTER_Y + delta }, m.position)
        break
      case 'CenterFix':
        const callback = target.options.movement.context.callback
        const offsetX = target.options.movement.context.offsetX | 0
        const offsetY = target.options.movement.context.offsetY | 0
        const desiredPos = {
          x: CENTER_X + offsetX,
          y: CENTER_Y + offsetY
        }
        // const desiredPos = {
        //   x: 0,
        //   y: 0
        // }
        const possubToCenter = Matter.Vector.sub(desiredPos, m.position)
        const switchRage = 200 //px
        if (Math.abs(possubToCenter.x) < switchRage && Math.abs(possubToCenter.y) < switchRage) {
          // 強制移動に切り替え
          target.easingMoveRender(desiredPos.x, desiredPos.y).then(() => {
            if (callback && typeof callback === 'function') {
              callback()
            }
          })
        } else {
          possub = possubToCenter
        }
        break
      case 'Around':
        let relsub = target.options.movement.context.relaub
        if (!relsub) {
          relsub = Matter.Vector.sub({ x: CENTER_X + delta, y: CENTER_Y + delta }, m.position)
          target.options.movement.context.relaub = relsub
        }
        if (relsub.x < 0) {
          if (relsub.y < 0) {
            //右下
            possub = Matter.Vector.sub({ x: WORLD_WIDTH, y: WORLD_HEIGHT }, m.position)
          } else {
            //右上
            possub = Matter.Vector.sub({ x: WORLD_WIDTH, y: 0 }, m.position)
          }
        } else {
          //左
          if (relsub.y < 0) {
            //左下
            possub = Matter.Vector.sub({ x: 0, y: WORLD_HEIGHT }, m.position)
          } else {
            //左上
            possub = Matter.Vector.sub({ x: 0, y: 0 }, m.position)
          }
        }
        break
      case 'OutOfRange':
        // 未実装
        break
      default:
        break
    }
    if (possub) {
      const force = { x: 0.05 * (possub.x > 0 ? +1 : -1), y: 0.05 * (possub.y > 0 ? +1 : -1) }
      Matter.Body.applyForce(m, { x: 1, y: 1 }, force)
      Matter.Body.setAngularVelocity(m, 0)
      Matter.Body.setAngle(m, 0)
    }
    target.syncPosition()
  })
}

/**
 * 必要なリソースを読み込みます
 * @async
 */
export async function loadRequiredResources() {
  try {
    await loadImages({
      quotation_white: '/quotation_white.png',
      author: '/author.png'
    })
  } catch {}
}

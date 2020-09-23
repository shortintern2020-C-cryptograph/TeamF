import { Component, useContext, useEffect } from 'react'
import { initPixi, loader } from '../lib/pixiHelpers'
import { initMatter, stopMatter, registerUpdateCb, initMatterRenderer } from '../lib/matterHelpers'
import { Dialog, DialogDetail, Comment, Spacer, moveAdjust, loadRequiredResources } from '../lib/SPGrahic'
import { getDialog, getDialogDetail } from '../lib/api'
import { createMock } from '../lib/createMock'

class SPCanvas extends Component {
  dialogs
  dialogDetail
  centerSpacer
  comments
  pixi
  matter
  matterRender
  mock
  currentViewMode

  constructor(props) {
    super(props)
    this.dialogs = []
    this.dialogDetail = null
    this.centerSpacer = null
    this.comments = []
    this.pixi = null
    this.matter = null
    this.matterRender = null
    this.mock = null
    this.currentViewMode = 'empty'
  }

  componentDidMount() {
    const self = this
    this.mock = createMock()

    if (typeof window === 'undefined') {
      return
    }
    this.pixi = initPixi(document.getElementById('spMainCanvas'))
    this.matter = initMatter()
    //デバッグ用レンダラー
    // this.matterRender = initMatterRenderer(document.getElementById('spDebugCanvas'), this.matter.engine)

    registerUpdateCb(self.matter.engine, [
      () => {
        if (self.dialogs) {
          moveAdjust(self.pixi, self.matter, self.dialogs)
        }
        if (self.dialogDetail) {
          // moveVectorAdjust([self.dialogDetail])
        }
        if (self.comments) {
          moveAdjust(self.pixi, self.matter, self.comments)
        }
      }
    ])
    this.changeView('listDialog')
  }

  componentWillUnmount() {
    this.mock.shutdown()
    for (let i = 0; i < this.dialogs.length; i++) {
      this.dialogs[i].normalRemoveRender(this.pixi, this.matter.engine.world)
      this.dialogs[i] = null
    }
    this.dialogs = null
    this.pixi = null
    this.matter = null
    this.matterRender = null
    this.mock = null
  }

  async changeView(viewMode, context) {
    const self = this
    const CENTER_X = window.innerWidth / 2
    const CENTER_Y = window.innerHeight / 2
    this.currentViewMode = viewMode
    switch (viewMode) {
      case 'listDialog':
        await loadRequiredResources()

        // リセット -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (this.dialogs.length > 0) {
          this.dialogs.forEach((dialog) => {
            dialog.mountModel(this.matter.engine.world)
            dialog.updateOption({
              movement: {
                mode: 'Center'
              }
            })
          })

          if (this.dialogDetail) {
            this.dialogDetail.normalRemoveRender(this.pixi, this.matter.engine.world)
            this.dialogDetail = null
          }

          if (this.centerSpacer) {
            this.centerSpacer.normalRemoveRender(this.pixi, this.matter.engine.world)
            this.centerSpacer = null
          }

          if (this.comments.length) {
            this.comments.forEach((comment) => {
              comment.normalRemoveRender(this.pixi, this.matter.engine.world)
            })
            this.comments = []
          }

          return
        }
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

        const res = await getDialog({
          genre: 'anime',
          offset: 0,
          limit: 20
        })
        res.schema.forEach((s, i) => {
          const dialog = new Dialog(Math.random() * 0.8 * CENTER_X * 1.1, Math.random() * 0.8 * CENTER_Y * 1.1, {
            dialog: s.content
          })
          dialog.presentation.on('click', () => {
            self.changeView('detailDialog', {
              targetDialog: dialog,
              targetDialogData: s
            })
          })
          window.setTimeout(() => {
            dialog.easingInitRender(this.pixi, this.matter.engine.world)
          }, 100 * i)
          self.dialogs.push(dialog)
        })
        break
      case 'detailDialog':
        if (typeof context === 'undefined') {
          return
        }
        await loadRequiredResources()
        const targetDialog = context.targetDialog
        const targetDialogData = context.targetDialogData
        if (typeof targetDialog === 'undefined' && typeof targetDialogData === 'undefined') {
          return
        }

        console.log(targetDialogData)
        /*----------------.
        | 追加データフェッチ |
        `-----------------*/
        const detailRes = await getDialogDetail(targetDialogData.id, {
          genre: 'all',
          limit: 20,
          offset: 0
        })
        const commentDatas = detailRes.comments

        /*--------.
        | 描画実行 |
        `--------*/
        // セリフ詳細表示オブジェクト
        const makeDialogDetail = () => {
          if (self.dialogDetail) {
            self.dialogDetail.normalRemoveRender(self.pixi, self.matter.engine.world)
            self.dialogDetail = null
          }
          self.dialogDetail = new DialogDetail(
            0,
            300,
            {
              author: targetDialogData.author,
              title: targetDialogData.title,
              source: targetDialogData.link,
              cite: targetDialogData.source
            },
            {
              movement: {
                mode: 'None'
              }
            }
          )
          self.dialogDetail.x =
            CENTER_X + (self.dialogDetail.width - targetDialog.width) / 2 - targetDialog.width / 2 + 10
          self.dialogDetail.y =
            CENTER_Y +
            (self.dialogDetail.height - targetDialog.height) / 2 +
            targetDialog.height -
            targetDialog.height / 2 -
            (self.dialogDetail.height - targetDialog.height - 10) / 2 -
            10
          self.dialogDetail.easingInitRender(self.pixi, self.matter.engine.world)
        }

        // 中央スペーサー
        const makeCenterSpacer = (width, height) => {
          if (self.centerSpacer) {
            return
          }
          self.centerSpacer = new Spacer(
            CENTER_X,
            CENTER_Y,
            {},
            {
              width,
              height
            }
          )
          self.centerSpacer.normalInitRender(this.pixi, this.matter.engine.world)
        }

        // コメント
        const makeComments = () => {
          if (self.comments && self.comments.length > 0) {
            self.comments.forEach((comment) => {
              comment.normalRemoveRender(this.pixi, this.matter.engine.world)
            })
            self.comments = []
          }
          commentDatas.forEach((commentData) => {
            self.comments.push(
              new Comment(Math.random() * CENTER_X * 2, Math.random() * CENTER_Y * 2, {
                comment: commentData.content,
                userName: commentData.user['display_name'],
                userPhoto: '',
                time: '●分前'
              })
            )
          })
          self.comments.forEach((comment) => {
            comment.easingInitRender(this.pixi, this.matter.engine.world)
          })
        }
        self.dialogs.forEach((dialog) => {
          if (dialog == targetDialog) {
            dialog.updateOption({
              movement: {
                mode: 'CenterFix',
                context: {
                  offsetX: -dialog.width / 2,
                  offsetY: -dialog.height / 2,
                  callback: () => {
                    makeDialogDetail()
                    makeCenterSpacer(
                      Math.max(targetDialog.width, self.dialogDetail.width) + 100,
                      targetDialog.height + self.dialogDetail.height + 100
                    )
                    makeComments()
                  }
                }
              }
            })
          } else {
            dialog.updateOption({
              movement: {
                mode: 'OutOfRange'
              }
            })
          }
        })
      default:
        break
    }
  }

  async back() {
    switch (this.currentViewMode) {
      case 'detailDialog':
        this.changeView('listDialog')
        break
      default:
        break
    }
  }

  render() {
    return (
      <>
        <div
          id="spDebugCanvas"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 0
          }}></div>
        <canvas
          id="spMainCanvas"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 1
          }}></canvas>
        <button
          onClick={this.back.bind(this)}
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            padding: '20px',
            zIndex: 2
          }}>
          戻る
        </button>
      </>
    )
  }
}

export default SPCanvas

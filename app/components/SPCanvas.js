import { Component, useContext, useEffect } from 'react'
import { initPixi, loader } from '../lib/pixiHelpers'
import { initMatter, stopMatter, registerUpdateCb } from '../lib/matterHelpers'
import { Dialog, moveVectorAdjust, loadRequiredResources, DialogDetail } from '../lib/SPGrahic'
import { getDialog } from '../lib/api'
import { createMock } from '../lib/createMock'

class SPCanvas extends Component {
  dialogs
  dialogDetail
  pixi
  matter
  mock
  currentViewMode

  constructor(props) {
    super(props)
    this.dialogs = []
    this.dialogDetail = null
    this.pixi = null
    this.matter = null
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

    registerUpdateCb(self.matter.engine, [
      () => {
        if (self.dialogs) {
          moveVectorAdjust(self.dialogs)
        }
        if (self.dialogDetail) {
          // moveVectorAdjust([self.dialogDetail])
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
    this.mock = null
  }

  async changeView(viewMode, context) {
    const self = this
    switch (viewMode) {
      case 'listDialog':
        await loadRequiredResources()
        const res = await getDialog({
          genre: 'anime',
          offset: 0,
          limit: 20
        })
        res.schema.forEach((s, i) => {
          const dialog = new Dialog(
            Math.random() * 0.8 * window.innerWidth + window.innerWidth * 0.1,
            Math.random() * 0.8 * window.innerHeight + window.innerHeight * 0.1,
            {
              dialog: s.content
            }
          )
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
        // targetDialog.updateOption({
        //   movement: {
        //     mode: 'Around',
        //     context: {}
        //   }
        // })
        self.dialogs.forEach((dialog) => {
          if (dialog == targetDialog) {
            dialog.updateOption({
              movement: {
                mode: 'CenterFix',
                context: {
                  offsetX: -dialog.width / 2,
                  offsetY: -dialog.height / 2
                }
              }
            })
          } else {
            dialog.updateOption({
              movement: {
                mode: 'Around'
              }
            })
          }
        })

        // セリフ詳細表示オブジェクト
        if (self.dialogDetail) {
          console.log('test')
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
          window.innerWidth / 2 + (self.dialogDetail.width - targetDialog.width) / 2 - targetDialog.width / 2 + 10
        self.dialogDetail.y =
          window.innerHeight / 2 +
          (self.dialogDetail.height - targetDialog.height) / 2 +
          targetDialog.height -
          targetDialog.height / 2 -
          10
        self.dialogDetail.easingInitRender(self.pixi, self.matter.engine.world)
      default:
        break
    }
  }

  render() {
    return (
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
    )
  }
}

export default SPCanvas

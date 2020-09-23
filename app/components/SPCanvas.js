import { Component, useContext, useEffect } from 'react'
import { initPixi, loader } from '../lib/pixiHelpers'
import { initMatter, stopMatter, registerUpdateCb } from '../lib/matterHelpers'
import { Dialog, moveVectorAdjust, loadRequiredResources } from '../lib/SPGrahic'
import { getDialog } from '../lib/api'
import { createMock } from '../lib/createMock'

class SPCanvas extends Component {
  dialogs
  pixi
  matter
  mock
  currentViewMode

  constructor(props) {
    super(props)
    this.dialogs = []
    this.pixi = null
    this.matter = null
    this.mock = null
    this.currentViewMode = 'empty'
  }

  componentDidMount() {
    const self = this

    if (process.env.NEXT_PUBLIC_ENV === 'MOCK') {
      this.mock = createMock()
    }

    if (typeof window === 'undefined') {
      return
    }
    this.pixi = initPixi(document.getElementById('spMainCanvas'))
    this.matter = initMatter()

    registerUpdateCb(self.matter.engine, [
      () => {
        if (!self.dialogs) return
        moveVectorAdjust(self.dialogs)
      },
      () => {
        if (!self.dialogs) return
        self.dialogs.forEach((d) => {
          d.syncPosition()
        })
      }
    ])
    this.changeView('listDialog')
  }

  componentWillUnmount() {
    if (process.env.NEXT_PUBLIC_ENV === 'MOCK') {
      this.mock.shutdown()
    }
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
        let res
        res = await getDialog({
          genre: 'anime',
          offset: 0,
          limit: 20
        })

        if (!res) return
        res.schema.forEach((s, i) => {
          self.dialogs.push(
            new Dialog(
              Math.random() * 0.8 * window.innerWidth + window.innerWidth * 0.1,
              Math.random() * 0.8 * window.innerHeight + window.innerHeight * 0.1,
              {
                dialog: s.content
              }
            )
          )
        })
        self.dialogs.forEach((dialog, i) => {
          window.setTimeout(() => {
            dialog.easingInitRender(this.pixi, this.matter.engine.world)
          }, 100 * i)
        })
        break
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
          zIndex: -1
        }}></canvas>
    )
  }
}

export default SPCanvas

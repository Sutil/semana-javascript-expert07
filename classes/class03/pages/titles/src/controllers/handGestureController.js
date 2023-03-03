import { prepareRunChecker } from "../../../../lib/shared/util.js"

const { shouldRun: scrollShouldRun }  = prepareRunChecker({timerDelay: 100})
const { shouldRun: clickShouldRun }  = prepareRunChecker({timerDelay: 500})

export default class HandGestureController {

  #camera
  #view
  #service
  #lastDirection = {
    direction: '',
    y: 0
  }

  constructor({view, service, camera}) {
    this.#view = view
    this.#service = service
    this.#camera = camera
  }

  async init() {
    return this.#loop()
  }

  #scrollPage(direction) {
    const pixelsPerScroll = 100

    if(this.#lastDirection.direction === direction) {

      console.log(this.#lastDirection.y, globalThis.screen.availWidth)
      if(direction === 'scroll-down') {
        if(this.#lastDirection.y <= globalThis.screen.availWidth) {
          this.#lastDirection.y += pixelsPerScroll
        }
      } else {
        if(this.#lastDirection.y >= 0) {
          this.#lastDirection.y -= pixelsPerScroll
        }
      }
      
    } else {
      this.#lastDirection.direction = direction
    }

    this.#view.scrollPage(this.#lastDirection.y)
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video)
      this.#view.clearCanvas()
      if(hands?.length) {
        this.#view.drawResults(hands)
      }
      for await(const {event, x, y} of this.#service.detectGestures(hands)) {
        if(event === 'click') {
          if(!clickShouldRun()) continue;
          this.#view.clickOnElement(x, y)
          continue;
        }
        if(event.includes('scroll')) {
          if(!scrollShouldRun()) continue;
          this.#scrollPage(event)
        }
      }
    } catch(error) {
      console.error('estimate hands fail', error)
    }
  }
  
  async #loop() {
    await this.#service.initializeDetector()
    await this.#estimateHands()
    this.#view.loop(this.#loop.bind(this))
  }

  static async initialize(deps) {
    const controller = new HandGestureController(deps)
    return controller.init()
  }
}

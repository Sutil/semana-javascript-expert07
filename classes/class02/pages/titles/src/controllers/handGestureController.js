import { prepareRunChecker } from "../../../../lib/shared/util.js"

const { shouldRun: scrollShouldRun }  = prepareRunChecker({timerDelay: 200})

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
      this.#lastDirection.y = (
        direction === 'scroll-down' 
          ? this.#lastDirection.y + pixelsPerScroll
          : this.#lastDirection.y - pixelsPerScroll
      )
    } else {
      this.#lastDirection.direction = direction
    }

    this.#view .scrollPage(this.#lastDirection.y)
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video)
      for await(const {event, x, y} of this.#service.detectGestures(hands)) {
        console.log(event, x, y)

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

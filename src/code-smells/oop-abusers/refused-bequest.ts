interface Resettable {
  reset(): void
}

interface Controller {
  start(): void

  stop(): void
}

class BaseController implements Controller, Resettable {
  start(): void {
    console.log('starting')
  }

  stop(): void {
    console.log('stopping')
  }

  reset(): void {
    console.log('resetting')
  }
}

export class ReadOnlyController implements Controller {
  start(): void {
  }

  stop(): void {
  }
}

export function demoRefusedBequest(readonly: boolean): void {
  const controller: Controller = readonly ? new ReadOnlyController() : new BaseController()
  controller.start()
  controller.stop()
}

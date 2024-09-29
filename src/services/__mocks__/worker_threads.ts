export class Worker {
  constructor(public url: string, public options: any) {}
  postMessage(message: any) {}
  onmessage(e: any) {}
  terminate() {}
}

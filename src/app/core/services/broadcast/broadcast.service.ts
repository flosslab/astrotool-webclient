import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private channel = new BroadcastChannel('shared_channel');

  constructor() {
  }

  sendMessage(message: any) {
    this.channel.postMessage(message);
  }

  onMessage(callback: (message: any) => void) {
    this.channel.onmessage = (event) => callback(event.data);
  }
}

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CloseWarningService {
  private showModalSignal = signal<boolean>(false);
  private resolveFn: ((value: boolean) => void) | null = null;

  get showModal() {
    console.log('showmodal', this.showModalSignal);
    return this.showModalSignal;
  }

  async confirmClose(): Promise<boolean> {
    this.showModalSignal.set(true);
    return new Promise((resolve) => (this.resolveFn = resolve));
  }

  handleResponse(shouldClose: boolean) {
    this.showModalSignal.set(false);
    this.resolveFn?.(shouldClose);
  }
}

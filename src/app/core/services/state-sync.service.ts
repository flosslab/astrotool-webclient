import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject} from "rxjs";

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class StateSyncService {
  private stateSource = new BehaviorSubject<any>({});
  public state$ = this.stateSource.asObservable();

  constructor(private zone: NgZone) {
    if (window?.electronAPI) {
      // Ascolta gli aggiornamenti dal processo principale
      window?.electronAPI.on('state-updated', (data: any) => {
        console.log('state-updated',data);
        this.zone.run(() => {
          this.stateSource.next(data);
        });
      });
    }
  }

  // Aggiorna lo stato e notifica il processo principale
  updateState(newState: any) {
    this.stateSource.next(newState);

    if (window?.electronAPI) {
      console.log('updateState', newState);
      window?.electronAPI.send('update-state', newState);
    }
  }
}

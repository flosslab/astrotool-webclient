import {Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {Params, Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
import {StorageService} from "@services/storage/storage.service";
import {BehaviorSubject, tap} from "rxjs";

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private settingsSubject = new BehaviorSubject<{}>({});
  private channelSettings = new BroadcastChannel('settings-channel');
  public isLoading: WritableSignal<boolean> = signal(false);


  constructor(
    private router: Router,
    private translateService: TranslateService,
    private storageService: StorageService,
  ) {
    this.channelSettings.onmessage = (event: MessageEvent) => {
      const settings = event.data.settings;
      this.updateSettings(settings);
    }

    this.settingsSubject
      .pipe(
        tap((settings) => {
            this.handleLanguageChange(settings)
          }
        )
      )
      .subscribe();
  }

  async initialize() {
    this.translateService.addLangs(['it', 'en']);

    await this.storageService.init();
    const settings = await this.storageService.get('settings');
    this.updateSettings(settings);
  }

  openWindow(
    position: string,
    queryParams: Params = {},
    options: OpenOptionType = {
      height: window.innerHeight,
      width: window.innerWidth,
      toolbar: 0,
      location: 0,
      menubar: 0
    }) {
    console.warn('<UNK>');
    if (window?.electronAPI) {
      console.log('open', position, options);
      window?.electronAPI.send('open-window', position, options);
    } else {
      const urlTree = this.router.createUrlTree([position], { queryParams });
      const url = '/#' + this.router.serializeUrl(urlTree);
      const _options = Object.entries(options).map((value) => value.join('=')).join(',');
      window.open(url, '_blank', _options);
      console.warn('open', url, _options)
    }
  }

  updateSettings(values: {}) {
    const newSettings = {...this.settingsSubject.getValue(), ...values,};
    this.settingsSubject.next(newSettings);
    this.storageService.set('settings', newSettings);
  }

  setSession(sessionId: any) {
    this.storageService.set('sessionId', sessionId);
  }

  async getSession() {
    return this.storageService.get('sessionId');
  }

  setProcess(processId: any) {
    this.storageService.set('processId', processId);
  }

  async getProcess() {
    return this.storageService.get('processId');
  }

  private handleLanguageChange(settings: any) {
    console.log('handleLanguageChange', settings);
    this.translateService.use(settings.lang);
  }
}

type OpenOptionType = {
  height: number;
  width: number;
  toolbar: boolean | number;
  location: boolean | number;
  menubar: boolean | number;
}

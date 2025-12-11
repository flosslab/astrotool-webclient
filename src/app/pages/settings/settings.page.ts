import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonList,
  IonMenu,
  IonNav,
  IonSplitPane,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {TranslatePipe} from "@ngx-translate/core";
import {SettingGeneralComponent} from "@components/setting-general/setting-general.component";
import {SettingExtraComponent} from "@components/setting-extra/setting-extra.component";
import {SettingRemoteComponent} from "@components/setting-remote/setting-remote.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSplitPane,
    IonMenu,
    IonList,
    IonLabel,
    TranslatePipe,
    IonButton,
    IonNav,
    IonNav,
    IonNav
  ]
})
export class SettingsPage implements AfterViewInit {
  @ViewChild('settingNav') private nav!: IonNav;
  private settings : any = {
    general: SettingGeneralComponent,
    remote: SettingRemoteComponent,
    extra: SettingExtraComponent,
  }
  public currentSettings: string = 'general';

  constructor() {
  }

  ngAfterViewInit() {
    this.openSettings(this.currentSettings);
  }

  openSettings(type: string) {
    this.currentSettings = type;
    this.nav.setRoot(this.settings[this.currentSettings]);
  }

  handleHighlight(type: string) {
    return this.currentSettings === type ? 'primary' : 'light';
  }

  get getSettingsKeys() {
    return Object.keys(this.settings);
  }
}

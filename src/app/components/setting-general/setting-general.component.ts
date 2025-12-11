import {Component, ViewChild} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {SettingsButtonsComponent} from "@components/settings-buttons/settings-buttons.component";
import {StorageService} from "@services/storage/storage.service";

@Component({
  selector: 'app-setting-general',
  templateUrl: './setting-general.component.html',
  styleUrls: ['./setting-general.component.scss'],
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    TranslatePipe,
    IonList,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    SettingsButtonsComponent
  ]
})
export class SettingGeneralComponent {
  @ViewChild('languageSelect') languageSelect!: IonSelect;
  languageList: string[];
  private readonly defaultSettings: {
    lang: string;
  } = {
    lang: 'en',
  };
  currentLang: any;
  public generalForm = this.fb.group({
      lang: [''],
    }
  )
  private settingsChannel = new BroadcastChannel('settings-channel');
  private storedSettings: {
    lang: string | null;
  } = this.defaultSettings;

  constructor(
    private translateService: TranslateService,
    private storageService: StorageService,
    private fb: FormBuilder,
  ) {
    this.storageService.get('settings')
      .then((settings) => {
        const lang = settings.lang;
        const generalSettings = { lang };

        this.storedSettings = generalSettings;

        this.generalForm.patchValue({
          lang: generalSettings.lang ?? this.defaultSettings.lang,
        });

        this.currentLang = generalSettings.lang;
      });

    this.languageList = this.translateService.getLangs();
    this.currentLang = this.translateService.currentLang;
    this.generalForm.patchValue({lang: this.currentLang});
    console.log(this.currentLang);
  }

  get areSaveAndCancelEnabled() {
    if(!this.languageSelect) {
      return false;
    }

    return this.languageSelect.value !== this.storedSettings.lang;
  }

  get isResetEnabled() {
    if(!this.languageSelect) {
      return false;
    }

    return this.languageSelect.value !== this.defaultSettings.lang;
  }

  setSettings() {
    this.currentLang = this.languageSelect.value;
    this.settingsChannel.postMessage({
      settings: this.generalForm.getRawValue()
    });
    this.storedSettings = {...this.storedSettings, lang: this.currentLang};
  }

  cancelSettings() {
    this.generalForm.patchValue({
      lang: this.storedSettings.lang,
    });
    this.languageSelect.value = this.storedSettings.lang;
  }

  resetSettings() {
    this.generalForm.patchValue({
      lang: this.defaultSettings.lang,
    });
    this.languageSelect.value = this.defaultSettings.lang;

    const newSettings = this.generalForm.getRawValue();

    this.settingsChannel.postMessage({
      settings: {
       lang: newSettings.lang,
      }
    });

    this.storedSettings = newSettings;
  }
}

import { Component } from '@angular/core';
import {IonContent, IonHeader, IonInput, IonItem, IonList, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {SettingsButtonsComponent} from "@components/settings-buttons/settings-buttons.component";
import {StorageService} from "@services/storage/storage.service";

@Component({
    selector: 'app-setting-extra',
    templateUrl: './setting-extra.component.html',
    styleUrls: ['./setting-extra.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonList,
    IonTitle,
    IonToolbar,
    TranslatePipe,
    ReactiveFormsModule,
    SettingsButtonsComponent,
    IonInput,
    IonItem,
  ]
})
export class SettingExtraComponent {
  // Default settings
  private readonly defaultSettings : {
    threeDMaxSize: string | null,
    glyphMax: string | null,
  } = {
    threeDMaxSize: '1024',
    glyphMax: '2147483647'
  }

  // Form
  public extraForm = this.fb.group({
    // 3D
    threeDMaxSize: [''],
    // Glyph
    glyphMax: ['']
  })
  private settingsChannel = new BroadcastChannel('settings-channel');

  // 3D
  threeDMaxSize: number = 0;

  // Glyph
  glyphMax: number = 0;

  // Status
  private storedSettings: {
    threeDMaxSize: string | null,
    glyphMax: string | null,
  } = this.defaultSettings;

  constructor(
    private storageService: StorageService,
    private fb: FormBuilder,
  ) {
    this.storageService.get('settings')
      .then((settings) => {
        const extraSettings = settings.extra;

        this.storedSettings = extraSettings;

        this.patchFormValues(extraSettings);
        this.applyFormValues();
      });
  }

  private setFormValues(values: {threeDMaxSize: string | null, glyphMax: string | null}) {
    // 3D
    this.threeDMaxSize = values.threeDMaxSize ? +values.threeDMaxSize : 0;

    // Glyph
    this.glyphMax = values.glyphMax ? +values.glyphMax : 0;
  }

  private get getFormValues() {
    return this.extraForm.getRawValue();
  }

  private applyFormValues() {
    this.setFormValues(this.getFormValues);
  }

  private patchFormValues(values: {threeDMaxSize: string | null, glyphMax: string | null}) {
    this.extraForm.patchValue({
      // 3D
      threeDMaxSize: values?.threeDMaxSize ?? this.defaultSettings.threeDMaxSize,
      // Glyph
      glyphMax: values?.glyphMax ?? this.defaultSettings.glyphMax,
    });
  }

  private updateSettings() {
    const newSettings = this.getFormValues;

    this.settingsChannel.postMessage({
      settings: {
        extra: newSettings
      }
    });

    this.storedSettings = newSettings;
  }

  private areTheSameSettings(comparison: {
    threeDMaxSize: string | null,
    glyphMax: string | null
  }) {
    const currentSettings = this.getFormValues;

    return currentSettings.threeDMaxSize === comparison.threeDMaxSize
      && currentSettings.glyphMax === comparison.glyphMax;
  }

  get areSaveAndCancelEnabled() {
    return !this.areTheSameSettings(this.storedSettings);
  }

  get isResetEnabled() {
    return !this.areTheSameSettings(this.defaultSettings);
  }

  saveSettings() {
    this.applyFormValues();
    this.updateSettings();
  }

  cancelSettings() {
    this.patchFormValues(this.storedSettings);
    this.setFormValues(this.storedSettings);
  }

  resetSettings() {
    this.patchFormValues(this.defaultSettings);
    this.setFormValues(this.defaultSettings);
    this.updateSettings();
  }
}

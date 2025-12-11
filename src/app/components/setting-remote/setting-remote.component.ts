import {Component} from '@angular/core';
import {
  IonButton, IonCheckbox,
  IonContent,
  IonHeader, IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {SettingsButtonsComponent} from "@components/settings-buttons/settings-buttons.component";
import {StorageService} from "@services/storage/storage.service";
import {addIcons} from "ionicons";
import {folderOutline} from "ionicons/icons";

@Component({
  selector: 'app-setting-remote',
  templateUrl: './setting-remote.component.html',
  styleUrls: ['./setting-remote.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonList,
    IonTitle,
    IonToolbar,
    TranslatePipe,
    IonButton,
    IonInput,
    IonItem,
    IonCheckbox,
    IonIcon,
    SettingsButtonsComponent,
    ReactiveFormsModule
  ]
})
export class SettingRemoteComponent {
  private readonly defaultSettings : {
    tilePath: string | null,
    tileIsOnline: string | null,
    tileUrl: string | null,
    vlkbMainUrl: string | null,
    vlkbTapUrl: string | null,
    vlkbSearchWhenLoadingLocalData: string | null,
    caesarApiEndpoint: string | null,
  } = {
    tilePath: "",
    tileIsOnline: "false",
    tileUrl: "http://vlkb.ia2.inaf.it/panoramicview/openlayers.html",
    vlkbMainUrl: "https://vlkb.ia.infa.it:8443/vlkb/datasets",
    vlkbTapUrl: "https://ia2-vialactea.oats.inaf.it:8080/vlkb",
    vlkbSearchWhenLoadingLocalData: "false",
    caesarApiEndpoint: "https://caesar-api.neanias.eu/caesar/api/v1.0"
  };

  // Form
  public remoteForm = this.fb.group({
    // Tile
    tilePath: [''],
    tileIsOnline: [''],
    tileUrl: [''],
    // VLKB
    vlkbMainUrl: [''],
    vlkbTapUrl: [''],
    vlkbSearchWhenLoadingLocalData: [''],
    // CAESAR
    caesarApiEndpoint: ['']
  });
  private settingsChannel = new BroadcastChannel('settings-channel');

  // Tile
  tilePath: string | null = "";
  tileIsOnline: boolean = false;
  tileUrl: string | null = "";

  // VLKB
  vlkbAuthenticated: boolean = false;
  vlkbMainUrl: string | null = "";
  vlkbTapUrl: string | null = "";
  vlkbSearchWhenLoadingLocalData: boolean = false;

  // CAESAR
  caesarAuthenticated: boolean = false;
  caesarApiEndpoint: string | null = "";

  // Status
  private storedSettings: {
    tilePath: string | null,
    tileIsOnline: string | null,
    tileUrl: string | null,
    vlkbMainUrl: string | null,
    vlkbTapUrl: string | null,
    vlkbSearchWhenLoadingLocalData: string | null,
    caesarApiEndpoint: string | null,
  } = this.defaultSettings;

  constructor(
    private storageService: StorageService,
    private fb: FormBuilder,
  ) {
    addIcons({folderOutline});

    this.storageService.get('settings')
      .then((settings) => {
        const remoteSettings = settings.remote;

        this.storedSettings = remoteSettings;

        this.patchFormValues(remoteSettings);
        this.applyFormValues();
      })
  }

  // Tile
  updateTileIsOnline() {
    this.tileIsOnline = !this.tileIsOnline;

    this.remoteForm.patchValue({
      tileIsOnline: this.tileIsOnline.toString()
    })
  }

  startBrowseLocalFoldersHandler() {
    document.getElementById("explore-tile-path")!.click();
  }

  endBrowseLocalFoldersHandler(event: any) {
    console.log(event);

    const path = event.target.value;

    console.log(path);

    if(!!path) {
      this.tilePath = path;

      this.remoteForm.patchValue({
        tilePath: path
      });
    }
  }

  // VLKB
  updateVlkbSearchWhenLoadingLocalData() {
    this.vlkbSearchWhenLoadingLocalData = !this.vlkbSearchWhenLoadingLocalData;

    this.remoteForm.patchValue({
      vlkbSearchWhenLoadingLocalData: this.vlkbSearchWhenLoadingLocalData.toString()
    })
  }

  vlkbSignIn() {
    this.updateVlkbAuthenticated(true);
  }

  vlkbSignUp() {
    this.updateVlkbAuthenticated(true);
  }

  vlkbSignOut() {
    this.updateVlkbAuthenticated(false);
  }

  private updateVlkbAuthenticated(authenticated: boolean) {
    this.vlkbAuthenticated = authenticated;
  }

  // CAESAR
  caesarSignIn() {
    this.updateCaesarAuthenticated(true);
  }

  caesarSignUp() {
    this.updateCaesarAuthenticated(true);
  }

  caesarSignOut() {
    this.updateCaesarAuthenticated(false);
  }

  private updateCaesarAuthenticated(authenticated: boolean) {
    this.caesarAuthenticated = authenticated;
  }

  // Form
  private setFormValues(values: {
    tilePath: string | null,
    tileIsOnline: string | null,
    tileUrl: string | null,
    vlkbMainUrl: string | null,
    vlkbTapUrl: string | null,
    vlkbSearchWhenLoadingLocalData: string | null,
    caesarApiEndpoint: string | null
  }) {
    // Tile
    this.tilePath = values.tilePath;
    this.tileIsOnline = values.tileIsOnline?.toLowerCase() === "true";
    this.tileUrl = values.tileUrl;

    // VLKB
    this.vlkbMainUrl = values.vlkbMainUrl;
    this.vlkbTapUrl = values.vlkbTapUrl;
    this.vlkbSearchWhenLoadingLocalData = values.vlkbSearchWhenLoadingLocalData?.toLowerCase() === "true";

    // CAESAR
    this.caesarApiEndpoint = values.caesarApiEndpoint;
  }

  private get getFormValues() {
    return this.remoteForm.getRawValue();
  }

  private applyFormValues() {
    this.setFormValues(this.getFormValues);
  }

  private patchFormValues(values: {
    tilePath: string | null,
    tileIsOnline: string | null,
    tileUrl: string | null,
    vlkbMainUrl: string | null,
    vlkbTapUrl: string | null,
    vlkbSearchWhenLoadingLocalData: string | null,
    caesarApiEndpoint: string | null
  }) {
    this.remoteForm.patchValue({
      // Tile
      tilePath: values?.tilePath ?? this.defaultSettings.tilePath,
      tileIsOnline: values?.tileIsOnline ?? this.defaultSettings.tileIsOnline,
      tileUrl: values?.tileUrl ?? this.defaultSettings.tileUrl,
      // VLKB
      vlkbMainUrl: values?.vlkbMainUrl ?? this.defaultSettings.vlkbMainUrl,
      vlkbTapUrl: values?.vlkbTapUrl ?? this.defaultSettings.vlkbTapUrl,
      vlkbSearchWhenLoadingLocalData: values?.vlkbSearchWhenLoadingLocalData ?? this.defaultSettings.vlkbSearchWhenLoadingLocalData,
      // CAESAR
      caesarApiEndpoint: values?.caesarApiEndpoint ?? this.defaultSettings.caesarApiEndpoint,
    });
  }

  private updateSettings() {
    const newSettings = this.getFormValues;

    this.settingsChannel.postMessage({
      settings: {
        remote: newSettings
      }
    });

    this.storedSettings = newSettings;
  }

  private areTheSameSettings(comparison: {
    tilePath: string | null,
    tileIsOnline: string | null,
    tileUrl: string | null,
    vlkbMainUrl: string | null,
    vlkbTapUrl: string | null,
    vlkbSearchWhenLoadingLocalData: string | null,
    caesarApiEndpoint: string | null,
  }) {
    const currentSettings = this.getFormValues;

    return currentSettings.tilePath === comparison.tilePath
      && currentSettings.tileIsOnline === comparison.tileIsOnline
      && currentSettings.tileUrl === comparison.tileUrl
      && currentSettings.vlkbMainUrl === comparison.vlkbMainUrl
      && currentSettings.vlkbTapUrl === comparison.vlkbTapUrl
      && currentSettings.vlkbSearchWhenLoadingLocalData === comparison.vlkbSearchWhenLoadingLocalData
      && currentSettings.caesarApiEndpoint === comparison.caesarApiEndpoint
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

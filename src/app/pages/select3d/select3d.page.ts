import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {folderOpenOutline} from "ionicons/icons";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-select3d',
  templateUrl: './select3d.page.html',
  styleUrls: ['./select3d.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonRow, IonInput,
    IonButton, ReactiveFormsModule, IonCol, IonCheckbox, IonIcon, TranslatePipe]
})
export class Select3dPage implements OnInit {
  select3dForm: FormGroup

  constructor(
    private fb: FormBuilder,
  ) {
    addIcons({folderOpenOutline});

    this.select3dForm = this.fb.group({
      'vlkb-url': ['https://vlkb.ia2.inaf.it/tap', []],
      'min-longitude': [0, []],
      'max-longitude': [360, []],
      'min-latitude': [-1, []],
      'max-latitude': [1, []],
      'save-to-disk': [false, []],
      'output-prefix-name': new FormControl({value: '', disabled: true})
    });

    this.select3dForm.get('save-to-disk')?.valueChanges.subscribe((value) => {
      if(value) {
        this.select3dForm.get('output-prefix-name')?.enable();
      }
      else {
        this.select3dForm.get('output-prefix-name')?.disable();
      }
    });
  }

  ngOnInit() {
  }

  connectToVLKBurlHandler() {
    console.log('Connecting to ' + this.select3dForm.getRawValue()['vlkb-url']);
  }

  get isSaveToDiskEnabled() {
    return this.select3dForm.getRawValue()['save-to-disk'] as boolean;
  }

  openFolderHandler() {
    console.log('Opening folder...');
  }

  queryHandler() {
    console.log('Querying with parameters: ', this.select3dForm.getRawValue());
  }
}

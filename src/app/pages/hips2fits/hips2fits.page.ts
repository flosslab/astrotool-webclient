import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {TranslatePipe} from "@ngx-translate/core";
import {ApiService} from "@services/api/api.service";
import {forkJoin, take, tap} from "rxjs";
import {addIcons} from "ionicons";
import {chevronDownSharp, chevronUpSharp} from "ionicons/icons";

@Component({
  selector: 'app-hips2fits',
  templateUrl: './hips2fits.page.html',
  styleUrls: ['./hips2fits.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonRow, IonInput,
    ReactiveFormsModule, IonCol, IonButton, TranslatePipe, IonSelect, IonSelectOption]
})
export class Hips2fitsPage implements OnInit {
  hips2fitsForm: FormGroup;
  coordsSysValues = ['icrs', 'galactic'];
  formatValues = ['fits', 'jpg', 'png'];
  stretchValues = ['linear', 'power', 'sqrt', 'log', 'asinh'];
  hipsSurveyValues: string[] = [];
  projectionValues: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
    addIcons({chevronDownSharp, chevronUpSharp});

    this.hips2fitsForm = this.fb.group({
      'hips': ['', []],
      'width': [0, []],
      'height': [0, []],
      'ra': [0, []],
      'dec': [0, []],
      'projection': ['', []],
      'fov': [0.5, []],
      'coordsys': [this.coordsSysValues[0], []],
      'rotation_angle': [0, []],
      'format': [this.formatValues[0], []],
      'min_cut': new FormControl({value: 0.5, disabled: true}),
      'max_cut': new FormControl({value: 99.5, disabled: true}),
      'stretch': new FormControl({value: this.stretchValues[0], disabled: true})
    });

    this.hips2fitsForm.get('format')?.valueChanges.subscribe(() => {
      if (this.isFormatFits) {
        this.hips2fitsForm.get('min_cut')?.disable();
        this.hips2fitsForm.get('max_cut')?.disable();
        this.hips2fitsForm.get('stretch')?.disable();
      } else {
        this.hips2fitsForm.get('min_cut')?.enable();
        this.hips2fitsForm.get('max_cut')?.enable();
        this.hips2fitsForm.get('stretch')?.enable();
      }
    });
  }

  ngOnInit() {
    forkJoin({
      projectionValues: this.apiService.getHips2FitsPayloadProjections(),
      hipsSurveyValues: this.apiService.getHips2FitsPayloadSurveys()
    }).pipe(
      take(1),
      tap(({hipsSurveyValues, projectionValues}) => {
        this.hipsSurveyValues = hipsSurveyValues;
        this.projectionValues = projectionValues;
        this.hips2fitsForm.patchValue({
          'hips': hipsSurveyValues[0],
          'projection': projectionValues[0]
        })
      })).subscribe();
  }

  // The following methods are needed because ion-select won't update the displayed value when the language changes
  // until it's selected again, or by using these methods to set selectedText on the corresponding ion-select
  // (this will force them to update the translated text)

  get getCoordsSysValue() {
    return this.hips2fitsForm.getRawValue()['coordsys'];
  }
  get getFormatValue() {
    return this.hips2fitsForm.getRawValue()['format'];
  }

  get getStretchValue() {
    return this.hips2fitsForm.getRawValue()['stretch'];
  }

  get isFormatFits() {
    return this.getFormatValue === 'fits';
  }

  downloadHandler() {
    const data = this.hips2fitsForm.getRawValue();
    this.apiService.getHips2Fits(data)
      .subscribe((res: Blob) => {
        const url = URL.createObjectURL(res);
        const link = document.createElement('a');
        const filename = "hips2fits" + Object.entries(data).map(([key, value]) => `__${key}_${value}`).join("") + ".fits"
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      })
  }
}

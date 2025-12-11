import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {addIcons} from "ionicons";
import {chevronDownSharp, chevronUpSharp} from "ionicons/icons";

@Component({
  selector: 'app-cone-search',
  templateUrl: './cone-search.page.html',
  styleUrls: ['./cone-search.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslatePipe, IonCol, IonGrid,
    IonInput, IonRow, IonSelect, IonSelectOption, ReactiveFormsModule, IonButton]
})
export class ConeSearchPage implements OnInit {
  verbosityValues = ['low', 'default', 'high'];
  coneSearchForm: FormGroup = this.fb.group({
    'coneURL': ['', []],
    'ra': [0, []],
    'dec': [0, []],
    'radius': [0, []],
    'verbosity': ['default', []],
  });

  constructor(
    private fb: FormBuilder,
  ) {
    addIcons({chevronDownSharp, chevronUpSharp});
  }

  ngOnInit() {
  }

  get getVerbosityValue() {
    return this.coneSearchForm.getRawValue()['verbosity'];
  }

  searchHandler() {
    console.log(this.coneSearchForm.getRawValue());
  }

  sodaCutoutHandler() {
    console.log('SODA cutout: Click');
  }
}

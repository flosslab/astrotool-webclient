import { Component, OnInit } from '@angular/core';
import {IonCol, IonGrid, IonRow} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {apertureOutline, eyeOutline} from "ionicons/icons";
import {FilamentListComponent} from "@components/vlkb-output/filaments/filament-list/filament-list.component";

type FilamentsRow = {
  color: string;
  label: string;
}

@Component({
    selector: 'app-filaments',
    templateUrl: './filaments.component.html',
    styleUrls: ['./filaments.component.scss'],
  imports: [
    IonCol,
    IonGrid,
    IonRow,
    FilamentListComponent
  ]
})
export class FilamentsComponent  implements OnInit {
  private filamentsRows: FilamentsRow[] = [
    {
      color: "#FFFF5A",
      label: "Hi-GAL 160 um Source Designation"
    },
    {
      color: "#FF5ABD",
      label: "Bokocam GPS 1.1mm Source Designation"
    },
    {
      color: "#BAFF5A",
      label: "Hi-GAL 350 um Source Designation"
    },
    {
      color: "#006379",
      label: "ATLASGAL 870 um Source Des124 980"
    },
    {
      color: "#87BA78",
      label: "Hi-GAL 70 um Source Designation"
    },
    {
      color: "#FF7C1F",
      label: "MSX Source Designation"
    },
    {
      color: "#3FCDD2",
      label: "Hi-GAL 70 um Source Designation"
    },
    {
      color: "#C63FD2",
      label: "MSX Source Designation"
    },
  ];

  visibleIndices: number[] = [0];

  constructor() {
    addIcons({apertureOutline, eyeOutline});
  }

  ngOnInit() {
  }

  apertureHandler(index: number) {
    console.log('TODO Aperture for the', index, 'element of filaments');
  }

  isVisible(index: number) {
    return this.visibleIndices.includes(index);
  }

  toggleVisible(index: number) {
    if(this.isVisible(index)) {
      this.visibleIndices = this.visibleIndices.filter((element) => element !== index);
    }
    else {
      this.visibleIndices.push(index);
    }
  }

  get getFirstHalfFilamentRows() {
    return this.filamentsRows.filter((element, index) => index < this.filamentsRows.length / 2);
  }

  get getFirstHalfFilamentsRowsLength() {
    return this.getFirstHalfFilamentRows.length;
  }

  get getSecondHalfFilamentRows() {
    return this.filamentsRows.filter((element) => !this.getFirstHalfFilamentRows.includes(element));
  }
}

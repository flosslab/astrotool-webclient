import {Component, Input, OnInit} from '@angular/core';
import {IonButton, IonCol, IonGrid, IonIcon, IonRow} from "@ionic/angular/standalone";
import {NgClass} from "@angular/common";
import {addIcons} from "ionicons";
import {apertureOutline, eyeOutline} from "ionicons/icons";

type FilamentsRow = {
  color: string;
  label: string;
}

@Component({
  selector: 'app-filament-list',
  templateUrl: './filament-list.component.html',
  styleUrls: ['./filament-list.component.scss'],
  imports: [
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    NgClass,
    IonGrid
  ]
})
export class FilamentListComponent  implements OnInit {
  @Input() filaments: FilamentsRow[] = [];
  @Input() offsetLength: number = 0;
  @Input() swapEvenAndOdd: boolean = false;
  @Input() apertureHandler: (index: number) => void = (index: number) => {
  };
  @Input() isVisible: (index: number) => boolean = (index: number) => false;
  @Input() toggleVisible: (index: number) => void = (index: number) => {
  };

  constructor() {
    addIcons({apertureOutline, eyeOutline})
  }

  ngOnInit() {
  }

  getFilamentBoxColor(color: string) {
    return 'background-color: ' + color + ';';
  }
}

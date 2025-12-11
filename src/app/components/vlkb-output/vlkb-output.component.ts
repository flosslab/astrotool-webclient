import {Component, input, OnInit} from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {chevronDown, closeCircle} from "ionicons/icons";
import {TranslatePipe} from "@ngx-translate/core";
import {SelectSourcesComponent} from "@components/vlkb-output/select-sources/select-sources.component";
import {FilamentsComponent} from "@components/vlkb-output/filaments/filaments.component";
import {AllSourcesComponent} from "@components/vlkb-output/all-sources/all-sources.component";

@Component({
  selector: 'app-vlkb-output',
  templateUrl: './vlkb-output.component.html',
  styleUrls: ['./vlkb-output.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
    IonContent,
    IonAccordionGroup,
    IonAccordion,
    IonLabel,
    IonItem,
    TranslatePipe,
    SelectSourcesComponent,
    FilamentsComponent,
    AllSourcesComponent
  ]
})
export class VlkbOutputComponent  implements OnInit {
  public isOpen = input(false);
  public onClose = input(() => {
  });

  constructor() {
    addIcons({chevronDown, closeCircle});
  }

  ngOnInit() {
  }

  closeModalHandler() {
    this.onClose()();
  }
}

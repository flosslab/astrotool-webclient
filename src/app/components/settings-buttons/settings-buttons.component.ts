import {Component, Input, OnInit} from '@angular/core';
import {IonButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-settings-buttons',
    templateUrl: './settings-buttons.component.html',
    styleUrls: ['./settings-buttons.component.scss'],
    imports: [
        IonButton,
        TranslatePipe
    ]
})
export class SettingsButtonsComponent  implements OnInit {
  @Input({required: true}) onSave : () => void = () => {};
  @Input({required: true}) onCancel : () => void = () => {};
  @Input({required: true}) onReset : () => void = () => {};
  @Input({required: true}) saveAndCancelEnabled : boolean = true;
  @Input({required: true}) resetEnabled : boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

   get isAnyShown() {
    return this.saveAndCancelEnabled || this.resetEnabled;
  }

   get getSaveAndCancelButtonColor() {
    return this.saveAndCancelEnabled ? "primary" : "medium"
  }
}

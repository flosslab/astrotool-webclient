import {Component, input, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-import-remote-file',
    templateUrl: './import-remote-file.component.html',
    styleUrls: ['./import-remote-file.component.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar,
    TranslatePipe,
    IonInput,
    IonRow,
    IonCol
  ]
})
export class ImportRemoteFileComponent  implements OnInit {
  public isOpen = input(false);
  public onClose = input(() => {});
  private url: string | null | undefined = undefined;

  constructor() {
  }

  ngOnInit() {
  }

  closeModalHandler() {
    this.url = undefined;

    this.onClose()();
  }

  setUrl(url: string | number | null | undefined) {
    if(url === undefined || url === null) {
      this.url = url;
    }
    else {
      this.url = url.toString();
    }
  }

  get isImportButtonValid() {
    if(!!this.url && this.url.length > 0) {
      const regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
      // /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

      return regex.test(this.url);
    }

    return false;
  }

  importFileHandler() {
    // TODO also import the actual file at the given url

    this.closeModalHandler();
  }
}

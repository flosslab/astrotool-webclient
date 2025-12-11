import {Component, input, OnInit, SecurityContext} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {DomSanitizer} from '@angular/platform-browser';
import {TranslatePipe} from "@ngx-translate/core";
import {DragDropDirective} from "@app/core/directives/drag-drop.directive";
import {addIcons} from "ionicons";
import {folderOutline} from "ionicons/icons";
import {AsyncPipe, NgClass} from "@angular/common";
import {VtkWsLinkService} from "@services/vtk-ws-link/vtk-ws-link.service";
import {AlertInfoComponent} from "@components/alert-info/alert-info.component";
import {from, Observable, of, switchMap, tap} from "rxjs";
import {SystemService} from "@services/system/system.service";

@Component({
  selector: 'app-import-local-file',
  templateUrl: './import-local-file.component.html',
  styleUrls: ['./import-local-file.component.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonHeader,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar,
    TranslatePipe,
    DragDropDirective,
    IonRow,
    NgClass,
    AlertInfoComponent,
    AsyncPipe
  ]
})
export class ImportLocalFileComponent implements OnInit {
  public isOpen = input(false);
  public onClose = input(() => {
  });
  isDragDropOvered: boolean = false;
  public uploadFileStatus: Observable<any> = of({isOpen: false, totalChunks: 0, chunkIndex: 0});
  private file: File | null | undefined = undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private vtkWsLinkService: VtkWsLinkService,
    private systemService: SystemService,
  ) {
    addIcons({folderOutline});
  }

  get isImportButtonValid() {
    if (!!this.file) {
      return this.file.name.endsWith(".fit")
        || this.file.name.endsWith(".fits");
    }

    return false;
  }

  get hasFile() {
    return !!this.file;
  }

  get getFileName() {
    return this.file!.name;
  }

  ngOnInit() {
  }

  closeModalHandler() {
    this.file = undefined;

    this.onClose()();
  }

  startBrowseLocalFoldersHandler() {
    document.getElementById("file-upload")!.click();
  }

  endBrowseLocalFoldersHandler(event: any) {
    this.setFile(event.target.files[0]);
    this.importFileHandler();
  }

  dragAndDropFilesHandler(files: File[]) {
    this.setFile(files[0]);
  }

  setDragDropOvered(value: boolean) {
    this.isDragDropOvered = value;
  }

  importFileHandler() {
    const url = this.sanitizer.sanitize(SecurityContext.URL, window.URL.createObjectURL(this.file!));

    debugger;
    this.uploadFileStatus = this.vtkWsLinkService.uploadFile(this.file!, 10);

    const sub = this.uploadFileStatus
      .pipe(
        switchMap((x: any) => {
          if (x.status === 'completed') {
            console.log(x, this.file!.name);
            return from(this.vtkWsLinkService.call("create.process", {
                resource: {
                  filename: this.file!.name,
                  type: 'upload'
                }
              })
            ).pipe(
              tap((y) => {
                this.systemService.openWindow(`data-view/${y.processId}`);
                this.closeModalHandler();
                sub.unsubscribe();
              }));
          } else {
            return of(x)
          }
        }),
      ).subscribe();
  }

  private setFile(file: File) {
    if (file.name.endsWith(".fit") || file.name.endsWith(".fits")) {
      this.file = file;
    }
  }
}

import { Component, input, OnInit, ViewEncapsulation } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon, IonRippleEffect,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { NgClass } from "@angular/common";
import { addIcons } from "ionicons";
import { arrowDown, arrowUp, closeCircle, desktopOutline, globeOutline, searchCircle } from "ionicons/icons";
import {
  ImportRemoteFileComponent
} from "@components/resources-explorer/import-remote-file/import-remote-file.component";
import { ImportLocalFileComponent } from "@components/resources-explorer/import-local-file/import-local-file.component";
import { ApiService } from "@services/api/api.service";
import {ResourceFileInterface, ResourceOrderType} from "@interfaces/resource-file.interface";
import { ConsoleService } from "@services/console/console.service";
import { BitSizePipe } from "@pipes/bit-size.pipe";
import { from, tap } from "rxjs";
import { VtkWsLinkService } from "@services/vtk-ws-link/vtk-ws-link.service";
import { SystemService } from "@services/system/system.service";


type ResourceLoadingState = "completed" | "uploading" | "error";

type Resource = {
  id: number;
  name: string;
  size: string;
  mimetype: string;
  create_date: number;
  write_date: number;
  state: ResourceLoadingState;
}

// type ResourceOrderType = "id" | "name" | "size" | "mimetype" | "create_date" | "write_date" | "state";

type TableColumn = {
  headerId: ResourceOrderType;
  headerTranslationKey: string;
  getBodyContent: (resource: ResourceFileInterface) => string;
  getBodyContainerClasses: (resource: ResourceFileInterface) => string;
  getBodyContentClasses: (resource: ResourceFileInterface) => string;
}

@Component({
  selector: 'app-resources-explorer',
  templateUrl: './resources-explorer.component.html',
  styleUrls: ['./resources-explorer.component.scss'],
  imports: [
    IonCol,
    IonGrid,
    IonRow,
    TranslatePipe,
    IonTitle,
    IonHeader,
    IonToolbar,
    NgClass,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSearchbar,
    ImportRemoteFileComponent,
    ImportLocalFileComponent,
    IonRippleEffect,
  ],
  encapsulation: ViewEncapsulation.Emulated
})
export class ResourcesExplorerComponent implements OnInit {
  public isOpen = input(false);
  public onClose = input(() => this.modal.dismiss({id:'ResourcesExplorerComponent'}));
  public importRemoteFileOpen: boolean = false;
  public importLocalFileOpen: boolean = false;
  private tableColumns: TableColumn[] = [
    {
      headerId: "id",
      headerTranslationKey: "id",
      getBodyContent: (resource) => resource.id.toString(),
      getBodyContainerClasses: (resource) => '',
      getBodyContentClasses: (resource) => ''
    },
    {
      headerId: "name",
      headerTranslationKey: "name",
      getBodyContent: (resource) => resource.name,
      getBodyContainerClasses: (resource) => '',
      getBodyContentClasses: (resource) => ''
    },
    {
      headerId: "size",
      headerTranslationKey: "size",
      getBodyContent: (resource) => this.bitSizePipe.transform(resource.size),
      getBodyContainerClasses: (resource) => '',
      getBodyContentClasses: (resource) => ''
    },
    {
      headerId: "isocontours",
      headerTranslationKey: "isocontours",
      getBodyContent: (resource) => resource.isocontours.toString(),
      getBodyContainerClasses: (resource) => '',
      getBodyContentClasses: (resource) => ''
    },
    {
      headerId: "slices",
      headerTranslationKey: "slices",
      getBodyContent: (resource) => resource.slices.toString(),
      getBodyContainerClasses: (resource) => '',
      getBodyContentClasses: (resource) => ''
    },
    {
      headerId: "cube",
      headerTranslationKey: "cube",
      getBodyContent: (resource) => resource.cube,
      getBodyContainerClasses: (resource) => '',
      getBodyContentClasses: (resource) => ''
    },
    {
      headerId: "create_date",
      headerTranslationKey: "createdAt",
      getBodyContent: (resource) => this.getFormattedDate(resource.create_date),
      getBodyContainerClasses: (resource) => '',
      getBodyContentClasses: (resource) => ''
    },
    {
      headerId: "write_date",
      headerTranslationKey: "wroteAt",
      getBodyContent: (resource) => this.getFormattedDate(resource.write_date),
      getBodyContainerClasses: (resource) => '',
      getBodyContentClasses: (resource) => ''
    },
    // {
    //   headerId: "actions",
    //   headerTranslationKey: "actions",
    //   getBodyContent: () => "",
    //   getBodyContainerClasses: (resource) => 'state-col-container state-col-' + resource.state,
    //   getBodyContentClasses: (resource) => 'ion-padding-horizontal'
    // }
  ]
  private resources: ResourceFileInterface[] = [];
  private orderedBy: {
    orderType: ResourceOrderType;
    ascending: boolean;
  } = {
      orderType: "id",
      ascending: false
    };
  private filter: string | null | undefined = undefined;
  private shownResources: ResourceFileInterface[] = [];

  constructor(
    private translate: TranslateService,
    private apiService: ApiService,
    private bitSizePipe: BitSizePipe,
    private vtkWsLinkService: VtkWsLinkService,
    private systemService: SystemService,
    private modal: ModalController
  ) {
    addIcons({ arrowDown, arrowUp, closeCircle, globeOutline, desktopOutline, searchCircle });

  }

  // Getters
  get shownResourcesLength() {
    return this.shownResources.length;
  }

  get isCurrentlyAscending() {
    return this.orderedBy.ascending;
  }

  get getTableColumns() {
    return this.tableColumns;
  }

  get getShownResources() {
    return this.shownResources;
  }

  ngOnInit() {
    from(this.vtkWsLinkService.call("get.processed.list"))
      .pipe(
        tap((res: any) => {
          console.log('res',res)
          this.resources = res;
          this.updateShownResources();
        })
      )
      .subscribe((res) => {
        ConsoleService.log('Resources loaded', res);
      });


    //
    // this.apiService.getResourceFiles().subscribe((res) => {
    //   ConsoleService.log("Resources", res);
    //   this.resources = res;
    //   this.updateShownResources();
    // })
  }

  // Utils
  getFormattedDate(timestamp: number) {
    const date = new Date(timestamp * 1000);

    return date.getFullYear()
      + '/' + (date.getMonth() + 1).toString().padStart(2, '0')
      + '/' + date.getDate().toString().padStart(2, '0')
      + ' ' + date.getHours().toString().padStart(2, '0')
      + ':' + date.getMinutes().toString().padStart(2, '0');
  }

  // Handlers
  closeModalHandler() {
    this.onClose()();
  }

  openImportLocalFileHandler() {
    this.importLocalFileOpen = true;
  }

  closeImportLocalFileHandler() {
    this.importLocalFileOpen = false;
  }

  openImportRemoteFileHandler() {
    this.importRemoteFileOpen = true;
  }

  closeImportRemoteFileHandler() {
    this.importRemoteFileOpen = false;
  }

  isCurrentlyOrderedBy(orderType: ResourceOrderType) {
    return this.orderedBy.orderType === orderType;
  }

  // Change the resources display
  // fetchResources() {
  //   // TODO actual fetching APIs
  //   this.resources = [
  //     {
  //       id: 0,
  //       name: "Test",
  //       size: "123MB",
  //       mimetype: ".fits",
  //       create_date: 0,
  //       write_date: 0,
  //       state: "completed"
  //     },
  //     {
  //       id: 1,
  //       name: "Fits",
  //       size: "1.5GB",
  //       mimetype: ".fits",
  //       create_date: Date.now(),
  //       write_date: Date.now(),
  //       state: "uploading"
  //     },
  //     {
  //       id: 2,
  //       name: "Three",
  //       size: "12GB",
  //       mimetype: ".fits",
  //       create_date: Date.now() - 1000000,
  //       write_date: Date.now() - 500000,
  //       state: "error"
  //     }
  //   ];
  //
  //   this.updateShownResources();
  // }

  filterResources(filter: string | null | undefined) {
    this.filter = filter;

    this.updateShownResources();
  }

  orderResources(orderType: ResourceOrderType) {
    const ascending = this.orderedBy.orderType === orderType
      ? !this.orderedBy.ascending
      : false;

    this.orderedBy = { orderType, ascending };

    this.updateShownResources();
  }

  openFits(resource: ResourceFileInterface) {
    console.log('openFits', resource);
    return from(this.vtkWsLinkService.call("create.process", {
      resource: {
        filename: resource.name,
        sha512: resource.sha512,
        type: 'from_volume'
      }
    })
    ).pipe(
      tap((y) => {
        this.systemService.openWindow(`data-view/${y.processId}`);
        this.closeModalHandler();
      })).subscribe();
  }

  private updateShownResources() {
    const orderedResources = this.resources.slice();

    orderedResources.sort((a, b) => {
      const type = this.orderedBy.orderType;
      let decision = (a[type] < b[type]) ? -1 : (a[type] > b[type]) ? 1 : 0;

      // switch (this.orderedBy.orderType) {
      //   case "id":
      //     decision = (a.id < b.id) ? -1 : (a.id > b.id) ? 1 : 0;
      //     break;
      //
      //   case "name":
      //     decision = (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
      //     break;
      //
      //   case "size":
      //     decision = (a.size < b.size) ? -1 : (a.size > b.size) ? 1 : 0;
      //     break;
      //
      //   // case "mimetype":
      //   //   decision = (a.mimetype < b.mimetype) ? -1 : (a.mimetype > b.mimetype) ? 1 : 0;
      //   //   break;
      //
      //   case "create_date":
      //     decision = (a.create_date < b.create_date) ? -1 : (a.create_date > b.create_date) ? 1 : 0;
      //     break;
      //
      //   case "write_date":
      //     decision = (a.write_date < b.write_date) ? -1 : (a.write_date > b.write_date) ? 1 : 0;
      //     break;
      //
      //   // case "state":
      //   //   decision = a.state === "error"
      //   //     ? b.state === "error" ? 0 : 1
      //   //     : a.state === "completed"
      //   //       ? b.state === "completed" ? 0 : -1
      //   //       : (a.state < b.state) ? -1 : (a.state > b.state) ? 1 : 0;
      //   //   break;
      // }

      if (this.orderedBy.ascending) {
        decision *= -1;
      }

      return decision;
    });

    this.shownResources = (this.filter && this.filter.length > 0)
      ? orderedResources.filter((element) => element.name.startsWith(this.filter!))
      : orderedResources;
  }
}

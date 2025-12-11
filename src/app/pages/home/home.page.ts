import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonIcon,
  IonInput,
  IonLabel,
  IonMenu,
  IonMenuButton,
  IonPopover,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSplitPane,
  IonText,
  IonToolbar,
  PopoverController
} from '@ionic/angular/standalone';
import { StateSyncService } from "@services/state-sync.service";
import {
  chevronDownSharp,
  chevronUpSharp,
  gitPullRequestOutline,
  layersOutline,
  searchCircleOutline,
  searchSharp
} from "ionicons/icons";
import { addIcons } from "ionicons";
import { BroadcastService } from "@services/broadcast/broadcast.service";
import { SystemService } from "@services/system/system.service";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { DOCUMENT, UpperCasePipe } from "@angular/common";
import { filter, pairwise, startWith } from "rxjs";
import { TranslatePipe } from "@ngx-translate/core";
import { VtkWsLinkService } from "@services/vtk-ws-link/vtk-ws-link.service";
import { AlertInfoComponent } from "@components/alert-info/alert-info.component";
import { ConsoleComponent } from "@components/console/console.component";
import { ConsoleService } from "@services/console/console.service";
import { ResourcesExplorerComponent } from "@components/resources-explorer/resources-explorer.component";
import { ChipToggleComponent } from "@components/chip-toggle/chip-toggle.component";
import { ApiService } from "@services/api/api.service";
import { ModalController } from "@ionic/angular";
import { CustomValidators } from "@app/core/validators/form.validator";
import { Router } from "@angular/router";
import { AladinService } from "@services/aladin/aladin.service";
import { FileUploadService } from "@services/file-upload/file-upload.service";

declare const window: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [ModalController],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonToolbar, IonContent, IonButtons, IonButton, IonPopover, IonInput, IonIcon, IonLabel, IonText,
    IonSegment, IonSegmentButton, IonMenu, IonSplitPane, IonMenuButton, IonGrid, IonRow, IonCol, IonFooter,
    ReactiveFormsModule, IonSelect, IonSelectOption, UpperCasePipe, TranslatePipe, AlertInfoComponent, ConsoleComponent, ChipToggleComponent]
})
export class HomePage implements OnInit {
  public myValue: boolean = false;
  public searchForm: FormGroup = this.fb.group({
    keywords: []
  });

  mouseCurrentPosition: string = "";
  projectionList = [
    ["TAN", "(Gnomonic projection)"],
    ["STG", "(Stereographic projection)"],
    ["SIN", "(Orthographic projection)"],
    ["ZEA", "(Zenital equal-area projection)"],
    ["MER", "(Mercator projection)"],
    ["AIT", "(Hammer-Aitoff projection)"],
    ["MOL", "(Mollweide projection)"]
  ];
  coordinatesList = [
    'J2000', 'J2000d', 'gal'
  ];

  surveyList = [
    ["ov-gso/P/Higal/500", "Hi-Gal 500"],
    ["ov-gso/P/Higal/350", "Hi-Gal 350"],
    ["ov-gso/P/Higal/250", "Hi-Gal 250"],
    ["ov-gso/P/Higal/160", "Hi-Gal 160"],
    ["ov-gso/P/Higal/70", "Hi-Gal 70"],
  ]
  public isLoading: boolean = true;
  loadingValue: string = '';
  public alertInfoData: { max: number, status: number, isOpen: boolean } = { isOpen: false, status: 0, max: 0 };
  public resourcesExplorerOpen: boolean = false;

  surveyFormGroup: FormGroup = this.fb.group({
    survey: this.fb.group({
      'hi-gal': this.fb.group({
        '500um': [false, []],
        '350um': [false, []],
        '250um': [false, []],
        '160um': [false, []],
        '70um': [false, []],
      }),
      'glimpse': this.fb.group({
        '24um': [false, []],
        '8_0um': [false, []],
        '5_8um': [false, []],
        '4_5um': [false, []],
        '3_6um': [false, []],
      }),
      'wise': this.fb.group({
        '22um': [false, []],
        '22um1': [false, []],
        '22um2': [false, []],
        '22um3': [false, []],
      }),
      'atlasgal': this.fb.group({
        '24um': [false, []],
      }),
      'bolocamGPS': this.fb.group({
        '22um': [false, []],
      }),
      'cornish': this.fb.group({
        '22um': [false, []],
      })
    }),
    selectionType: this.fb.group({
      'selection-type': ['none', []],
    }),
    coordinates: this.fb.group({
      lon: [0.000000],
      lat: [0.000000],
      rad: [0.000000],
      dlon: [0.000000],
      dlat: [0.000000]
    })
  }, {
    validators: [CustomValidators.surveyValidator()]
  });

  private circleOpt = {
    color: "#FF8C00",
    fillColor: "#FF8C00" + "50",
    fill: true,
    lineWidth: 5
  };

  constructor(
    private myService: StateSyncService,
    private popoverController: PopoverController,
    private systemService: SystemService,
    private broadcastService: BroadcastService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private vtkWsLinkService: VtkWsLinkService,
    private apiService: ApiService,
    private modal: ModalController,
    private router: Router,
    private aladinService: AladinService,
    private fileUploadService: FileUploadService,
    @Inject(DOCUMENT) private document: any
  ) {
    addIcons({
      layersOutline, searchCircleOutline, gitPullRequestOutline,
      searchSharp, chevronUpSharp, chevronDownSharp
    });
  }

  ngOnInit() {
    this.broadcastService.onMessage((message) => {
      this.myValue = message;
      this.cd.detectChanges();
      ConsoleService.log('home', message, this.myValue);
    });

    this.aladinService.init('#aladin-lite-div', {
      fov: 90,
      projection: "STG",
      cooFrame: 'gal',
      showCooGridControl: false,
      showSimbadPointerControl: false,
      showCooGrid: true,
      gridOpacity: 0.4,
      showContextMenu: false,
      showProjectionControl: false,
      showFullscreenControl: false,
      showLayersControl: false,
      showFrame: false,
      manualSelection: true,
      showCooLocation: false
    }).then((aladin) => {
      aladin.on("mouseMove", (obj: any) => {
        const currentFrame = aladin.getFrame();
        let [val1, val2] = aladin.pix2world(obj.x, obj.y);
        val1 = ((val1 + 180) % 360) - 180;
        [val1, val2] = [val1, val2].map((x: number) => this.formatGal(x));
        let label1, label2 = "";
        if (currentFrame === 'GAL') {
          label1 = 'GLON';
          label2 = 'GLAT';
        } else {
          label1 = 'RA';
          label2 = 'DEC';
        }
        this.mouseCurrentPosition = `${currentFrame} --- ${label1} ${val1} - ${label2} ${val2}`;
        this.cd.detectChanges();
      });
    });

    this.onSelectionFormChange();
    const getConnectionStatus = this.vtkWsLinkService.getConnectionStatus().subscribe((connected) => {
      if (connected) {
        ConsoleService.log('🎉 VTK Client pronto all\'uso!');
        const client = this.vtkWsLinkService.getClient();
        getConnectionStatus.unsubscribe();
      }

    });
    this.vtkWsLinkService.startWithRetry();
  }

  async uploadFile(file: File) {
    this.alertInfoData.isOpen = true;
    this.isLoading = true;
    this.cd.detectChanges();

    try {
      await this.fileUploadService.uploadFile(file, (status, max) => {
        this.alertInfoData.status = status;
        this.alertInfoData.max = max;
        this.cd.detectChanges();
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.alertInfoData.isOpen = false;
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  onSelectionFormChange() {
    ConsoleService.log('onSelectionFormChange');
    this.surveyFormGroup.get('coordinates')?.valueChanges
      .pipe(
        startWith(null),
        pairwise(),
        filter(([prev, next]) => prev && JSON.stringify(prev) !== JSON.stringify(next) && (next.dlat || next.dlon || next.rad)),
      )
      .subscribe();
  }

  formatGal(value: number) {
    return +Number(value).toFixed(4);
  }

  startRectSelection() {
    this.aladinService.select('rect', (p: { x: number, y: number, w: number, h: number }) => {
      const { x, y, w, h } = p;

      this.aladinService.removeOverlays();
      const overlay = this.aladinService.createGraphicOverlay();
      this.aladinService.addOverlay(overlay);

      const corners = [
        [x, y],
        [x, y + h],
        [x + w, y + h],
        [x + w, y],
      ].map(([px, py]) => this.aladinService.pix2world(px, py, 'ICRSd'));

      const [lon, lat] = (this.aladinService.pix2world(x + w / 2, y + h / 2)).map((el: number) => el.toFixed(4));
      const [lon2, lat2] = this.aladinService.pix2world(x + w, y + h).map((el: number) => el.toFixed(4));

      const dlon = (Math.abs(lon - lon2) * 2).toFixed(4);
      const dlat = (Math.abs(lat - lat2) * 2).toFixed(4);

      const lonNorm = (((lon % 360) + ( lon >= 180 ? -1 : +1) * 360) % 360).toFixed(4);

      overlay.addFootprints([this.aladinService.createPolygon(corners, this.circleOpt)]);

      this.surveyFormGroup.patchValue({
        coordinates: {
          lon: lonNorm,
          lat,
          dlon,
          dlat,
          rad: 0 },
        selectionType: { 'selection-type': 'none' },
      });
      this.cd.detectChanges();
    });
  }

  startPointSelection() {
    this.aladinService.select('circle', (p: any) => {
      const { x, y, r } = p;
      const [ra, dec] = this.aladinService.pix2world(x, y, 'ICRSd').map((x: number) => this.formatGal(x));
      let [lon, lat] = this.aladinService.pix2world(x, y).map((x: number) => this.formatGal(x));
      lon = lon % 360;
      this.aladinService.removeOverlays();
      let overlay = this.aladinService.createGraphicOverlay();
      this.aladinService.addOverlay(overlay);
      const rDegrees = this.formatGal(this.aladinService.angularDist(0, 0, r, r, 'ICRSd'));
      overlay.addFootprints([this.aladinService.createCircle(ra, dec, rDegrees, this.circleOpt)]);
      this.surveyFormGroup.get('coordinates')?.reset();
      this.surveyFormGroup.get('selectionType')?.reset();
      this.surveyFormGroup.patchValue({
        coordinates: {
          lon,
          lat,
          rad: rDegrees,
          dlat: 0,
          dlon: 0
        },
        selectionType: {
          'selection-type': 'none'
        }
      });
      this.cd.detectChanges();
    });
  }

  search() {
    const { keywords } = this.searchForm.getRawValue();
    this.aladinService.gotoObject(keywords, {
      success: () => {
        ConsoleService.log(`Successfully moved to ${keywords}.`);
      },
      error: (err: any) => {
        console.error(`Error moving to ${keywords}:`, err);
      }
    }
    );
  }

  setFrame(event: CustomEvent) {
    const frame = event.detail.value;
    this.aladinService.setFrame(frame);
  }

  setProjection(event: CustomEvent) {
    const proj = event.detail.value;
    this.aladinService.setProjection(proj);
  }

  openSecond() {
    this.popoverController.dismiss();
    this.systemService.openWindow('data-view')
  }

  openResourceExplorer() {
    this.popoverController.dismiss();
    this.resourcesExplorerOpen = true;
    this.cd.detectChanges();
  }

  closeResourceExplorer() {
    this.resourcesExplorerOpen = false;
    this.cd.detectChanges();
  }

  openSettings() {
    this.popoverController.dismiss();
    this.systemService.openWindow('settings', {
      width: window.innerWidth / 1.5,
      height: window.innerWidth / 2,
      toolbar: 0,
      location: 0,
      menubar: 0
    });
  }

  openConeSearch() {
    this.popoverController.dismiss();
    this.systemService.openWindow('cone-search', {
      width: 600,
      height: 725,
      toolbar: 0,
      location: 0,
      menubar: 0
    });
  }

  openHips2Fits() {
    this.popoverController.dismiss();
    this.systemService.openWindow('hips2fits', {
      width: 650,
      height: 550,
      toolbar: 0,
      location: 0,
      menubar: 0
    });
  }

  openSelect3D() {
    this.popoverController.dismiss();
    this.systemService.openWindow('select3d', {
      width: 600,
      height: 475,
      toolbar: 0,
      location: 0,
      menubar: 0
    });
  }

  openAboutUs() {
    this.popoverController.dismiss();
    this.systemService.openWindow('about-us', {
      width: 700,
      height: 700,
      toolbar: 0,
      location: 0,
      menubar: 0
    });
  }

  handleSelection(event: CustomEvent) {
    this.aladinService.cancelSelection();
    this.aladinService.removeOverlays();
    switch (
    this.surveyFormGroup.get('selectionType.selection-type')?.value
    ) {
      case 'point':
        this.startPointSelection()
        break;
      case 'rect':
        this.startRectSelection()
        break;
      case 'none':
        break;
    }
  }

  setSurvey(event: CustomEvent) {
    const values = event.detail.value;
    const currentOverlays = this.surveyList.map(([x]) => this.aladinService.getOverlayImageLayer(x)?.name).filter((x) => !!x);
    currentOverlays.forEach((layer: string) => {
      if (!values.includes(layer)) {
        this.aladinService.removeImageLayer(layer);
      }
    });
    values.forEach((value: string) => {
      if (!currentOverlays.includes(value)) {
        this.aladinService.setOverlayImageLayer(value, value)
      }
    })
  }

  async loadData(event: any) {
    this.isLoading = true;
    this.cd.detectChanges();
    await this.uploadFile(event.target.files[0])
  }

  async submitQuery() {
    const payload = this.surveyFormGroup.getRawValue();
    this.router.navigate(['/vlkb-source-explorer'], {
      queryParams: payload.coordinates
    });
  }

  async openExploreResource() {
    const modal = await this.modal.create({
      id: 'ResourcesExplorerComponent',
      component: ResourcesExplorerComponent,
      cssClass: 'resource-modal'
    });
    modal.present();
  }
}

import {AfterContentInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import vtkWSLinkClient from '@kitware/vtk.js/IO/Core/WSLinkClient';
import SmartConnect from 'wslink/src/SmartConnect';
import vtkRemoteView from '@kitware/vtk.js/Rendering/Misc/RemoteView';
import {IonButton, IonHeader, IonInput, IonModal, IonRange, IonToggle} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {scanOutline} from "ionicons/icons";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {VtkWsLinkService} from "@services/vtk-ws-link/vtk-ws-link.service";
import {DecimalPipe} from "@angular/common";
import {Process} from "@interfaces/process.interface";


vtkWSLinkClient.setSmartConnectClass(SmartConnect);

@Component({
  selector: 'app-vtk-remote-viewer',
  templateUrl: './vtk-remote-viewer.component.html',
  styleUrls: ['./vtk-remote-viewer.component.scss'],
  imports: [
    IonRange,
    IonButton,
    IonInput,
    ReactiveFormsModule,
    DecimalPipe,
    IonModal,
    IonHeader,
    IonToggle,
  ]
})
export class VtkRemoteViewerComponent implements OnInit, AfterContentInit {
  @ViewChild('vtkDivRenderer', {static: true}) vtkDivRenderer!: ElementRef<any>;
  @ViewChild('vtkDivRendererImage', {static: true}) vtkDivRendererImage!: ElementRef<any>;
  @ViewChild('crossHairX') crossHairX!: ElementRef<any>;
  @ViewChild('crossHAirY') crossHAirY!: ElementRef<any>;
  @ViewChild('headerModalTemplate') headerModalTemplate!: ElementRef<any>;
  public bounds: [number, number] = [0, 0];
  public threshold: [number, number] = [0, 0];
  public boundsStep: number = 0.1;
  public isLoaded: boolean = false;
  public rightCoordinates: string = '';
  public contour2DForm = this.fb.group({
    enabled: false,
    level: [15],
    min: [0],
    max: [0],
  });
  @Input() processId: any;
  @Input() processData!: Process;
  public sliceStats = {
    min: 0,
    max: 0,
    mean: 0,
    rms: 0,
  };
  public headers: any
  private view3d: vtkRemoteView | undefined;
  private view2d: vtkRemoteView | undefined;


  constructor(
    private vtkWsService: VtkWsLinkService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    addIcons({scanOutline})
  }

  ngOnInit() {
    console.log('vtkRemoteViewerComponent');
    this.headers = Object.entries(this.processData?.resource?.header);
  }

  ngAfterContentInit() {
    this.cdr.detectChanges();
    this.prepareScene();
  }

  async prepareScene() {
    console.log('prepare', this.processData)
    const client = this.vtkWsService.getClient();
    this.isLoaded = true;

    const view3d = vtkRemoteView.newInstance({
      rpcWheelEvent: 'viewport.mouse.zoom.wheel',
      viewStream: client.getImageStream().createViewStream(this.processData.objectIds["3d"].toString()),
    });
    view3d.setSession(this.vtkWsService.session);
    view3d.setContainer(this.vtkDivRenderer.nativeElement);
    view3d.setInteractiveRatio(1); // the scaled image compared to the clients view resolution
    view3d.setInteractiveQuality(100); // jpeg quality

    this.view3d = view3d;

    this.contour2DForm.get('min')?.patchValue(+this.processData.stats.three_rms.toFixed(4));
    this.contour2DForm.get('max')?.patchValue(+this.processData.stats.max.toFixed(4));

    const view2d = vtkRemoteView.newInstance({
      rpcMouseEvent: "viewport.mouse.interaction",
      rpcWheelEvent: 'viewport.mouse.zoom.wheel',
      viewStream: client.getImageStream().createViewStream(this.processData.objectIds["2d"].toString()),
    });
    view2d.setSession(this.vtkWsService.session);
    view2d.setContainer(this.vtkDivRendererImage.nativeElement);
    view2d.setInteractiveRatio(1); // the scaled image compared to the clients view resolution
    view2d.setInteractiveQuality(100); // jpeg quality

    this.view2d = view2d;

    this.view2d.getInteractor().onMouseMove((event: any) => {
      const {x, y} = event.position;
      this.crossHairX.nativeElement.style.bottom = `${y}px`;
      this.crossHAirY.nativeElement.style.left = `${x}px`;
      const header = this.processData.resource.header;
      const canvasWidth = view2d.getContainer().clientWidth;
      const canvasHeight = view2d.getContainer().clientHeight - (event.firstRenderer.getCanvas().parentElement.getBoundingClientRect().top * 2);
      const cubeCenter = {x: header.CRVAL1.value, y: header.CRVAL2.value};
      const pixelToCoordRatio = header.CDELT1.value < 0 ? -header.CDELT1.value : header.CDELT1.value;
      const spatialX = (cubeCenter.x + (x - canvasWidth / 2) * pixelToCoordRatio).toLocaleString(undefined, {
        maximumFractionDigits: 4,
        minimumFractionDigits: 4
      });
      const spatialY = (cubeCenter.y + (y - canvasHeight / 2) * pixelToCoordRatio).toLocaleString(undefined, {
        maximumFractionDigits: 4,
        minimumFractionDigits: 4
      });
      this.rightCoordinates = `${spatialX}, ${spatialY}`;
    });
    this.cdr.detectChanges();
  }

  updateContour(event: CustomEvent) {
    const value = event.detail.value;
    this.vtkWsService.call('update.contour', {value}).then((response: any) => {
      console.table(response);
      this.view3d?.render();
    });
  }

  updateCutter(event: CustomEvent) {
    const value = event.detail.value;
    this.vtkWsService.call('update.cutting.plane', {value}).then((response: any) => {
      console.table(response);
      this.sliceStats = response;
      this.view2d?.render();
      this.view3d?.render();
    });
  }

  handleCrossHair(mode: 'enter' | 'leave') {
    // let display = mode == 'enter' ? 'block' : 'none';
    // this.crossHairX.nativeElement.style.display = display;
    // this.crossHAirY.nativeElement.style.display = display;
  }

  enableCrossHair() {
    const display = this.crossHAirY.nativeElement.style.display;
    this.crossHairX.nativeElement.style.display = display === 'none' ? 'block' : 'none';
    this.crossHAirY.nativeElement.style.display = display === 'none' ? 'block' : 'none';
  }

  handleLut() {
    const {enabled, level, min, max} = this.contour2DForm.getRawValue();
    this.vtkWsService.call('contour.update_levels', {enabled, level, min, max}).then((response: any) => {
      console.table(response);
      this.view2d?.render();
      this.view3d?.render();
      setTimeout(() => {
        this.view2d?.render();
        this.view3d?.render();
      }, 1000)

    });
  }

  // handleLutEnable(event: any) {
  //   const enabled = this.contour2DForm.get('enabled')?.value;
  //   this.vtkWsService.call('contour.toggle', {enabled}).then((response: any) => {
  //     console.table(response);
  //     this.view2d?.render();
  //     this.view3d?.render();
  //   });
  // }

  getHeaders(filterBy: any): any {
    console.log('getHeaders', filterBy);
    const header = Object.entries({...this.processData.resource.header})
    return header.filter(([x, y]) => x.toLowerCase().includes(filterBy.toLowerCase()));
  }

  openHeadersModal() {
    debugger;
    this.cdr.detectChanges();
    // const headersModal = this.modal.create({
    //
    // })
    // headersModal.present();
  }
}

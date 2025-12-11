import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonMenuButton,
  IonPopover,
  IonToolbar,
  PopoverController
} from '@ionic/angular/standalone';
import {VtkRemoteViewerComponent} from "@components/vtk-remote-viewer/vtk-remote-viewer.component";
import {VtkWsLinkService} from "@services/vtk-ws-link/vtk-ws-link.service";
import {SystemService} from "@services/system/system.service";


@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.page.html',
  styleUrls: ['./data-view.page.scss'],
  standalone: true,
  imports: [IonContent, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonMenuButton, IonPopover, VtkRemoteViewerComponent]
})
export class DataViewPage {
  @Input() processId: any;
  public processData: any;
  private session: any;
  private sessionId: any;
  public isLoaded: boolean = false;

  constructor(
    private popoverController: PopoverController,
    private vtkWsService: VtkWsLinkService,
    private systemService: SystemService,
    private cdr: ChangeDetectorRef,
  ) {
    this.vtkWsService.startWithRetry();
    this.vtkWsService.getConnectionStatus().subscribe(status => {
      console.log('vtkSessionService.getConnectionStatus', status);
      if (status) {
        this.vtkWsService.setProcessId(this.processId);
        this.session = this.vtkWsService.session;
        this.prepareScene()
      }
    })
  }

  async prepareScene() {
    this.vtkWsService.call('get.process').then((data: any) => {
      this.processData = data;
      this.isLoaded = true;
      this.cdr.detectChanges();
      console.log('processData', this.processData);
      // const view3d = vtkRemoteView.newInstance({
      //   rpcWheelEvent: 'viewport.mouse.zoom.wheel',
      //   viewStream: client.getImageStream().createViewStream(data.object_id.toString()),
      // });
      // view3d.setSession(this.session);
      // view3d.setContainer(this.vtkDivRenderer.nativeElement);
      // view3d.setInteractiveRatio(1); // the scaled image compared to the clients view resolution
      // view3d.setInteractiveQuality(100); // jpeg quality
      //
      // this.contour2DForm.get('min')?.patchValue(data.stats.three_rms);
      // this.contour2DForm.get('max')?.patchValue(data.stats.scalar_range.upper);
      //
      // console.warn('data', data, client.getImageStream().createViewStream(data.object_2d_id))
      // const viewStream2d = client.getImageStream().createViewStream(data.object_2d_id)
      // const view2d = vtkRemoteView.newInstance({
      //   rpcMouseEvent: "viewport.mouse.interaction",
      //   rpcWheelEvent: 'viewport.mouse.zoom.wheel',
      //   viewStream: viewStream2d,
      // });
      // view2d.setSession(this.session);
      // view2d.setContainer(this.vtkDivRendererImage.nativeElement);
      // view2d.setInteractiveRatio(1); // the scaled image compared to the clients view resolution
      // view2d.setInteractiveQuality(100); // jpeg quality
      //
      //
      // view2d.getInteractor().onMouseMove((event: any) => {
      //   const {x, y} = event.position;
      //   this.crossHairX.nativeElement.style.bottom = `${y}px`;
      //   this.crossHAirY.nativeElement.style.left = `${x}px`;
      //   const header = this.header;
      //   const canvasWidth = view2d.getContainer().clientWidth;
      //   const canvasHeight = view2d.getContainer().clientHeight - (event.firstRenderer.getCanvas().parentElement.getBoundingClientRect().top * 2);
      //   const cubeCenter = {x: header.CRVAL1.value, y: header.CRVAL2.value};
      //   const pixelToCoordRatio = header.CDELT1.value < 0 ? -header.CDELT1.value : header.CDELT1.value;
      //   const spatialX = (cubeCenter.x + (x - canvasWidth / 2) * pixelToCoordRatio).toLocaleString(undefined, {
      //     maximumFractionDigits: 4,
      //     minimumFractionDigits: 4
      //   });
      //   const spatialY = (cubeCenter.y + (y - canvasHeight / 2) * pixelToCoordRatio).toLocaleString(undefined, {
      //     maximumFractionDigits: 4,
      //     minimumFractionDigits: 4
      //   });
      //   this.rightCoordinates = `${spatialX}, ${spatialY}`;
      // });
    })
  }

  async set3dLayout(value: 'legend' | 'grid') {
    this.sessionId = await this.systemService.getSession();
    this.vtkWsService.call('update.render.layout', {value}).then((response: any) => {
      console.table(response);
      this.popoverController.dismiss();
    });
  }
}

import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonAccordion,
  IonAccordionGroup, IonBackButton, IonButton, IonButtons,
  IonContent, IonHeader,
  IonIcon,
  IonItem,
  IonLabel, IonMenu, IonMenuButton,
  IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import {AllSourcesComponent} from "@components/vlkb-output/all-sources/all-sources.component";
import {FilamentsComponent} from "@components/vlkb-output/filaments/filaments.component";
import {SelectSourcesComponent} from "@components/vlkb-output/select-sources/select-sources.component";
import {TranslatePipe} from "@ngx-translate/core";
import {BroadcastService} from "@services/broadcast/broadcast.service";
import {VtkWsLinkService} from "@services/vtk-ws-link/vtk-ws-link.service";
import {SourcesService} from "@services/sources/sources.service";
import {ActivatedRoute, Router} from "@angular/router";
import {filter} from "rxjs";
import {SystemService} from "@services/system/system.service";
import vtkRemoteView from "@kitware/vtk.js/Rendering/Misc/RemoteView";

@Component({
  selector: 'app-vlkb-test-page',
  templateUrl: './vlkb-source-explorer.page.html',
  styleUrls: ['./vlkb-source-explorer.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, AllSourcesComponent, FilamentsComponent, IonAccordion, IonAccordionGroup, IonIcon, IonItem, IonLabel, SelectSourcesComponent, TranslatePipe, IonTitle, IonMenuButton, IonButtons, IonToolbar, IonHeader, IonMenu, IonBackButton, IonButton]
})
export class VlkbSourceExplorerPage implements AfterContentInit {
  public sources: any = [];
  public payload: any = {
    lon: 0,
    lat: 0,
    rad: 0,
    dlon: 0,
    dlat: 0,
    range: 'range'
  };
  public isLoaded: boolean = false;
  @ViewChild('vtkDivRendererImage', {static: true}) vtkDivRendererImage!: ElementRef<any>;


  constructor(
    private broadcastService: BroadcastService,
    private sourcesService: SourcesService,
    private vtkWsLinkService: VtkWsLinkService,
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
  ) {
    this.payload = {
      lon: +this.route.snapshot.queryParams["lon"],
      lat: +this.route.snapshot.queryParams["lat"],
      rad: +this.route.snapshot.queryParams["rad"],
      dlon: +this.route.snapshot.queryParams["dlon"],
      dlat: +this.route.snapshot.queryParams["dlat"],
      cutout_type: 'range'
    }
    console.log('p', this.payload);
    this.vtkWsLinkService.startWithRetry();
    this.vtkWsLinkService.getConnectionStatus()
      .pipe(filter((x) => x!!))
      .subscribe((connected) => {
        console.log('Connected', connected);
        this.sourcesService.getSources(this.payload).subscribe((x) => {
          this.sources = x;
          console.log('sources', x);
        });
      })


    // this.broadcastService.onMessage((message) => {
    //   ConsoleService.log('vlkb-source-explorer.page', message);
    // });

    this.sourcesService.selected$.asObservable().subscribe((x) => {
      console.log('chiama per mostrare', x);
      this.vtkWsLinkService.call('create.process', {resource: {id: x[x.length - 1]?.id, type: 'vlkb', ...this.payload}})
        .then((xx) => {
          console.log('xx', xx)

          this.vtkWsLinkService.setProcessId(xx.processId);
          const client = this.vtkWsLinkService.getClient();
          this.isLoaded = true;

          const view2d = vtkRemoteView.newInstance({
            rpcMouseEvent: "viewport.mouse.interaction",
            rpcWheelEvent: 'viewport.mouse.zoom.wheel',
            viewStream: client.getImageStream().createViewStream(`VIEW-VLKB-${xx.processId}`),
          });
          view2d.setSession(this.vtkWsLinkService.session);
          view2d.setContainer(this.vtkDivRendererImage.nativeElement);
          view2d.setInteractiveRatio(1); // the scaled image compared to the clients view resolution
          view2d.setInteractiveQuality(100); // jpeg quality

          // this.view2d = view2d;
        })
    })
  }


  ngAfterContentInit() {
    //this.prepareScene();
  }

  onSelect() {

  }

  // async prepareScene() {
  //   const client = this.vtkWsLinkService.getClient();
  //   this.isLoaded = true;
  //
  //   const view2d = vtkRemoteView.newInstance({
  //     rpcMouseEvent: "viewport.mouse.interaction",
  //     rpcWheelEvent: 'viewport.mouse.zoom.wheel',
  //     viewStream: client.getImageStream().createViewStream(this.processData.objectIds["2d"].toString()),
  //   });
  //   view2d.setSession(this.vtkWsLinkService.session);
  //   view2d.setContainer(this.vtkDivRendererImage.nativeElement);
  //   view2d.setInteractiveRatio(1); // the scaled image compared to the clients view resolution
  //   view2d.setInteractiveQuality(100); // jpeg quality
  //
  //   this.view2d = view2d;
  //
  //   this.view2d.getInteractor().onMouseMove((event: any) => {
  //     const {x, y} = event.position;
  //     // this.crossHairX.nativeElement.style.bottom = `${y}px`;
  //     // this.crossHAirY.nativeElement.style.left = `${x}px`;
  //     // const header = this.processData.resource.header;
  //     // const canvasWidth = view2d.getContainer().clientWidth;
  //     // const canvasHeight = view2d.getContainer().clientHeight - (event.firstRenderer.getCanvas().parentElement.getBoundingClientRect().top * 2);
  //     // const cubeCenter = {x: header.CRVAL1.value, y: header.CRVAL2.value};
  //     // const pixelToCoordRatio = header.CDELT1.value < 0 ? -header.CDELT1.value : header.CDELT1.value;
  //     // const spatialX = (cubeCenter.x + (x - canvasWidth / 2) * pixelToCoordRatio).toLocaleString(undefined, {
  //     //   maximumFractionDigits: 4,
  //     //   minimumFractionDigits: 4
  //     // });
  //     // const spatialY = (cubeCenter.y + (y - canvasHeight / 2) * pixelToCoordRatio).toLocaleString(undefined, {
  //     //   maximumFractionDigits: 4,
  //     //   minimumFractionDigits: 4
  //     // });
  //     // this.rightCoordinates = `${spatialX}, ${spatialY}`;
  //   });
  //   this.cdr.detectChanges();
  // }

  // openFits(resourceId: string) {
  //   console.log('openFits', resourceId);
  //   this.sourcesService.selected$.asObservable().subscribe((selected) => {
  //
  //   })
  //   // return from(this.vtkWsLinkService.call("create.process", {
  //   //     resource: {
  //   //       id: resourceId,
  //   //       type: 'vlkb'
  //   //     }
  //   //   })
  //   // ).pipe(
  //   //   tap((y) => {
  //   //     this.systemService.openWindow(`data-view/${y.processId}`);
  //   //   })).subscribe();
  // }

  protected saveAndGoHome() {
    //add stuff to save
    this.router.navigate(['/home'])
  }
}

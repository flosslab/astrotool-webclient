import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkHttpSceneLoader from "@kitware/vtk.js/IO/Core/HttpSceneLoader";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs";
import {IonButton, IonInput} from "@ionic/angular/standalone";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";
import vtkOpenGLRenderWindow from "@kitware/vtk.js/Rendering/OpenGL/RenderWindow";
import vtkRenderWindowInteractor from "@kitware/vtk.js/Rendering/Core/RenderWindowInteractor";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import vtkBoundingBox from "@kitware/vtk.js/Common/DataModel/BoundingBox";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
// @ts-ignore
import vtkVolumeController from "@kitware/vtk.js/Interaction/UI/VolumeController";


@Component({
  selector: 'app-vtk-gzip-viewer',
  templateUrl: './vtk-gzip-viewer.component.html',
  styleUrls: ['./vtk-gzip-viewer.component.scss'],
  imports: [
    IonInput
  ],
  standalone: true
})
export class VtkGzipViewerComponent implements AfterViewInit {

  @ViewChild('vtkContainer', {static: false}) vtkContainer!: ElementRef;

  private fullScreenRenderer: any;
  private renderWindow: any;
  private renderer: any;
  private sceneImporter: any;

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const container = this.vtkContainer.nativeElement;

      // Configura la pipeline di rendering
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0.2, 0.3, 0.4],
        container
      });
      this.renderer = fullScreenRenderer.getRenderer();
      this.renderWindow = fullScreenRenderer.getRenderWindow();
      this.renderWindow.getInteractor().setDesiredUpdateRate(30);
      // Imposta il renderer
      // this.fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      //   container: this.vtkContainer.nativeElement,
      //   background: [0, 0, 0],
      // });
      // this.renderWindow = vtkRenderWindow.newInstance();
      // this.renderer = vtkRenderer.newInstance();
      // // this.renderer = this.fullScreenRenderer.getRenderer();
      // // this.renderWindow = this.fullScreenRenderer.getRenderWindow();
      // this.sceneImporter = vtkHttpSceneLoader.newInstance({fetchGzip: true});
      // this.sceneImporter.setRenderer(this.renderer);
    }, 100)
  }

  loadCompressedVTIData() {
    const headers = new HttpHeaders({
      'Accept': 'application/gzip'  // Imposta l'header per indicare che ti aspetti un file gzip
    });
    this.http.post('http://localhost:8000/api/public/v1/get_vti_gzip', null, {headers, responseType: 'blob'})  // URL della tua API
      .pipe(
      )
      .subscribe((response: Blob) => {
        const url = URL.createObjectURL(response);  // Genera URL blob locale
        this.sceneImporter.setUrl(url);         // Carica la scena
        this.sceneImporter.onReady(() => {
          this.renderWindow.render();
          URL.revokeObjectURL(url);            // Rilascia l'URL blob
        });
      })

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Leggi il file come ArrayBuffer
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = reader.result;
        this.loadVTIFile(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  }

// Carica il file VTI e visualizzalo con vtk.js
  loadVTIFile(arrayBuffer: any) {
    const vtiReader = vtkXMLImageDataReader.newInstance();
    vtiReader.parseAsArrayBuffer(arrayBuffer);

    const source = vtiReader.getOutputData(0);
    const mapper = vtkVolumeMapper.newInstance();
    const actor = vtkVolume.newInstance();

    const dataArray =
      source.getPointData().getScalars() || source.getPointData().getArrays()[0];
    const dataRange = dataArray.getRange();

    const lookupTable = vtkColorTransferFunction.newInstance();
    const piecewiseFunction = vtkPiecewiseFunction.newInstance();

    // Pipeline handling
    actor.setMapper(mapper);
    mapper.setInputData(source);
    this.renderer.addActor(actor);

    // Configuration
    const sampleDistance =
      0.7 *
      Math.sqrt(
        source
          .getSpacing()
          .map((v: any) => v * v)
          .reduce((a: any, b: any) => a + b, 0)
      );
    mapper.setSampleDistance(sampleDistance);
    actor.getProperty().setRGBTransferFunction(0, lookupTable);
    actor.getProperty().setScalarOpacity(0, piecewiseFunction);
    // actor.getProperty().setInterpolationTypeToFastLinear();
    actor.getProperty().setInterpolationTypeToLinear();

    // For better looking volume rendering
    // - distance in world coordinates a scalar opacity of 1.0
    actor
      .getProperty()
      .setScalarOpacityUnitDistance(
        0,
        vtkBoundingBox.getDiagonalLength(source.getBounds()) /
        Math.max(...source.getDimensions())
      );
    // - control how we emphasize surface boundaries
    //  => max should be around the average gradient magnitude for the
    //     volume or maybe average plus one std dev of the gradient magnitude
    //     (adjusted for spacing, this is a world coordinate gradient, not a
    //     pixel gradient)
    //  => max hack: (dataRange[1] - dataRange[0]) * 0.05
    actor.getProperty().setGradientOpacityMinimumValue(0, 0);
    actor
      .getProperty()
      .setGradientOpacityMaximumValue(0, (dataRange[1] - dataRange[0]) * 0.05);
    // - Use shading based on gradient
    actor.getProperty().setShade(true);
    actor.getProperty().setUseGradientOpacity(0, true);
    // - generic good default
    actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
    actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
    actor.getProperty().setAmbient(0.2);
    actor.getProperty().setDiffuse(0.7);
    actor.getProperty().setSpecular(0.3);
    actor.getProperty().setSpecularPower(8.0);

    // Control UI
    const controllerWidget = vtkVolumeController.newInstance({
      size: [400, 150],
      rescaleColorMap: true,
    });
    controllerWidget.setContainer(this.vtkContainer.nativeElement);
    controllerWidget.setupContent(this.renderWindow, actor, true);

    // setUpContent above sets the size to the container.
    // We need to set the size after that.
    // controllerWidget.setExpanded(false);

    this.fullScreenRenderer.setResizeCallback(({ width, height }: any) => {
      // 2px padding + 2x1px boder + 5px edge = 14
      if (width > 414) {
        controllerWidget.setSize(400, 150);
      } else {
        controllerWidget.setSize(width - 14, 150);
      }
      controllerWidget.render();
    });

    // First render
    this.renderer.resetCamera();
    this.renderWindow.render();

  }
}

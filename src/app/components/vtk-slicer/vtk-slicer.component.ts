import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import vtkImageSlice from "@kitware/vtk.js/Rendering/Core/ImageSlice";
import vtkImageMapper from "@kitware/vtk.js/Rendering/Core/ImageMapper";
import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkOpenGLRenderWindow from "@kitware/vtk.js/Rendering/OpenGL/RenderWindow";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";
import {HttpClient} from "@angular/common/http";
import vtkRenderWindowInteractor from "@kitware/vtk.js/Rendering/Core/RenderWindowInteractor";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import {VtiViewer} from "./vtiViewer";
import {ConeView} from "../vtk-viewer/coneView";
import {itkWasmViewer} from "./itkwasm";

@Component({
  selector: 'app-vtk-slicer',
  templateUrl: './vtk-slicer.component.html',
  styleUrls: ['./vtk-slicer.component.scss'],
  standalone: true
})
export class VtkSlicerComponent implements AfterViewInit {
  @ViewChild('vtkContainer', {static: true}) vtkContainer!: ElementRef;

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.tryViewVti(), 100);
  }

  tryViewVti(): void {
    // let vw = new VtiViewer();
    // let cs = new ConeView();
    let itkwasm = new itkWasmViewer();
    const nativeElement = this.vtkContainer.nativeElement
    console.log('tryViewVti', this.vtkContainer.nativeElement)
    // vw.Initialize(this.vtkContainer.nativeElement, 'http://localhost:8000/static/public/head-binary.vti');
    this.http.get(`http://localhost:8000/static/public/output_3d.vti`, {responseType:"blob"}).subscribe((blob) => {
      var fileReader = new FileReader();
      fileReader.onload = function(event) {
        console.log('Loaded file', event);
        if (event?.target?.result)
        itkwasm.Initialize(nativeElement, event.target.result, {});
      };
      fileReader.readAsArrayBuffer(blob);

    })

    // cs.Initialize(this.vtkContainer.nativeElement);
  }

  // loadVTI(): void {
  //   const url = 'http://localhost:8000/static/public/head-binary.vti';
  //
  //   this.http.get(url, { responseType: 'arraybuffer' }).subscribe((data) => {
  //     console.log('File VTI caricato con successo:', data);
  //     this.renderVTI(data);
  //   }, (error) => {
  //     console.error('Errore nel caricamento del file VTI:', error);
  //   });
  // }
  //
  // renderVTI(vtiData: ArrayBuffer): void {
  //   const vtkContainer = this.vtkContainer.nativeElement;
  //   console.log('Contenitore VTK:', vtkContainer);
  //
  //   const renderWindow = vtkRenderWindow.newInstance();
  //   console.log('Render Window inizializzato:', renderWindow);
  //
  //   const renderer = vtkRenderer.newInstance();
  //   console.log('Renderer inizializzato:', renderer);
  //
  //   const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
  //   openGLRenderWindow.setContainer(vtkContainer);
  //   renderWindow.addView(openGLRenderWindow);
  //   console.log('OpenGL Render Window collegato al container:', openGLRenderWindow);
  //
  //   const interactor = vtkRenderWindowInteractor.newInstance();
  //   interactor.setView(openGLRenderWindow);
  //   interactor.initialize();
  //   interactor.setContainer(vtkContainer);
  //   console.log('Interactor inizializzato:', interactor);
  //
  //   renderWindow.addRenderer(renderer);
  //
  //   // Legge il file VTI
  //   const reader = vtkXMLImageDataReader.newInstance();
  //   reader.parseAsArrayBuffer(vtiData);
  //   console.log('File VTI parsato:', reader);
  //
  //   const imageData = reader.getOutputData();
  //   if (!imageData) {
  //     console.error('Errore: imageData è undefined');
  //     return;
  //   }
  //   console.log('Image Data ottenuto dal file VTI:', imageData);
  //
  //   // Configura il volume e il mapper
  //   const actor = vtkVolume.newInstance();
  //   const mapper = vtkVolumeMapper.newInstance();
  //   mapper.setInputData(imageData);
  //   actor.setMapper(mapper);
  //   console.log('Actor e Mapper configurati:', actor, mapper);
  //
  //   // Imposta la funzione di trasferimento colore
  //   const ctfun = vtkColorTransferFunction.newInstance();
  //   ctfun.addRGBPoint(0, 0.0, 0.0, 0.0);
  //   ctfun.addRGBPoint(255, 1.0, 1.0, 1.0);
  //   actor.getProperty().setRGBTransferFunction(0, ctfun);
  //   console.log('Funzione di trasferimento colore impostata:', ctfun);
  //
  //   // Aggiungi l'attore al renderer
  //   renderer.addVolume(actor);
  //   renderer.resetCamera();
  //   console.log('Volume aggiunto al renderer e camera resettata.');
  //
  //   // Forza il rendering
  //   try {
  //     renderWindow.render();
  //   } catch (error) {
  //     console.error("Render failed: ", error);
  //   }
  //   console.log('Rendering completato.');
  // }

}


/*
*
* import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import vtkImageSlice from "@kitware/vtk.js/Rendering/Core/ImageSlice";
import vtkImageMapper from "@kitware/vtk.js/Rendering/Core/ImageMapper";
import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkOpenGLRenderWindow from "@kitware/vtk.js/Rendering/OpenGL/RenderWindow";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import {HttpClient} from "@angular/common/http";
import vtkBoundingBox from "@kitware/vtk.js/Common/DataModel/BoundingBox";

@Component({
  selector: 'app-vtk-slicer',
  templateUrl: './vtk-slicer.component.html',
  styleUrls: ['./vtk-slicer.component.scss'],
  standalone: true
})
export class VtkSlicerComponent implements AfterViewInit {
  @ViewChild('vtkDiv') vtkDiv!: ElementRef;
  private renderWindow!: vtkRenderWindow;
  private renderer!: vtkRenderer;

  constructor(
    private http: HttpClient,
  ) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
        const container = this.vtkDiv.nativeElement;
        const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
        openGLRenderWindow.setContainer(container);
        openGLRenderWindow.setSize(container.clientWidth, container.clientHeight);

        this.renderWindow = vtkRenderWindow.newInstance();
        this.renderer = vtkRenderer.newInstance();
        this.renderWindow.addRenderer(this.renderer);

        // const renderWindow = fullScreenRenderWindow.getRenderWindow();
        // const renderer = fullScreenRenderWindow.getRenderer();
        // fullScreenRenderWindow.addController(container);

        // const imageActorI = vtkImageSlice.newInstance();
        // const imageActorJ = vtkImageSlice.newInstance();
        // const imageActorK = vtkImageSlice.newInstance();
        //
        // renderer.addActor(imageActorK);
        // renderer.addActor(imageActorJ);
        // renderer.addActor(imageActorI);

        const vtiReader = vtkXMLImageDataReader.newInstance();

        this.http.get('http://localhost:8000/static/public/head-binary.vti', {responseType: 'arraybuffer'})
          .subscribe((fileContents: any) => {
            vtiReader.parseAsArrayBuffer(fileContents);
            console.log('inside')

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
                  .map((v: number) => v * v)
                  .reduce((a: number, b: number) => a + b, 0)
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


            // First render
            this.renderer.resetCamera();
            this.zrenderWindow.render();

          })


        // const reader = vtkHttpDataSetReader.newInstance({
        //   fetchGzip: true,
        // });
        // reader
        //   .setUrl(`http://localhost:8000/static/public/head-binary.vti`, {loadData: false})
        //   .then(() => {
        //     const data = reader.getOutputData();
        //     const dataRange = data.getPointData().getScalars().getRange();
        //     const extent = data.getExtent();
        //
        //     const imageMapperK = vtkImageMapper.newInstance();
        //     imageMapperK.setInputData(data);
        //     imageMapperK.setKSlice(30);
        //     imageActorK.setMapper(imageMapperK);
        //
        //     const imageMapperJ = vtkImageMapper.newInstance();
        //     imageMapperJ.setInputData(data);
        //     imageMapperJ.setJSlice(30);
        //     imageActorJ.setMapper(imageMapperJ);
        //
        //     const imageMapperI = vtkImageMapper.newInstance();
        //     imageMapperI.setInputData(data);
        //     imageMapperI.setISlice(30);
        //     imageActorI.setMapper(imageMapperI);
        //
        //     renderer.resetCamera();
        //     renderer.resetCameraClippingRange();
        //     renderWindow.render();
        //
        //   });
      }
      , 100)
  }

}

* */

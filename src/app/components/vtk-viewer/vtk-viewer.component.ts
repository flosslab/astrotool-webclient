import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
// Importazioni specifiche da VTK.js
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkConeSource from "@kitware/vtk.js/Filters/Sources/ConeSource";
import {ConeView} from "./coneView";
import vtkInteractorStyleTrackballCamera from "@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera";
// import { ParaViewWebClient } from 'paraviewweb';
import {HttpClient} from "@angular/common/http";
import {IonInput, IonItem, IonLabel} from "@ionic/angular/standalone";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";

declare var fits: any;

@Component({
    selector: 'app-vtk-viewer',
    templateUrl: './vtk-viewer.component.html',
    styleUrls: ['./vtk-viewer.component.scss'],
    imports: [
        IonInput,
        IonItem,
        IonLabel
    ]
})
export class VtkViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('vtkContainer', {static: true}) vtkContainer!: ElementRef;

  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit() {
    console.log('here')
  }

  ngAfterViewInit() {

    setTimeout(() => {
      let container = this.vtkContainer.nativeElement;
      let cs = new ConeView();
      // cs.Initialize(container);
      // this.initializeVTK();
    }, 100);
  }

  initializeVTK(): void {
    const container = this.vtkContainer.nativeElement;
    if (!container) {
      console.error('VTK container element not found!');
      return;
    }

    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance();
    renderWindow.addRenderer(renderer);

    const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    openGLRenderWindow.setContainer(container);
    openGLRenderWindow.setSize(container.clientWidth, container.clientHeight);

    // Aggiungi log per verificare se tutto è impostato correttamente
    console.log('Container:', container);
    console.log('Renderer:', renderer);
    console.log('Render Window:', renderWindow);

    renderWindow.addView(openGLRenderWindow);

    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setInteractorStyle(
      vtkInteractorStyleTrackballCamera.newInstance()
    );
    interactor.setView(openGLRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);

    const coneSource = vtkConeSource.newInstance();
    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(coneSource.getOutputPort());

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    renderer.addActor(actor);
    renderer.resetCamera();

    // Aggiungi log per assicurarti che renderWindow e renderer siano correttamente impostati
    if (!renderWindow || !renderer) {
      console.error('RenderWindow or Renderer is not defined');
    }

    renderWindow.render();
  }

  loadFITSFile(e: any) {
    console.log('here', e)
    // // Sostituisci l'URL con quello del tuo file FITS servito da ParaView
    // const fitsUrl = 'http://your-paraview-server/file.fits';
    //
    // this.http.get(fitsUrl, { responseType: 'arraybuffer' })
    //   .subscribe(data => {
    //     this.processFITSFile(data);
    //   }, error => {
    //     console.error('Error loading FITS file:', error);
    //   });
  }

  processFITSFile(fitsData: ArrayBuffer) {
    const fitsFile = new fits.File(fitsData);

    const hdu = fitsFile.getHDU();
    const imageData = hdu.data; // Ottenere i dati dell'immagine FITS

    // Ora che hai i dati FITS, puoi convertirli in un'immagine visibile e renderizzarla con vtk.js
    this.renderWithVTK(imageData);
  }

  renderWithVTK(imageData: any) {
    const container = this.vtkContainer.nativeElement;

    // Step 1: Create render window and renderer
    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance();
    renderWindow.addRenderer(renderer);

    // Step 2: Create OpenGL window and link it to a DOM element
    const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    openGLRenderWindow.setContainer(container);
    openGLRenderWindow.setSize(container.clientWidth, container.clientHeight);
    renderWindow.addView(openGLRenderWindow);

    // Step 3: Create interactor and bind to the OpenGL render window
    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setView(openGLRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);

    // Step 4: Create an actor and mapper to display the FITS data
    // Qui potresti voler creare una texture o utilizzare vtk.js per visualizzare i dati

    const actor = vtkActor.newInstance();
    const mapper = vtkMapper.newInstance();
    // Imposta i dati dell'immagine nel mapper
    mapper.setInputData(imageData);

    actor.setMapper(mapper);
    renderer.addActor(actor);

    // Step 5: Render the scene
    renderer.resetCamera();
    renderWindow.render();
  }

  renderRemoteData(session: any) {
    const container = this.vtkContainer.nativeElement;

    // Crea una scena 3D con vtk.js
    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance();
    renderWindow.addRenderer(renderer);

    const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    openGLRenderWindow.setContainer(container);
    openGLRenderWindow.setSize(container.clientWidth, container.clientHeight);
    renderWindow.addView(openGLRenderWindow);

    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setView(openGLRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);

    // Esempio di creazione di un cono da visualizzare
    const coneSource = vtkConeSource.newInstance();
    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(coneSource.getOutputPort());

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    renderer.addActor(actor);
    renderer.resetCamera();

    renderWindow.render();
  }

  readFITSFile(file: any): void {
    const reader = new FileReader();

    // Funzione di callback per il completamento della lettura del file
    reader.onload = (event: any) => {
      const fileContent = event.target.result;
      this.processFITSFile(fileContent);
    };

    // Legge il file come array buffer
    reader.readAsArrayBuffer(file);
  }

  // onFileSelected(event: any) {
  //   console.log('onFileSelected', event.target?.files);
  //   this.http.post('http://localhost:8000/filter', {file: event.target.files[0]}).subscribe((res: any) => {
  //     console.log('onFileSelected', res);
  //   });
  // }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Leggi il file come ArrayBuffer
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = reader.result as ArrayBuffer;
        this.loadVTIFile(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Carica il file VTI e visualizzalo con vtk.js
  loadVTIFile(arrayBuffer: ArrayBuffer) {
    const container = this.vtkContainer.nativeElement;

    // Crea lettore VTK per file XML VTI
    const reader = vtkXMLImageDataReader.newInstance();
    reader.parseAsArrayBuffer(arrayBuffer);

    const imageData = reader.getOutputData();

    // Configura la pipeline di rendering
    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance();
    const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    const interactor = vtkRenderWindowInteractor.newInstance();

    renderWindow.addRenderer(renderer);
    openGLRenderWindow.setContainer(container);
    renderWindow.addView(openGLRenderWindow);
    interactor.setView(openGLRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);

    // Configura la mappa di rendering e il volume
    const volume = vtkVolume.newInstance();
    const mapper = vtkVolumeMapper.newInstance();
    mapper.setInputData(imageData);

    volume.setMapper(mapper);
    renderer.addVolume(volume);
    renderer.resetCamera();
    renderWindow.render();
  }

  getGzip() {
    this.http.post('http://localhost:8000/get_vti_gzip', null).subscribe(() => {

    })
  }

}

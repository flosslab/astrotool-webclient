// Redistribution and use in source and binary forms, with or without
// modification, are permitted without any need to contact the author.

import '@kitware/vtk.js/Rendering/Profiles/Volume';
import vtkRenderWindowInteractor from "@kitware/vtk.js/Rendering/Core/RenderWindowInteractor";
import vtkInteractorStyleTrackballCamera from "@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera";
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkOpenGLRenderWindow from "@kitware/vtk.js/Rendering/OpenGL/RenderWindow";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkVolumeController from '@kitware/vtk.js/Interaction/UI/VolumeController';


export class VtiViewer {
  constructor() {
  }

  Initialize(Div, vtiFileUrl) {
    this.windowWidth = Div.clientWidth;
    this.windowHeight = Div.clientHeight;

    try {
      this.vtkRenderWindow = vtkRenderWindow.newInstance();
    } catch (e) {
      console.error('vtkrenderWindow newInstance error');
    }

    const vtkRenderWindowInstance = vtkRenderWindow.newInstance();
    const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
    openglRenderWindow.setContainer(Div);
    vtkRenderWindowInstance.addView(openglRenderWindow);

    const renderer = vtkRenderer.newInstance();
    vtkRenderWindowInstance.addRenderer(renderer);

    // Leggi il file VTI
    const vtiReader = vtkXMLImageDataReader.newInstance();

    // Fetch the VTI file
    fetch(vtiFileUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        console.log('arraybuffer', arrayBuffer);
        vtiReader.parseAsArrayBuffer(arrayBuffer);

        // Crea attore e mapper per il rendering volumetrico
        const outputData = vtiReader.getOutputData(0);
        console.log('Output Data:', outputData);

        const volume = vtkVolume.newInstance();
        const mapper = vtkVolumeMapper.newInstance();
        mapper.setInputData(outputData);
        volume.setMapper(mapper);

        // Configura color transfer function
        const lookupTable = vtkColorTransferFunction.newInstance();
        const piecewiseFunction = vtkPiecewiseFunction.newInstance();

        // Configura la scalabilità
        const dataArray = outputData.getPointData().getScalars();
        const dataRange = dataArray.getRange();
        dataRange[0] = 2.7345
        console.log('Data Range:', dataRange);


        // Imposta la funzione di trasferimento del colore
        lookupTable.addRGBPoint(dataRange[0], 0.0, 0.0, 0.0); // Nero
        lookupTable.addRGBPoint(dataRange[1], 1.0, 0.1, 0.5); // Bianco

        // Imposta la funzione di trasferimento dell'opacità
        piecewiseFunction.addPoint(dataRange[0], 0.0); // Trasparente per valori bassi
        piecewiseFunction.addPoint(dataRange[1], 1.0); // Opaco per valori alti

        volume.getProperty().setRGBTransferFunction(0, lookupTable);
        volume.getProperty().setScalarOpacity(0, piecewiseFunction);
        volume.getProperty().setInterpolationTypeToLinear();

        renderer.addActor(volume);

        renderer.resetCamera();

        // Configura l'interactor
        const interactor = vtkRenderWindowInteractor.newInstance();
        interactor.setView(openglRenderWindow);
        interactor.setContainer(Div);
        interactor.setDesiredUpdateRate(60);

        const trackballCamera = vtkInteractorStyleTrackballCamera.newInstance();
        interactor.setInteractorStyle(trackballCamera);

        interactor.initialize();

        // const controllerWidget = vtkVolumeController.newInstance({
        //   size: [400, 150],
        //   rescaleColorMap: true,
        // });
        //
        // controllerWidget.setContainer(Div.parentElement);
        // controllerWidget.setupContent(vtkRenderWindowInstance, volume, true);

        vtkRenderWindowInstance.render();

        // document.getElementById('vtkContainer').parentElement.querySelector('[class^="VolumeController-module_container"]').style.top = "100px"
      })
      .catch(error => {
        console.error('Errore nel caricamento del file VTI:', error);
      });
  }
}

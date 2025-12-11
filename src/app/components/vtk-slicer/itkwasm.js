// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Volume';

// Fetch the data. Other options include `fetch`, axios.
import vtkLiteHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/LiteHttpDataAccessHelper';

// To render the result in this example
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import vtkBoundingBox from "@kitware/vtk.js/Common/DataModel/BoundingBox";
import vtkScalarBarActor from "@kitware/vtk.js/Rendering/Core/ScalarBarActor";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";
import * as vtkVolumeController from "@kitware/vtk.js/macros";

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------


export class itkWasmViewer {


  Initialize(container, file, options={}) {
    const background = options.background
      ? options.background.split(',').map((s) => Number(s))
      : [0, 0, 0];
    const containerStyle = options.containerStyle;
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      background,
      rootContainer: container,
    });
    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();
    renderWindow.getInteractor().setDesiredUpdateRate(30);

    const vtiReader = vtkXMLImageDataReader.newInstance();
    vtiReader.parseAsArrayBuffer(file);

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
    renderer.addActor(actor);

    // Configuration
    const sampleDistance =
      0.7 *
      Math.sqrt(
        source
          .getSpacing()
          .map((v) => v * v)
          .reduce((a, b) => a + b, 0)
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
    // const controllerWidget = vtkVolumeController.newInstance({
    //   size: [400, 150],
    //   rescaleColorMap: true,
    // });
    // const isBackgroundDark = background[0] + background[1] + background[2] < 1.5;
    // controllerWidget.setContainer(rootContainer);
    // controllerWidget.setupContent(renderWindow, actor, isBackgroundDark);

    // setUpContent above sets the size to the container.
    // We need to set the size after that.
    // controllerWidget.setExpanded(false);

    // fullScreenRenderer.setResizeCallback(({ width, height }) => {
    //   // 2px padding + 2x1px boder + 5px edge = 14
    //   if (width > 414) {
    //     controllerWidget.setSize(400, 150);
    //   } else {
    //     controllerWidget.setSize(width - 14, 150);
    //   }
    //   controllerWidget.render();
    //   fpsMonitor.update();
    // });

    // First render
    renderer.resetCamera();
    renderWindow.render();
  }

  // Initialize(Div) {
  //   const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  //     background: [0, 0, 0],
  //   });
  //   this.renderer = fullScreenRenderer.getRenderer();
  //   this.renderWindow = fullScreenRenderer.getRenderWindow();
  //
  //   this.actor = vtkVolume.newInstance();
  //   this.mapper = vtkVolumeMapper.newInstance();
  //   this.mapper.setSampleDistance(0.7);
  //   this.actor.setMapper(this.mapper);
  //
  //   const ctfun = vtkColorTransferFunction.newInstance();
  //   ctfun.addRGBPoint(200.0, 0.4, 0.5, 0.0);
  //   ctfun.addRGBPoint(2000.0, 1.0, 1.0, 1.0);
  //   const ofun = vtkPiecewiseFunction.newInstance();
  //   ofun.addPoint(200.0, 0.0);
  //   ofun.addPoint(120.0, 0.3);
  //   ofun.addPoint(300.0, 0.6);
  //   this.actor.getProperty().setRGBTransferFunction(0, ctfun);
  //   this.actor.getProperty().setScalarOpacity(0, ofun);
  //   this.actor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
  //   this.actor.getProperty().setInterpolationTypeToLinear();
  //   this.actor.getProperty().setUseGradientOpacity(0, true);
  //   this.actor.getProperty().setGradientOpacityMinimumValue(0, 15);
  //   this.actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
  //   this.actor.getProperty().setGradientOpacityMaximumValue(0, 100);
  //   this.actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
  //   this.actor.getProperty().setShade(true);
  //   this.actor.getProperty().setAmbient(0.2);
  //   this.actor.getProperty().setDiffuse(0.7);
  //   this.actor.getProperty().setSpecular(0.3);
  //   this.actor.getProperty().setSpecularPower(8.0);
  //
  //   this.update().then();
  // }

  // ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------

  // async update() {
  //   const volumeArrayBuffer = await vtkLiteHttpDataAccessHelper.fetchBinary(
  //     `https://data.kitware.com/api/v1/file/5d2a36ff877dfcc902fae6d9/download`
  //   );
  //
  //   // Load the itk-wasm ESM module dynamically for the example.
  //   // This can also go in the HTML <head>.
  //   // Or `npm install @itk-wasm/image-io` and import it directly.
  //   const { readImage } = await import(
  //     // eslint-disable-next-line import/no-unresolved, import/extensions
  //     /* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/@itk-wasm/image-io@1.1.0/dist/bundle/index-worker-embedded.min.js'
  //     );
  //
  //   const { image: itkImage, webWorker } = await readImage({
  //     data: new Uint8Array(volumeArrayBuffer),
  //     path: 'knee.mha',
  //   });
  //   // Optionally terminate the web worker when it is no longer needed
  //   webWorker.terminate();
  //
  //   const vtkImage = vtkITKHelper.convertItkToVtkImage(itkImage);
  //
  //   this.mapper.setInputData(vtkImage);
  //   this.renderer.addVolume(this.actor);
  //   this.renderer.resetCamera();
  //   this.renderer.getActiveCamera().zoom(1.5);
  //   this.renderer.getActiveCamera().elevation(70);
  //   this.renderer.updateLightsGeometryToFollowCamera();
  //   this.renderWindow.render();
  // }
}




// vti-viewer.component.ts

import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Input,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import '@kitware/vtk.js/Rendering/Profiles/Volume';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkBoundingBox from '@kitware/vtk.js/Common/DataModel/BoundingBox';
import {VtiViewer} from "../vtk-slicer/vtiViewer";

@Component({
  selector: 'app-vti-viewer',
  templateUrl: './vti-viewer.component.html',
  styleUrl: './vti-viewer.component.scss',
  standalone: true
})
export class VtiViewerComponent implements AfterViewInit {
  @ViewChild('vtkContainer', { static: true }) vtkContainer!: ElementRef;
  @Input() fileUrl: string = '';

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const vtiViewer = new VtiViewer();
    vtiViewer.Initialize(this.vtkContainer.nativeElement, 'http://localhost:8000/static/public/cubehi_output.vti');
  }
}

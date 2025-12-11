import {Injectable, signal, WritableSignal} from '@angular/core';
import vtkWSLinkClient from "@kitware/vtk.js/IO/Core/WSLinkClient";
import vtkRemoteView from "@kitware/vtk.js/Rendering/Misc/RemoteView";

@Injectable({
  providedIn: 'root'
})
export class VtkSessionService {
  session: WritableSignal<any> = signal(undefined);
  clientToConnect: vtkWSLinkClient | undefined;
  viewData: WritableSignal<any> = signal(undefined);
  viewId: any;

  constructor() {
    this.start();
  }

  start() {
    const clientToConnect = vtkWSLinkClient.newInstance();
    // Error
    clientToConnect.onConnectionError((httpReq) => {
      const message =
        (httpReq && httpReq.response && httpReq.response.error) ||
        `Connection error`;
      console.error(message);
      console.log(httpReq);
    });

    // Close
    clientToConnect.onConnectionClose((httpReq) => {
      const message =
        (httpReq && httpReq.response && httpReq.response.error) ||
        `Connection close`;
      console.error(message);
      console.log(httpReq);
    });

    clientToConnect.onConnectionReady(async (res) => {
      this.session.set(res.getConnection().getSession());
    });

    const config = {
      application: 'cone',
      sessionURL: 'ws://localhost:1234/ws',
    };

    clientToConnect
      .connect(config).then((x) => {
      console.log('Connected', x);
      console.table(clientToConnect.getConfig());
    })

    this.clientToConnect = clientToConnect;

  }

  async getView(element3d: HTMLElement, element2d: HTMLElement) {
    const data = await this.session().call('get.view.id');
    console.log('get.view.id', data);
    this.viewData.set({
      isLoaded: true,
      viewId: data.view_id,
      bounds: [data.bounds[4], data.bounds[5]],
      boundsStep: data.bounds[5] / 100,
      threshold: [data.threshold[0], data.threshold[1]],
    });
    const view3d = vtkRemoteView.newInstance({
      rpcWheelEvent: 'viewport.mouse.zoom.wheel',
      viewStream: this.clientToConnect!.getImageStream().createViewStream(data.object_id),
    });
    view3d.setSession(this.session);
    view3d.setContainer(element3d);
    view3d.setInteractiveRatio(1); // the scaled image compared to the clients view resolution
    view3d.setInteractiveQuality(100); // jpeg quality

    const view2d = vtkRemoteView.newInstance({
      viewStream: this.clientToConnect!.getImageStream().createViewStream(data.object_2d_id),
    });
    // view2d.setSession(this.session);
    view2d.setContainer(element2d);
    view2d.setInteractiveRatio(1); // the scaled image compared to the clients view resolution
    view2d.setInteractiveQuality(100); // jpeg quality
    return this.viewData();
  }

}

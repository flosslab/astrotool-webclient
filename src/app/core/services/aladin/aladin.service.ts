import { Injectable } from '@angular/core';
// @ts-ignore
import A from 'aladin-lite';

@Injectable({
    providedIn: 'root'
})
export class AladinService {
    private aladin: any;
    private circleOpt = {
        color: "#FF8C00",
        fillColor: "#FF8C00" + "50",
        fill: true,
        lineWidth: 5
    };

    constructor() {
    }

    init(divId: string, options: any): Promise<any> {
        return A.init.then(() => {
            this.aladin = A.aladin(divId, options);
            return this.aladin;
        });
    }

    get instance() {
        return this.aladin;
    }

    setFrame(frame: string) {
        if (this.aladin) {
            this.aladin.setFrame(frame);
        }
    }

    setProjection(proj: string) {
        if (this.aladin) {
            this.aladin.setProjection(proj);
        }
    }

    gotoObject(keywords: string, callbacks?: { success?: () => void, error?: (err: any) => void }) {
        if (this.aladin) {
            this.aladin.gotoObject(keywords, callbacks);
        }
    }

    addOverlay(overlay: any) {
        if (this.aladin) {
            this.aladin.addOverlay(overlay);
        }
    }

    removeOverlays() {
        if (this.aladin) {
            this.aladin.removeOverlays();
        }
    }

    createGraphicOverlay() {
        return A.graphicOverlay();
    }

    createPolygon(corners: any[], options: any) {
        return A.polygon(corners, options);
    }

    createCircle(ra: number, dec: number, rDegrees: number, options: any) {
        return A.circle(ra, dec, rDegrees, options);
    }

    pix2world(x: number, y: number, frame?: string) {
        if (this.aladin) {
            return this.aladin.pix2world(x, y, frame);
        }
        return [0, 0];
    }

    angularDist(x1: number, y1: number, x2: number, y2: number, frame?: string) {
        if (this.aladin) {
            return this.aladin.angularDist(x1, y1, x2, y2, frame);
        }
        return 0;
    }

    select(type: string, callback: (p: any) => void) {
        if (this.aladin) {
            this.aladin.select(type, callback);
        }
    }

    cancelSelection() {
        if (this.aladin?.view?.selector) {
            this.aladin.view.selector.cancel();
        }
    }

    getOverlayImageLayer(name: string) {
        return this.aladin?.getOverlayImageLayer(name);
    }

    removeImageLayer(layer: string) {
        this.aladin?.removeImageLayer(layer);
    }

    setOverlayImageLayer(name: string, url: string) {
        this.aladin?.setOverlayImageLayer(name, url);
    }
}

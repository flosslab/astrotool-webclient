import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {endpoints as e} from "@app/core/endpoints";
import {ResourceFileInterface} from "@interfaces/resource-file.interface";
import {SourceInterface, SourcePayloadInterface} from "@interfaces/source-interface";
import {LUTInterface} from "@interfaces/lut-interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getResourceFiles(): Observable<ResourceFileInterface[]> {
    return this.http.get<ResourceFileInterface[]>(e.resource.list);
  }

  getSources(payload: SourcePayloadInterface): Observable<SourceInterface> {
    return this.http.post<SourceInterface>(e.resource.list, payload);
  }

  getLUTForSources(): Observable<LUTInterface[]> {
    return this.http.get<LUTInterface[]>(e.vtk.lut.source.list);
  }

  getHips2Fits(payload: any): Observable<Blob> {
    return this.http.post(e.hips2fits.download, payload, {responseType: 'blob'});
  }

  getHips2FitsPayloadSurveys(): Observable<string[]> {
    return this.http.get<string[]>(e.hips2fits.surveys).pipe(map((res: any) => res.surveys));
  }

  getHips2FitsPayloadProjections(): Observable<string[]> {
    return this.http.get<string[]>(e.hips2fits.projections).pipe(map((res: any) => res.projections));
  }

  getVLKBQuery(payload: any): Observable<any> {
    return this.http.post<Observable<any>>(e.vlkb.list, payload);
  }
}

export interface ResourceFile {
  name: string;
}

import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable} from "rxjs";
import {ApiService} from "@services/api/api.service";
import {FourthLevelInterface, SourceInterface, SourcePayloadInterface} from "@interfaces/source-interface";
import {VtkWsLinkService} from "@services/vtk-ws-link/vtk-ws-link.service";

@Injectable({
  providedIn: 'root'
})
export class SourcesService {
  selected$ = new BehaviorSubject<FourthLevelInterface[]>([]);
  filaments$ = new BehaviorSubject<any[]>([]);


  constructor(
    private vtkWsLinkService: VtkWsLinkService,
  ) {
  }

  getSources(payload: SourcePayloadInterface): Observable<SourceInterface> {
    return from(this.vtkWsLinkService.call('vlkb.query_grouped', {payload}));
  }

  addSelected(source: any) {
    const newVals = [...this.selected$.getValue(), source];
    this.selected$.next(newVals);
  }

  removeSelected(source: any) {
    const newVals = this.selected$.getValue().filter((el: any) => el.id !== source.id);
    this.selected$.next(newVals);
  }

  toggleSelected(source: any) {
    if (this.selected$.getValue().map((el: any) => el.id).includes(source.id)) {
      this.removeSelected(source);
    } else {
      this.addSelected(source);
    }
  }

  addFilament(filament: any) {
    const newVals = [...this.filaments$.getValue(), filament];
    this.filaments$.next(newVals);
  }

  removeFilament(filament: any) {
    const newVals = this.filaments$.getValue().map((el: any) => el.id !== filament.id);
    this.filaments$.next(newVals);
  }


}


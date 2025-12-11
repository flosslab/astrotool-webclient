import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {SourcePayloadInterface} from "@interfaces/source-interface";
import {SourcesService} from "@services/sources/sources.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-vlkb-test-page2',
  templateUrl: './vlkb-test-page2.page.html',
  styleUrls: ['./vlkb-test-page2.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class VlkbTestPage2Page implements OnInit {
  public sources: any = {}
  public sourceForm: FormGroup = this.fb.group({
    first: [],
    second: [],
    third: [],
    fourth: [],
  });
  filaments: Observable<any[]>;
  selected: Observable<any[]>;
  expanded: boolean = false;

  constructor(
    private sourcesService: SourcesService,
    private fb: FormBuilder
  ) {
    const payload: SourcePayloadInterface = {
      lon: 0,
      lat: 0,
      rad: 0,
      dlon: 0,
      dlat: 0
    }
    this.sourcesService.getSources(payload).subscribe((x) => {
      this.sources = x;
    });
    this.selected = this.sourcesService.selected$.asObservable();
    this.filaments = this.sourcesService.filaments$.asObservable();
  }

  ngOnInit() {

  }

  getGroupFirst() {
    return Object.keys(this.sources) || [];
  }

  getGroupSecond() {
    const levels = Object.values(this.sourceForm.getRawValue());
    return Object.keys(levels.slice(0, 1).reduce((acc: any, k: any) => acc && acc[k], this.sources) || {});
  }

  getGroupThird() {
    const levels = Object.values(this.sourceForm.getRawValue());
    return Object.keys(levels.slice(0, 2).reduce((acc: any, k: any) => acc && acc[k], this.sources) || {});
  }


  getGroupFourth() {
    const levels = Object.values(this.sourceForm.getRawValue());
    return Object.values(levels.slice(0, 3).reduce((acc: any, k: any) => acc && acc[k], this.sources) || {});
  }

  setSource(position: string, value: any) {
    const old = this.sourceForm.getRawValue();
    const res = {
      ...position === 'first' ? {first: value, second: null, third: null, fourth: null} :
        position === 'second' ? {first: old.first, second: value, third: null, fourth: null} :
          position === 'third' ? {first: old.first, second: old.second, third: value, fourth: null} :
            position === 'fourth' ? {first: old.first, second: old.second, third: old.third, fourth: value.id} : old,
    };
    console.log(position, value, res);
    this.sourceForm.patchValue(res);

    if (position === 'fourth') {
      this.sourcesService.toggleSelected(value)
    }
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}

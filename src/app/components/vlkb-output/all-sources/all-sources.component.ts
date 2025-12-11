import {Component, input, InputSignal, OnInit, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SourcePayloadInterface} from "@interfaces/source-interface";
import {SourcesService} from "@services/sources/sources.service";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-all-sources',
  templateUrl: './all-sources.component.html',
  styleUrls: ['./all-sources.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AllSourcesComponent implements OnInit {
  public sources: InputSignal<any>= input([]);
  public sourceForm: FormGroup = this.fb.group({
    first: [],
    second: [],
    third: [],
    fourth: [],
  });
  filaments: Observable<any[]>;
  selected: Observable<any[]>;

  constructor(
    private sourcesService: SourcesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    // const payload: SourcePayloadInterface = {
    //   lon: +this.route.snapshot.paramMap.get('lon')!,
    //   lat: +this.route.snapshot.paramMap.get('lat')!,
    //   rad: +this.route.snapshot.paramMap.get('rad')!,
    //   dlon: +this.route.snapshot.paramMap.get('dlon')!,
    //   dlat: +this.route.snapshot.paramMap.get('dlat')!,
    // }
    // this.sourcesService.getSources(payload).subscribe((x) => {
    //   this.sources = x;
    // });
    this.selected = this.sourcesService.selected$.asObservable();
    this.filaments = this.sourcesService.filaments$.asObservable();
  }

  ngOnInit() {

  }

  getGroupFirst() {
    return Object.keys(this.sources()) || [];
  }

  getGroupSecond() {
    const levels = Object.values(this.sourceForm.getRawValue());
    return Object.keys(levels.slice(0, 1).reduce((acc: any, k: any) => acc && acc[k], this.sources()) || {});
  }

  getGroupThird() {
    const levels = Object.values(this.sourceForm.getRawValue());
    return Object.keys(levels.slice(0, 2).reduce((acc: any, k: any) => acc && acc[k], this.sources()) || {});
  }


  getGroupFourth() {
    const levels = Object.values(this.sourceForm.getRawValue());
    return Object.values(levels.slice(0, 3).reduce((acc: any, k: any) => acc && acc[k], this.sources()) || {});
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
}

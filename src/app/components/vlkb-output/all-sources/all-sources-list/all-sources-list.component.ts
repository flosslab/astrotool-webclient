import {Component, Input, OnInit} from '@angular/core';
import {IonGrid, IonRow} from "@ionic/angular/standalone";
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-all-sources-list',
    templateUrl: './all-sources-list.component.html',
    styleUrls: ['./all-sources-list.component.scss'],
  imports: [
    IonGrid,
    IonRow,
    NgClass,
  ]
})
export class AllSourcesListComponent  implements OnInit {
  @Input() values: {
    value: string;
    disabled: boolean;
  }[] = [];
  @Input() isSelected: (index: number) => boolean = (index) => false;
  @Input() setSelected: (index: number) => void = (index) => {
  };
  @Input() selectedClass: 'blue-background' | 'green-text' = 'blue-background';

  constructor() { }

  ngOnInit() {}

}

import {Component, computed, input, OnInit} from '@angular/core';
import {IonModal} from "@ionic/angular/standalone";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-alert-info',
  templateUrl: './alert-info.component.html',
  styleUrls: ['./alert-info.component.scss'],
  imports: [
    IonModal,
    NgStyle,
  ]
})
export class AlertInfoComponent implements OnInit {
  public isOpen = input(false);
  public status = input(0);
  public max = input(0);
  public percent = computed(() => {
    return `${this.status() * (100 / this.max())}%`;
  });

  constructor() {
  }

  ngOnInit() {
  }

}

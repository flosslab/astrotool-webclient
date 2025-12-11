import {Component, input, OnInit, Signal} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SystemService} from "@services/system/system.service";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '100%',
          opacity: 1,
          backgroundColor: 'rgb(0 0 0 / 75%)',
          'z-index': '999',
        }),
      ),
      state(
        'closed',
        style({
          height: '100%',
          opacity: 0,
          backgroundColor: 'rgb(0 0 0 / 0%)',

        }),
      ),
      transition('open => closed', [animate('1s')]),
      transition('closed => open', [animate('1s')]),
    ]),
  ],
})
export class LoadingComponent implements OnInit {
  public message = input('Loading...');
  protected isOpen: boolean = false;
  protected isLoading: Signal<boolean>;

  constructor(
    private systemService: SystemService,
  ) {
    this.isLoading = this.systemService.isLoading;
  }

  ngOnInit() {

  }

}

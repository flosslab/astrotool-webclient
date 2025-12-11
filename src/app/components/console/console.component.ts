import {Component, HostBinding, OnInit} from '@angular/core';
import {ConsoleService} from "@services/console/console.service";
import {AsyncPipe} from "@angular/common";
import {Observable} from "rxjs";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
  imports: [
    AsyncPipe
  ],
})
export class ConsoleComponent implements OnInit {
  isOpen: boolean = false;
  protected logs: Observable<any>;

  constructor() {
    this.logs = ConsoleService.getLogs();
  }

  @HostBinding('class.expanded') get expandedClass() {
    return this.isOpen;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
  }

}

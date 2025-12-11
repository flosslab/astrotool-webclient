import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CloseWarningService} from '@services/close-warning.service';

@Component({
  selector: 'app-close-warning',
  templateUrl: './close-warning.component.html',
  styleUrls: ['./close-warning.component.scss'],
  imports: [CommonModule]
})
export class CloseWarningComponent {
  constructor(public warningService: CloseWarningService) {
  }

  confirmExit() {
    this.warningService.handleResponse(true);
  }

  cancelExit() {
    this.warningService.handleResponse(false);
  }
}

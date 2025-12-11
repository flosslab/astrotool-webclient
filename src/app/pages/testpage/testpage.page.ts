import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import {IonicModule} from "@ionic/angular";
import {StateSyncService} from "../../core/services/state-sync.service";
import {take} from "rxjs";
import {BroadcastService} from "@services/broadcast/broadcast.service";

@Component({
    selector: 'app-testpage',
    templateUrl: './testpage.page.html',
    styleUrls: ['./testpage.page.scss'],
    imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton]
})
export class TestpagePage {
  myToggle = false;

  constructor(
    private myService: StateSyncService,
    private broadcastService: BroadcastService
  ) {
    myService.state$
      .pipe(take(1))
      .subscribe((res) => {
      this.myToggle = res.myToggle;
    });
    this.broadcastService.onMessage((message) => {
      console.log('test', message);
    });
  }

  doSomething() {
    this.myToggle = !this.myToggle;
    this.broadcastService.sendMessage(this.myToggle)
    // console.log('doSomething', {myToggle: this.myToggle});
    // this.myService.updateState({myToggle: this.myToggle});
  }

}

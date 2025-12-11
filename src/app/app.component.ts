import {Component, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import {SystemService} from "@services/system/system.service";
import {LoadingComponent} from "@components/loading/loading.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, LoadingComponent]
})
export class AppComponent implements OnInit {

  constructor(
    private systemService: SystemService,
  ) {
  }

  async ngOnInit() {
    await this.systemService.initialize();
  }

}

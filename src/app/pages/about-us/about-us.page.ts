import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonCard, IonContent} from '@ionic/angular/standalone';
import {appVersion} from "../../../main";
import {TranslatePipe} from "@ngx-translate/core";

// import {SystemService} from '@services/system/system.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, TranslatePipe]
})
export class AboutUsPage {
  public version = appVersion

  constructor(
    // TODO use methods from system to navigate
    // private system : SystemService
  ) {
  }

  ngOnInit() {
  }

  onNavigate(
    event: any,
    options?: {
      height: number,
      width: number,
      toolbar: number | boolean,
      location: number | boolean,
      menubar: number | boolean
    }
  ) {
    event.preventDefault();

    // TODO add the pages needed for the in-app navigation
    // this.system.open(event.target.href, options);
  }

  onNavigateExternal(event: any) {
    event.preventDefault();

    // TODO create a function that redirects to the user's default browser
    // this.system.openExternal(event.target.href);
  }
}

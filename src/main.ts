/*
 * Copyright 2025 VisivoLab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {bootstrapApplication} from '@angular/platform-browser';
import {PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading} from '@angular/router';
import {provideIonicAngular} from '@ionic/angular/standalone';

import {routes} from '@app/app.routes';
import {AppComponent} from '@app/app.component';
import {provideHttpClient} from "@angular/common/http";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

import {version} from '../package.json';
import {provideTranslation} from "./translation.config";
import {IonicStorageModule} from "@ionic/storage-angular";
import {importProvidersFrom} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

export const appVersion = version;

bootstrapApplication(AppComponent, {
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideHttpClient(),
    provideTranslation(),
    importProvidersFrom(
      IonicStorageModule.forRoot({})
    ),
    provideAnimationsAsync(),
  ]
}).then();

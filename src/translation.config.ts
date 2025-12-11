import {provideTranslateService, TranslateLoader, TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {inject} from "@angular/core";

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideTranslation() {
  return provideTranslateService({
    defaultLanguage: 'it',
    useDefaultLang: true,
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
  })
}



import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'testpage',
    loadComponent: () => import('./pages/testpage/testpage.page').then( m => m.TestpagePage)
  },
  {
    path: 'data-view/:processId',
    loadComponent: () => import('./pages/data-view/data-view.page').then( m => m.DataViewPage)
  },
  {
    path: 'about-us',
    loadComponent: () => import('./pages/about-us/about-us.page').then( m => m.AboutUsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'vlkb-source-explorer',
    loadComponent: () => import('@page/vlkb-source-explorer/vlkb-source-explorer.page').then( m => m.VlkbSourceExplorerPage)
  },
  {
    path: 'vlkb-test-page2',
    loadComponent: () => import('@page/vlkb-test-page2/vlkb-test-page2.page').then( m => m.VlkbTestPage2Page)
  },
  {
    path: 'hips2fits',
    loadComponent: () => import('./pages/hips2fits/hips2fits.page').then( m => m.Hips2fitsPage)
  },
  {
    path: 'select3d',
    loadComponent: () => import('./pages/select3d/select3d.page').then( m => m.Select3dPage)
  },
  {
    path: 'cone-search',
    loadComponent: () => import('./pages/cone-search/cone-search.page').then( m => m.ConeSearchPage)
  }
];

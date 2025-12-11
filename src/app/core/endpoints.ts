import {environment} from "@env";


const prefix = environment.middleware.apiUrl + '/api/public/v1';

export const endpoints: any = {
  resource: {
    list: [prefix, 'resources'].join('/'),
  },
  hips2fits: {
    download: [prefix, 'hips2fits', 'download'].join('/'),
    surveys: [prefix, 'hips2fits', 'surveys'].join('/'),
    projections: [prefix, 'hips2fits', 'projections'].join('/'),
  },
  vtk: {
    lut: {
      source: {
        list: [prefix, 'vtk', 'lut', 'source'].join('/'),
      }
    }
  },
  vlkb: {
    list: [prefix, 'vlkb', 'query'].join('/'),
  }

}




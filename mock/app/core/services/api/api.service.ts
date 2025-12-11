import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {faker} from "@faker-js/faker/locale/it";
import sources from "@mock/sources.json"
import {ResourceFileInterface} from "@interfaces/resource-file.interface";
import {SourceInterface, SourcePayloadInterface} from "@interfaces/source-interface";
import {LUTInterface} from "@interfaces/lut-interface";
import {endpoints as e} from "@app/core/endpoints";
import vlkbQueryResponse from '@mock/vlkb_query.json'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {
  }

  getResourceFiles(): Observable<ResourceFileInterface[]> {
    const resources = faker.helpers.multiple(() => (
      {
        id: faker.number.int({max: 100}),
        name: faker.system.commonFileName('fits'),
        path: `/${faker.string.uuid()}/`,
        size: faker.helpers.rangeToNumber({min: 200 * 1000000, max: 2000 * 1000000}),
        state: faker.helpers.arrayElement(['completed', 'uploading', 'error']),
        mimetype: "application/fits",
        create_date: faker.date.recent({days: 365}).getTime(),
        write_date: faker.date.recent({days: 1}).getTime(),
        to_pre_process: false
      }
    ), {count: {min: 0, max: 15}})
    return of(resources);
  }

  getSources(payload: SourcePayloadInterface): Observable<SourceInterface>  {
    return of(sources);
  }

  getLUTForSources(): Observable<LUTInterface[]> {
    const lutSources = faker.helpers.multiple(() => (
      {
        id: faker.string.uuid(),
        key: faker.string.alphanumeric({length: {min: 5, max: 15}}),
        label: faker.string.alphanumeric({length: {min: 5, max: 15}}),
      }
    ), {count: {min: 0, max: 5}})

    return of(lutSources);
  }

  getHips2Fits(payload: any): Observable<Blob> {
    return of(new Blob([]));
  }

  getHips2FitsPayloadSurveys(): Observable<string[]> {
    return of([
      "CDS/C/HI4PI/HI",
      "CDS/P/2MASS/color",
      "CDS/P/ACT_Planck/DR5/f220",
      "CDS/P/CO",
      "CDS/P/DES-DR2/ColorIRG",
      "CDS/P/DSS2/color",
      "CDS/P/Fermi/3",
      "CDS/P/Fermi/4",
      "CDS/P/Fermi/5",
      "CDS/P/Finkbeiner",
      "CDS/P/GALEXGR6_7/FUV",
      "CDS/P/GALEXGR6_7/NUV",
      "CDS/P/HGPS/Flux",
      "CDS/P/IRIS/color",
      "CDS/P/MeerKAT/Galactic-Centre-1284MHz-StokesI",
      "CDS/P/NVSS",
      "CDS/P/PLANCK/R3/HFI/color",
      "CDS/P/PLANCK/R3/HFI100",
      "CDS/P/PLANCK/R3/LFI30",
      "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "CDS/P/PanSTARRS/DR1/g",
      "CDS/P/PanSTARRS/DR1/i",
      "CDS/P/PanSTARRS/DR1/r",
      "CDS/P/PanSTARRS/DR1/y",
      "CDS/P/PanSTARRS/DR1/z",
      "CDS/P/unWISE/color-W2-W1W2-W1",
      "CSIRO/P/RACS/low/I",
      "CSIRO/P/RACS/mid/I",
      "ESAVO/P/AKARI/N60",
      "ESAVO/P/AKARI/WideL",
      "ESAVO/P/HERSCHEL/SPIRE-250",
      "ESAVO/P/HERSCHEL/SPIRE-350",
      "ESAVO/P/HERSCHEL/SPIRE-500",
      "astron.nl/P/lotss_dr2_high",
      "astron.nl/P/tgssadr",
      "erosita/dr1/rate/023",
      "erosita/dr1/rate/024",
      "ov-gso/P/BAT/14-20keV",
      "ov-gso/P/BAT/150-195keV",
      "ov-gso/P/BAT/35-50keV",
      "ov-gso/P/CGPS/VGPS",
      "ov-gso/P/Fermi/Band2",
      "ov-gso/P/GLEAM/072-103",
      "ov-gso/P/GLEAM/103-134",
      "ov-gso/P/GLEAM/139-170",
      "ov-gso/P/GLEAM/170-231",
      "ov-gso/P/GLIMPSE/irac1",
      "ov-gso/P/GLIMPSE/irac2",
      "ov-gso/P/GLIMPSE/irac3",
      "ov-gso/P/GLIMPSE/irac4"
    ]);
  }

  getHips2FitsPayloadProjections(): Observable<string[]> {
    return of([
      "AZP - zenithal/azimuthal perspective",
      "SZP - slant zenithal perspective",
      "TAN - tangential",
      "STG - stereographic",
      "SIN - orthographic",
      "ARC - zenithal/azimuthal equidistant",
      "ZEA - zenithal/azimuthal equal area",
      "AIR - Airy’s projection",
      "CYP - cylindrical perspective",
      "CEA - cylindrical equal area",
      "CAR - plate carrée",
      "MER - Mercator’s projection",
      "SFL - Sanson-Flamsteed",
      "PAR - parabolic",
      "MOL - Mollweide’s projection",
      "AIT - Hammer-Aitoff",
      "TSC - tangential spherical cube",
      "CSC - COBE quadrilateralized spherical cube",
      "QSC - quadrilateralized spherical cube",
      "HPX - HEALPix",
      "XPH - HEALPix polar, aka “butterfly”"
    ]);
  }

  getVLKBQuery(payload: any): Observable<any> {
    return of(vlkbQueryResponse);
  }
}

export interface SourcePayloadInterface {
  lon: number,
  lat: number,
  rad: number,
  dlon: number,
  dlat: number
}


export interface SourceInterface {
  continuum: SecondLevelInterface
  spectroscopy: SecondLevelInterface
}

export interface SecondLevelInterface {
  // Visible: ThirdLevelInterface
  // "Near-IR / Mid-IR": ThirdLevelInterface
  // "Far-IR": ThirdLevelInterface
  // Submm: ThirdLevelInterface
  // Radio: ThirdLevelInterface
  [key: string]: ThirdLevelInterface | FourthLevelInterface[] | any
}

export interface ThirdLevelInterface {
  [key: string]: FourthLevelInterface[]
}

export interface FourthLevelInterface {
  title: string
  id: string
  access_url: string
  collection: string
  instrument: any
  facility: string
  size: number
  extra: Extra
}

export interface Extra {
  dataproduct_type: string
  calib_level: number
  obs_collection: string
  obs_title: string
  obs_id: string
  primaryID: string
  bib_reference: string
  data_rights: string
  access_url: string
  access_format: string
  access_estsize: number
  target_name: string
  s_ra: number
  s_dec: number
  s_fov: number
  s_region: string
  s_xel1: number
  s_xel2: number
  s_resolution: any
  t_min: any
  t_max: any
  t_exptime: any
  t_resolution: any
  t_xel: number
  em_min: number
  em_max: number
  em_res_power: any
  em_xel: number
  o_ucd: string
  pol_states: string
  pol_xel: number
  facility_name: string
  instrument_name: string
  overlap: number
  overlapSky: number
  overlapSpec: number
  s_region_galactic: string
  vel_min: any
  vel_max: any
}

export interface ResourceFileInterface {
  name: string
  stats: {}
  header: {}
  id: string
  sha512: string
  size: number
  write_date: number
  create_date: number
  isocontours: number
  slices: number
  cube: string
}

export type ResourceOrderType = keyof ResourceFileInterface;

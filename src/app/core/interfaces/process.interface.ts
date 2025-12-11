export interface Process {
  name:      string;
  objectIds: ObjectIDS;
  rendering: Rendering;
  resource:  Resource;
  stats:     any;
}

export interface ObjectIDS {
  "2d": number;
  "3d": number;
}

export interface Rendering {
  "3d": The3D;
  "2d": The2D;
}

export interface The2D {
  contour: Contour;
}

export interface Contour {
  level: number;
  min:   number;
  max:   number;
}

export interface The3D {
  scalar: number;
  cutter: number;
}

export interface Resource {
  name:         string;
  header:       any;
  cutterBounds: number[];
  scalarRange:  number[];
}

export interface Stats {
}

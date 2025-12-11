import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'bitSize',
  pure: true
})
@Injectable({ providedIn: 'root' })
export class BitSizePipe implements PipeTransform {

  transform(value: number, precision: number = 3, convention: 'decimal' | 'binary' = 'decimal'): string {
    const dividend = convention == 'decimal' ? 1000 : 1024;
    if (isNaN(value) || value < 0) return '0 bit';

    const units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let i = 0;
    let bits = value;

    while (bits >= dividend && i < units.length - 1) {
      bits /= dividend;
      i++;
    }

    return `${bits.toFixed(precision)} ${units[i]}`;
  }
}

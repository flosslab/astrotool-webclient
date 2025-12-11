import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-chip-toggle',
  templateUrl: './chip-toggle.component.html',
  styleUrls: ['./chip-toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChipToggleComponent),
    multi: true
  }]
})
export class ChipToggleComponent implements ControlValueAccessor {
  public value: boolean = false;
  public onChange: (value: boolean) => void = () => {
  };
  public onTouched: () => void = () => {
  };

  toggle() {
    this.value = !this.value;
    this.onChange(this.value);
  }

  writeValue(value: boolean) {
    this.value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }
}

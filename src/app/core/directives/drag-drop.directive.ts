import {Directive, EventEmitter,HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
  standalone: true
})
export class DragDropDirective {
  @Output() filesEmitter: EventEmitter<File[]> = new EventEmitter();
  @Output() overedEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  private stopEvent(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener("dragenter", ["$event"])
  public dragEnterHandler(event: DragEvent) {
    this.stopEvent(event);

    this.overedEmitter.emit(true);
  }

  @HostListener("dragover", ["$event"])
  public dragOverHandler(event: DragEvent) {
    this.stopEvent(event);
  }

  @HostListener("dragleave", ["$event"])
  public dragLeaveHandler(event: DragEvent) {
    this.stopEvent(event);

    this.overedEmitter.emit(false);
  }

  @HostListener('drop', ['$event'])
  public dropHandler(event: DragEvent) {
    this.stopEvent(event);

    this.overedEmitter.emit(false);

    const files = !!event.dataTransfer
      ? event.dataTransfer.files
      : new FileList();

    const result: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      result.push(file);
    }

    if (result.length > 0) {
      this.filesEmitter.emit(result);
    }
  }
}

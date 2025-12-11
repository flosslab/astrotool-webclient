import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, scan} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  private static cs$ = new BehaviorSubject<any[]>([]);

  constructor() {
  }

  public static log(msg: string, ...args: any[]) {
    console.log(msg, ...args);
    ConsoleService.cs$.next([msg, ...args]);
  }

  public static getLogs(): Observable<any> {
    return ConsoleService.cs$.pipe(
      scan((acc: any[], value) => [...acc, value], [])
    )
  }
}

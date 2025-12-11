import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  async get(key: string) {
    return this._storage?.get(key);
  }
}

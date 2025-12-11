import { Injectable } from '@angular/core';
import {ApiService} from "@services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(
    private apiService: ApiService,
  ) { }

  getAll() {
    return this.apiService.getResourceFiles();
  }
}

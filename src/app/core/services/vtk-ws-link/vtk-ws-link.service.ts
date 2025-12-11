import {HostListener, Injectable} from '@angular/core';
import vtkWSLinkClient from "@kitware/vtk.js/IO/Core/WSLinkClient";
import {BehaviorSubject, Subject} from "rxjs";
import {SystemService} from "@services/system/system.service";
import {environment} from "@env";
import {ConsoleService} from "@services/console/console.service";


@Injectable({
  providedIn: 'root'
})
export class VtkWsLinkService {
  public session: any;
  private client = vtkWSLinkClient.newInstance();
  private isConnected$ = new BehaviorSubject<boolean>(false);
  private maxAttempts = 5;
  private attemptDelayMs = 2000;
  private processId: string = '';
  private progressSubject = new Subject<any>();

  constructor(
    private systemService: SystemService
  ) {
  }

  getConnectionStatus() {
    return this.isConnected$.asObservable();
  }

  getClient() {
    return this.client;
  }

  setProcessId(processId: string) {
    this.processId = processId;
  }

  async startWithRetry(sessionURL: string = environment.middleware.wslink) {
    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      await this.sleep(this.attemptDelayMs);
      ConsoleService.log(`🔁 Tentativo ${attempt}: connessione a ${sessionURL}`);

      try {
        const res = await this.client.connect({sessionURL});
        this.session = res.getConnection().getSession()
        ConsoleService.log('✅ Connessione stabilita!');
        this.isConnected$.next(true);
        await this.handleSession();
        return;
      } catch (err: any) {
        console.warn(`❌ Connessione fallita (${attempt}):`, err.message);
        this.isConnected$.next(false);
      }
    }

    console.error('❌ Tutti i tentativi falliti.');
  }

  async call(rpcID: string, payload: {} = {}) {
    payload = {
      ...payload,
      sessionId: await this.systemService.getSession(),
      processId: this.processId
    };
    //ConsoleService.log('call', rpcID, payload);
    this.systemService.isLoading.set(true);
    return this.session.call(rpcID, [payload])
      .then((response: any) => {
        this.systemService.isLoading.set(false);
        return response;
      });
  }

  uploadFile(file: File, chunkSize: number) {
    chunkSize = chunkSize * 1024 * 1024; // 10 MB
    const totalChunks = Math.ceil(file.size / chunkSize);


    ConsoleService.log('File size:', file.size);
    ConsoleService.log('Total chunks:', totalChunks);

    const uploadChunk = async (chunkIndex: number): Promise<void> => {
      if (chunkIndex >= totalChunks) {
        return;
      }

      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const blob = file.slice(start, end);

      try {
        const base64Chunk = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]); // Rimuove il prefisso base64
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        const response = await this.call("file.chunk.upload", {
          chunk_index: chunkIndex,
          total_chunks: totalChunks,
          file_name: file.name,
          data: base64Chunk
        });

        if (response.status === 'completed') {
          this.progressSubject.next({ isOpen: false, chunkIndex, totalChunks, status: response.status });
          return;
        }

        this.progressSubject.next({ isOpen: true, chunkIndex, totalChunks, status: response.status });

        await uploadChunk(chunkIndex + 1);

      } catch (err) {
        console.error(`Errore durante l'invio del chunk ${chunkIndex}:`, err);
        this.progressSubject.next({ isOpen: false, chunkIndex, totalChunks });
      }
    };
    this.progressSubject.next({isOpen: false, totalChunks: 0, chunkIndex: 0, status: 'importing'});
    uploadChunk(0);
    return this.progressSubject.asObservable();
  }


  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async handleSession() {
    const {sessionId, processId} = await this.call('get.session.id');
    this.systemService.setSession(sessionId);
    this.systemService.setProcess(processId);
  }
}

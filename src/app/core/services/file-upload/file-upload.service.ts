import { Injectable } from '@angular/core';
import { VtkWsLinkService } from "@services/vtk-ws-link/vtk-ws-link.service";
import { SystemService } from "@services/system/system.service";
import { ConsoleService } from "@services/console/console.service";

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    constructor(
        private vtkWsLinkService: VtkWsLinkService,
        private systemService: SystemService
    ) {
    }

    async uploadFile(file: File, onProgress: (status: number, max: number) => void): Promise<void> {
        const chunkSize = 10 * 1024 * 1024; // 10 MB
        const totalChunks = Math.ceil(file.size / chunkSize);

        ConsoleService.log('File size:', file.size);
        ConsoleService.log('Total chunks:', totalChunks);

        onProgress(0, totalChunks);

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            onProgress(chunkIndex, totalChunks);

            const start = chunkIndex * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const blob = file.slice(start, end);

            const base64Chunk = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    const base64 = result.split(',')[1]; // rimuove "data:...;base64,"
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            try {
                let response = await this.vtkWsLinkService.call("file.chunk.upload", {
                    chunk_index: chunkIndex,
                    total_chunks: totalChunks,
                    file_name: file.name,
                    data: base64Chunk
                });
                if (response.status === 'completed') {
                    break;
                }
            } catch (err) {
                console.error(`Errore durante l'invio del chunk ${chunkIndex}:`, err);
                throw err;
            }
        }

        const { processId } = await this.vtkWsLinkService.call("create.process", {
            resource: {
                filename: file.name,
                type: 'upload'
            }
        });

        this.systemService.openWindow(`data-view/${processId}`);
    }
}

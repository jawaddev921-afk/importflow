import { Injectable, EventEmitter } from '@angular/core';
import { EventCalls, IShowWidgetProps, logError } from '@importflow/client';

@Injectable({
  providedIn: 'root',
})
export class ImportFlowService {
  private uuid: string;
  private isImportFlowReady = false;
  private widgetEvents = new EventEmitter<EventCalls>(true);

  initializeImportFlow(): void {
    this.uuid = this.generateUuid();
    if (window.importflow) {
      window.importflow.init(this.uuid);
      const intervalId = setInterval(() => {
        if (window.importflow.isReady()) {
          this.isImportFlowReady = true;
          clearInterval(intervalId);
        }
      }, 1000);

      window.importflow.on(
        'message',
        (eventData: EventCalls) => {
          this.widgetEvents.emit(eventData);
        },
        this.uuid
      );
    } else logError('IMPORTFLOW_UNDEFINED_ERROR');
  }

  showWidget(options: IShowWidgetProps): void {
    if (this.isImportFlowReady) {
      window.importflow.show({ ...options, uuid: this.uuid });
    } else {
      logError('IMPORTFLOW_UNDEFINED_ERROR');
    }
  }

  getReadyState(): boolean {
    return this.isImportFlowReady;
  }

  private generateUuid(): string {
    return window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
  }
  closeWidget() {
    if (window.importflow) {
      window.importflow.close();
    } else logError('IMPORTFLOW_UNDEFINED_ERROR');
  }
  subscribeToWidgetEvents(callback: (data: EventCalls) => void): void {
    this.widgetEvents.subscribe(callback);
  }
}

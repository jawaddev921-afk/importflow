/* eslint no-undef: 0 */
/* eslint promise/param-names: 0 */
/* eslint-disable */
//

import { EventTypesEnum, WidgetEventTypesEnum } from './shared/eventTypes';
import { UnmountedError } from './shared/errors';
import { IFRAME_URL } from './shared/resources';

const WEASL_WRAPPER_ID = 'importflow-container';
const IFRAME_ID = 'importflow-iframe-element';
const WRAPPER_CLASS_NAME = 'wrapper-importflow-widget';

class ImportFlow {
  private projectId: string = '';

  private onloadFunc: (b: any) => void;

  private iframe: HTMLIFrameElement | undefined;

  private widgetVisible = false;

  private listeners: {
    [key: string]: { [key: string]: (data: any) => void };
  } = {};

  private initPayload: any;

  private activeWidgetId: string | undefined;

  private isWidgetReady: boolean = false;

  constructor(onloadFunc = function () {}) {
    this.onloadFunc = onloadFunc;
    this.widgetVisible = false;
  }

  on = (name: string, cb: (data: any) => void, id: string = '1') => {
    if (!this.listeners[id]) this.listeners[id] = {};
    this.listeners[id][name] = cb;
  };

  init = (widgetOrProjectId: string = '1', initPayload: { accessToken: string }) => {
    if (initPayload) {
      this.projectId = widgetOrProjectId;
      this.initPayload = initPayload;
    }
    this.initializeIframe(widgetOrProjectId);
    this.mountIframe();
  };

  positionIframe = () => {
    const wrapper: any = document.querySelector(`.${WRAPPER_CLASS_NAME}`);

    wrapper.style.position = 'absolute';
    wrapper.style.height = '100vh';
    wrapper.style.width = '100vw';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
  };

  hideWidget = () => {
    var elem = document.querySelector(`.${WRAPPER_CLASS_NAME}`) as HTMLBodyElement;

    if (elem) {
      elem.style.visibility = 'hidden';
    }
  };

  showWidget = (payload: any) => {
    this.ensureMounted();
    this.widgetVisible = !this.widgetVisible;
    var elem = document.querySelector(`.${WRAPPER_CLASS_NAME}`) as HTMLBodyElement;

    if (elem) {
      elem.style.visibility = 'visible';
    }
    if (payload.uuid) {
      this.activeWidgetId = payload.uuid;
    } else {
      this.activeWidgetId = '1';
    }

    this.iframe?.contentWindow?.postMessage(
      {
        type: WidgetEventTypesEnum.SHOW_WIDGET,
        value: {
          projectId: this.projectId,
          ...(this.initPayload || {}),
          ...payload,
          host: location.host,
        },
      },
      '*'
    );
  };

  closeWidget = () => {
    this.ensureMounted();
    this.iframe?.contentWindow?.postMessage(
      {
        type: WidgetEventTypesEnum.CLOSE_WIDGET,
      },
      '*'
    );
    this.hideWidget();
  }

  isReady = () => this.isWidgetReady;

  // PRIVATE METHODS
  ensureMounted = () => {
    if (!document.getElementById(IFRAME_ID)) {
      throw new UnmountedError('importflow.init needs to be called first');
    }
  };

  receiveMessage = (event: any) => {
    if (!!event && !!event.data && !!event.data.type) {
      // eslint-disable-next-line default-case
      switch (event.data.type) {
        case EventTypesEnum.WIDGET_READY:
          this.isWidgetReady = true;
          if (typeof this.listeners === 'object') {
            Object.keys(this.listeners).forEach((id) => {
              this.postMessageToContentWindow(EventTypesEnum.WIDGET_READY, id);
            });
          }
          break;
        case EventTypesEnum.CLOSE_WIDGET:
          this.hideWidget();
          this.postMessageToContentWindow(event.data.type, this.activeWidgetId!);
          break;
        default:
          this.postMessageToContentWindow(event.data.type, this.activeWidgetId!, event.data.value);
      }
    }
  };

  postMessageToContentWindow(type: EventTypesEnum, id: string, value?: any): void {
    if (!this.listeners[id]?.['message']) {
      return;
    }
    this.listeners[id]['message']({ type, value });
  }

  initializeIframe = (id: string) => {
    let iframe: HTMLIFrameElement;
    if (!document.getElementById(IFRAME_ID)) {
      const iframe = document.createElement('iframe');

      iframe.style.backgroundColor = 'transparent';
      iframe.src = `${IFRAME_URL}/widget?id=${id}`;
      iframe.id = IFRAME_ID;
      iframe.style.border = 'none';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.style.overflow = 'hidden';
      iframe.style.zIndex = Number.MAX_SAFE_INTEGER.toString();
      (iframe as any).crossorigin = 'anonymous';
      this.iframe = iframe;
    } else {
      iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement;
      this.iframe = iframe;
    }
  };

  mountIframe = () => {
    if (!document.getElementById(IFRAME_ID) && this.iframe) {
      window.addEventListener('message', this.receiveMessage, false);

      const wrapper = document.createElement('div');

      wrapper.className = WRAPPER_CLASS_NAME;
      wrapper.style.visibility = 'hidden';
      wrapper.id = WEASL_WRAPPER_ID;
      wrapper.style.zIndex = String(Number.MAX_SAFE_INTEGER);
      wrapper.style.width = '0';
      wrapper.style.height = '0';
      wrapper.style.position = 'relative';
      wrapper.appendChild(this.iframe);
      document.body.appendChild(wrapper);
    }
  };
}

export default ((window: any) => {
  const onloadFunc =
    window.importflow && window.importflow.onload && typeof window.importflow.onload === 'function'
      ? window.importflow.onload
      : function () {};

  const importflow = new ImportFlow(onloadFunc);

  (window as any).importflow = {};
  (window as any).importflow.init = importflow.init;
  (window as any).importflow.on = importflow.on;
  (window as any).importflow.show = importflow.showWidget;
  (window as any).importflow.close = importflow.closeWidget;
  (window as any).importflow.isReady = importflow.isReady;
})(window);

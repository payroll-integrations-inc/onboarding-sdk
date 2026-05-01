export interface BootstrapConfig {
  /**
   * Token retrieved from Payroll Integrations API
   * See: URL_TODO
   */
  token: string;
  /**
   * CSS selector for the element to attach the SDK
   * frame. Defaults to `#pi-host`.
   */
  selector?: string;
  callbacks?: {
    message?: (value: any) => unknown;
    success?: (value: string) => unknown;
    error?: (value: string) => unknown;
  };
  /**
   * Overrides the default iframe host. Defaults to
   * https://secure.payrollintegrationsapp.com
   */
  frameHost?: string;
  /**
   * Override the default frame style
   */
  frameStyle?: {
    zIndex?: string;
    height?: string;
    width?: string;
    border?: string;
  };
}

export interface WindowState {
  host?: HTMLElement;
  iframe?: HTMLIFrameElement;
  callbacks?: BootstrapConfig["callbacks"];
}

export type SdkMessageData = {
  source: "pi-sdk";
} & (
  | {
      type: "token";
      value: string;
    }
  | {
      type: "error";
      value: string;
    }
  | {
      type: "success";
      value: string;
    }
);

export type SdkMessage = MessageEvent<SdkMessageData>;

declare global {
  interface Window {
    __PAYROLL_INTEGRATIONS__: WindowState;
  }
}

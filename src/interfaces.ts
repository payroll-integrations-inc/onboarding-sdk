export interface BootstrapConfig {
  /**
   * Onboarding URL retrieved from Payroll Integrations API
   * See: URL_TODO
   */
  onboardingLink: string;
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
}

export interface SdkState {
  host?: HTMLElement;
  iframe?: HTMLIFrameElement;
  callbacks?: BootstrapConfig["callbacks"];
  incomingMessageAbortController?: AbortController;
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
  | {
      type: "style";
      value: {
        height: string;
        width: string;
      };
    }
);

export type SdkMessage = MessageEvent<SdkMessageData>;

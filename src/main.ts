import {
  DEFAULT_HOST_ELEMENT_SELECTOR,
  DEFAULT_ONBOARDING_HOST,
  MESSAGE_SOURCE,
} from "./constants";
import type { SdkMessage, BootstrapConfig, SdkMessageData } from "./interfaces";

function getFrameSrc(host: string) {
  let preparedHost = host.endsWith("/") ? host.slice(0, host.length - 1) : host;
  return [preparedHost, "link/start"].join("/");
}

function isSdkMessage(message: MessageEvent): message is SdkMessage {
  return message?.data?.source === MESSAGE_SOURCE && message?.data?.type;
}

function handleMessage(message: MessageEvent) {
  if (isSdkMessage(message)) {
    if (message.data.type === "error") {
      console.error(message.data.value);
      window.__PAYROLL_INTEGRATIONS__.callbacks?.error?.(message.data.value);
    }
    if (message.data.type === "success") {
      window.__PAYROLL_INTEGRATIONS__.callbacks?.success?.(message.data.value);
    }
  }
}

export function bootstrap(config: BootstrapConfig) {
  const {
    token,
    selector = DEFAULT_HOST_ELEMENT_SELECTOR,
    frameHost = DEFAULT_ONBOARDING_HOST,
    frameStyle = {},
    callbacks,
  } = config;

  if (!window.__PAYROLL_INTEGRATIONS__) {
    window.__PAYROLL_INTEGRATIONS__ = {};
  }
  window.__PAYROLL_INTEGRATIONS__.callbacks = callbacks;

  if (!token) {
    throw new Error(`The token parameter is required!`);
  }

  const host = document.querySelector<HTMLElement>(selector);

  // Ensure valid host element
  if (!host) {
    throw new Error(
      `Could not find host element to attach to with selector ${selector}`,
    );
  }

  // Remove old message listeners and add a new one
  window.removeEventListener("message", handleMessage);
  window.addEventListener("message", handleMessage);

  // Clear the host of previous iframes/other elements
  host.replaceChildren();

  // Create our iframe
  const iframe = document.createElement("iframe");
  iframe.src = getFrameSrc(frameHost);
  iframe.frameBorder = "0";
  iframe.style.zIndex = frameStyle.zIndex ?? "900";
  iframe.style.height = frameStyle.height ?? "600px";
  iframe.style.width = frameStyle.width ?? "400px";
  iframe.style.border = frameStyle.border ?? "none";
  iframe.allow = "clipboard-write; clipboard-read";
  iframe.onload = () => {
    const tokenMessage: SdkMessageData = {
      source: MESSAGE_SOURCE,
      type: "token",
      value: token,
    };
    callbacks?.message?.(tokenMessage);
    iframe.contentWindow?.postMessage(tokenMessage, frameHost);
  };
  host.append(iframe);
}

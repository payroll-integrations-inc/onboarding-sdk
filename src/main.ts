import {
  DEFAULT_HOST_ELEMENT_SELECTOR,
  DEFAULT_ONBOARDING_HOST,
  INCOMING_MESSAGE_SOURCE,
  OUTGOING_MESSAGE_SOURCE,
} from "./constants";
import type {
  SdkMessage,
  BootstrapConfig,
  SdkMessageData,
  SdkState,
} from "./interfaces";

const sdkState: SdkState = {};

function getFrameSrc(host: string) {
  let preparedHost = host.endsWith("/") ? host.slice(0, host.length - 1) : host;
  return [preparedHost, "link/start"].join("/");
}

function isSdkMessage(
  message: MessageEvent,
  targetOrigin: string,
  messageSource: string,
): message is SdkMessage {
  return (
    message.origin === targetOrigin &&
    message.data?.source === messageSource &&
    message.data?.type
  );
}

function handleMessage(message: SdkMessage) {
  if (message.data.type === "error") {
    console.error(message.data.value);
    sdkState.callbacks?.error?.(message.data.value);
  }
  if (message.data.type === "success") {
    sdkState.callbacks?.success?.(message.data.value);
  } else {
    sdkState.callbacks?.message?.(message.data.value);
  }
}

function handleIncomingMessage(message: MessageEvent, targetOrigin: string) {
  if (isSdkMessage(message, targetOrigin, INCOMING_MESSAGE_SOURCE)) {
    return handleMessage(message);
  }
}

function throwError(message: string) {
  sdkState.callbacks?.error?.(message);
  throw new Error(message);
}

export function bootstrap(config: BootstrapConfig) {
  const {
    onboardingUrl,
    selector = DEFAULT_HOST_ELEMENT_SELECTOR,
    frameHost = DEFAULT_ONBOARDING_HOST,
    frameStyle = {},
    callbacks,
  } = config;

  sdkState.callbacks = callbacks;

  if (!onboardingUrl) {
    throwError("The onboardingUrl parameter is required!");
    return;
  }

  const params = new URL(onboardingUrl).searchParams;
  const token = params.get("token");

  if (!token) {
    throwError("Invalid onboarding URL. The token parameter is required!");
    return;
  }

  const host = document.querySelector<HTMLElement>(selector);

  // Ensure valid host element
  if (!host) {
    throwError(
      `Could not find host element to attach to with selector ${selector}`,
    );
    return;
  }

  // Remove old message listener, set up abort controller for removal
  if (sdkState.incomingMessageAbortController) {
    sdkState.incomingMessageAbortController.abort();
  }
  sdkState.incomingMessageAbortController = new AbortController();

  // Add new message listener, use AbortSignal for removal
  window.addEventListener(
    "message",
    (event) => handleIncomingMessage(event, frameHost),
    { signal: sdkState.incomingMessageAbortController.signal },
  );

  // Clear the host of previous iframes/other elements
  host.replaceChildren();

  // Create our iframe
  const height = `${frameStyle.heightPx ?? 600}px`;
  const width = `${frameStyle.widthPx ?? 420}px`;
  const iframe = document.createElement("iframe");
  iframe.src = getFrameSrc(frameHost);
  iframe.frameBorder = "0";
  iframe.style.zIndex = frameStyle.zIndex ?? "900";
  iframe.style.height = height;
  iframe.style.width = width;
  iframe.style.border = frameStyle.border ?? "none";
  iframe.allow = "clipboard-write; clipboard-read";
  iframe.onload = () => {
    // Send token to pi app
    const tokenMessage: SdkMessageData = {
      source: OUTGOING_MESSAGE_SOURCE,
      type: "token",
      value: token,
    };
    iframe.contentWindow?.postMessage(tokenMessage, frameHost);
  };
  host.append(iframe);
}

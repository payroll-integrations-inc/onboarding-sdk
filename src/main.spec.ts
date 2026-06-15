import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { bootstrap } from "./main";
import { DEFAULT_HOST_ELEMENT_ID } from "./constants";
import type { BootstrapConfig } from "./interfaces";

function config(overrides?: Partial<BootstrapConfig>): BootstrapConfig {
  return {
    onboardingLink: "http://mock-token-url.example.com?token=mock-token",
    frameHost: "http://localhost:4201",
    ...overrides,
  };
}

describe("bootstrap", () => {
  test("errors if no matching host element is found", () => {
    try {
      bootstrap(config());
      throw new Error("THIS SHOULD HAVE THROWN");
    } catch (err) {
      expect(
        (err as Error).message.includes("Could not find host element"),
      ).toBeTruthy();
    }
  });

  test("errors if no token is provided, or is empty", () => {
    try {
      bootstrap(config({ onboardingLink: "" }));
      throw new Error("THIS SHOULD HAVE THROWN");
    } catch (err) {
      expect(
        (err as Error).message.includes("onboardingLink parameter is required"),
      ).toBeTruthy();
    }
  });

  describe("host element", () => {
    let host: HTMLDivElement;
    beforeEach(() => {
      host = document.createElement("div");
      host.id = DEFAULT_HOST_ELEMENT_ID;
      document.body.appendChild(host);
    });
    afterEach(() => {
      host.remove();
    });

    test("should look for default host element", () => {
      expect(host.childNodes.length).toEqual(0);

      bootstrap(config());

      expect(host.childNodes.length).toEqual(1);
    });

    test("should support custom host element selector", () => {
      host.classList.add("custom-selector");
      expect(host.childNodes.length).toEqual(0);
      bootstrap(config({ selector: ".custom-selector" }));
      expect(host.childNodes.length).toEqual(1);
    });

    test("should not add more than one iframe on subsequent bootstrap calls", () => {
      expect(host.childNodes.length).toEqual(0);
      bootstrap(config());
      expect(host.childNodes.length).toEqual(1);
      bootstrap(config());
      expect(host.childNodes.length).toEqual(1);
    });
  });

  describe("iframe", () => {
    let host: HTMLDivElement;
    beforeEach(() => {
      host = document.createElement("div");
      host.id = DEFAULT_HOST_ELEMENT_ID;
      document.body.appendChild(host);
    });
    afterEach(() => {
      host.remove();
    });

    test("should sanitize trailing slash on host", () => {
      bootstrap(config({ frameHost: "http://localhost:4201/" }));
      const iframe = host.querySelector("iframe");
      expect(iframe).toBeTruthy();
      expect(iframe!.src.endsWith("localhost:4201/link/start")).toBeTruthy();
    });

    test("should connect to the onboarding start url", () => {
      bootstrap(config());
      const iframe = host.querySelector("iframe");
      expect(iframe).toBeTruthy();
      expect(iframe!.src.endsWith("link/start")).toBeTruthy();
    });

    test("should include clipboard permissions", () => {
      bootstrap(config());
      const iframe = host.querySelector("iframe");
      expect(iframe).toBeTruthy();
      expect(iframe!.allow.includes("clipboard-write")).toBeTruthy();
      expect(iframe!.allow.includes("clipboard-read")).toBeTruthy();
    });

    describe("onload", () => {
      test("should post token message", () => {
        bootstrap(config());
        const iframe = host.querySelector("iframe");
        expect(iframe).toBeTruthy();
        const onload = iframe?.onload as () => void;
        vi.spyOn(iframe?.contentWindow!, "postMessage");
        expect(iframe?.contentWindow?.postMessage).not.toHaveBeenCalled();
        onload();
        expect(iframe?.contentWindow?.postMessage).toHaveBeenCalled();
      });
    });
  });
});

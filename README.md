# Onboarding SDK

A lightweight JavaScript SDK for embedding the [Payroll Integrations](https://payrollintegrationsapp.com) onboarding flow into your web application via an iframe.

## Overview

The SDK mounts a secure iframe into a host element on your page and handles two-way communication between your app and the Payroll Integrations platform using the `postMessage` API.

## Installation

> **Note:** This package has not yet been published. Installation instructions will be added once it is available.

## Usage

1. Add a host element to your page:

```html
<div id="pi-host"></div>
```

2. Call `bootstrap` with a token obtained from the Payroll Integrations API:

```js
import { bootstrap } from "onboarding-sdk";

bootstrap({
  token: "YOUR_API_TOKEN",
  callbacks: {
    success: (value) => console.log("Onboarding complete", value),
    error: (value) => console.error("Onboarding error", value),
  },
});
```

## Configuration

| Option | Type | Default | Description |
|---|---|---|---|
| `token` | `string` | **required** | Token retrieved from the Payroll Integrations API |
| `selector` | `string` | `#pi-host` | CSS selector for the element to mount the iframe into |
| `frameHost` | `string` | `https://secure.payrollintegrationsapp.com` | Override the iframe host URL |
| `frameStyle.height` | `string` | `600px` | iframe height |
| `frameStyle.width` | `string` | `400px` | iframe width |
| `frameStyle.zIndex` | `string` | `900` | iframe z-index |
| `frameStyle.border` | `string` | `none` | iframe border |
| `callbacks.success` | `(value: string) => unknown` | — | Called when onboarding completes successfully |
| `callbacks.error` | `(value: string) => unknown` | — | Called when an error occurs |
| `callbacks.message` | `(value: any) => unknown` | — | Called for every outbound message sent to the iframe |

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## License

Copyright © Payroll Integrations Inc. All rights reserved.

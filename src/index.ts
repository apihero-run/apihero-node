import { ApiHeroEndpoint } from "@apihero/core";
import invariant from "tiny-invariant";
import { FetchEndpointResult } from "./@types";
import fetch from "node-fetch";

const GATEWAY_URL =
  process.env.APIHERO_GATEWAY_URL ?? "https://gateway.apihero.run";
const PROJECT_KEY = process.env.APIHERO_PROJECT_KEY;

invariant(
  PROJECT_KEY,
  "APIHero project key is required. Set process.env.APIHERO_PROJECT_KEY"
);

export function createEndpoint<TProps, TResponseBody, THeaders>(
  endpoint: ApiHeroEndpoint<TProps, TResponseBody, THeaders>
): (props: TProps) => Promise<FetchEndpointResult<TResponseBody>> {
  return async (props: TProps) => {
    return fetchEndpoint(endpoint, props);
  };
}

export async function fetchEndpoint<TProps, TResponseBody, THeaders>(
  endpoint: ApiHeroEndpoint<TProps, TResponseBody, THeaders>,
  props: TProps
): Promise<FetchEndpointResult<TResponseBody>> {
  const response = await fetch(`${GATEWAY_URL}/gateway/run`, {
    method: "POST",
    body: JSON.stringify({
      endpoint,
      params: props,
    }),
    headers: {
      Authorization: `token ${PROJECT_KEY}`,
    },
  });

  if (!response.ok) {
    const error = new Error(response.statusText);

    return {
      body: undefined,
      error,
      status: "error",
    };
  }

  const body = await response.json();

  return {
    body,
    error: undefined,
    status: "success",
  };
}

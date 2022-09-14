import { ApiHeroEndpoint } from "@apihero/core";
import invariant from "tiny-invariant";
import { FetchEndpointResult } from "./@types";
import fetch from "node-fetch";
import debugFactory from "debug";

const debug = debugFactory("apihero:node");

const GATEWAY_URL =
  process.env.APIHERO_GATEWAY_URL ?? "https://gateway.apihero.run";
const PROJECT_KEY = process.env.APIHERO_PROJECT_KEY;

export type EndpointOptions = {
  projectKey?: string;
  gatewayUrl?: string;
};

export function createEndpoint<TProps, TResponseBody, THeaders>(
  endpoint: ApiHeroEndpoint<TProps, TResponseBody, THeaders>,
  options: EndpointOptions = {}
): (props: TProps) => Promise<FetchEndpointResult<TResponseBody>> {
  return async (props: TProps) => {
    return fetchEndpoint(endpoint, props, options);
  };
}

export async function fetchEndpoint<TProps, TResponseBody, THeaders>(
  endpoint: ApiHeroEndpoint<TProps, TResponseBody, THeaders>,
  props: TProps,
  options: EndpointOptions = {}
): Promise<FetchEndpointResult<TResponseBody>> {
  const projectKey = options.projectKey ?? PROJECT_KEY;

  invariant(
    projectKey,
    "APIHero project key is required. Set process.env.APIHERO_PROJECT_KEY or pass projectKey as an option"
  );

  const gatewayUrl = options.gatewayUrl ?? GATEWAY_URL;

  debug(
    "fetching endpoint %s from %s, with props %o",
    endpoint.id,
    gatewayUrl,
    props
  );

  const response = await fetch(`${gatewayUrl}/gateway/run`, {
    method: "POST",
    body: JSON.stringify({
      endpoint,
      params: props,
    }),
    headers: {
      Authorization: `token ${projectKey}`,
    },
  });

  debug("response for endpoint %s [%d]", endpoint.id, response.status);

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

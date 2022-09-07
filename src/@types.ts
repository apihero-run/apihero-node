export type FetchStatus = "success" | "error";

interface FetchEndpointBaseResult<TResponseBody = unknown> {
  body: TResponseBody | undefined;
  status: FetchStatus;
  error: Error | undefined;
}

interface FetchEndpointSuccessResult<TResponseBody = unknown>
  extends FetchEndpointBaseResult<TResponseBody> {
  body: TResponseBody;
  status: "success";
}

interface FetchEndpointErrorResult<TResponseBody = unknown>
  extends FetchEndpointBaseResult<TResponseBody> {
  body: undefined;
  error: Error;
  status: "error";
}

export type FetchEndpointResult<TResponseBody = unknown> =
  | FetchEndpointSuccessResult<TResponseBody>
  | FetchEndpointErrorResult<TResponseBody>;

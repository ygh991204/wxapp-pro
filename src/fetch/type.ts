export type WxRequestOption = Omit<WechatMiniprogram.RequestOption, 'complete' | 'fail' | 'success' | 'method'> & {
  method?:
  | WechatMiniprogram.RequestOption['method']
  | 'options'
  | 'get'
  | 'head'
  | 'post'
  | 'put'
  | 'delete'
  | 'trace'
  | 'connect'
}

export type FetchConfig = Partial<
Omit<WxRequestOption, 'url'> & {
  baseUrl: string
}
>

export type RequestOption = WxRequestOption & {
  taskId?: string
}

export type FetchOption = Omit<RequestOption, 'url'>

export type RequestFulfilled = (value: RequestOption) => RequestOption | Promise<RequestOption>

export type ResponseFulfilled = (
  value: WechatMiniprogram.RequestSuccessCallbackResult
) => WechatMiniprogram.RequestSuccessCallbackResult | Promise<WechatMiniprogram.RequestSuccessCallbackResult>

export type Rejected = (err: any) => any

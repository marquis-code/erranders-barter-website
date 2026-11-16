import { GATEWAY_ENDPOINT } from '../axios.config';
export const escrowApi = {
  initiate: (data: any) => GATEWAY_ENDPOINT.post('/escrow/initiate', data),
  initiateNegotiation: (data: any) => GATEWAY_ENDPOINT.post('/escrow/initiate-negotiation', data),
  /** Check a Paystack reference with the backend and settle the escrow it belongs to. */
  verifyCallback: (reference: string) =>
    GATEWAY_ENDPOINT.get('/escrow/payment-callback', { params: { reference } }),

  confirmPayment: (txId: string, data: { paymentReference: string; negotiatedFee?: number }) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/confirm-payment`, data),
  getTransaction: (txId: string) => GATEWAY_ENDPOINT.get(`/escrow/${txId}`),
  release: (txId: string) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/release`),
  dispute: (txId: string) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/dispute`),
  /** Server-side Paystack: returns the authorisation URL to send the buyer to. */
  initializePayment: (txId: string) => GATEWAY_ENDPOINT.post(`/escrow/${txId}/initialize-payment`),

  acceptNegotiation: (txId: string) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/accept-negotiation`),
  counterNegotiation: (txId: string, amount: number) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/counter-negotiation`, { amount }),
  myTransactions: () => GATEWAY_ENDPOINT.get('/escrow/my-transactions')
};
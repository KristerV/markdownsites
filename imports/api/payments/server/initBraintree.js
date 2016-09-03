export const braintreGateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: G.getEnv('BRAINTREE_MERCHANT_ID'),
	publicKey: G.getEnv('BRAINTREE_PUBLIC_KEY'),
	privateKey: G.getEnv('BRAINTREE_PRIVATE_KEY'),
});
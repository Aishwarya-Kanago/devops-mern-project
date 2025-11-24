// Use the ingress-mounted backend path so the frontend talks to the in-cluster API
// When the app is served from the same host, `/api` will be routed by ingress
// to the backend service (see infra/minikube/ingress.tf)
export const BASEAPIURL = "/api";

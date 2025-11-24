resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
  }
}

/*resource "helm_release" "monitoring" {
  name       = "kube-prometheus-stack"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name

  values = [
    <<EOF
grafana:
  service:
    type: NodePort
    nodePort: 32000

prometheus:
  service:
    type: NodePort
    nodePort: 32001
EOF
  ]
}*/
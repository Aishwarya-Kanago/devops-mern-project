locals {
  # Use nip.io automatically if domain is empty
  host = var.domain != "" ? "app.${var.domain}" : "app.${chomp(trimspace(data.external.minikube_ip.result.ip))}.nip.io"
}

data "external" "minikube_ip" {
  program = ["bash", "-lc", "minikube ip | tr -d '\\n' | awk '{print \"{\\\"ip\\\":\\\"\"$0\"\\\"}\"}'"]
}

resource "kubernetes_ingress_v1" "app" {
  metadata {
    name      = "mern-ingress"
    namespace = var.namespace
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
    }
  }
  spec {
    rule {
      host = local.host
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service.frontend.metadata[0].name
              port { number = 80 }
            }
          }
        }
      }
    }
  }
}

output "app_url" {
  value = "http://${local.host}"
}
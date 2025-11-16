# Get Minikube IP using external provider
data "external" "minikube_ip" {
  program = ["powershell", "-Command", "minikube ip | % { '{\"ip\":\"' + $_ + '\"}' }"]
}

# Build hostname
locals {
  minikube_ip = data.external.minikube_ip.result.ip
}

locals {
  host = var.domain != "" ? "app.${var.domain}" : "app.${local.minikube_ip}.nip.io"
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

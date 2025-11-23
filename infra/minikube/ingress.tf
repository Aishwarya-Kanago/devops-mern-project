/*GET MINIKUBE IP*/
data "external" "minikube_ip" {
  program = [
    "powershell",
    "-NoProfile",
    "-NonInteractive",
    "-ExecutionPolicy", "Bypass",
    "-Command",
    "$ip = (minikube ip | Out-String).Trim(); Write-Output ('{\"ip\":\"' + $ip + '\"}')"
  ]
}

/*LOCAL VARIABLES*/
locals {
  minikube_ip = trim(data.external.minikube_ip.result.ip, "\"")
  host        = var.domain != "" ? "app.${var.domain}" : "app.${local.minikube_ip}.nip.io"
}


/*INGRESS RESOURCE*/
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
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }
}

/*OUTPUT*/
output "app_url" {
  description = "Ingress URL"
  value       = "http://${local.host}"
}
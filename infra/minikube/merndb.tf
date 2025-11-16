resource "kubernetes_deployment" "mongo" {
  metadata {
    name      = "mongo"
    namespace = var.namespace
    labels    = { app = "mongo" }
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "mongo" } }
    template {
      metadata { labels = { app = "mongo" } }
      spec {
        container {
          name  = "mongo"
          image = "mongo:6.0"
          port { container_port = 27017 }
          args = ["--bind_ip_all"]
          resources {
            requests = { cpu = "50m", memory = "128Mi" }
            limits   = { cpu = "300m", memory = "256Mi" }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "mongo" {
  metadata {
    name      = "mongo-svc"
    namespace = var.namespace
    labels    = { app = "mongo" }
  }
  spec {
    selector = { app = "mongo" }
    port {
      port        = 27017
      target_port = 27017
    }

    type = "ClusterIP"
  }
}
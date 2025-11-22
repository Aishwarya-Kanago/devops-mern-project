resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "backend"
    namespace = var.namespace
    labels = {
      app = "backend"
    }
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          name  = "backend"
          image = var.backend_image

          port {
            container_port = 3000
          }

          env {
            name  = "MONGO_URL"
            value = "mongodb://mongo-svc.${var.namespace}.svc.cluster.local:27017/mern"
          }

          resources {
            requests = {
              cpu    = "50m"
              memory = "64Mi"
            }
            limits = {
              cpu    = "300m"
              memory = "256Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend" {
  metadata {
    name      = "backend-svc"
    namespace = var.namespace
    labels = {
      app = "backend"
    }

    annotations = {
      "prometheus.io/scrape" = "true"
      "prometheus.io/port"   = "3000"
      "prometheus.io/path"   = "/metrics"
    }
  }

  spec {
    selector = {
      app = "backend"
    }

    port {
      port        = 3000
      target_port = 3000
    }

    type = "ClusterIP"
  }
}
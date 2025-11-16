variable "kubeconfig_path" {
  description = "Path to kubeconfig file"
  type        = string
}

provider "kubernetes" {
  config_path = var.kubeconfig_path
}

provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_path
  }
}

provider "external" {}
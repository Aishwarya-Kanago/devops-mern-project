variable "kubeconfig_path" {
  description = "Path to kubeconfig file"
  type        = string
  default     = "/var/lib/jenkins/.kube/config"
}

provider "kubernetes" {
  config_path = pathexpand(var.kubeconfig_path)
}

provider "helm" {
  kubernetes {
    config_path = pathexpand(var.kubeconfig_path)
  }
}
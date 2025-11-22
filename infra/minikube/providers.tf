variable "kubeconfig_path" {
  description = "Path to kubeconfig file"
  type        = string
}

provider "kubernetes" {
  config_path = "C:/Users/Aishwarya_SK/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "C:/Users/Aishwarya_SK/.kube/config"
  }
}

provider "external" {}
provider "kubernetes" {
  config_path = "C:/ProgramData/Jenkins/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "C:/ProgramData/Jenkins/.kube/config"
  }
}

provider "external" {}
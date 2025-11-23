data "external" "minikube_ip" {
  program = ["cmd", "/c", "minikube ip"]
}
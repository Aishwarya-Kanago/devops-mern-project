variable "namespace" {
  description = "Kubernetes namespace for the app"
  type        = string
  default     = "demo"
}

variable "domain" { 
  type = string
  default = "" 
}

variable "replicas" {
  description = "Number of nginx pods"
  type        = number
  default     = 1
}

variable "frontend_image" {
  description = "Frontend Docker image"
  default     = "mern-frontend:local"
}

variable "backend_image" {
  description = "Backend Docker image"
  default     = "mern-backend:local"
}

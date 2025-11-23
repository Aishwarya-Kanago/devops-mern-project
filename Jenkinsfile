/* Jenkins Script to Build Docker Images, Load into Minikube,
   and Deploy using Terraform (not using the pipeline from SCM)

  pipeline {
  agent any

  stages {

    /* -----------------------------
       CLONE THE MONOREPO
    --------------------------------
    stage('Clone Repository') {
      steps {
        git url: 'https://github.com/Aishwarya-Kanago/devops-mern-project.git', branch: 'main'
      }
    }

    /* -----------------------------
       BUILD DOCKER IMAGES
    --------------------------------
    stage('Build Docker Images') {
      steps {
        echo "Building Docker Images..."

        // Build frontend image
        dir('frontend') {
          bat 'docker build -t mern-frontend:local .'
        }

        // Build backend image
        dir('backend') {
          bat 'docker build -t mern-backend:local .'
        }

        // Load images into Minikube
        bat '''
          echo Loading Docker images into Minikube...
          minikube image load mern-frontend:local
          minikube image load mern-backend:local
        '''
      }
    }

    /* -----------------------------
       TERRAFORM INIT & APPLY
    --------------------------------
    stage('Terraform Init & Apply') {
          steps {
            script {
        
              // Auto-detect OS
              boolean isWindows = !isUnix()
        
              // Pick kubeconfig path based on OS
              def kubeconfig = isWindows
                ? "C:/Users/${env.USERNAME}/.kube/config"
                : "/var/lib/jenkins/.kube/config"
        
              echo "Using kubeconfig: ${kubeconfig}"
        
              dir('infra/minikube') {
        
                if (isWindows) {
                  bat """
                    terraform init
                    terraform validate
                    terraform apply ^
                      -var="frontend_image=mern-frontend:local" ^
                      -var="backend_image=mern-backend:local" ^
                      -var="kubeconfig_path=${kubeconfig}" ^
                      -auto-approve
                  """
                } else {
                  sh """
                    terraform init
                    terraform validate
                    terraform apply \
                      -var="frontend_image=mern-frontend:local" \
                      -var="backend_image=mern-backend:local" \
                      -var="kubeconfig_path=${kubeconfig}" \
                      -auto-approve
                  """
                }
              }
            }
          }
        }

    /* -----------------------------
       VERIFY DEPLOYMENT
    --------------------------------
    stage('Verify Deployment') {
      steps {
        bat 'kubectl get pods -n demo'
        bat 'kubectl get svc -n demo'
        bat 'kubectl get ingress -n demo'
      }
    }
  }
}
*/


/* Pipeline from SCM */
pipeline {
  agent any

  environment {
    KUBECONFIG = "C:/Users/Aishwarya SK/.kube/config"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Images') {
      steps {
        echo "Building Docker Images..."

        dir('frontend') {
          bat 'docker build -t mern-frontend:local .'
        }

        dir('backend') {
          bat 'docker build -t mern-backend:local .'
        }

        bat '''
          echo Loading images into Minikube...
          minikube image load mern-frontend:local
          minikube image load mern-backend:local
        '''
      }
    }

    stage('Install Ingress Controller') {
      steps {
        echo "Ensuring Ingress Controller is installed (idempotent)..."

        bat """
          REM If minikube is available on this agent, enable its ingress addon (idempotent).
          minikube status >nul 2>nul
          if %errorlevel%==0 (
            echo Using Minikube addon for ingress
            minikube addons enable ingress
            REM give it a few seconds to start
            timeout /t 5 >nul
            REM try waiting for controller in common namespaces
            kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=controller -n ingress-nginx --timeout=120s || \
            kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=controller -n kube-system --timeout=120s || \
            echo Ingress controller may still be starting; continuing pipeline
          ) else (
            echo Minikube not detected; installing ingress-nginx via Helm
            helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
            helm repo update
            helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx ^
              --namespace ingress-nginx --create-namespace ^
              --set controller.service.type=NodePort ^
              --set controller.service.nodePorts.http=30080 ^
              --set controller.service.nodePorts.https=30443
            kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=controller -n ingress-nginx --timeout=120s || \
            echo Helm install done; controller may still be starting
          )
        """
      }
    }

    stage('Terraform Init & Apply') {
      steps {
        echo "Running Terraform..."

        dir('infra/minikube') {
          withEnv(["KUBECONFIG=${env.USERPROFILE}\\.kube\\config"]) {

            bat """
              echo Using kubeconfig: %KUBECONFIG%

              kubectl config current-context

              terraform init
              terraform validate

              terraform apply -auto-approve ^
                -var="frontend_image=mern-frontend:local" ^
                -var="backend_image=mern-backend:local"
            """
          }
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        echo "Verifying Deployment..."

        bat 'kubectl get pods -n demo'
        bat 'kubectl get svc -n demo'
        bat 'kubectl get ingress -n demo'
      }
    }
  }
}
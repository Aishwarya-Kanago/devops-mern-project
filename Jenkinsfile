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
          @echo on
          REM Idempotent ingress install: prefer minikube addon when available.

          echo STEP1: Checking minikube status
          minikube status >nul 2>nul
          echo STEP1 errorlevel: %errorlevel%

          if %errorlevel%==0 (
            echo STEP2: Minikube detected - enabling minikube ingress addon

            echo STEP3: Checking for existing helm ingress-nginx
            helm list -n ingress-nginx -q 2>nul | findstr ingress-nginx >nul 2>nul
            echo STEP3 errorlevel: %errorlevel%

            if %errorlevel%==0 (
              echo STEP4: Uninstalling existing helm ingress-nginx release
              helm uninstall ingress-nginx -n ingress-nginx
              echo STEP4 helm uninstall errorlevel: %errorlevel%
              if not %errorlevel%==0 exit /b 1
              kubectl delete namespace ingress-nginx --ignore-not-found
              echo STEP4 kubectl delete ns errorlevel: %errorlevel%
              if not %errorlevel%==0 exit /b 1
            )

            echo STEP5: Enabling minikube ingress addon
            minikube addons enable ingress
            echo STEP5 errorlevel: %errorlevel%
            if not %errorlevel%==0 exit /b 1

            echo STEP6: Waiting for ingress controller pod (ingress-nginx)
            kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=controller -n ingress-nginx --timeout=60s
            echo STEP6a errorlevel: %errorlevel%
            if not %errorlevel%==0 (
              echo STEP6b: Trying kube-system namespace
              kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=controller -n kube-system --timeout=60s
              echo STEP6b errorlevel: %errorlevel%
              if not %errorlevel%==0 (
                echo STEP6c: Ingress controller may still be starting
                exit /b 1
              )
            )

          ) else (
            echo STEP7: Minikube not detected - installing ingress-nginx via Helm (idempotent)
            helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
            echo STEP7a errorlevel: %errorlevel%
            if not %errorlevel%==0 exit /b 1
            helm repo update
            echo STEP7b errorlevel: %errorlevel%
            if not %errorlevel%==0 exit /b 1
            helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx ^
              --namespace ingress-nginx --create-namespace ^
              --set controller.service.type=NodePort ^
              --set controller.service.nodePorts.http=32758 ^
              --set controller.service.nodePorts.https=31049
            echo STEP7c errorlevel: %errorlevel%
            if not %errorlevel%==0 exit /b 1

            echo STEP8: Waiting for ingress controller pod (ingress-nginx)
            kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=controller -n ingress-nginx --timeout=120s
            echo STEP8 errorlevel: %errorlevel%
            if not %errorlevel%==0 (
              echo STEP8b: controller may still be starting
              exit /b 1
            )
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

    stage('Print Access Info') {
      steps {
        echo "Printing ingress access URLs and probing reachability..."

        bat '''
          powershell -NoProfile -Command ^
            $ip=(minikube ip).Trim(); ^
            $nodePort=(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath="{.spec.ports[?(@.port==80)].nodePort}" 2>nul).Trim(); ^
            Write-Output "Minikube IP: $ip"; ^
            if ($nodePort) { Write-Output "Ingress NodePort: $nodePort" } else { Write-Output "Ingress NodePort: (not found)" }; ^
            Write-Output "Try these URLs:"; ^
            Write-Output "  - http://app.$ip.nip.io/      (preferred, no :port)"; ^
            if ($nodePort) { Write-Output "  - http://app.$ip.nip.io:$nodePort/  (nodePort)"; Write-Output "  - http://$ip:$nodePort/            (direct)" }; ^
            try { (Invoke-WebRequest -UseBasicParsing -Uri "http://app.$ip.nip.io/" -TimeoutSec 5).StatusCode | Out-Null; Write-Output 'nip.io host reachable' } catch { Write-Warning 'nip.io host not reachable' }; ^
            if ($nodePort) { try { (Invoke-WebRequest -UseBasicParsing -Uri "http://$ip:$nodePort/" -TimeoutSec 5).StatusCode | Out-Null; Write-Output 'NodePort reachable' } catch { Write-Warning 'NodePort not reachable' } }
        '''
      }
    }
  }
}
pipeline {
    agent any
    
    environment {
       
        DOCKER_HUB_CREDS = credentials('dockerhub-credentials')
        DOCKER_HUB_USER = 'yasmin952' 
        
        // Versions des images
        API_GATEWAY_IMAGE = "${DOCKER_HUB_USER}/medic-api-gateway"
        USER_SERVICE_IMAGE = "${DOCKER_HUB_USER}/medic-user-service"
        APPOINTMENT_SERVICE_IMAGE = "${DOCKER_HUB_USER}/medic-appointment-service"
        NOTIFICATION_SERVICE_IMAGE = "${DOCKER_HUB_USER}/medic-notification-service"
        
        // Tag de version (numéro de build)
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage(' Checkout Code') {
            steps {
                echo ' Récupération du code source...'
                checkout scm
            }
        }
        
        stage('🏗️ Build Docker Images') {
            parallel {
                stage('Build API Gateway') {
                    steps {
                        script {
                            echo '🔨 Construction de l\'image API Gateway...'
                            dir('api-gateway') {
                                sh """
                                    docker build -t ${API_GATEWAY_IMAGE}:${IMAGE_TAG} .
                                    docker tag ${API_GATEWAY_IMAGE}:${IMAGE_TAG} ${API_GATEWAY_IMAGE}:latest
                                """
                            }
                        }
                    }
                }
                
                stage('Build User Service') {
                    steps {
                        script {
                            echo '🔨 Construction de l\'image User Service...'
                            dir('user-service') {
                                sh """
                                    docker build -t ${USER_SERVICE_IMAGE}:${IMAGE_TAG} .
                                    docker tag ${USER_SERVICE_IMAGE}:${IMAGE_TAG} ${USER_SERVICE_IMAGE}:latest
                                """
                            }
                        }
                    }
                }
                
                stage('Build Appointment Service') {
                    steps {
                        script {
                            echo '🔨 Construction de l\'image Appointment Service...'
                            dir('appointment-service') {
                                sh """
                                    docker build -t ${APPOINTMENT_SERVICE_IMAGE}:${IMAGE_TAG} .
                                    docker tag ${APPOINTMENT_SERVICE_IMAGE}:${IMAGE_TAG} ${APPOINTMENT_SERVICE_IMAGE}:latest
                                """
                            }
                        }
                    }
                }
                
                stage('Build Notification Service') {
                    steps {
                        script {
                            echo '🔨 Construction de l\'image Notification Service...'
                            dir('notification-service') {
                                sh """
                                    docker build -t ${NOTIFICATION_SERVICE_IMAGE}:${IMAGE_TAG} .
                                    docker tag ${NOTIFICATION_SERVICE_IMAGE}:${IMAGE_TAG} ${NOTIFICATION_SERVICE_IMAGE}:latest
                                """
                            }
                        }
                    }
                }
            }
        }
        
        stage(' Security Scan with Trivy') {
            steps {
                script {
                    echo 'Analyse de sécurité des images avec Trivy...'
                    
                    // Scan API Gateway
                    sh """
                        echo " Scan de l'API Gateway..."
                        trivy image --severity HIGH,CRITICAL --no-progress ${API_GATEWAY_IMAGE}:${IMAGE_TAG} || true
                    """
                    
                    // Scan User Service
                    sh """
                        echo " Scan du User Service..."
                        trivy image --severity HIGH,CRITICAL --no-progress ${USER_SERVICE_IMAGE}:${IMAGE_TAG} || true
                    """
                    
                    // Scan Appointment Service
                    sh """
                        echo " Scan de l'Appointment Service..."
                        trivy image --severity HIGH,CRITICAL --no-progress ${APPOINTMENT_SERVICE_IMAGE}:${IMAGE_TAG} || true
                    """
                    
                    // Scan Notification Service
                    sh """
                        echo " Scan du Notification Service..."
                        trivy image --severity HIGH,CRITICAL --no-progress ${NOTIFICATION_SERVICE_IMAGE}:${IMAGE_TAG} || true
                    """
                }
            }
        }
        
        stage(' Push to Docker Hub') {
            steps {
                script {
                    echo ' Publication des images sur Docker Hub...'
                    sh """
                        echo \$DOCKER_HUB_CREDS_PSW | docker login -u \$DOCKER_HUB_CREDS_USR --password-stdin
                        
                        # Push toutes les images avec leur tag de build
                        docker push ${API_GATEWAY_IMAGE}:${IMAGE_TAG}
                        docker push ${USER_SERVICE_IMAGE}:${IMAGE_TAG}
                        docker push ${APPOINTMENT_SERVICE_IMAGE}:${IMAGE_TAG}
                        docker push ${NOTIFICATION_SERVICE_IMAGE}:${IMAGE_TAG}
                        
                        # Push les tags 'latest'
                        docker push ${API_GATEWAY_IMAGE}:latest
                        docker push ${USER_SERVICE_IMAGE}:latest
                        docker push ${APPOINTMENT_SERVICE_IMAGE}:latest
                        docker push ${NOTIFICATION_SERVICE_IMAGE}:latest
                    """
                }
            }
        }
        
        stage(' Cleanup Local Images') {
            steps {
                script {
                    echo ' Nettoyage des images locales...'
                    sh """
                        docker rmi ${API_GATEWAY_IMAGE}:${IMAGE_TAG} || true
                        docker rmi ${USER_SERVICE_IMAGE}:${IMAGE_TAG} || true
                        docker rmi ${APPOINTMENT_SERVICE_IMAGE}:${IMAGE_TAG} || true
                        docker rmi ${NOTIFICATION_SERVICE_IMAGE}:${IMAGE_TAG} || true
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo ' Déconnexion de Docker Hub...'
            sh 'docker logout'
        }
        
        success {
            echo ' Pipeline terminé avec succès !'
            echo " Images publiées avec le tag: ${IMAGE_TAG}"
        }
        
        failure {
            echo ' Le pipeline a échoué !'
        }
        
        cleanup {
            echo ' Nettoyage final...'
            cleanWs()
        }
    }
}
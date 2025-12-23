# 🏥 Medic Booking Platform - Projet DevOps

## 📋 Table des matières

- [Présentation du projet](#présentation-du-projet)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Phases du projet DevOps](#phases-du-projet-devops)
- [Tests et validation](#tests-et-validation)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Auteur](#auteur)

---

## 📖 Présentation du projet

**Medic Booking Platform** est une application de prise de rendez-vous médicaux construite avec une architecture microservices. Ce projet démontre une implémentation complète DevOps de bout en bout.

### Fonctionnalités principales

- ✅ Gestion des utilisateurs (patients et médecins)
- ✅ Création de rendez-vous
- ✅ Notifications par email
- ✅ API REST et GraphQL
- ✅ Communication gRPC entre services

---

## 🏗️ Architecture

### Architecture Microservices

```
┌─────────────────────────────────────────────────────────┐
│                     API GATEWAY (4000)                   │
│            GraphQL + REST + JWT Auth                     │
└────────────┬────────────────────────┬────────────────────┘
             │                        │
             │ HTTP                   │ gRPC
             ▼                        ▼
    ┌────────────────┐      ┌──────────────────┐
    │  APPOINTMENT   │      │  USER SERVICE    │
    │   SERVICE      │◄─────┤    (5000)        │
    │   (5001)       │ gRPC │  + gRPC (50051)  │
    └────┬───────────┘      └──────────────────┘
         │                           │
         │ Kafka Events              │
         ▼                           ▼
    ┌────────────────┐         ┌─────────┐
    │ NOTIFICATION   │         │ MongoDB │
    │   SERVICE      │         └─────────┘
    └────────────────┘
         ▲
         │
    ┌────┴─────┐
    │  Kafka   │
    │ Zookeeper│
    └──────────┘
```

### Services

| Service | Port | Description | Technologies |
|---------|------|-------------|--------------|
| **API Gateway** | 4000 | Point d'entrée unique, GraphQL + REST | Node.js, Express, Apollo Server |
| **User Service** | 5000, 50051 | Gestion utilisateurs, Auth JWT, gRPC | Node.js, Express, gRPC, MongoDB |
| **Appointment Service** | 5001 | Gestion des rendez-vous | Node.js, Express, gRPC, MongoDB, Kafka Producer |
| **Notification Service** | - | Envoi d'emails | Node.js, Kafka Consumer, Nodemailer |
| **MongoDB** | 27017 | Base de données | MongoDB 6 |
| **Kafka + Zookeeper** | 9092, 2181 | Messaging asynchrone | Kafka, Zookeeper |

---

## 🛠️ Technologies utilisées

### Application
- **Backend** : Node.js 18, Express.js
- **API** : REST, GraphQL (Apollo Server)
- **Communication** : gRPC, HTTP, Kafka
- **Base de données** : MongoDB
- **Authentification** : JWT (JSON Web Tokens)

### DevOps
- **Conteneurisation** : Docker, Docker Compose
- **CI/CD** : Jenkins, Trivy (Security Scanner)
- **Orchestration** : Kubernetes (Docker Desktop)
- **Gestion** : Helm Charts
- **GitOps** : ArgoCD
- **Monitoring** : Prometheus, Grafana
- **Registry** : Docker Hub

---

## 📦 Prérequis

### Logiciels requis

- **Docker Desktop** (avec Kubernetes activé) : https://www.docker.com/products/docker-desktop
- **Node.js 18+** : https://nodejs.org/
- **kubectl** : https://kubernetes.io/docs/tasks/tools/
- **Helm 3** : https://helm.sh/docs/intro/install/
- **Git** : https://git-scm.com/
- **Jenkins** (optionnel pour CI/CD) : https://www.jenkins.io/

### Configuration minimale

- **RAM** : 8 Go minimum (16 Go recommandés)
- **CPU** : 4 cores minimum
- **Disque** : 20 Go d'espace libre
- **OS** : Windows 10/11, macOS, ou Linux

---

## 🚀 Installation

### Étape 1 : Cloner le repository

```bash
git clone https://github.com/yasminjammeli/medic-booking-platform.git
cd medic-booking-platform
```

### Étape 2 : Configuration des variables d'environnement

#### Générer le JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Configurer les fichiers .env

**api-gateway/.env**
```env
PORT=4000
APPOINTMENT_SERVICE_URL=http://appointment-service:5001
USER_SERVICE_URL=http://user-service:5000
JWT_SECRET=votre_jwt_secret_genere
```

**user-service/.env**
```env
PORT=5000
MONGO_URI=mongodb://mongodb:27017/user_service
JWT_SECRET=votre_jwt_secret_genere
```

**appointment-service/.env**
```env
PORT=5001
MONGO_URI=mongodb://mongodb:27017/appointment_service
USER_SERVICE_HOST=user-service:50051
JWT_SECRET=votre_jwt_secret_genere
```

**notification-service/src/.env**
```env
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_app_password_gmail
KAFKA_BROKER=kafka:9092
KAFKA_TOPIC=appointment-created
```

### Étape 3 : Test local avec Docker Compose

```bash
# Démarrer tous les services
docker-compose up --build

# Vérifier que tous les services sont Running
docker-compose ps

# Arrêter
docker-compose down
```

**Test de l'API Gateway :**
- REST : http://localhost:4000/api/auth/users
- GraphQL : http://localhost:4000/graphql

---

## 📊 Phases du projet DevOps

### Phase 1-2 : Conteneurisation ✅

**Objectif** : Empaqueter l'application dans des conteneurs Docker

**Livrables** :
- ✅ Dockerfiles pour chaque service
- ✅ docker-compose.yml pour orchestration locale
- ✅ Images optimisées (multi-stage builds)

**Commandes** :
```bash
# Build des images
docker build -t medic-api-gateway ./api-gateway
docker build -t medic-user-service ./user-service
docker build -t medic-appointment-service ./appointment-service
docker build -t medic-notification-service ./notification-service

# Test local
docker-compose up
```

---

### Phase 3 : CI/CD avec Jenkins ✅

**Objectif** : Automatiser le build, scan et déploiement

**Pipeline Jenkins** :
1. **Checkout** : Récupération du code depuis Git
2. **Build** : Construction des images Docker (parallèle)
3. **Security Scan** : Analyse avec Trivy
4. **Push** : Publication sur Docker Hub

**Jenkinsfile** : `./Jenkinsfile`

**Installation Jenkins** :
```bash
cd jenkins
docker-compose up -d

# Récupérer le mot de passe initial
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Accès** : http://localhost:8080

---

### Phase 4 : Déploiement Kubernetes ✅

**Objectif** : Déployer sur un cluster Kubernetes local

**Activation Kubernetes (Docker Desktop)** :
1. Docker Desktop → Settings → Kubernetes
2. ☑ Enable Kubernetes
3. Apply & Restart

**Déploiement** :
```bash
# Appliquer les manifestes
kubectl apply -f k8s/manifests/

# Vérifier le déploiement
kubectl get all -n medic-booking

# Accéder à l'API Gateway
kubectl port-forward -n medic-booking svc/api-gateway 4000:4000
```

**Structure Kubernetes** :
```
k8s/manifests/
├── 00-namespace.yaml
├── 01-configmaps.yaml
├── 02-secrets.yaml
├── 03-mongodb.yaml
├── 04-kafka.yaml
├── 05-user-service.yaml
├── 06-appointment-service.yaml
├── 07-notification-service.yaml
└── 08-api-gateway.yaml
```

---

### Phase 5 : Helm Charts ✅

**Objectif** : Simplifier et standardiser les déploiements

**Structure Helm** :
```
helm/medic-booking/
├── Chart.yaml
├── values.yaml           # Configuration par défaut
├── values-dev.yaml       # Environnement dev
├── values-prod.yaml      # Environnement prod
└── templates/
    ├── _helpers.tpl
    ├── namespace.yaml
    ├── secrets.yaml
    ├── mongodb.yaml
    ├── kafka.yaml
    ├── zookeeper.yaml
    ├── user-service.yaml
    ├── appointment-service.yaml
    ├── notification-service.yaml
    └── api-gateway.yaml
```

**Déploiement avec Helm** :
```bash
# Installation environnement dev
helm install medic-booking-dev helm/medic-booking \
  --values helm/medic-booking/values-dev.yaml \
  --namespace medic-booking-dev \
  --create-namespace

# Installation environnement prod
helm install medic-booking-prod helm/medic-booking \
  --values helm/medic-booking/values-prod.yaml \
  --namespace medic-booking-prod \
  --create-namespace

# Mise à jour
helm upgrade medic-booking-prod helm/medic-booking \
  --values helm/medic-booking/values-prod.yaml \
  --namespace medic-booking-prod

# Rollback
helm rollback medic-booking-prod -n medic-booking-prod
```

---

### Phase 6 : GitOps avec ArgoCD ✅

**Objectif** : Déploiement continu depuis Git

**Installation ArgoCD** :
```bash
# Créer le namespace
kubectl create namespace argocd

# Installer ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Port-forward
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Récupérer le mot de passe
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

**Accès** : https://localhost:8080 (admin / mot_de_passe)

**Déploiement des applications** :
```bash
kubectl apply -f argocd/application-dev.yaml
kubectl apply -f argocd/application-prod.yaml
```

**Workflow GitOps** :
```
Commit sur Git → ArgoCD détecte → Sync automatique → Kubernetes mis à jour
```

---

### Phase 7 : Monitoring avec Prometheus + Grafana ✅

**Objectif** : Observabilité complète de l'infrastructure

**Installation** :
```bash
# Ajouter les repos Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Installer le stack complet
helm install prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set grafana.adminPassword=admin123 \
  --set grafana.service.type=LoadBalancer \
  --set nodeExporter.enabled=false
```

**Accès Grafana** :
```bash
kubectl port-forward -n monitoring svc/prometheus-stack-grafana 3000:80
```
**URL** : http://localhost:3000 (admin / admin123)

**Accès Prometheus** :
```bash
kubectl port-forward -n monitoring svc/prometheus-stack-kube-prom-prometheus 9090:9090
```
**URL** : http://localhost:9090

**Dashboards disponibles** :
- Kubernetes / Compute Resources / Cluster
- Kubernetes / Compute Resources / Namespace (Pods)
- Kubernetes / Networking / Namespace (Pods)

**Métriques surveillées** :
- ✅ CPU usage par pod
- ✅ Memory usage par pod
- ✅ Network I/O
- ✅ Pod restarts
- ✅ Deployment health

---

## 🧪 Tests et validation

### Test 1 : Créer un utilisateur

```bash
# Patient
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Patient Test",
    "email": "patient@test.com",
    "password": "test123",
    "role": "patient"
  }'

# Médecin
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith",
    "email": "doctor@test.com",
    "password": "test123",
    "role": "doctor",
    "specialty": "Cardiology"
  }'
```

### Test 2 : Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "test123"
  }'
```

### Test 3 : GraphQL (dans le GraphQL Playground)

**Ouvrir** : http://localhost:4000/graphql

```graphql
# Lister tous les utilisateurs
query {
  users {
    _id
    name
    email
    role
    specialty
  }
}

# Créer un rendez-vous
mutation {
  createAppointment(
    patientId: "PATIENT_ID"
    doctorId: "DOCTOR_ID"
    date: "2025-01-15T10:00:00Z"
    description: "Consultation de routine"
  ) {
    _id
    date
    status
    patient {
      name
    }
    doctor {
      name
    }
  }
}
```

---

## 📈 Monitoring

### Métriques Kubernetes disponibles

**CPU et Memory** :
- Utilisation par pod
- Utilisation par namespace
- Quotas et limites

**Network** :
- Bandwidth
- Packets transmis/reçus
- Erreurs réseau

**Application** :
- Nombre de pods
- Restarts
- Health checks

### Dashboards Grafana recommandés

1. **Kubernetes / Compute Resources / Namespace (Pods)**
   - Vue détaillée par namespace
   - CPU, RAM par pod

2. **Kubernetes / Compute Resources / Cluster**
   - Vue d'ensemble du cluster
   - Utilisation totale des ressources

3. **Kubernetes / Networking / Namespace (Pods)**
   - Métriques réseau
   - Bandwidth usage

---

## 🐛 Troubleshooting

### Problème : Pods en CrashLoopBackOff

```bash
# Voir les logs
kubectl logs -n medic-booking-prod <pod-name>

# Décrire le pod pour plus de détails
kubectl describe pod -n medic-booking-prod <pod-name>
```

**Causes communes** :
- Variables d'environnement incorrectes
- Dépendances non prêtes (MongoDB, Kafka)
- Images Docker incorrectes

### Problème : Service non accessible

```bash
# Vérifier les services
kubectl get svc -n medic-booking-prod

# Port-forward manuel
kubectl port-forward -n medic-booking-prod svc/api-gateway 4000:4000
```

### Problème : MongoDB connection failed

```bash
# Vérifier que MongoDB est Running
kubectl get pods -n medic-booking-prod -l app=mongodb

# Vérifier les logs MongoDB
kubectl logs -n medic-booking-prod -l app=mongodb
```

### Problème : Kafka ne démarre pas

```bash
# Vérifier Zookeeper d'abord
kubectl get pods -n medic-booking-prod -l app=zookeeper

# Vérifier les logs Kafka
kubectl logs -n medic-booking-prod -l app=kafka
```

---

## 📚 Documentation supplémentaire

- **Architecture détaillée** : `docs/ARCHITECTURE.md`
- **Guide de contribution** : `docs/CONTRIBUTING.md`
- **Diagrammes** : `docs/diagrams/`
- **Screenshots** : `docs/screenshots/`

---

## 🎓 Compétences démontrées

### Techniques
- ✅ Architecture microservices
- ✅ Conteneurisation Docker
- ✅ Orchestration Kubernetes
- ✅ CI/CD automatisé
- ✅ Infrastructure as Code (Helm)
- ✅ GitOps (ArgoCD)
- ✅ Monitoring et observabilité

### Outils DevOps
- Docker, Docker Compose
- Kubernetes, kubectl
- Helm
- Jenkins, Trivy
- ArgoCD
- Prometheus, Grafana
- Git, GitHub

### Communication inter-services
- REST API
- GraphQL
- gRPC
- Kafka (event-driven)

---

## 👤 Auteur

**Votre Nom**
- GitHub : [@yasminjammeli](https://github.com/yasminjammeli)
- Email : yasmina.jammeli@polytechnicien.tn


---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---



---

**🎉 Projet réalisé dans le cadre du cours DevOps 2025-2026**

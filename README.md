# 🚀 DevOps Project — Production-Grade Kubernetes Pipeline

A fully automated, production-ready DevOps project built with Docker, Kubernetes, GitHub Actions, Prometheus, Grafana, MongoDB, and Trivy. Covers the complete DevOps lifecycle from code to deployment to monitoring to security.

---

## 🏗️ Architecture Overview

```
Developer → GitHub Push
              ↓
        GitHub Actions CI/CD
         ├── Build Docker Image
         ├── Run Health Check Tests
         ├── Trivy Security Scan
         └── Deploy to Kubernetes
                    ↓
             Kubernetes Cluster (Minikube / GKE)
              ├── devops-app (2 replicas)
              ├── user-service
              ├── order-service
              └── MongoDB (with PersistentVolume)
                    ↓
             Prometheus + Grafana Monitoring
              ├── CPU / Memory / Disk metrics
              ├── Pod health dashboards
              └── Node Exporter metrics
```

---

## ✅ Features

| Feature | Technology |
|---|---|
| Containerization | Docker |
| Orchestration | Kubernetes (Minikube) |
| CI/CD Pipeline | GitHub Actions |
| Monitoring | Prometheus + Grafana |
| Database | MongoDB (in-cluster) |
| Secret Management | Kubernetes Secrets + ConfigMaps |
| Security Scanning | Trivy |
| Microservices | user-service + order-service |
| Ingress | NGINX Ingress Controller |
| Public Deployment | Render |

---

## 📁 Project Structure

```
devops-project/
├── app/
│   ├── index.js               # Main Express app
│   ├── test.js                # Health check test
│   ├── package.json
│   ├── Dockerfile
│   └── public/
│       └── index.html
├── user-service/
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
├── order-service/
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD pipeline
├── deployment.yaml            # Main app deployment
├── service.yaml               # NodePort service
├── ingress.yaml               # NGINX ingress
├── mongo-deployment.yaml      # MongoDB deployment
├── mongo-service.yaml         # MongoDB service
└── mongo-pvc.yaml             # Persistent volume claim
```

---

## ⚙️ CI/CD Pipeline

Every push to `main` triggers the full pipeline automatically:

```
Push to main
    │
    ├── Job 1: build-and-push
    │     ├── Checkout code
    │     ├── Login to Docker Hub
    │     ├── Build Docker image
    │     ├── Push to Docker Hub
    │     ├── Run health check test (curl /health)
    │     └── Trivy vulnerability scan
    │
    └── Job 2: deploy
          ├── Setup kubectl
          ├── Configure kubeconfig from secret
          ├── kubectl set image (rolling update)
          └── Verify rollout status
```

---

## 📊 Monitoring Stack

Prometheus and Grafana deployed via Helm inside the cluster:

```bash
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

**Dashboards available:**
- Node Exporter Full (ID: 15661) — CPU, Memory, Disk, Network
- Prometheus Overview — scrape targets, query stats
- Pod-level metrics — per-container resource usage

**Access Grafana:**
```bash
kubectl --namespace monitoring port-forward service/monitoring-grafana 3000:80
# Open http://localhost:3000
# Username: admin
```

---

## 🔐 Secrets & Configuration

Sensitive values are never hardcoded. All config is injected via Kubernetes primitives:

```bash
# Secrets (encrypted at rest)
kubectl create secret generic devops-app-secret \
  --from-literal=APP_ENV=production \
  --from-literal=APP_PORT=3000

# ConfigMaps (non-sensitive config)
kubectl create configmap devops-app-config \
  --from-literal=LOG_LEVEL=info \
  --from-literal=APP_NAME=devops-app \
  --from-literal=VERSION=1.0.0
```

Pods receive these as environment variables via `secretKeyRef` and `configMapKeyRef` in `deployment.yaml`.

---

## 🛡️ Security — Trivy Scanning

Every build is scanned for vulnerabilities before deployment:

```yaml
- name: Trivy Security Scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: soham1810/test-image:latest
    format: table
    exit-code: 1
    severity: CRITICAL,HIGH
```

Pipeline fails automatically if CRITICAL or HIGH vulnerabilities are found.

---

## 🧩 Microservices

The app is split into independent services, each with its own Deployment and Docker image:

| Service | Port | Responsibility |
|---|---|---|
| devops-app | 3000 | Main application + health endpoint |
| user-service | 4000 | User management API |
| order-service | 5000 | Order management API |
| MongoDB | 27017 | Persistent database |

---

## 🚀 Local Setup

**Prerequisites:** Docker, Minikube, kubectl, Helm

```bash
# Start Minikube
minikube start

# Deploy the app
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

# Deploy MongoDB
kubectl apply -f mongo-pvc.yaml
kubectl apply -f mongo-deployment.yaml
kubectl apply -f mongo-service.yaml

# Access the app
minikube service devops-app --url

# Install monitoring
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace

# Access Grafana
kubectl --namespace monitoring port-forward service/monitoring-grafana 3000:80
```

---

## 🔑 GitHub Secrets Required

| Secret | Description |
|---|---|
| `DOCKER_USER` | Docker Hub username |
| `DOCKER_PASS` | Docker Hub password |
| `KUBECONFIG_B64` | Base64-encoded kubeconfig for cluster access |

---

## 📈 What This Project Demonstrates

- **Docker** — multi-stage containerization and image optimization
- **Kubernetes** — deployments, services, ingress, probes, rolling updates
- **CI/CD** — fully automated build, test, scan, deploy pipeline
- **Monitoring** — real-time observability with Prometheus and Grafana
- **Security** — image scanning, Kubernetes secrets, least-privilege config
- **Microservices** — service decomposition and inter-service communication
- **Database** — stateful workloads with PersistentVolumes in Kubernetes
- **GitOps** — infrastructure as code, everything version controlled

---

## 🌐 Live Demo

- **Public URL:** Deployed on Render
- **Docker Hub:** `soham1810/test-image:latest`
- **GitHub:** [SohamB1810/devops-project](https://github.com/SohamB1810/devops-project)

---

## 👤 Author

**Soham** — DevOps Engineer  
Built as a production-grade portfolio project covering the complete DevOps lifecycle.

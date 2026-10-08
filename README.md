# Daily Schedule Manager

> A distraction-free, minimalist daily planner inspired by Notion's clean design philosophy and Todoist's fast scheduling workflow, built with Spring Boot, React, PostgreSQL, and Docker, deployed on AWS EC2 with custom domain routing.

---

## Live Application

- **Live URL**: [https://dailyschedulemanager.prerits.in](https://dailyschedulemanager.prerits.in)
- **Demo Account**: Built-in 1-click demo login option (`xyz004` / `xyz@example.com`) to explore features instantly without registration.

---

## Project Overview

**Daily Schedule Manager** was built as both a private daily task management system and a hands-on learning project to master **end-to-end cloud deployment on AWS with Docker**. 

### Key Features
- **Multi-View Task Management**:
  - **List View**: Clean Notion-style task list with category badges, time ranges, and priority tags.
  - **Kanban Board**: 3-column workflow board (`NOT_STARTED`, `ONGOING`, `COMPLETED`) with drag-and-drop / status toggling.
  - **Timeline View**: Visual chronological schedule showing morning, afternoon, and evening blocks.
- **Daily Progress Analytics**: Real-time progress bar computing completion rate and active task breakdown for the selected day.
- **Fast Date Navigation**: Jump between today, yesterday, tomorrow, or any specific date using the calendar picker.
- **Multi-User Isolation**: Complete account security where each user only accesses their own private schedule.
- **Authentication**: JWT-based stateless authentication with password hashing (BCrypt), password visibility toggling, and input validation.

---

## Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Vanilla CSS with Notion-inspired design tokens, typography, and glassmorphic micro-animations
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API with centralized JWT interceptors

### Backend
- **Framework**: Spring Boot (Java 17)
- **Security**: Spring Security with stateless JWT (JSON Web Token) authentication and BCrypt password encryption
- **Data Persistence**: Spring Data JPA & Hibernate ORM
- **Database**: Serverless PostgreSQL hosted on Neon (SSL-encrypted connections)
- **Validation**: Jakarta Bean Validation

### Cloud Infrastructure & DevOps
- **Cloud Provider**: Amazon Web Services (AWS)
- **Compute Instance**: AWS EC2 (Ubuntu 24.04 LTS)
- **IP Management**: AWS Elastic IP (Fixed public IPv4)
- **Containerization**: Docker & Docker Compose (Multi-stage builds)
- **Reverse Proxy**: Nginx (Host-level reverse proxy & internal container routing)
- **Domain & DNS**: Hostinger DNS Management (Subdomain `A` record mapping)
- **Security & SSL**: Certbot & Let's Encrypt (Automated SSL/TLS certificate renewal and HTTPS enforcement)

---

## Production Architecture

```
                         INTERNET
                            │
                       HTTPS : 443
                            │
                            ▼
              dailyschedulemanager.prerits.in
                            │
                       DNS A Record
                            │
                            ▼
                      HOSTINGER DNS
                            │
                         Points to
                            ▼
                    AWS ELASTIC IP
                            │
                            ▼
                 ┌─────────────────────┐
                 │      AWS EC2        │
                 │       Ubuntu        │
                 │                     │
                 │       NGINX         │
                 │   Reverse Proxy     │
                 │   TLS Termination   │
                 │                     │
                 │       │             │
                 │   Docker Compose    │
                 │       │             │
                 │   ┌───┴───────┐     │
                 │   │           │     │
                 │   ▼           ▼     │
                 │ React      Spring   │
                 │ Container  Boot     │
                 │            Container│
                 │               │     │
                 └───────────────┼─────┘
                                 │
                           SSL / JDBC
                                 │
                                 ▼
                       NEON POSTGRESQL
```

---

## How the Application Was Deployed

This application was taken from a local development environment and deployed into a secure production cloud setup on AWS. Below is the step-by-step methodology implemented:

### 1. Cloud Server Provisioning on AWS EC2
- Launched an **AWS EC2 virtual server** running **Ubuntu 24.04 LTS**.
- Configured a dedicated SSH key pair for secure terminal access.
- Set up **AWS Security Groups** applying the principle of least privilege:
  - Allowed **SSH (Port 22)** restricted to administrative access.
  - Allowed **HTTP (Port 80)** and **HTTPS (Port 443)** for public web traffic.
  - Kept application container ports (`8080` for Spring Boot, `3000` for React) strictly internal to the server and blocked from external internet access.

### 2. Static Public IP with AWS Elastic IP
- Standard EC2 public IP addresses change whenever an instance stops or restarts.
- Allocated a permanent **AWS Elastic IP** and associated it with the running EC2 instance.
- This provided a static, reliable IPv4 address that domain DNS records could point to permanently without disruption.

### 3. Containerization with Docker & Docker Compose
Both frontend and backend services were containerized using optimized multi-stage Docker builds:
- **Backend Dockerfile**:
  - *Stage 1 (Builder)*: Uses Maven on Temurin JDK 17 to download dependencies and compile a standalone JAR archive.
  - *Stage 2 (Runtime)*: Uses a minimal Eclipse Temurin JRE 17 Alpine image, running under a non-root system user for enhanced container security.
- **Frontend Dockerfile**:
  - *Stage 1 (Builder)*: Uses Node.js 20 Alpine to compile production Vite assets.
  - *Stage 2 (Runtime)*: Uses a lightweight Nginx Alpine container serving static assets with SPA fallback routing.
- **Docker Compose**:
  - Orchestrates both the frontend and backend containers together.
  - Places them on an isolated internal Docker bridge network where they communicate using internal service names.
  - Injects cloud database credentials securely from server-side environment variables.
  - Configures container restart policies (`unless-stopped`) so containers auto-recover if restarted.

### 4. Cloud Database Integration with Neon PostgreSQL
- Connected the Spring Boot backend to a managed serverless **PostgreSQL database on Neon**.

### 5. Custom Subdomain & DNS Routing
- Mapped the application to a dedicated subdomain via DNS records pointing to the server's static IP.
- Isolated application traffic to the subdomain while keeping the apex domain independent.

### 6. Reverse Proxy & Traffic Management
- Configured Nginx as a host-level reverse proxy to handle incoming requests securely.
- Routed frontend traffic to the React container and API requests to the Spring Boot backend service.
- Shielded internal container networking from direct public exposure.

### 7. SSL/TLS Encryption & HTTPS
- Secured traffic with Let's Encrypt SSL/TLS certificates.
- Enforced automatic HTTP-to-HTTPS redirection and automated certificate renewals.

---

## Security Practices

- **Firewall & Port Shielding**: Only standard web ports (80, 443) are open to the internet. Application containers and the database remain internal and shielded behind the reverse proxy.
- **Secret Isolation**: Sensitive configuration, database credentials, and signing keys are decoupled from source control using environment variables.
- **Encrypted Database Communications**: Database queries travel over secure TLS/SSL connections.
- **Non-Root Containers**: Backend services run under an unprivileged system user inside the container environment.
- **Stateless Token Authentication**: User sessions are authenticated with cryptographically signed JWT tokens.

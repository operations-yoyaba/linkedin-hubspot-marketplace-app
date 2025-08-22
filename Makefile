.PHONY: help install dev test build deploy clean docker-build docker-run docker-compose lint lint-fix

# Default target
help:
	@echo "LinkedIn-HubSpot Marketplace App - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  install        Install dependencies"
	@echo "  dev           Start development server"
	@echo "  test          Run tests"
	@echo "  test-watch    Run tests in watch mode"
	@echo "  test-coverage Run tests with coverage"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint          Run ESLint"
	@echo "  lint-fix      Fix ESLint issues automatically"
	@echo ""
	@echo "HubSpot:"
	@echo "  build         Build project for HubSpot"
	@echo "  deploy        Deploy to HubSpot"
	@echo "  watch         Watch for changes and rebuild"
	@echo "  clean         Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build  Build Docker image"
	@echo "  docker-run    Run Docker container"
	@echo "  docker-compose Start with Docker Compose"
	@echo ""
	@echo "Utilities:"
	@echo "  health        Check app health"
	@echo "  logs          Show app logs"

# Development
install:
	@echo "Installing dependencies..."
	npm install

dev:
	@echo "Starting development server..."
	npm run dev

test:
	@echo "Running tests..."
	npm test

test-watch:
	@echo "Running tests in watch mode..."
	npm run test:watch

test-coverage:
	@echo "Running tests with coverage..."
	npm run test:coverage

# Code Quality
lint:
	@echo "Running ESLint..."
	npm run lint

lint-fix:
	@echo "Fixing ESLint issues..."
	npm run lint:fix

# HubSpot
build:
	@echo "Building project for HubSpot..."
	npm run build

deploy:
	@echo "Deploying to HubSpot..."
	npm run deploy

watch:
	@echo "Watching for changes..."
	npm run watch

clean:
	@echo "Cleaning build artifacts..."
	npm run clean

# Docker
docker-build:
	@echo "Building Docker image..."
	docker build -t hubspot-marketplace-app .

docker-run:
	@echo "Running Docker container..."
	docker run -p 3000:3000 hubspot-marketplace-app

docker-compose:
	@echo "Starting with Docker Compose..."
	docker-compose up -d

# Utilities
health:
	@echo "Checking app health..."
	@curl -s http://localhost:3000/health | jq .

logs:
	@echo "Showing app logs..."
	@docker-compose logs -f hubspot-marketplace-app

# Setup (first time only)
setup: install
	@echo "Setting up project..."
	@if [ ! -f .env ]; then \
		cp env.example .env; \
		echo "Created .env file from template. Please edit with your configuration."; \
	else \
		echo ".env file already exists."; \
	fi
	@echo "Setup complete! Run 'make dev' to start development server."

# Production deployment
prod-deploy: build deploy
	@echo "Production deployment complete!"

# Full development cycle
dev-cycle: install lint test dev
	@echo "Development cycle complete!"

# Clean everything
clean-all: clean
	@echo "Cleaning everything..."
	@rm -rf node_modules
	@rm -rf coverage
	@rm -rf .hsdev
	@echo "Clean all complete!"

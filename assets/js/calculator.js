document.addEventListener("DOMContentLoaded", () => {
  // Apply neon border effects to cards
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    card.classList.add("hover-item-up")
    card.classList.add("crd-color")
  })

  // Project Type Selection
  const projectTypeItems = document.querySelectorAll(".project-type-item")
  const projectTypeDisplay = document.getElementById("project-type-display")

  // Load saved project type
  const savedProjectType = localStorage.getItem("projectType")
  if (savedProjectType) {
    projectTypeItems.forEach((item) => {
      if (item.dataset.type === savedProjectType) {
        item.classList.add("selected")
        projectTypeDisplay.textContent = item.querySelector("h3").textContent
      }
    })
  } else {
    // Default selection
    projectTypeItems[2].classList.add("selected") // Default to Web App
  }

  projectTypeItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove selected class from all items
      projectTypeItems.forEach((i) => i.classList.remove("selected"))

      // Add selected class to clicked item
      this.classList.add("selected")

      // Update project type display
      projectTypeDisplay.textContent = this.querySelector("h3").textContent

      // Save selection
      localStorage.setItem("projectType", this.dataset.type)

      // Update calculations
      calculateEstimates()

      // Add animation effect
      this.style.transform = "scale(1.05)"
      setTimeout(() => {
        this.style.transform = ""
      }, 300)
    })
  })

  // Input Controls
  const inputGroups = document.querySelectorAll(".input-with-controls")

  inputGroups.forEach((group) => {
    const input = group.querySelector("input")
    const decreaseBtn = group.querySelector(".decrease-btn")
    const increaseBtn = group.querySelector(".increase-btn")

    if (decreaseBtn && increaseBtn) {
      decreaseBtn.addEventListener("click", () => {
        const min = Number.parseInt(input.min) || 0
        const step = Number.parseInt(input.step) || 1
        const newValue = Number.parseInt(input.value) - step

        if (newValue >= min) {
          input.value = newValue
          input.dispatchEvent(new Event("change"))
        }
      })

      increaseBtn.addEventListener("click", () => {
        const max = Number.parseInt(input.max) || Number.POSITIVE_INFINITY
        const step = Number.parseInt(input.step) || 1
        const newValue = Number.parseInt(input.value) + step

        if (newValue <= max) {
          input.value = newValue
          input.dispatchEvent(new Event("change"))
        }
      })
    }
  })

  // Load saved values
  const complexityInput = document.getElementById("complexity")
  const techStackSelect = document.getElementById("tech-stack")
  const databaseTypeSelect = document.getElementById("database-type")
  const deploymentTypeInput = document.getElementById("deployment-type")
  const budgetInput = document.getElementById("budget")
  const urgencyToggle = document.getElementById("urgency-toggle")
  const featureCheckboxes = document.querySelectorAll(".feature-checkbox")

  // Load saved values from localStorage
  if (localStorage.getItem("complexity")) {
    complexityInput.value = localStorage.getItem("complexity")
  }

  if (localStorage.getItem("techStack")) {
    techStackSelect.value = localStorage.getItem("techStack")
  }

  if (localStorage.getItem("databaseType")) {
    databaseTypeSelect.value = localStorage.getItem("databaseType")
  }

  if (localStorage.getItem("budget")) {
    budgetInput.value = localStorage.getItem("budget")
  }

  if (localStorage.getItem("urgency") === "true") {
    urgencyToggle.checked = true
  }

  // Load saved features
  featureCheckboxes.forEach((checkbox) => {
    const featureId = checkbox.id
    if (localStorage.getItem(featureId) === "true") {
      checkbox.checked = true
    }
  })

  // Save values on change
  complexityInput.addEventListener("change", function () {
    localStorage.setItem("complexity", this.value)
    updateDifficultyResult(this.value)
    calculateEstimates()
  })

  techStackSelect.addEventListener("change", function () {
    localStorage.setItem("techStack", this.value)
    calculateEstimates()
  })

  databaseTypeSelect.addEventListener("change", function () {
    localStorage.setItem("databaseType", this.value)
    calculateEstimates()
  })

  budgetInput.addEventListener("change", function () {
    localStorage.setItem("budget", this.value)
    calculateEstimates()
  })

  urgencyToggle.addEventListener("change", function () {
    localStorage.setItem("urgency", this.checked)
    updateUrgentIndicator(this.checked)
    calculateEstimates()
  })

  featureCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      localStorage.setItem(this.id, this.checked)
      calculateEstimates()
    })
  })

  // Hosting Plan Selection
  const hostingPlans = document.querySelectorAll(".hosting-plan")

  // Load saved deployment type
  const savedDeploymentType = localStorage.getItem("deploymentType")
  if (savedDeploymentType) {
    hostingPlans.forEach((plan) => {
      if (plan.dataset.plan === savedDeploymentType) {
        plan.classList.add("selected")
        deploymentTypeInput.value = savedDeploymentType
      }
    })
  } else {
    // Default selection
    hostingPlans[0].classList.add("selected")
    deploymentTypeInput.value = hostingPlans[0].dataset.plan
  }

  hostingPlans.forEach((plan) => {
    plan.addEventListener("click", function () {
      // Remove selected class from all plans
      hostingPlans.forEach((p) => p.classList.remove("selected"))

      // Add selected class to clicked plan
      this.classList.add("selected")

      // Update hidden input value
      deploymentTypeInput.value = this.dataset.plan

      // Save selection
      localStorage.setItem("deploymentType", this.dataset.plan)

      // Update calculations
      calculateEstimates()

      // Add animation effect
      this.style.transform = "scale(1.05)"
      setTimeout(() => {
        this.style.transform = ""
      }, 300)
    })
  })

  // Calculate estimates
  // Modificar la función calculateEstimates para reducir los precios
  function calculateEstimates() {
    const selectedProject = document.querySelector(".project-type-item.selected")
    if (!selectedProject) return

    // Reducir los costos base a aproximadamente la mitad
    const baseHours = Number.parseInt(selectedProject.dataset.baseHours)
    const baseCost = Number.parseInt(selectedProject.dataset.baseCost) * 0.5 // Reducir a la mitad
    const complexity = Number.parseInt(complexityInput.value)
    const techStack = techStackSelect.value
    const databaseType = databaseTypeSelect.value
    const deploymentType = deploymentTypeInput.value
    const isUrgent = urgencyToggle.checked

    // Count selected features
    let featureCount = 0
    let featureMultiplier = 1

    featureCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        featureCount++

        // Different price multipliers based on feature complexity
        switch (checkbox.id) {
          // High complexity features (expensive)
          case "feature-chat":
            featureMultiplier += 0.25 // Chat/Messaging is complex and expensive
            break
          case "feature-realtime":
            featureMultiplier += 0.2 // Real-time data is complex
            break
          case "feature-payment":
            featureMultiplier += 0.18 // Payment integration is complex
            break

          // Medium complexity features
          case "feature-maps":
            featureMultiplier += 0.15 // Maps/Geolocation
            break
          case "feature-auth":
            featureMultiplier += 0.15 // Authentication
            break
          case "feature-notifications":
            featureMultiplier += 0.12 // Push notifications
            break
          case "feature-multilingual":
            featureMultiplier += 0.12 // Multilingual support
            break
          case "feature-cms":
            featureMultiplier += 0.1 // CMS/Admin panel
            break

          // Lower complexity features
          case "feature-offline":
            featureMultiplier += 0.08 // Offline mode
            break
          case "feature-pwa":
            featureMultiplier += 0.08 // PWA
            break
          case "feature-social":
            featureMultiplier += 0.07 // Social media integration
            break
          case "feature-api":
            featureMultiplier += 0.07 // API integration
            break
          case "feature-analytics":
            featureMultiplier += 0.06 // Analytics
            break
          case "feature-seo":
            featureMultiplier += 0.05 // SEO optimization
            break
          case "feature-animations":
            featureMultiplier += 0.05 // Animations
            break
          default:
            featureMultiplier += 0.05 // Default increase for other features
        }
      }
    })

    // Reducir los multiplicadores de stack tecnológico
    let techStackMultiplier = 1
    if (techStack === "react" || techStack === "vue") techStackMultiplier = 1.05 // Reducido de 1.1
    if (techStack === "angular") techStackMultiplier = 1.1 // Reducido de 1.2
    if (techStack === "flutter" || techStack === "react-native") techStackMultiplier = 1.15 // Reducido de 1.3
    if (techStack === "custom") techStackMultiplier = 1.2 // Reducido de 1.4

    // Reducir los multiplicadores de base de datos
    let databaseMultiplier = 1
    if (databaseType === "supabase") databaseMultiplier = 1.05 // Reducido de 1.1
    if (databaseType === "mongodb") databaseMultiplier = 1.08 // Reducido de 1.15
    if (databaseType === "graph" || databaseType === "time-series") databaseMultiplier = 1.12 // Reducido de 1.25
    if (databaseType === "custom") databaseMultiplier = 1.15 // Reducido de 1.3

    // Reducir los multiplicadores de despliegue
    let deploymentMultiplier = 1
    if (deploymentType === "starter") deploymentMultiplier = 1.0
    if (deploymentType === "pro") deploymentMultiplier = 1.05 // Reducido de 1.1
    if (deploymentType === "business") deploymentMultiplier = 1.1 // Reducido de 1.2
    if (deploymentType === "enterprise") deploymentMultiplier = 1.15 // Reducido de 1.3

    // Calcular tiempo estimado (mantener igual)
    let timeMultiplier = 1 + (complexity - 3) * 0.2
    if (isUrgent) timeMultiplier *= 0.7

    const estimatedHours = Math.round(baseHours * timeMultiplier * (1 + featureCount * 0.1))
    const estimatedWeeks = Math.ceil(estimatedHours / 40)

    // Reducir el multiplicador de complejidad para el costo
    let costMultiplier = 1 + (complexity - 3) * 0.1 // Reducido de 0.15
    if (isUrgent) costMultiplier *= 1.2 // Reducido de 1.25

    // Calcular el costo estimado con los nuevos multiplicadores
    const estimatedCost = Math.round(
      baseCost * costMultiplier * featureMultiplier * techStackMultiplier * databaseMultiplier * deploymentMultiplier,
    )

    const costRange = {
      min: Math.round(estimatedCost * 0.9),
      max: Math.round(estimatedCost * 1.1),
    }

    // Actualizar resultados con animación
    animateValue("time-result", `${estimatedWeeks}-${estimatedWeeks + 2} semanas`)
    animateValue("cost-result", `$${costRange.min.toLocaleString()} - $${costRange.max.toLocaleString()}`)

    // Actualizar dificultad y urgencia
    updateDifficultyResult(complexity)
    updateUrgentIndicator(isUrgent)
  }

  function animateValue(elementId, newValue) {
    const element = document.getElementById(elementId)

    // Add animation class
    element.style.opacity = "0"
    element.style.transform = "translateY(-10px)"

    setTimeout(() => {
      element.textContent = newValue
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }, 300)
  }

  // Actualizar la tecnología principal basada en el stack seleccionado
  function updateTechResult() {
    const techStack = document.getElementById("tech-stack").value
    let techResult = ""

    switch (techStack) {
      case "react":
        techResult = "React + Node.js"
        break
      case "vue":
        techResult = "Vue.js + Express"
        break
      case "angular":
        techResult = "Angular + TypeScript"
        break
      case "node":
        techResult = "Node.js + Express"
        break
      case "python":
        techResult = "Python + Django"
        break
      case "php":
        techResult = "PHP + Laravel"
        break
      case "dotnet":
        techResult = ".NET Core + C#"
        break
      case "flutter":
        techResult = "Flutter + Dart"
        break
      case "react-native":
        techResult = "React Native + Firebase"
        break
      case "custom":
        techResult = "Tecnología Personalizada"
        break
      default:
        techResult = "React + Node.js"
    }

    document.getElementById("tech-result").textContent = techResult
  }

  // Actualizar la tecnología cuando cambia el stack
  document.getElementById("tech-stack").addEventListener("change", updateTechResult)

  // Actualizar la dificultad basada en el valor de complejidad
  function updateDifficultyResult(complexity) {
    let difficultyText = ""

    switch (Number.parseInt(complexity)) {
      case 1:
        difficultyText = "Muy Baja"
        break
      case 2:
        difficultyText = "Baja"
        break
      case 3:
        difficultyText = "Media"
        break
      case 4:
        difficultyText = "Alta"
        break
      case 5:
        difficultyText = "Muy Alta"
        break
      default:
        difficultyText = "Media"
    }

    document.getElementById("difficulty-result").textContent = difficultyText
  }

  // Actualizar el indicador de entrega urgente
  function updateUrgentIndicator(isUrgent) {
    const urgentIndicator = document.getElementById("urgent-indicator")
    if (urgentIndicator) {
      urgentIndicator.style.display = isUrgent ? "flex" : "none"
    }
  }

  // Inicializar dificultad y urgencia
  updateDifficultyResult(complexityInput.value)
  updateUrgentIndicator(urgencyToggle.checked)

  // Llamar a la función inicialmente
  updateTechResult()

  // Initial calculation
  calculateEstimates()
})

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
  function calculateEstimates() {
    const selectedProject = document.querySelector(".project-type-item.selected")
    if (!selectedProject) return

    const baseHours = Number.parseInt(selectedProject.dataset.baseHours)
    const baseCost = Number.parseInt(selectedProject.dataset.baseCost)
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

        // Special multipliers for certain features
        if (checkbox.id === "feature-payment") {
          featureMultiplier += 0.2 // Payment integration adds 20%
        }

        if (checkbox.id === "feature-multilingual") {
          featureMultiplier += 0.15 // Multilingual adds 15%
        }

        if (checkbox.id === "feature-maintenance") {
          featureMultiplier += 0.3 // Maintenance adds 30%
        }

        if (checkbox.id === "feature-realtime") {
          featureMultiplier += 0.25 // Real-time data adds 25%
        }

        if (checkbox.id === "feature-auth") {
          featureMultiplier += 0.15 // Authentication adds 15%
        }
      }
    })

    // Tech stack multiplier
    let techStackMultiplier = 1
    if (techStack === "react" || techStack === "vue") techStackMultiplier = 1.1
    if (techStack === "angular") techStackMultiplier = 1.2
    if (techStack === "flutter" || techStack === "react-native") techStackMultiplier = 1.3
    if (techStack === "custom") techStackMultiplier = 1.4

    // Database multiplier
    let databaseMultiplier = 1
    if (databaseType === "supabase") databaseMultiplier = 1.1
    if (databaseType === "mongodb") databaseMultiplier = 1.15
    if (databaseType === "graph" || databaseType === "time-series") databaseMultiplier = 1.25
    if (databaseType === "custom") databaseMultiplier = 1.3

    // Deployment multiplier based on hosting plan
    let deploymentMultiplier = 1
    if (deploymentType === "starter") deploymentMultiplier = 1.0
    if (deploymentType === "pro") deploymentMultiplier = 1.1
    if (deploymentType === "business") deploymentMultiplier = 1.2
    if (deploymentType === "enterprise") deploymentMultiplier = 1.3

    // Calculate time estimate
    let timeMultiplier = 1 + (complexity - 3) * 0.2 // Complexity adjustment
    if (isUrgent) timeMultiplier *= 0.7 // Urgent projects take less time but cost more

    const estimatedHours = Math.round(baseHours * timeMultiplier * (1 + featureCount * 0.1))
    const estimatedWeeks = Math.ceil(estimatedHours / 40) // 40 hours per week

    // Calculate cost estimate
    let costMultiplier = 1 + (complexity - 3) * 0.15 // Complexity adjustment
    if (isUrgent) costMultiplier *= 1.25 // 25% premium for urgent projects

    const estimatedCost = Math.round(
      baseCost * costMultiplier * featureMultiplier * techStackMultiplier * databaseMultiplier * deploymentMultiplier,
    )

    const costRange = {
      min: Math.round(estimatedCost * 0.9),
      max: Math.round(estimatedCost * 1.1),
    }

    // Determine team size based on project complexity and features
    let teamSize = ""
    if (complexity >= 4 || featureCount >= 5) {
      teamSize = "1 Desarrollador Senior, 1 Desarrollador Junior, 1 Diseñador UI/UX"
    } else if (complexity >= 3 || featureCount >= 3) {
      teamSize = "1 Desarrollador Senior, 1 Diseñador UI/UX"
    } else {
      teamSize = "1 Desarrollador, 1 Diseñador"
    }

    // Update result displays with animation
    animateValue("time-result", `${estimatedWeeks}-${estimatedWeeks + 2} semanas`)
    animateValue("cost-result", `$${costRange.min.toLocaleString()} - $${costRange.max.toLocaleString()}`)
    animateValue("team-result", teamSize)
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

  // Initial calculation
  calculateEstimates()
})

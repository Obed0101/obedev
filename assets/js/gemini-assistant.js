document.addEventListener("DOMContentLoaded", () => {
  const geminiInput = document.getElementById("gemini-input")
  const geminiSubmit = document.getElementById("gemini-submit")
  const geminiResponse = document.getElementById("gemini-response")
  const chatMessages = document.getElementById("chat-messages")
  const exampleButtons = document.getElementById("example-buttons")
  const resetChatBtn = document.getElementById("reset-chat")
  const aiSuggestedFeatures = document.getElementById("ai-suggested-features")

  // Gemini API Key
  const GEMINI_API_KEY = "AIzaSyBVL4SvQpF9x3E5FcR3W8eOnEAQZABa-co"

  // Conversation history for context
  let conversationHistory = []

  // Example prompts with emojis
  const examplePrompts = [
    { text: "Necesito un dashboard para 50 dispositivos IoT", icon: "fas fa-chart-line" },
    { text: "Quiero crear una tienda online para vender ropa", icon: "fas fa-tshirt" },
    { text: "Necesito una app móvil para gestionar inventario", icon: "fas fa-boxes" },
    { text: "Quiero un sitio web para mi restaurante", icon: "fas fa-utensils" },
    { text: "Necesito una plataforma de cursos online", icon: "fas fa-graduation-cap" },
    { text: "Quiero crear un blog personal", icon: "fas fa-blog" },
    { text: "Necesito una app de citas para mascotas", icon: "fas fa-paw" },
    { text: "Quiero un sistema de reservas para hotel", icon: "fas fa-hotel" },
    { text: "Necesito una app de seguimiento fitness", icon: "fas fa-dumbbell" },
    { text: "Quiero crear un marketplace de servicios", icon: "fas fa-handshake" },
    { text: "Necesito una app para delivery de comida", icon: "fas fa-hamburger" },
    { text: "Quiero un sistema de gestión de tareas", icon: "fas fa-tasks" },
  ]

  // Generate random example buttons
  function generateExampleButtons() {
    // Shuffle array and take first 3
    const shuffled = [...examplePrompts].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)

    exampleButtons.innerHTML = ""

    selected.forEach((prompt) => {
      const button = document.createElement("button")
      button.className = "example-button"
      button.innerHTML = `<i class="${prompt.icon}"></i> ${prompt.text}`
      button.addEventListener("click", () => {
        geminiInput.value = prompt.text
        processGeminiRequest()
      })
      exampleButtons.appendChild(button)
    })
  }

  // Initialize example buttons
  generateExampleButtons()

  // Send message on button click
  geminiSubmit.addEventListener("click", () => {
    processGeminiRequest()
  })

  // Send message on Enter key (but allow Shift+Enter for new line)
  geminiInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      processGeminiRequest()
    }
  })

  // Auto-resize textarea
  geminiInput.addEventListener("input", function () {
    this.style.height = "auto"
    this.style.height = Math.min(this.scrollHeight, 120) + "px"
  })

  // Reset chat
  resetChatBtn.addEventListener("click", () => {
    // Clear chat messages except the first one (welcome message)
    while (chatMessages.children.length > 1) {
      chatMessages.removeChild(chatMessages.lastChild)
    }

    // Clear input
    geminiInput.value = ""
    geminiInput.style.height = "auto"

    // Hide response area
    geminiResponse.classList.remove("active")
    geminiResponse.innerHTML = ""

    // Reset conversation history
    conversationHistory = []

    // Generate new example buttons
    generateExampleButtons()

    // Scroll to top of chat
    chatMessages.scrollTop = 0
  })

  function processGeminiRequest() {
    const userPrompt = geminiInput.value.trim()
    if (!userPrompt) return

    // Add user message to chat
    addMessageToChat(userPrompt, "user")

    // Add to conversation history
    conversationHistory.push({ role: "user", content: userPrompt })

    // Clear input
    geminiInput.value = ""
    geminiInput.style.height = "auto"

    // Show loading message
    const loadingMessage = document.createElement("div")
    loadingMessage.className = "message bot-message loading-message"
    loadingMessage.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <div class="gemini-loading">
            <div class="gemini-loading-spinner"></div>
          </div>
        </div>
      `
    chatMessages.appendChild(loadingMessage)
    scrollToBottom()

    // Call Gemini API
    callGeminiAPI(userPrompt)
      .then((response) => {
        // Remove loading message
        chatMessages.removeChild(loadingMessage)

        // Process the response
        processGeminiResponse(response, userPrompt)
      })
      .catch((error) => {
        console.error("Error calling Gemini API:", error)

        // Remove loading message
        chatMessages.removeChild(loadingMessage)

        // Add error message
        addMessageToChat(
          "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.",
          "bot",
        )
      })
  }

  function addMessageToChat(message, type) {
    const messageElement = document.createElement("div")
    messageElement.className = `message ${type}-message`

    messageElement.innerHTML = `
        <div class="message-avatar">
          <i class="${type === "bot" ? "fas fa-robot" : "fas fa-user"}"></i>
        </div>
        <div class="message-content">
          <p>${message}</p>
        </div>
      `

    chatMessages.appendChild(messageElement)
    scrollToBottom()
  }

  // Modificar la función scrollToBottom para asegurar que funcione correctamente
  function scrollToBottom() {
    // Asegurarse de que el scroll baje completamente
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight + 1000
    }, 100)
  }

  // Asegurarse de que se llame a scrollToBottom después de añadir mensajes
  // function addMessageToChat(message, type) {
  //   const messageElement = document.createElement("div")
  //   messageElement.className = `message ${type}-message`

  //   messageElement.innerHTML = `
  //       <div class="message-avatar">
  //         <i class="${type === "bot" ? "fas fa-robot" : "fas fa-user"}"></i>
  //       </div>
  //       <div class="message-content">
  //         <p>${message}</p>
  //       </div>
  //     `

  //   chatMessages.appendChild(messageElement)
  //   scrollToBottom() // Llamar aquí
  // }

  async function callGeminiAPI(prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

    // Detect language from prompt
    const isSpanish = detectSpanishLanguage(prompt)

    const systemPrompt = isSpanish
      ? `
        Eres un asistente de IA que ayuda a los usuarios a configurar una calculadora de proyectos para proyectos de desarrollo de software.
        Basado en la descripción del usuario, necesitas determinar:
        1. Tipo de proyecto (website, ecommerce, webapp, dashboard, mobile, iot, ai, monorepo, api, firmware, cli, custom)
        2. Nivel de complejidad (1-5)
        3. Stack tecnológico (react, vue, angular, node, python, php, dotnet, flutter, react-native, custom)
        4. Tipo de base de datos (none, supabase, mongodb, graph, time-series, custom)
        5. Tipo de despliegue (starter, pro, business, enterprise)
        6. Características requeridas de esta lista: responsive, cms, seo, analytics, multilingual, api, payment, maintenance, auth, realtime, offline, pwa, notifications, social, maps, chat
        7. Si es urgente o no (true/false)
        
        Información sobre los planes de despliegue:
        - starter: Plan básico ObeStarter (1 vCPU, 4 GB RAM, 50 GB SSD, 4 TB ancho de banda)
        - pro: Plan popular ObePro (2 vCPU, 8 GB RAM, 100 GB SSD, 8 TB ancho de banda)
        - business: Plan recomendado ObeBusiness (4 vCPU, 16 GB RAM, 200 GB SSD, 16 TB ancho de banda)
        - enterprise: Plan premium ObeEnterprise (8 vCPU, 32 GB RAM, 400 GB SSD, 32 TB ancho de banda)
        
        Si el usuario está haciendo una pregunta general o no está describiendo un proyecto, responde de manera conversacional y amigable.
        
        Si el usuario está describiendo un proyecto, responde en formato JSON con estos campos:
        {
          "projectType": "uno de: website, ecommerce, webapp, dashboard, mobile, iot, ai, monorepo, api, firmware, cli, custom",
          "complexity": "número del 1-5",
          "techStack": "uno de: react, vue, angular, node, python, php, dotnet, flutter, react-native, custom",
          "database": "uno de: none, supabase, mongodb, graph, time-series, custom",
          "deployment": "uno de: starter, pro, business, enterprise",
          "features": ["lista de características de las opciones disponibles"],
          "urgent": "true o false",
          "explanation": "breve explicación de tus recomendaciones"
        }
        `
      : `
        You are an AI assistant that helps users configure a project calculator for software development projects.
        Based on the user's description, you need to determine:
        1. Project type (website, ecommerce, webapp, dashboard, mobile, iot, ai, monorepo, api, firmware, cli, custom)
        2. Complexity level (1-5)
        3. Tech stack (react, vue, angular, node, python, php, dotnet, flutter, react-native, custom)
        4. Database type (none, supabase, mongodb, graph, time-series, custom)
        5. Deployment type (starter, pro, business, enterprise)
        6. Required features from this list: responsive, cms, seo, analytics, multilingual, api, payment, maintenance, auth, realtime, offline, pwa, notifications, social, maps, chat
        7. Whether it's urgent or not (true/false)
        
        Information about deployment plans:
        - starter: Basic ObeStarter plan (1 vCPU, 4 GB RAM, 50 GB SSD, 4 TB bandwidth)
        - pro: Popular ObePro plan (2 vCPU, 8 GB RAM, 100 GB SSD, 8 TB bandwidth)
        - business: Recommended ObeBusiness plan (4 vCPU, 16 GB RAM, 200 GB SSD, 16 TB bandwidth)
        - enterprise: Premium ObeEnterprise plan (8 vCPU, 32 GB RAM, 400 GB SSD, 32 TB bandwidth)
        
        If the user is asking a general question or not describing a project, respond in a conversational and friendly manner.
        
        If the user is describing a project, respond in JSON format with these fields:
        {
          "projectType": "one of: website, ecommerce, webapp, dashboard, mobile, iot, ai, monorepo, api, firmware, cli, custom",
          "complexity": "number 1-5",
          "techStack": "one of: react, vue, angular, node, python, php, dotnet, flutter, react-native, custom",
          "database": "one of: none, supabase, mongodb, graph, time-series, custom",
          "deployment": "one of: starter, pro, business, enterprise",
          "features": ["list of features from the available options"],
          "urgent": "true or false",
          "explanation": "brief explanation of your recommendations"
        }
        `

    // Format conversation history for the API
    let conversationContext = ""
    if (conversationHistory.length > 0) {
      conversationContext = "Conversación previa:\n"
      conversationHistory.forEach((message) => {
        const role = message.role === "user" ? "Usuario" : "Asistente"
        conversationContext += `${role}: ${message.content}\n`
      })
      conversationContext += "\n"
    }

    const fullPrompt = `${systemPrompt}\n\n${conversationContext}User request: ${prompt}`

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      throw error
    }
  }

  function detectSpanishLanguage(text) {
    // Simple language detection - check for Spanish-specific characters and common words
    const spanishPatterns = [
      /[áéíóúüñ¿¡]/i,
      /\b(el|la|los|las|un|una|unos|unas|y|o|pero|porque|si|cuando|como|qué|cuál|este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|aquellos|aquellas)\b/i,
      /\b(necesito|quiero|hacer|proyecto|sitio|web|aplicación|app|móvil|página|tienda|dashboard|panel|días|urgente)\b/i,
    ]

    return spanishPatterns.some((pattern) => pattern.test(text))
  }

  function processGeminiResponse(responseText, userPrompt) {
    try {
      // Check if response contains JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)

      if (jsonMatch) {
        // It's a project recommendation
        const jsonResponse = JSON.parse(jsonMatch[0])

        // Detect language from user prompt
        const isSpanish = detectSpanishLanguage(userPrompt)

        // Add the explanation to chat
        addMessageToChat(jsonResponse.explanation, "bot")

        // Add to conversation history
        conversationHistory.push({ role: "assistant", content: jsonResponse.explanation })

        // Create recommendation UI
        const recommendationHTML = `
            <div class="gemini-recommendation">
              <div class="gemini-recommendation-title">${isSpanish ? "Recomendaciones para tu proyecto:" : "Recommendations for your project:"}</div>
              <div class="gemini-recommendation-item">
                <i class="fas fa-laptop-code"></i>
                <span>${isSpanish ? "Tipo de Proyecto" : "Project Type"}: <strong>${getProjectTypeName(jsonResponse.projectType, isSpanish)}</strong></span>
              </div>
              <div class="gemini-recommendation-item">
                <i class="fas fa-chart-line"></i>
                <span>${isSpanish ? "Complejidad" : "Complexity"}: <strong>${jsonResponse.complexity}/5</strong></span>
              </div>
              <div class="gemini-recommendation-item">
                <i class="fas fa-code"></i>
                <span>${isSpanish ? "Stack Tecnológico" : "Tech Stack"}: <strong>${getTechStackName(jsonResponse.techStack, isSpanish)}</strong></span>
              </div>
              <div class="gemini-recommendation-item">
                <i class="fas fa-database"></i>
                <span>${isSpanish ? "Base de Datos" : "Database"}: <strong>${getDatabaseName(jsonResponse.database, isSpanish)}</strong></span>
              </div>
              <div class="gemini-recommendation-item">
                <i class="fas fa-server"></i>
                <span>${isSpanish ? "Despliegue" : "Deployment"}: <strong>${getDeploymentName(jsonResponse.deployment, isSpanish)}</strong></span>
              </div>
              <div class="gemini-recommendation-item">
                <i class="fas fa-list-check"></i>
                <span>${isSpanish ? "Características" : "Features"}: <strong>${formatFeatures(jsonResponse.features, isSpanish)}</strong></span>
              </div>
              <div class="gemini-recommendation-item">
                <i class="fas fa-bolt"></i>
                <span>${isSpanish ? "Entrega Urgente" : "Urgent Delivery"}: <strong>${jsonResponse.urgent === "true" ? (isSpanish ? "Sí" : "Yes") : "No"}</strong></span>
              </div>
              <div class="gemini-buttons">
                <button class="gemini-apply-button" id="apply-recommendations">
                  <i class="fas fa-check"></i>
                  <span>${isSpanish ? "Aplicar Recomendaciones" : "Apply Recommendations"}</span>
                </button>
                <button class="gemini-cancel-button" id="cancel-recommendations">
                  <i class="fas fa-times"></i>
                  <span>${isSpanish ? "Cancelar" : "Cancel"}</span>
                </button>
              </div>
            </div>
          `

        // Add recommendation to chat
        const recommendationElement = document.createElement("div")
        recommendationElement.className = "message bot-message"
        recommendationElement.innerHTML = `
            <div class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
              ${recommendationHTML}
            </div>
          `
        chatMessages.appendChild(recommendationElement)
        scrollToBottom()

        // Store recommendations for later use
        recommendationElement.dataset.recommendations = JSON.stringify(jsonResponse)
        recommendationElement.dataset.language = isSpanish ? "es" : "en"

        // Add event listeners to buttons
        recommendationElement.querySelector("#apply-recommendations").addEventListener("click", () => {
          applyRecommendations(jsonResponse, isSpanish, recommendationElement)
        })

        recommendationElement.querySelector("#cancel-recommendations").addEventListener("click", () => {
          cancelRecommendations(isSpanish, recommendationElement)
        })
      } else {
        // It's a regular conversation response
        addMessageToChat(responseText, "bot")

        // Add to conversation history
        conversationHistory.push({ role: "assistant", content: responseText })
      }
      // Añadir esta línea al final de la función
      scrollToBottom()
    } catch (error) {
      console.error("Error processing Gemini response:", error)
      addMessageToChat("Lo siento, ha ocurrido un error al procesar la respuesta. Por favor, intenta de nuevo.", "bot")
      scrollToBottom() // También aquí
    }
  }

  function getProjectTypeName(type, isSpanish) {
    const projectTypes = {
      website: isSpanish ? "Sitio Web" : "Website",
      ecommerce: "E-commerce",
      webapp: isSpanish ? "Aplicación Web" : "Web Application",
      dashboard: "Dashboard",
      mobile: isSpanish ? "App Móvil" : "Mobile App",
      iot: isSpanish ? "IoT" : "IoT",
      ai: isSpanish ? "Inteligencia Artificial" : "Artificial Intelligence",
      monorepo: "Monorepo Node.js",
      api: "API/Integración",
      firmware: isSpanish ? "Firmware" : "Firmware",
      cli: isSpanish ? "Herramienta CLI" : "CLI Tool",
      custom: isSpanish ? "Personalizado" : "Custom",
    }

    return projectTypes[type] || type
  }

  function getTechStackName(stack, isSpanish) {
    const techStacks = {
      react: "React",
      vue: "Vue.js",
      angular: "Angular",
      node: "Node.js",
      python: "Python",
      php: "PHP",
      dotnet: ".NET",
      flutter: "Flutter",
      "react-native": "React Native",
      custom: isSpanish ? "Personalizado" : "Custom",
    }

    return techStacks[stack] || stack
  }

  function getDatabaseName(db, isSpanish) {
    const databases = {
      none: isSpanish ? "Ninguna" : "None",
      supabase: "Supabase",
      mongodb: "MongoDB",
      graph: "Graph (Neo4j)",
      "time-series": "Time Series (InfluxDB)",
      custom: isSpanish ? "Personalizada" : "Custom",
    }

    return databases[db] || db
  }

  function getDeploymentName(deployment, isSpanish) {
    const deployments = {
      starter: "ObeStarter (1 vCPU, 4 GB RAM)",
      pro: "ObePro (2 vCPU, 8 GB RAM)",
      business: "ObeBusiness (4 vCPU, 16 GB RAM)",
      enterprise: "ObeEnterprise (8 vCPU, 32 GB RAM)",
    }

    return deployments[deployment] || deployment
  }

  function formatFeatures(features, isSpanish) {
    if (!features || features.length === 0) {
      return isSpanish ? "Ninguna" : "None"
    }

    const featureNames = {
      responsive: isSpanish ? "Diseño Responsive" : "Responsive Design",
      cms: isSpanish ? "CMS / Panel Admin" : "CMS / Admin Panel",
      seo: isSpanish ? "Optimización SEO" : "SEO Optimization",
      analytics: isSpanish ? "Analytics / Reportes" : "Analytics / Reports",
      multilingual: isSpanish ? "Multilenguaje" : "Multilingual",
      api: isSpanish ? "Integración API" : "API Integration",
      payment: isSpanish ? "Pasarela de Pagos" : "Payment Gateway",
      auth: isSpanish ? "Autenticación / Usuarios" : "Authentication / Users",
      realtime: isSpanish ? "Datos en Tiempo Real" : "Real-time Data",
      offline: isSpanish ? "Modo Offline" : "Offline Mode",
      pwa: "PWA (Progressive Web App)",
      notifications: isSpanish ? "Notificaciones Push" : "Push Notifications",
      social: isSpanish ? "Integración Redes Sociales" : "Social Media Integration",
      maps: isSpanish ? "Mapas / Geolocalización" : "Maps / Geolocation",
      chat: isSpanish ? "Chat / Mensajería" : "Chat / Messaging",
    }

    return features.map((feature) => featureNames[feature] || feature).join(", ")
  }

  // Declare calculateEstimates function
  function calculateEstimates() {
    // This function should be defined elsewhere in your project
    // or you should replace this with your actual implementation.
    console.warn("calculateEstimates function is not defined.")
  }

  function applyRecommendations(recommendations, isSpanish, recommendationElement) {
    // Select project type
    const projectTypeItems = document.querySelectorAll(".project-type-item")
    projectTypeItems.forEach((item) => {
      if (item.dataset.type === recommendations.projectType) {
        item.click()
      }
    })

    // Set complexity
    const complexityInput = document.getElementById("complexity")
    complexityInput.value = recommendations.complexity
    complexityInput.dispatchEvent(new Event("change"))

    // Set tech stack
    const techStackSelect = document.getElementById("tech-stack")
    techStackSelect.value = recommendations.techStack
    techStackSelect.dispatchEvent(new Event("change"))

    // Set database type
    const databaseSelect = document.getElementById("database-type")
    databaseSelect.value = recommendations.database
    databaseSelect.dispatchEvent(new Event("change"))

    // Set deployment type - Updated for new hosting plans
    const deploymentTypeInput = document.getElementById("deployment-type")
    deploymentTypeInput.value = recommendations.deployment

    // Select the corresponding hosting plan
    const hostingPlans = document.querySelectorAll(".hosting-plan")
    hostingPlans.forEach((plan) => {
      if (plan.dataset.plan === recommendations.deployment) {
        plan.classList.add("selected")
      } else {
        plan.classList.remove("selected")
      }
    })

    // Set features
    const featureCheckboxes = document.querySelectorAll(".feature-checkbox")
    featureCheckboxes.forEach((checkbox) => {
      const featureId = checkbox.id.replace("feature-", "")
      checkbox.checked = recommendations.features.includes(featureId)
      checkbox.dispatchEvent(new Event("change"))
    })

    // Set urgency
    const urgencyToggle = document.getElementById("urgency-toggle")
    urgencyToggle.checked = recommendations.urgent === "true"
    urgencyToggle.dispatchEvent(new Event("change"))

    // Replace buttons with success message
    const buttonsContainer = recommendationElement.querySelector(".gemini-buttons")
    if (buttonsContainer) {
      const statusMessage = document.createElement("div")
      statusMessage.className = "gemini-status success"
      statusMessage.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>${isSpanish ? "¡Recomendaciones aplicadas correctamente!" : "Recommendations applied successfully!"}</span>
        `
      buttonsContainer.parentNode.replaceChild(statusMessage, buttonsContainer)
    }

    // Add confirmation message to chat
    addMessageToChat(
      isSpanish
        ? "He aplicado las recomendaciones a la calculadora. Puedes ajustar los parámetros si lo necesitas."
        : "I've applied the recommendations to the calculator. You can adjust the parameters if needed.",
      "bot",
    )

    // Add to conversation history
    conversationHistory.push({
      role: "assistant",
      content: isSpanish
        ? "He aplicado las recomendaciones a la calculadora. Puedes ajustar los parámetros si lo necesitas."
        : "I've applied the recommendations to the calculator. You can adjust the parameters if needed.",
    })

    // Scroll to project type section
    document.querySelector(".project-type-card").scrollIntoView({ behavior: "smooth" })
  }

  function cancelRecommendations(isSpanish, recommendationElement) {
    // Replace buttons with rejected message
    const buttonsContainer = recommendationElement.querySelector(".gemini-buttons")
    if (buttonsContainer) {
      const statusMessage = document.createElement("div")
      statusMessage.className = "gemini-status rejected"
      statusMessage.innerHTML = `
          <i class="fas fa-times-circle"></i>
          <span>${isSpanish ? "Recomendaciones rechazadas" : "Recommendations rejected"}</span>
        `
      buttonsContainer.parentNode.replaceChild(statusMessage, buttonsContainer)
    }

    // Add message to chat
    addMessageToChat(
      isSpanish
        ? "No hay problema. ¿Hay algo más en lo que pueda ayudarte?"
        : "No problem. Is there anything else I can help you with?",
      "bot",
    )

    // Add to conversation history
    conversationHistory.push({
      role: "assistant",
      content: isSpanish
        ? "No hay problema. ¿Hay algo más en lo que pueda ayudarte?"
        : "No problem. Is there anything else I can help you with?",
    })
  }
})

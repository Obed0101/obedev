document.addEventListener("DOMContentLoaded", () => {
  // Chat toggle functionality
  const chatToggle = document.getElementById("chat-toggle")
  const chatPanel = document.getElementById("chat-panel")
  const minimizeChat = document.getElementById("minimize-chat")

  // Toggle chat panel
  chatToggle.addEventListener("click", () => {
    chatPanel.classList.toggle("active")

    // If opening the chat, focus on the input
    if (chatPanel.classList.contains("active")) {
      setTimeout(() => {
        userInput.focus()
      }, 300)
    }
  })

  // Minimize chat
  minimizeChat.addEventListener("click", () => {
    chatPanel.classList.remove("active")
  })

  // Close chat when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !chatPanel.contains(e.target) &&
      e.target !== chatToggle &&
      !chatToggle.contains(e.target) &&
      chatPanel.classList.contains("active")
    ) {
      chatPanel.classList.remove("active")
    }
  })
  const chatContainer = document.getElementById("chat-container")
  const userInput = document.getElementById("user-input")
  const sendButton = document.getElementById("send-message")
  const resetButton = document.getElementById("reset-chat")
  const exampleCards = document.querySelectorAll(".example-card")

  // Auto-resize textarea
  userInput.addEventListener("input", function () {
    this.style.height = "auto"
    this.style.height = this.scrollHeight + "px"
  })

  // Load chat history from localStorage
  loadChatHistory()

  // Send message on button click
  sendButton.addEventListener("click", () => {
    sendMessage()
  })

  // Send message on Enter key (but allow Shift+Enter for new line)
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  })

  // Reset chat
  resetButton.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres reiniciar la conversación? Se perderá todo el historial.")) {
      localStorage.removeItem("chatHistory")
      chatContainer.innerHTML = ""

      // Add welcome message
      addMessage(
        "assistant",
        `
                <p>¡Hola! 👋 Soy <strong>DevBuddy</strong>, tu asistente para planificar proyectos de desarrollo.</p>
                <p>Puedo ayudarte a:</p>
                <ul>
                    <li>Estimar tiempos y costos</li>
                    <li>Recomendar tecnologías</li>
                    <li>Identificar requisitos</li>
                    <li>Generar propuestas</li>
                </ul>
                <p>¿En qué tipo de proyecto estás interesado?</p>
            `,
      )

      // Add example cards
      addExampleCards()
    }
  })

  // Example card click
  exampleCards.forEach((card) => {
    card.addEventListener("click", function () {
      const exampleText = this.dataset.example
      userInput.value = exampleText
      sendMessage()
    })
  })

  function sendMessage() {
    const message = userInput.value.trim()
    if (!message) return

    // Add user message to chat
    addMessage("user", message)

    // Clear input
    userInput.value = ""
    userInput.style.height = "auto"

    // Show typing indicator
    showTypingIndicator()

    // Process message for commands
    if (message.startsWith("/")) {
      processCommand(message)
    } else {
      // Generate AI response after a delay
      setTimeout(
        () => {
          generateResponse(message)
        },
        1000 + Math.random() * 1000,
      ) // Random delay between 1-2 seconds
    }
  }

  function addMessage(role, content) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${role}-message`

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "message-avatar"

    const iconElement = document.createElement("i")
    iconElement.className = role === "assistant" ? "fas fa-robot" : "fas fa-user"
    avatarDiv.appendChild(iconElement)

    const contentDiv = document.createElement("div")
    contentDiv.className = "message-content"

    // If content is HTML, set innerHTML, otherwise set textContent
    if (role === "assistant" || content.includes("<")) {
      contentDiv.innerHTML = content
    } else {
      contentDiv.textContent = content
    }

    messageDiv.appendChild(avatarDiv)
    messageDiv.appendChild(contentDiv)

    chatContainer.appendChild(messageDiv)

    // Remove example cards when user sends a message
    const exampleCardsContainer = document.querySelector(".example-cards")
    if (exampleCardsContainer) {
      exampleCardsContainer.remove()
    }

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight

    // Save chat history
    saveChatHistory()
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "message assistant-message typing-indicator"
    typingDiv.id = "typing-indicator"

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "message-avatar"

    const iconElement = document.createElement("i")
    iconElement.className = "fas fa-robot"
    avatarDiv.appendChild(iconElement)

    const contentDiv = document.createElement("div")
    contentDiv.className = "message-content"

    const loadingDiv = document.createElement("div")
    loadingDiv.className = "loading"
    loadingDiv.innerHTML = "<div></div><div></div><div></div><div></div>"

    contentDiv.appendChild(loadingDiv)
    typingDiv.appendChild(avatarDiv)
    typingDiv.appendChild(contentDiv)

    chatContainer.appendChild(typingDiv)
    chatContainer.scrollTop = chatContainer.scrollHeight
  }

  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  function generateResponse(userMessage) {
    removeTypingIndicator()

    // Simple response logic based on keywords
    let response = ""

    if (userMessage.toLowerCase().includes("sitio web") || userMessage.toLowerCase().includes("página web")) {
      response = `
                <p>Para un sitio web, puedo recomendarte las siguientes opciones:</p>
                <ul>
                    <li><strong>Tecnologías:</strong> HTML5, CSS3, JavaScript, React</li>
                    <li><strong>Tiempo estimado:</strong> 3-5 semanas</li>
                    <li><strong>Costo aproximado:</strong> $1,500 - $3,000</li>
                </ul>
                <p>Basado en mi experiencia con proyectos similares como el sitio web de CognixPa y GITSA, podría implementar:</p>
                <ul>
                    <li>Diseño responsive optimizado para todos los dispositivos</li>
                    <li>Optimización SEO para mejor posicionamiento</li>
                    <li>Integración con Google Analytics</li>
                </ul>
                <p>¿Te gustaría que generara una propuesta preliminar con estas características?</p>
            `
    } else if (userMessage.toLowerCase().includes("app") || userMessage.toLowerCase().includes("aplicación")) {
      response = `
                <p>Para una aplicación, recomendaría:</p>
                <ul>
                    <li><strong>Tecnologías:</strong> React Native (móvil) o React (web)</li>
                    <li><strong>Tiempo estimado:</strong> 8-12 semanas</li>
                    <li><strong>Costo aproximado:</strong> $5,000 - $8,000</li>
                </ul>
                <p>Basado en mi experiencia con proyectos como la Plataforma Educativa Aula+ y la aplicación de Chat Colaborativo con IA, podría implementar:</p>
                <ul>
                    <li>Autenticación de usuarios segura</li>
                    <li>Sincronización en tiempo real</li>
                    <li>Notificaciones push</li>
                    <li>Interfaz intuitiva y moderna</li>
                </ul>
                <p>¿Qué funcionalidades específicas necesitarías en tu aplicación?</p>
            `
    } else if (userMessage.toLowerCase().includes("dashboard") || userMessage.toLowerCase().includes("panel")) {
      response = `
                <p>Para un dashboard, te recomendaría:</p>
                <ul>
                    <li><strong>Tecnologías:</strong> React, D3.js o Chart.js para visualizaciones</li>
                    <li><strong>Tiempo estimado:</strong> 6-8 semanas</li>
                    <li><strong>Costo aproximado:</strong> $3,000 - $5,000</li>
                </ul>
                <p>Basado en mi experiencia con proyectos como el Dashboard de Sistemas de Riegos y el Dashboard Climático para estación IoT, podría implementar:</p>
                <ul>
                    <li>Gráficos interactivos en tiempo real</li>
                    <li>Filtros avanzados de datos</li>
                    <li>Exportación de informes en PDF/Excel</li>
                    <li>Panel de administración</li>
                </ul>
                <p>¿Qué tipo de datos necesitarías visualizar en tu dashboard?</p>
            `
    } else if (userMessage.toLowerCase().includes("presupuesto") || userMessage.toLowerCase().includes("costo")) {
      response = `
                <p>Los costos de desarrollo varían según varios factores:</p>
                <ul>
                    <li><strong>Sitio web informativo:</strong> $1,000 - $2,000</li>
                    <li><strong>E-commerce básico:</strong> $3,000 - $5,000</li>
                    <li><strong>Aplicación web con autenticación:</strong> $4,000 - $6,000</li>
                    <li><strong>Dashboard con visualización de datos:</strong> $2,000 - $4,000</li>
                    <li><strong>Aplicación móvil híbrida:</strong> $5,000 - $8,000</li>
                </ul>
                <p>Factores que afectan el costo:</p>
                <ul>
                    <li>Complejidad del diseño y funcionalidades</li>
                    <li>Integración con sistemas externos</li>
                    <li>Plazos de entrega (urgencia)</li>
                    <li>Mantenimiento posterior</li>
                </ul>
                <p>¿Tienes un presupuesto específico en mente para tu proyecto?</p>
            `
    } else if (userMessage.toLowerCase().includes("tiempo") || userMessage.toLowerCase().includes("plazo")) {
      response = `
                <p>Los tiempos de desarrollo típicos son:</p>
                <ul>
                    <li><strong>Sitio web informativo:</strong> 2-4 semanas</li>
                    <li><strong>E-commerce:</strong> 6-10 semanas</li>
                    <li><strong>Aplicación web:</strong> 8-12 semanas</li>
                    <li><strong>Dashboard:</strong> 4-8 semanas</li>
                    <li><strong>Aplicación móvil:</strong> 10-16 semanas</li>
                </ul>
                <p>El proceso de desarrollo incluye:</p>
                <ul>
                    <li>Planificación y diseño: 20% del tiempo</li>
                    <li>Desarrollo: 60% del tiempo</li>
                    <li>Pruebas y ajustes: 20% del tiempo</li>
                </ul>
                <p>¿Tienes alguna fecha límite para tu proyecto?</p>
            `
    } else if (userMessage.toLowerCase().includes("portfolio") || userMessage.toLowerCase().includes("experiencia")) {
      response = `
                <p>Algunos proyectos destacados de mi portfolio:</p>
                <ul>
                    <li><strong>Calculadora IoT con Interfaz de IA (CognixPanama)</strong> - React</li>
                    <li><strong>Dashboard de Mantenimiento para Cuarto Frío</strong> - React</li>
                    <li><strong>Plataforma Educativa Aula+</strong> - React</li>
                    <li><strong>Dashboard de Sistemas de Riegos</strong> - React</li>
                    <li><strong>Aplicación de Chat Colaborativo con IA</strong> - React</li>
                    <li><strong>Plataforma TerraPredict</strong> - HTML/CSS/JS, Python</li>
                </ul>
                <p>También tengo experiencia en:</p>
                <ul>
                    <li>Desarrollo de firmware C++ para sensores IoT</li>
                    <li>Herramientas de gestión para monorepos Node.js</li>
                    <li>Ingeniería de prompts avanzada</li>
                </ul>
                <p>¿Hay algún tipo de proyecto específico que te interese?</p>
            `
    } else if (userMessage.toLowerCase().includes("gracias") || userMessage.toLowerCase().includes("genial")) {
      response = `
                <p>¡De nada! Estoy aquí para ayudarte con tu proyecto. Si tienes más preguntas o necesitas información adicional, no dudes en preguntar.</p>
                <p>Recuerda que puedes usar la calculadora de proyectos para obtener una estimación más precisa basada en tus necesidades específicas.</p>
                <p>¿Hay algo más en lo que pueda asistirte hoy?</p>
            `
    } else {
      response = `
                <p>Gracias por compartir esa información. Para poder darte una estimación más precisa, me gustaría saber:</p>
                <ul>
                    <li>¿Qué tipo de proyecto estás considerando? (sitio web, aplicación, dashboard, etc.)</li>
                    <li>¿Tienes alguna funcionalidad específica en mente?</li>
                    <li>¿Cuál es tu plazo ideal para completar el proyecto?</li>
                    <li>¿Tienes un presupuesto aproximado?</li>
                </ul>
                <p>Con estos detalles, podré recomendarte la mejor solución basada en mi experiencia con proyectos similares.</p>
            `
    }

    // Add AI response to chat
    addMessage("assistant", response)
  }

  function processCommand(command) {
    removeTypingIndicator()

    if (command.startsWith("/configurar_proyecto:")) {
      const params = command.substring(20).split(",")
      let projectType = ""

      let complexity = 3
      let time = 30

      // Parse parameters
      params.forEach((param) => {
        const [key, value] = param.split("=")
        if (key === "tipo") {
          projectType = value
        } else if (key === "complejidad") {
          complexity = Number.parseInt(value)
        } else if (key === "tiempo") {
          time = Number.parseInt(value)
        }
      })

      // Update calculator UI based on command
      if (projectType) {
        const projectItems = document.querySelectorAll(".project-type-item")
        projectItems.forEach((item) => {
          if (item.dataset.type === projectType) {
            item.click() // Trigger click event to select this project
          }
        })
      }

      // Update complexity and time inputs
      if (complexity >= 1 && complexity <= 5) {
        document.getElementById("complexity").value = complexity
        document.getElementById("complexity").dispatchEvent(new Event("change"))
      }

      if (time > 0) {
        document.getElementById("time-estimate").value = time
        document.getElementById("time-estimate").dispatchEvent(new Event("change"))
      }

      // Respond to command
      addMessage(
        "assistant",
        `
                <p>He configurado la calculadora con los siguientes parámetros:</p>
                <ul>
                    ${projectType ? `<li><strong>Tipo de proyecto:</strong> ${projectType}</li>` : ""}
                    <li><strong>Complejidad:</strong> ${complexity}/5</li>
                    <li><strong>Tiempo estimado:</strong> ${time} días</li>
                </ul>
                <p>Puedes ajustar más parámetros en la calculadora o pedirme recomendaciones específicas.</p>
            `,
      )
    } else if (command.startsWith("/generar_propuesta")) {
      // Trigger client PDF generation
      document.getElementById("generate-client-pdf").click()

      addMessage(
        "assistant",
        `
                <p>¡Generando propuesta de proyecto! Puedes descargar el PDF con los detalles basados en la configuración actual.</p>
                <p>Si necesitas ajustar algún parámetro antes de finalizar, puedes modificar los valores en la calculadora.</p>
            `,
      )
    } else if (command.startsWith("/mostrar_portfolio")) {
      addMessage(
        "assistant",
        `
                <p>Aquí tienes algunos de mis proyectos destacados:</p>
                <ul>
                    <li><strong>Calculadora IoT con Interfaz de IA (CognixPanama)</strong> - Implementación de una calculadora para dispositivos IoT con una interfaz conversacional basada en IA.</li>
                    <li><strong>Dashboard de Mantenimiento para Cuarto Frío</strong> - Desarrollo de un dashboard para monitoreo en tiempo real y gestión del mantenimiento preventivo/correctivo.</li>
                    <li><strong>Plataforma Educativa Aula+</strong> - Creación de una plataforma digital orientada a estudiantes para acceso a recursos y seguimiento académico.</li>
                    <li><strong>Dashboard de Sistemas de Riegos</strong> - Creación de un panel de control web para monitorizar y gestionar sistemas de riego en un vivero.</li>
                    <li><strong>TerraPredict</strong> - Desarrollo de un dashboard y API de predicción para visualizar y predecir microclimas.</li>
                </ul>
                <p>¿Te gustaría más información sobre alguno de estos proyectos?</p>
            `,
      )
    } else {
      addMessage(
        "assistant",
        `
                <p>Lo siento, no reconozco ese comando. Los comandos disponibles son:</p>
                <ul>
                    <li><code>/configurar_proyecto:tipo=webapp,complejidad=3,tiempo=30</code></li>
                    <li><code>/generar_propuesta</code></li>
                    <li><code>/mostrar_portfolio</code></li>
                </ul>
            `,
      )
    }
  }

  function addExampleCards() {
    const exampleCardsDiv = document.createElement("div")
    exampleCardsDiv.className = "example-cards"

    exampleCardsDiv.innerHTML = `
            <div class="example-card" data-example="Necesito un sitio web para mi negocio de restaurante con reservas online">
                <div class="example-icon"><i class="fas fa-utensils"></i></div>
                <p>Sitio web para restaurante con reservas</p>
            </div>
            <div class="example-card" data-example="¿Cuánto costaría desarrollar una app móvil para delivery?">
                <div class="example-icon"><i class="fas fa-truck"></i></div>
                <p>App móvil para delivery</p>
            </div>
            <div class="example-card" data-example="Necesito un dashboard para monitorear datos de ventas">
                <div class="example-icon"><i class="fas fa-chart-pie"></i></div>
                <p>Dashboard de ventas</p>
            </div>
        `

    chatContainer.appendChild(exampleCardsDiv)

    // Add event listeners to new example cards
    const newExampleCards = exampleCardsDiv.querySelectorAll(".example-card")
    newExampleCards.forEach((card) => {
      card.addEventListener("click", function () {
        const exampleText = this.dataset.example
        userInput.value = exampleText
        sendMessage()
      })
    })
  }

  function saveChatHistory() {
    const messages = chatContainer.querySelectorAll(".message")
    const history = []

    messages.forEach((message) => {
      const role = message.classList.contains("user-message") ? "user" : "assistant"
      const content = message.querySelector(".message-content").innerHTML

      history.push({ role, content })
    })

    localStorage.setItem("chatHistory", JSON.stringify(history))
  }

  function loadChatHistory() {
    const history = localStorage.getItem("chatHistory")

    if (history) {
      const messages = JSON.parse(history)

      // Clear default welcome message
      chatContainer.innerHTML = ""

      messages.forEach((message) => {
        addMessage(message.role, message.content)
      })
    }
  }
})

document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const generateQuotePdfBtn = document.getElementById("generate-quote-pdf")
    const sendToWhatsappBtn = document.getElementById("send-to-whatsapp")
    const generateAdminPdfBtn = document.getElementById("generate-admin-pdf")
    const whatsappModal = document.getElementById("whatsapp-modal")
    const closeModalBtn = document.querySelector(".close-modal")
    const cancelWhatsappBtn = document.getElementById("cancel-whatsapp")
    const sendWhatsappBtn = document.getElementById("send-whatsapp")
    const phoneNumberInput = document.getElementById("phone-number")
    const consentCheckbox = document.getElementById("consent-checkbox")
    const modalError = document.getElementById("modal-error")
  
    // Benefit tabs
    const benefitTabs = document.querySelectorAll(".benefit-tab")
    const benefitContents = document.querySelectorAll(".benefits-content")
  
    // Summary elements
    const summaryProjectType = document.getElementById("summary-project-type")
    const summaryComplexity = document.getElementById("summary-complexity")
    const summaryTechStack = document.getElementById("summary-tech-stack")
    const summaryDatabase = document.getElementById("summary-database")
    const summaryDeployment = document.getElementById("summary-deployment")
    const summaryUrgency = document.getElementById("summary-urgency")
    const summaryFeatures = document.getElementById("summary-features")
  
    // Update summary when page loads
    updateProjectSummary()
  
    // Listen for changes in calculator inputs
    document.querySelectorAll(".project-type-item").forEach((item) => {
      item.addEventListener("click", updateProjectSummary)
    })
  
    document.getElementById("complexity").addEventListener("change", updateProjectSummary)
    document.getElementById("tech-stack").addEventListener("change", updateProjectSummary)
    document.getElementById("database-type").addEventListener("change", updateProjectSummary)
    document.getElementById("urgency-toggle").addEventListener("change", updateProjectSummary)
  
    document.querySelectorAll(".hosting-plan").forEach((plan) => {
      plan.addEventListener("click", updateProjectSummary)
    })
  
    document.querySelectorAll(".feature-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", updateProjectSummary)
    })
  
    // Benefit tabs functionality
    benefitTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs and contents
        benefitTabs.forEach((t) => t.classList.remove("active"))
        benefitContents.forEach((c) => c.classList.remove("active"))
  
        // Add active class to clicked tab and corresponding content
        tab.classList.add("active")
        const tabId = tab.dataset.tab
        document.getElementById(`${tabId}-content`).classList.add("active")
      })
    })
  
    // Generate PDF button
    generateQuotePdfBtn.addEventListener("click", generateQuotePDF)
  
    // Admin PDF button
    generateAdminPdfBtn.addEventListener("click", () => {
      // Ask for password
      const password = prompt("Ingrese la contraseña para generar el PDF de detalles técnicos:")
      if (password === "obedev2025") {
        generateAdminPDF()
      } else {
        alert("Contraseña incorrecta")
      }
    })
  
    // WhatsApp modal
    sendToWhatsappBtn.addEventListener("click", openWhatsAppModal)
    closeModalBtn.addEventListener("click", closeWhatsAppModal)
    cancelWhatsappBtn.addEventListener("click", closeWhatsAppModal)
    sendWhatsappBtn.addEventListener("click", sendToWhatsApp)
  
    // Phone number formatting
    phoneNumberInput.addEventListener("input", formatPhoneNumber)
  
    // Functions
    function updateProjectSummary() {
      // Get selected project type
      const selectedProject = document.querySelector(".project-type-item.selected")
      if (!selectedProject) return
  
      const projectTypeName = selectedProject.querySelector("h3").textContent
      const complexity = document.getElementById("complexity").value
      const techStack = document.getElementById("tech-stack")
      const techStackName = techStack.options[techStack.selectedIndex].text
      const database = document.getElementById("database-type")
      const databaseName = database.options[database.selectedIndex].text
  
      // Get selected hosting plan
      const selectedPlan = document.querySelector(".hosting-plan.selected")
      const planName = selectedPlan ? selectedPlan.querySelector("h3").textContent : "ObeStarter"
  
      // Get urgency
      const isUrgent = document.getElementById("urgency-toggle").checked
  
      // Update summary values
      summaryProjectType.textContent = projectTypeName
      summaryComplexity.textContent = `${complexity}/5`
      summaryTechStack.textContent = techStackName
      summaryDatabase.textContent = databaseName
      summaryDeployment.textContent = planName
      summaryUrgency.textContent = isUrgent ? "Sí" : "No"
  
      // Actualizar el desarrollador asignado
      document.getElementById("team-result").textContent = "Obed González"
  
      // Update features
      updateFeaturesSummary()
    }
  
    function updateFeaturesSummary() {
      // Clear current features
      summaryFeatures.innerHTML = ""
  
      // Get all checked feature checkboxes
      const checkedFeatures = document.querySelectorAll(".feature-checkbox:checked")
  
      // If no features selected, show message
      if (checkedFeatures.length === 0) {
        summaryFeatures.innerHTML = "<p class='no-features'>No se han seleccionado características adicionales</p>"
        return
      }
  
      // Add each feature to the summary
      checkedFeatures.forEach((checkbox) => {
        const featureLabel = checkbox.nextElementSibling.textContent
        const featureTag = document.createElement("div")
        featureTag.className = "feature-tag"
        featureTag.innerHTML = `<i class="fas fa-check-circle"></i> ${featureLabel}`
        summaryFeatures.appendChild(featureTag)
      })
    }
  
    function openWhatsAppModal() {
      whatsappModal.style.display = "flex"
      // Clear previous inputs
      phoneNumberInput.value = ""
      consentCheckbox.checked = false
      modalError.textContent = ""
    }
  
    function closeWhatsAppModal() {
      whatsappModal.style.display = "none"
    }
  
    function formatPhoneNumber() {
      // Remove non-numeric characters
      let value = phoneNumberInput.value.replace(/\D/g, "")
  
      // Format as XXXX-XXXX
      if (value.length > 4) {
        value = value.substring(0, 4) + "-" + value.substring(4, 8)
      }
  
      phoneNumberInput.value = value
    }
  
    function sendToWhatsApp() {
      // Validate phone number
      const phoneNumber = phoneNumberInput.value.replace(/\D/g, "")
      if (phoneNumber.length !== 8) {
        modalError.textContent = "Por favor, ingrese un número de teléfono válido (8 dígitos)"
        return
      }
  
      // Validate consent
      if (!consentCheckbox.checked) {
        modalError.textContent = "Debe aceptar los términos para continuar"
        return
      }
  
      // Get project summary
      const projectType = summaryProjectType.textContent
      const complexity = summaryComplexity.textContent
      const techStack = summaryTechStack.textContent
      const timeEstimate = document.getElementById("time-result").textContent
      const costEstimate = document.getElementById("cost-result").textContent
  
      // Prepare WhatsApp message
      const message = `Hola, estoy interesado en una cotización para un proyecto de tipo: ${projectType}, complejidad: ${complexity}, stack: ${techStack}. Tiempo estimado: ${timeEstimate}. Costo estimado: ${costEstimate}.`
  
      // Format phone number for WhatsApp API
      const formattedPhone = `507${phoneNumber.replace(/-/g, "")}`
  
      // Create WhatsApp URL
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`
  
      // Send data to tracking API (mock for now)
      sendToTrackingAPI(formattedPhone, projectType, complexity, techStack, timeEstimate, costEstimate)
        .then(() => {
          // Open WhatsApp in new tab
          window.open(whatsappUrl, "_blank")
  
          // Close modal
          closeWhatsAppModal()
        })
        .catch((error) => {
          console.error("Error sending to tracking API:", error)
          // Still open WhatsApp even if tracking fails
          window.open(whatsappUrl, "_blank")
          closeWhatsAppModal()
        })
    }
  
    async function sendToTrackingAPI(phone, projectType, complexity, techStack, timeEstimate, costEstimate) {
      // This is a mock function - replace with actual API call
      console.log("Sending to tracking API:", {
        phone,
        projectType,
        complexity,
        techStack,
        timeEstimate,
        costEstimate,
        timestamp: new Date().toISOString(),
      })
  
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(resolve, 500)
      })
    }
  
    function generateQuotePDF() {
      // Get current values
      const projectType = summaryProjectType.textContent
      const complexity = summaryComplexity.textContent
      const techStack = summaryTechStack.textContent
      const database = summaryDatabase.textContent
      const deployment = summaryDeployment.textContent
      const isUrgent = summaryUrgency.textContent === "Sí"
  
      // Get time and cost estimates
      const timeEstimate = document.getElementById("time-result").textContent
      const costEstimate = document.getElementById("cost-result").textContent
  
      // Desarrollador asignado
      const developerName = "Obed González"
  
      // Get selected features
      const selectedFeatures = []
      document.querySelectorAll(".feature-checkbox:checked").forEach((checkbox) => {
        selectedFeatures.push(checkbox.nextElementSibling.textContent)
      })
  
      // Current date
      const currentDate = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
  
      // Create PDF content
      const content = `
      <div style="font-family: 'Roboto', sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #714cdf; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h1 style="color: white; margin: 0; font-size: 24px;">Propuesta de Proyecto: ${projectType}</h1>
              <p style="color: white; opacity: 0.8; margin: 5px 0 0 0;">ObeDev</p>
            </div>
            <div style="text-align: right;">
              <p style="color: white; margin: 5px 0 0 0;">Fecha: ${currentDate}</p>
            </div>
          </div>
        </div>
        
        <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Detalles del Proyecto</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Tipo de Proyecto:</span>
            <span>${projectType}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Complejidad:</span>
            <span>${complexity}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Stack Tecnológico:</span>
            <span>${techStack}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Base de Datos:</span>
            <span>${database}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Plan de Hosting:</span>
            <span>${deployment}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Tiempo Estimado:</span>
            <span>${timeEstimate}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Entrega Urgente:</span>
            <span>${isUrgent ? "Sí" : "No"}</span>
          </div>
        </div>
        
        <div style="background-color: #714cdf; color: white; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: white; margin-top: 0; margin-bottom: 15px;">Inversión Estimada</h2>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-weight: 500; font-size: 18px;">Costo Total:</span>
            <span style="font-weight: 700; font-size: 24px;">${costEstimate}</span>
          </div>
          <div style="font-size: 14px; opacity: 0.8; margin-top: 10px;">
            <p>* El precio incluye desarrollo, pruebas y despliegue inicial.</p>
            <p>* Mantenimiento y soporte disponibles por separado.</p>
          </div>
        </div>
        
        <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Características Incluidas</h2>
          <ul style="padding-left: 20px;">
            ${selectedFeatures.map((feature) => `<li style="margin-bottom: 8px;">${feature}</li>`).join("")}
          </ul>
        </div>
        
        <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Desarrollador Asignado</h2>
          <p style="margin: 5px 0;">${developerName}</p>
        </div>
        
        <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Beneficios del Plan ${deployment}</h2>
          <ul style="padding-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>Data centers worldwide:</strong> Elija la ubicación más cercana a su audiencia para minimizar la latencia.</li>
            <li style="margin-bottom: 8px;"><strong>Linux OS preinstalado:</strong> Soporte para las distribuciones más populares, configurado y listo para usar.</li>
            <li style="margin-bottom: 8px;"><strong>Backups automáticos semanales:</strong> Copias de seguridad gestionadas, para restaurar en minutos ante cualquier imprevisto.</li>
            <li style="margin-bottom: 8px;"><strong>Firewall y DDoS protection:</strong> Seguridad avanzada con filtrado de tráfico y reglas personalizables.</li>
            <li style="margin-bottom: 8px;"><strong>Soporte 24/7:</strong> Equipo de expertos disponible en todo momento para resolver cualquier incidencia.</li>
          </ul>
        </div>
        
        <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Información de Contacto</h2>
          <p style="margin: 5px 0;">Obed González Peña</p>
          <p style="margin: 5px 0;">Email: obedev.dev@gmail.com</p>
          <p style="margin: 5px 0;">Web: <a href="https://obedev.is-a.dev" style="color: #714cdf;">obedev.is-a.dev</a></p>
          <p style="margin: 5px 0;">Teléfono: +507 6351-6283</p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
          <p>Esta propuesta es válida por 30 días a partir de la fecha de emisión.</p>
          <p>© ${new Date().getFullYear()} ObeDev. Todos los derechos reservados.</p>
        </div>
      </div>
    `
  
      // Generate PDF
      generatePDF(content, `Propuesta_${projectType.replace(/\s+/g, "_")}_${currentDate}.pdf`)
    }
  
    function generateAdminPDF() {
      // This function can be similar to the one in pdf-generator.js
      // For brevity, I'm not duplicating all the code here
      alert("Generando PDF de detalles técnicos...")
      // Call the existing function from pdf-generator.js if available
      if (typeof window.generateAdminPDF === "function") {
        window.generateAdminPDF()
      }
    }
  
    // Declare html2pdf variable
    const html2pdf = window.html2pdf
  
    function generatePDF(content, filename) {
      // Create a temporary element
      const element = document.createElement("div")
      element.innerHTML = content
  
      // Append to body but make it invisible
      element.style.position = "absolute"
      element.style.left = "-9999px"
      element.style.top = "-9999px"
      document.body.appendChild(element)
  
      // PDF options
      const options = {
        margin: 10,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }
  
      // Generate PDF
      html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
          // Remove temporary element
          document.body.removeChild(element)
        })
        .catch((error) => {
          console.error("Error generating PDF:", error)
          alert("Hubo un problema al generar el PDF. Por favor, intente de nuevo.")
          document.body.removeChild(element)
        })
    }
  })
  
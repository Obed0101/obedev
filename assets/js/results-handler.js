// WhatsApp modal
const sendToWhatsappBtn = document.getElementById("send-to-whatsapp")
const whatsappModal = document.getElementById("whatsapp-modal")
const closeModalBtn = document.getElementById("close-modal")
const cancelWhatsappBtn = document.getElementById("cancel-whatsapp")
const sendWhatsappBtn = document.getElementById("send-whatsapp")
const whatsappNumberInput = document.getElementById("whatsapp-number")
const whatsappMessageInput = document.getElementById("whatsapp-message")

if (sendToWhatsappBtn) {
  sendToWhatsappBtn.addEventListener("click", openWhatsAppModal)
}
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeWhatsAppModal)
}
if (cancelWhatsappBtn) {
  cancelWhatsappBtn.addEventListener("click", closeWhatsAppModal)
}
if (sendWhatsappBtn) {
  sendWhatsappBtn.addEventListener("click", sendToWhatsApp)
}

// Asegurarse de que el modal esté en el DOM
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "send-to-whatsapp") {
    if (!whatsappModal) {
      console.error("Modal de WhatsApp no encontrado en el DOM")
      return
    }
    openWhatsAppModal()
  }
})

function openWhatsAppModal() {
  whatsappModal.style.display = "flex"
}

function closeWhatsAppModal() {
  whatsappModal.style.display = "none"
}

function sendToWhatsApp() {
  const number = whatsappNumberInput.value
  const message = whatsappMessageInput.value
  const whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  window.open(whatsappLink, "_blank")
  closeWhatsAppModal()
}

// Actualizar la tecnología principal
function updateProjectSummary() {
  const techStack = document.getElementById("tech-stack")
  const techStackValue = techStack.value
  let techResult = "React + Node.js" // Valor por defecto

  switch (techStackValue) {
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
  }

  document.getElementById("tech-result").textContent = techResult
}

// Generar el PDF de la cotización
async function generateQuotePDF() {
  // Obtener los valores de los campos
  const projectName = document.getElementById("project-name").value
  const projectDescription = document.getElementById("project-description").value
  const projectTimeline = document.getElementById("project-timeline").value
  const techResult = document.getElementById("tech-result").textContent

  // Crear el contenido del PDF
  const pdfContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.4;">
      <div style="background-color: #714cdf; color: #fff; padding: 30px; text-align: center; border-radius: 20px 20px 0 0;">
        <h1 style="margin-top: 0; margin-bottom: 5px; font-size: 28px;">Cotización de Proyecto</h1>
        <p style="margin: 0; font-size: 16px;">Detalles del Proyecto</p>
      </div>
      <div style="padding: 30px;">
        <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Nombre del Proyecto</h2>
          <p style="margin: 5px 0;">${projectName}</p>
        </div>
        <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Descripción del Proyecto</h2>
          <p style="margin: 5px 0;">${projectDescription}</p>
        </div>
        <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Tiempo Estimado</h2>
          <p style="margin: 5px 0;">${projectTimeline}</p>
        </div>
        <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Tecnología Principal</h2>
          <p style="margin: 5px 0;">${techResult}</p>
        </div>
      </div>
      <div style="background-color: #714cdf; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 20px 20px;">
        <p style="margin: 0; font-size: 12px;">Este es un documento generado automáticamente. Para cualquier consulta, contáctenos.</p>
      </div>
    </div>
  `

  // Opciones de configuración del PDF
  const options = {
    margin: 10,
    filename: "cotizacion-proyecto.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  }

  // Generar el PDF
  const { html2pdf } = window
  html2pdf().from(pdfContent).set(options).save()
}

// Actualizar las características seleccionadas en el resumen
function updateSelectedFeatures() {
  const summaryFeatures = document.getElementById("summary-features")
  if (!summaryFeatures) return

  // Limpiar el contenido actual
  summaryFeatures.innerHTML = ""

  // Obtener todas las características seleccionadas
  const selectedFeatures = document.querySelectorAll(".feature-checkbox:checked")

  // Si no hay características seleccionadas, mostrar un mensaje
  if (selectedFeatures.length === 0) {
    summaryFeatures.innerHTML = "<p class='no-features'>No se han seleccionado características adicionales</p>"
    return
  }

  // Añadir cada característica al resumen
  selectedFeatures.forEach((checkbox) => {
    const featureLabel = checkbox.nextElementSibling.textContent
    const featureTag = document.createElement("div")
    featureTag.className = "feature-tag"
    featureTag.innerHTML = `<i class="fas fa-check-circle"></i> ${featureLabel}`
    summaryFeatures.appendChild(featureTag)
  })
}

// Actualizar el estado de entrega urgente en el resumen
function updateUrgencyStatus() {
  const summaryUrgency = document.getElementById("summary-urgency")
  if (!summaryUrgency) return

  const isUrgent = document.getElementById("urgency-toggle").checked
  summaryUrgency.textContent = isUrgent ? "Sí" : "No"
}

// Añadir event listeners para actualizar el resumen cuando cambian las características
document.addEventListener("DOMContentLoaded", () => {
  // Actualizar inicialmente
  updateSelectedFeatures()
  updateUrgencyStatus()

  // Añadir event listeners a los checkboxes de características
  const featureCheckboxes = document.querySelectorAll(".feature-checkbox")
  featureCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateSelectedFeatures)
  })

  // Añadir event listener al toggle de urgencia
  const urgencyToggle = document.getElementById("urgency-toggle")
  if (urgencyToggle) {
    urgencyToggle.addEventListener("change", updateUrgencyStatus)
  }
})

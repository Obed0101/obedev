document.addEventListener("DOMContentLoaded", () => {
  const generateQuotePdfBtn = document.getElementById("generate-quote-pdf")
  const sendToWhatsappBtn = document.getElementById("send-to-whatsapp")

  if (generateQuotePdfBtn) {
    generateQuotePdfBtn.addEventListener("click", generateCanvasPDF)
  }

  if (sendToWhatsappBtn) {
    sendToWhatsappBtn.addEventListener("click", openWhatsAppModal)
  }

  // Función para generar PDF usando html2canvas
  async function generateCanvasPDF() {
    try {
      // Crear un contenedor para el PDF
      const pdfContainer = document.createElement("div")
      pdfContainer.className = "pdf-container"
      pdfContainer.style.position = "fixed"
      pdfContainer.style.top = "0"
      pdfContainer.style.left = "0"
      pdfContainer.style.width = "100%"
      pdfContainer.style.height = "100%"
      pdfContainer.style.backgroundColor = "#0b0c15"
      pdfContainer.style.zIndex = "9999"
      pdfContainer.style.overflow = "auto"
      pdfContainer.style.padding = "20px"

      // Obtener datos del proyecto
      const projectType = document.querySelector(".project-type-item.selected")
      const projectTypeName = projectType.querySelector("h3").textContent
      const complexity = document.getElementById("complexity").value
      const timeResult = document.getElementById("time-result").textContent
      const costResult = document.getElementById("cost-result").textContent
      const difficultyResult = document.getElementById("difficulty-result").textContent
      const isUrgent = document.getElementById("urgency-toggle").checked

      // Obtener características seleccionadas
      const selectedFeatures = []
      document.querySelectorAll(".feature-checkbox:checked").forEach((checkbox) => {
        selectedFeatures.push(checkbox.nextElementSibling.textContent)
      })

      // Fecha actual
      const currentDate = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      // Crear contenido del PDF - Primera página
      const firstPageContent = document.createElement("div")
      firstPageContent.style.maxWidth = "700px"
      firstPageContent.style.margin = "0 auto"
      firstPageContent.style.fontFamily = "'Roboto', sans-serif"
      firstPageContent.style.color = "#e4e2ff"
      firstPageContent.style.backgroundColor = "#0b0c15"
      firstPageContent.style.padding = "20px"

      firstPageContent.innerHTML = `
      <div style="background-color: #714cdf; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="color: white; margin: 0; font-size: 24px;">Propuesta de Proyecto: ${projectTypeName}</h1>
            <p style="color: white; opacity: 0.8; margin: 5px 0 0 0;">ObeDev</p>
          </div>
          <div style="text-align: right;">
            <p style="color: white; margin: 5px 0 0 0;">Fecha: ${currentDate}</p>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 16px; margin-bottom: 30px; border: 1px solid rgba(113, 76, 223, 0.3);">
        <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Detalles del Proyecto</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-weight: 500;">Tipo de Proyecto:</span>
          <span>${projectTypeName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-weight: 500;">Dificultad:</span>
          <span>${difficultyResult}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-weight: 500;">Tiempo Estimado:</span>
          <span>${timeResult}</span>
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
          <span style="font-weight: 700; font-size: 24px;">${costResult}</span>
        </div>
        <div style="font-size: 14px; opacity: 0.8; margin-top: 10px;">
          <p>* El precio incluye desarrollo, pruebas y despliegue inicial.</p>
          <p>* Mantenimiento y soporte disponibles por separado.</p>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 16px; margin-bottom: 30px; border: 1px solid rgba(113, 76, 223, 0.3);">
        <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Características Incluidas</h2>
        <ul style="padding-left: 20px;">
          ${selectedFeatures.map((feature) => `<li style="margin-bottom: 8px;">${feature}</li>`).join("") || "<li>No se han seleccionado características adicionales</li>"}
        </ul>
      </div>
    `

      // Crear contenido del PDF - Segunda página (contacto)
      const secondPageContent = document.createElement("div")
      secondPageContent.style.maxWidth = "700px"
      secondPageContent.style.margin = "0 auto"
      secondPageContent.style.fontFamily = "'Roboto', sans-serif"
      secondPageContent.style.color = "#e4e2ff"
      secondPageContent.style.backgroundColor = "#0b0c15"
      secondPageContent.style.padding = "20px"

      secondPageContent.innerHTML = `
      <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 16px; margin-bottom: 30px; border: 1px solid rgba(113, 76, 223, 0.3);">
        <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Información de Contacto</h2>
        <p style="margin: 5px 0;">Obed González Peña</p>
        <p style="margin: 5px 0;">Email: obedev.dev@gmail.com</p>
        <p style="margin: 5px 0;">Web: <a href="https://obedev.is-a.dev" style="color: #714cdf;">obedev.is-a.dev</a></p>
        <p style="margin: 5px 0;">Teléfono: +507 6351-6283</p>
      </div>
      
      <div style="text-align: center; margin-top: 40px; color: #a8b2d1; font-size: 12px;">
        <p>Esta propuesta es válida por 30 días a partir de la fecha de emisión.</p>
        <p>© ${new Date().getFullYear()} ObeDev. Todos los derechos reservados.</p>
      </div>
    `

      // Añadir botones para la vista previa
      const buttonsContainer = document.createElement("div")
      buttonsContainer.style.textAlign = "center"
      buttonsContainer.style.marginTop = "30px"
      buttonsContainer.innerHTML = `
      <button id="download-pdf-btn" style="background-color: #714cdf; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 16px;">
        <i class="fas fa-download"></i> Descargar
      </button>
      <button id="close-preview-btn" style="background-color: transparent; color: #a8b2d1; border: 1px solid #a8b2d1; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 16px; margin-left: 10px;">
        <i class="fas fa-times"></i> Cerrar Vista Previa
      </button>
    `

      // Añadir contenido al contenedor
      pdfContainer.appendChild(firstPageContent)
      pdfContainer.appendChild(secondPageContent)
      pdfContainer.appendChild(buttonsContainer)

      // Añadir el contenedor al body
      document.body.appendChild(pdfContainer)

      // Añadir event listener al botón de descarga
      const downloadBtn = document.getElementById("download-pdf-btn")
      if (downloadBtn) {
        downloadBtn.addEventListener("click", async () => {
          // Cambiar el texto del botón para indicar que está procesando
          downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...'
          downloadBtn.disabled = true

          try {
            // Ocultar los botones para la captura
            buttonsContainer.style.display = "none"

            // Verificar que las bibliotecas necesarias estén disponibles
            if (typeof html2canvas === "undefined") {
              throw new Error("La biblioteca html2canvas no está disponible")
            }

            if (typeof window.jspdf === "undefined" && typeof jspdf === "undefined") {
              throw new Error("La biblioteca jsPDF no está disponible")
            }

            // Referencia a jsPDF
            const jsPDFLib = window.jspdf || jspdf

            // Crear una nueva instancia de jsPDF
            const pdf = new jsPDFLib.jsPDF({
              orientation: "portrait",
              unit: "mm",
              format: "a4",
              compress: true,
            })

            // Capturar la primera página
            const firstPageCanvas = await html2canvas(firstPageContent, {
              backgroundColor: "#0b0c15",
              scale: 2,
              logging: false,
              useCORS: true,
              allowTaint: true,
            })

            // Establecer fondo negro para la primera página
            pdf.setFillColor(11, 12, 21) // #0b0c15
            pdf.rect(0, 0, 210, 297, "F")

            // Añadir la primera página al PDF
            const imgWidth = 210 // A4 width in mm
            const imgHeight = (firstPageCanvas.height * imgWidth) / firstPageCanvas.width
            pdf.addImage(firstPageCanvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, imgWidth, imgHeight)

            // Añadir una nueva página para la información de contacto
            pdf.addPage()

            // Establecer fondo negro para la segunda página
            pdf.setFillColor(11, 12, 21) // #0b0c15
            pdf.rect(0, 0, 210, 297, "F")

            // Capturar la segunda página
            const secondPageCanvas = await html2canvas(secondPageContent, {
              backgroundColor: "#0b0c15",
              scale: 2,
              logging: false,
              useCORS: true,
              allowTaint: true,
            })

            // Añadir la segunda página al PDF
            const secondImgHeight = (secondPageCanvas.height * imgWidth) / secondPageCanvas.width
            pdf.addImage(secondPageCanvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, imgWidth, secondImgHeight)

            // Guardar el PDF
            pdf.save(`Propuesta_${projectTypeName.replace(/\s+/g, "_")}_${currentDate}.pdf`)

            // Mostrar los botones nuevamente
            buttonsContainer.style.display = "block"

            // Restaurar el texto del botón
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Descargar'
            downloadBtn.disabled = false
          } catch (error) {
            console.error("Error al generar el PDF:", error)
            alert("Hubo un problema al generar el PDF: " + error.message)

            // Mostrar los botones nuevamente
            buttonsContainer.style.display = "block"

            // Restaurar el texto del botón
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Descargar'
            downloadBtn.disabled = false
          }
        })
      }

      // Añadir event listener al botón de cerrar
      const closeBtn = document.getElementById("close-preview-btn")
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          document.body.removeChild(pdfContainer)
        })
      }
    } catch (error) {
      console.error("Error al generar la vista previa:", error)
      alert("Hubo un problema al generar la vista previa. Por favor, intente de nuevo.")
    }
  }

  // Función para abrir el modal de WhatsApp
  function openWhatsAppModal() {
    const whatsappModal = document.getElementById("whatsapp-modal")
    if (whatsappModal) {
      whatsappModal.style.display = "flex"
    }
  }
})

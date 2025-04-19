document.addEventListener("DOMContentLoaded", () => {
    const generateClientPdfBtn = document.getElementById("generate-client-pdf")
    const generateAdminPdfBtn = document.getElementById("generate-admin-pdf")
  
    generateClientPdfBtn.addEventListener("click", () => {
      generateClientPDF()
    })
  
    generateAdminPdfBtn.addEventListener("click", () => {
      // Ask for password
      const password = prompt("Ingrese la contraseña para generar el PDF de detalles técnicos:")
      if (password === "obedev2025") {
        generateAdminPDF()
      } else {
        alert("Contraseña incorrecta")
      }
    })
  
    function generateClientPDF() {
      // Get current values
      const projectType = document.querySelector(".project-type-item.selected")
      const projectTypeName = projectType.querySelector("h3").textContent
      const complexity = document.getElementById("complexity").value
      const timeEstimate = document.getElementById("time-estimate").value
      const budget = document.getElementById("budget").value
      const isUrgent = document.getElementById("urgency-toggle").checked
  
      // Get selected features
      const selectedFeatures = []
      document.querySelectorAll(".feature-checkbox:checked").forEach((checkbox) => {
        selectedFeatures.push(checkbox.nextElementSibling.textContent)
      })
  
      // Get results
      const timeResult = document.getElementById("time-result").textContent
      const costResult = document.getElementById("cost-result").textContent
      const teamResult = document.getElementById("team-result").textContent
  
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
                              <h1 style="color: white; margin: 0; font-size: 24px;">Propuesta de Proyecto: ${projectTypeName}</h1>
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
                          <span>${projectTypeName}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                          <span style="font-weight: 500;">Complejidad:</span>
                          <span>${complexity}/5</span>
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
                  
                  <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
                      <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Características Incluidas</h2>
                      <ul style="padding-left: 20px;">
                          ${selectedFeatures.map((feature) => `<li style="margin-bottom: 8px;">${feature}</li>`).join("")}
                      </ul>
                  </div>
                  
                  <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
                      <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Equipo Asignado</h2>
                      <p style="margin: 5px 0;">${teamResult}</p>
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
      generatePDF(content, `Propuesta_${projectTypeName.replace(/\s+/g, "_")}_${currentDate}.pdf`)
    }
  
    function generateAdminPDF() {
      // Get current values
      const projectType = document.querySelector(".project-type-item.selected")
      const projectTypeName = projectType.querySelector("h3").textContent
      const baseHours = projectType.dataset.baseHours
      const baseCost = projectType.dataset.baseCost
      const complexity = document.getElementById("complexity").value
      const timeEstimate = document.getElementById("time-estimate").value
      const budget = document.getElementById("budget").value
      const isUrgent = document.getElementById("urgency-toggle").checked
  
      // Get selected features
      const selectedFeatures = []
      document.querySelectorAll(".feature-checkbox:checked").forEach((checkbox) => {
        selectedFeatures.push(checkbox.nextElementSibling.textContent)
      })
  
      // Get results
      const timeResult = document.getElementById("time-result").textContent
      const costResult = document.getElementById("cost-result").textContent
      const teamResult = document.getElementById("team-result").textContent
  
      // Current date
      const currentDate = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
  
      // Calculate profit margin (simplified)
      const costRange = costResult.replace(/\$|,/g, "").split(" - ")
      const avgCost = (Number.parseInt(costRange[0]) + Number.parseInt(costRange[1])) / 2
      const developmentCost = avgCost * 0.6 // Assume 60% goes to development costs
      const profit = avgCost - developmentCost
      const profitMargin = ((profit / avgCost) * 100).toFixed(2)
  
      // Create PDF content
      const content = `
              <div style="font-family: 'Roboto', sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
                  <div style="background-color: #32334a; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                          <div>
                              <h1 style="color: white; margin: 0; font-size: 24px;">Detalles Técnicos: ${projectTypeName}</h1>
                              <p style="color: white; opacity: 0.8; margin: 5px 0 0 0;">Uso Interno - ObeDev</p>
                          </div>
                          <div style="text-align: right;">
                              <p style="color: white; margin: 5px 0 0 0;">Fecha: ${currentDate}</p>
                          </div>
                      </div>
                  </div>
                  
                  <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
                      <h2 style="color: #714cdf; margin-top: 0;">Configuración del Proyecto</h2>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                          <span style="font-weight: 500;">Tipo de Proyecto:</span>
                          <span>${projectTypeName}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                          <span style="font-weight: 500;">Horas Base:</span>
                          <span>${baseHours} horas</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                          <span style="font-weight: 500;">Costo Base:</span>
                          <span>${baseCost}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                          <span style="font-weight: 500;">Complejidad:</span>
                          <span>${complexity}/5</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                          <span style="font-weight: 500;">Tiempo Estimado (Cliente):</span>
                          <span>${timeEstimate} días</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                          <span style="font-weight: 500;">Presupuesto Cliente:</span>
                          <span>${budget}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                          <span style="font-weight: 500;">Entrega Urgente:</span>
                          <span>${isUrgent ? "Sí (+25% costo)" : "No"}</span>
                      </div>
                  </div>
                  
                  <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
                      <h2 style="color: #714cdf; margin-top: 0;">Desglose de Costos</h2>
                      
                      <div style="margin-bottom: 15px;">
                          <h3 style="color: #714cdf; font-size: 16px; margin-bottom: 10px;">Costos de Desarrollo</h3>
                          <div style="background-color: white; padding: 15px; border-radius: 8px;">
                              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                  <span>Desarrollo Frontend:</span>
                                  <span>${Math.round(developmentCost * 0.4).toLocaleString()}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                  <span>Desarrollo Backend:</span>
                                  <span>${Math.round(developmentCost * 0.4).toLocaleString()}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                  <span>Diseño UI/UX:</span>
                                  <span>${Math.round(developmentCost * 0.2).toLocaleString()}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #eee; font-weight: 500;">
                                  <span>Total Costos:</span>
                                  <span>${Math.round(developmentCost).toLocaleString()}</span>
                              </div>
                          </div>
                      </div>
                      
                      <div style="margin-bottom: 15px;">
                          <h3 style="color: #714cdf; font-size: 16px; margin-bottom: 10px;">Facturación al Cliente</h3>
                          <div style="background-color: white; padding: 15px; border-radius: 8px;">
                              <div style="display: flex; justify-content: space-between; font-weight: 500; color: #714cdf; margin-bottom: 8px;">
                                  <span>Rango de Facturación:</span>
                                  <span>${costResult}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                  <span>Facturación Promedio:</span>
                                  <span>${Math.round(avgCost).toLocaleString()}</span>
                              </div>
                          </div>
                      </div>
                      
                      <div>
                          <h3 style="color: #714cdf; font-size: 16px; margin-bottom: 10px;">Rentabilidad</h3>
                          <div style="background-color: white; padding: 15px; border-radius: 8px;">
                              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                  <span>Costo Total:</span>
                                  <span>${Math.round(developmentCost).toLocaleString()}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                  <span>Ingreso Promedio:</span>
                                  <span>${Math.round(avgCost).toLocaleString()}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #eee; font-weight: 500; color: green;">
                                  <span>Ganancia Estimada:</span>
                                  <span>${Math.round(profit).toLocaleString()}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 14px; color: #666;">
                                  <span>Margen de ganancia:</span>
                                  <span>${profitMargin}%</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
                      <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Características Solicitadas</h2>
                      <ul style="padding-left: 20px;">
                          ${selectedFeatures.map((feature) => `<li style="margin-bottom: 8px;">${feature}</li>`).join("")}
                      </ul>
                  </div>
                  
                  <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
                      <h2 style="color: #714cdf; margin-top: 0; margin-bottom: 15px;">Recursos Técnicos</h2>
                      <h3 style="margin-top: 0; margin-bottom: 10px;">Stack Tecnológico Recomendado</h3>
                      <ul style="padding-left: 20px;">
                          <li style="margin-bottom: 8px;"><strong>Frontend:</strong> React, Tailwind CSS</li>
                          <li style="margin-bottom: 8px;"><strong>Backend:</strong> Node.js, Express</li>
                          <li style="margin-bottom: 8px;"><strong>Base de Datos:</strong> MongoDB / PostgreSQL</li>
                          <li style="margin-bottom: 8px;"><strong>Despliegue:</strong> Vercel / Render</li>
                      </ul>
                      
                      <h3 style="margin-top: 20px; margin-bottom: 10px;">Equipo Asignado</h3>
                      <p style="margin: 5px 0;">${teamResult}</p>
                      
                      <h3 style="margin-top: 20px; margin-bottom: 10px;">Cronograma Tentativo</h3>
                      <ul style="padding-left: 20px;">
                          <li style="margin-bottom: 8px;"><strong>Planificación y Diseño:</strong> ${Math.ceil(Number.parseInt(timeEstimate) * 0.2)} días</li>
                          <li style="margin-bottom: 8px;"><strong>Desarrollo:</strong> ${Math.ceil(Number.parseInt(timeEstimate) * 0.6)} días</li>
                          <li style="margin-bottom: 8px;"><strong>Pruebas y Ajustes:</strong> ${Math.ceil(Number.parseInt(timeEstimate) * 0.2)} días</li>
                      </ul>
                  </div>
                  
                  <div style="background-color: #f5f5f7; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
                      <h2 style="color: #714cdf; margin-top: 0;">Notas Adicionales</h2>
                      <p>Este informe es para uso interno de ObeDev. Contiene información confidencial sobre costos y márgenes de ganancia.</p>
                      <p>Factores que pueden afectar el costo final:</p>
                      <ul>
                          <li>Cambios en el alcance durante el desarrollo</li>
                          <li>Integraciones adicionales no previstas</li>
                          <li>Complejidad técnica descubierta durante la implementación</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
                      <p>Documento generado automáticamente por la Calculadora de Proyectos.</p>
                      <p>© ${new Date().getFullYear()} ObeDev. Todos los derechos reservados.</p>
                  </div>
              </div>
          `
  
      // Generate PDF
      generatePDF(content, `Detalles_Tecnicos_${projectTypeName.replace(/\s+/g, "_")}_${currentDate}.pdf`)
    }
  
    function generatePDF(content, filename) {
      // Create a temporary element
      const element = document.createElement("div")
      element.innerHTML = content
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
      const { jsPDF } = window.jspdf
      const html2pdf = window.html2pdf.default
      html2pdf()
        .from(element)
        .set(options)
        .save()
        .then(() => {
          // Remove temporary element
          document.body.removeChild(element)
        })
    }
  })
  
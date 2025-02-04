//Tecla "s" para detener sonido
// ctrl+c para matar proceso
import puppeteer from "puppeteer";
import { exec } from "child_process";

// Variables globales para acceder desde cualquier parte del script
let browser;
let isSoundPlaying = true;

(async () => {
  try {
    console.log(`Script PID: ${process.pid}`); // Imprimir el PID del proceso

    // Iniciar el navegador
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let attemptCount = 0;
    //const targetUrl = "https://example.com";
    const targetUrl = "https://titulosvalidez.educacion.gob.ar/validez/detitulos/";
    const noAccessUrl = "https://titulosvalidez.educacion.gob.ar/validez/detitulos/noaccess.php";

    console.log("Iniciando el proceso de verificación...");

    // Función para reproducir el sonido en bucle
    const playSoundLoop = (soundFile) => {
      const play = () => {
        if (!isSoundPlaying) return; // Detener si isSoundPlaying es false

        exec(`powershell -c (New-Object Media.SoundPlayer "${soundFile}").PlaySync()`, (error) => {
          if (error) {
            console.error("Error al reproducir el sonido:", error);
          } else {
            console.log("Sonido reproducido.");
            if (isSoundPlaying) play(); // Repetir si isSoundPlaying es true
          }
        });
      };
      play(); // Iniciar el bucle
    };

    // Configurar stdin para capturar teclas presionadas
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    // Capturar eventos de teclado
    process.stdin.on("data", (key) => {
      if (key === "s") {
        console.log("\nDeteniendo el sonido pero manteniendo el navegador abierto...");
        isSoundPlaying = false; // Detener el bucle de sonido
        if (browser) {
          browser.disconnect(); // Desconectar el navegador del script
        }
        // Restaurar la configuración de stdin
        process.stdin.setRawMode(false);
        process.stdin.pause();
      } else if (key === "\u0003") { // Ctrl + C para salir
        console.log("\nSaliendo y cerrando el navegador...");
        isSoundPlaying = false;
        if (browser) {
          browser.close(); // Cerrar el navegador
        }
        process.exit();
      }
    });

    while (true) {
      attemptCount++;
      console.log(`Intento #${attemptCount}`);

      try {
        // Navegar a la página de interés
        await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 }); // Aumentar el tiempo de espera

        // Verificar la URL actual después de la redirección
        const currentUrl = page.url();

        if (currentUrl.includes(noAccessUrl)) {
          console.log('Redirigido a la página de "noaccess". Intentando nuevamente...');
        } else {
          console.log("¡Éxito! Redirigido a una página distinta:", currentUrl);
          console.log("\x1b[42m\x1b[30m%s\x1b[0m", "🎉 ¡TURNOS DISPONIBLES!");

          console.log("Manteniendo el navegador abierto para interacción manual...");

          // Reproducir el sonido en bucle
          playSoundLoop("success.wav");

          // Salir del bucle while
          break;
        }
      } catch (error) {
        console.error("Error durante la ejecución:", error);
      }

      // Esperar 3 segundos antes de reintentar
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } catch (error) {
    console.error("Error general en el script:", error);
  } finally {
    // No cerrar el navegador explícitamente aquí
    console.log("Script finalizado. El navegador permanecerá abierto.");
  }
})();

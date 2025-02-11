# README: Script Puppeteer para detección de turnos

Este script utiliza Puppeteer para automatizar el acceso en este caso pagina para pedir turnos disponibles en un sitio web y notificar al usuario mediante un sonido cuando logra acceder al link.

## Descripción

El script navega a una URL específica (`targetUrl`) y verifica si es redirigido a una página de "noaccess" (`noAccessUrl`). Si no es redirigido, asume que hay turnos disponibles y reproduce un sonido (`success.wav`). El script se ejecuta en un bucle, intentando acceder a la página cada 3 segundos hasta que encuentra turnos disponibles.

## Uso

### Requisitos:

*   Node.js y npm instalados.
*   Puppeteer instalado (`npm install puppeteer`).
*   Archivo de sonido `success.wav` en el mismo directorio que el script.

### Ejecución:

1.  Guarda el código como un archivo `.js` (por ejemplo, `turnos.js`).
2.  Abre una terminal en el directorio donde guardaste el archivo.
3.  Ejecuta el script con `node turnos.js`.

### Control:

*   Presiona la tecla "s" para detener el sonido y desconectar el navegador del script, pero manteniendo el navegador abierto para interacción manual. Esto te permite seguir viendo la página sin que el sonido siga reproduciéndose.
*   Presiona Ctrl+C para detener el script y cerrar el navegador.

## Variables importantes

*   `targetUrl`: URL del sitio web donde se buscan los turnos.
*   `noAccessUrl`: URL de la página a la que se redirige si no hay turnos disponibles.
*   `isSoundPlaying`: Variable global que controla si el sonido se está reproduciendo.

## Funcionamiento

1.  El script inicia Puppeteer y abre una nueva página en el navegador.
2.  Intenta acceder a `targetUrl`.
3.  Si es redirigido a `noAccessUrl`, espera 3 segundos y vuelve a intentarlo.
4.  Si no es redirigido, reproduce el sonido `success.wav` y muestra un mensaje en la consola.
5.  El script sigue ejecutándose hasta que se presiona Ctrl+C para detenerlo.

## Notas

*   Esta diseñado para window (probado en Win 10 y terminal PowerShell)
*   El script utiliza `child_process.exec` para reproducir el sonido en Windows. Si utilizas otro sistema operativo, deberás modificar esta parte del código.
*   El tiempo de espera para cargar la página se puede ajustar en la opción `timeout` de `page.goto()`.
*   El script imprime el PID del proceso al inicio. Esto puede ser útil para identificar el proceso si necesitas detenerlo manualmente.

## Ejemplo de uso

```bash
node turnos.js

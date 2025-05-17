# Productor de Música en Línea

¡Bienvenido al Productor de Música en Línea! Una aplicación web que te permite crear música con un sintetizador, secuenciador y batería.

## Características

- **Sintetizador**
  - Teclado de piano con notas de solfeo (Do, Re, Mi, Fa, Sol, La, Si)
  - Control de volumen y octava
  - Reproducción de notas con el teclado del computador

- **Secuenciador**
  - Patrón de 8 pasos
  - Control de BPM (120 por defecto)
  - Visualización de patrón activo

- **Batería**
  - 4 instrumentos: Base (Q), Snare (W), Hihat (E), Cymbal (R)
  - Selección de diferentes sonidos por instrumento
  - Visualización de teclas activas
  - Reproducción con teclado o clic

- **Metrónomo**
  - Control de BPM independiente
  - Ajuste de volumen
  - Reproducción continua

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari)
- JavaScript habilitado

## Uso

1. Abre el archivo `index.html` en tu navegador
2. Usa el sintetizador:
   - Haz clic en las teclas del piano
   - Usa el teclado del computador (teclas de solfeo)
   - Ajusta el volumen y octava
3. Usa la batería:
   - Haz clic en los instrumentos
   - Usa las teclas Q, W, E, R
   - Selecciona diferentes sonidos
4. Usa el secuenciador:
   - Haz clic en las celdas para crear patrones
   - Ajusta el BPM
   - Usa los controles de reproducción
5. Usa el metrónomo:
   - Actívalo/desactívalo
   - Ajusta el BPM
   - Ajusta el volumen

## Estructura del Proyecto

```
producer/
├── index.html         # Archivo principal
├── script.js          # Lógica de la aplicación
├── styles.css         # Estilos
└── sounds/           # Sonidos
    ├── metronome/    # Sonidos del metrónomo
    ├── notas/        # Notas del sintetizador
    └── sonidos de batería
```

## Contribución

¡Siéntete libre de contribuir! Para hacerlo:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

## Contacto

Para preguntas o sugerencias, por favor contacta a través del repositorio de GitHub.

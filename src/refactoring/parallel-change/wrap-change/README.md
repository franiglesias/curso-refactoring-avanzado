# Técnica de refactorización: Wrap

La técnica **Wrap** consiste en envolver una dependencia problemática manteniendo su interfaz existente, pero mejorando su implementación interna (añadiendo validación, logging, retry, caching, etc.) sin romper el código que la usa.

**Clave:** La interfaz pública NO cambia. Los clientes siguen llamando igual, pero ganan funcionalidad.

## Escenario

Tenemos `LegacyEmailService` (una dependencia externa que NO podemos modificar) que se usa directamente en todo el código. El servicio es limitado: no valida emails, no tiene retry, no tiene logging, no maneja errores bien.

Queremos mejorar la funcionalidad SIN cambiar todas las llamadas existentes.

## Código actual

En `wrap-change.ts` existe:

- `LegacyEmailService` - servicio externo rígido
- `notifyWelcome`, `notifyPasswordReset`, `notifyOrderConfirmation` - usan el servicio directamente

## Ejercicio: Aplicar técnica WRAP

**Objetivo:** Crear un wrapper que mantiene la misma interfaz (`sendEmail(to, subject, body)`) pero añade:

- Validación de emails
- Logging de operaciones
- Sanitización del contenido
- Plantillas
- Manejo de errores mejorado

### Pasos sugeridos

1. **Crear el wrapper** con la misma interfaz que `LegacyEmailService`:

```ts
class EmailServiceWrapper {
  constructor(private legacyService: LegacyEmailService) {
  }

  sendEmail(to: string, subject: string, body: string): string {
    // Por ahora, solo delegar
    return this.legacyService.sendEmail(to, subject, body)
  }
}
```

2. **Añadir validación** dentro del wrapper (sin cambiar la interfaz):
```ts
sendEmail(to
:
string, subject
:
string, body
:
string
):
string
{
  if (!this.isValidEmail(to)) {
    throw new Error(`Invalid email: ${to}`)
  }
  return this.legacyService.sendEmail(to, subject, body)
}
```

3. **Añadir logging** (sin cambiar la interfaz):

```ts
sendEmail(to
:
string, subject
:
string, body
:
string
):
string
{
  console.log(`Sending email to ${to}...`)
  const result = this.legacyService.sendEmail(to, subject, body)
  console.log(`Email sent successfully`)
  return result
}
```

4. **Migrar los puntos de uso** al wrapper uno por uno:

```ts
const emailService = new EmailServiceWrapper(new LegacyEmailService())

export function notifyWelcome(userEmail: string): string {
  return emailService.sendEmail(userEmail, 'Welcome!', 'Thanks for joining our app.')
}
```

5. **Añadir más funcionalidad** según necesites (retry, sanitización, plantillas, etc.)

### Criterios de aceptación

- ✅ La interfaz pública (`sendEmail(to, subject, body)`) NO cambia
- ✅ Los clientes no necesitan modificarse (solo cambiar la instancia usada)
- ✅ El wrapper añade funcionalidad (validación, logging, etc.)
- ✅ El servicio legacy sigue siendo usado internamente
- ✅ Puedes migrar punto por punto sin romper nada

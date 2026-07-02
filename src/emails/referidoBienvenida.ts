export const REFERIDO_BIENVENIDA_SUBJECT = 'Te recomendaron para actuar en TAG 🎭';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildReferidoBienvenidaHtml(friendFirstName: string): string {
  const safeName = escapeHtml(friendFirstName);
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Te recomendaron para TAG</title>
</head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Alguien de TAG te recomendó. Entras sin pagar matrícula.
  </span>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#000;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <tr>
            <td style="padding:0;line-height:0;">
              <img
                src="https://theactinggarage.com/content/tag-bg.jpg"
                alt="The Acting Garage"
                width="600"
                style="display:block;width:100%;max-width:600px;height:auto;"
              />
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:40px 40px 0;">
              <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.25em;color:rgba(255,255,255,0.3);text-transform:uppercase;">
                The Acting Garage
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:16px 40px 0;">
              <h1 style="margin:0;font-family:'Arial Black','Impact','Helvetica Neue',sans-serif;font-size:44px;font-weight:900;line-height:1.05;color:#fff;text-transform:uppercase;letter-spacing:-0.02em;">
                TE RECOMENDARON<br>PARA <span style="color:#FFBE00;">TAG</span>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:24px 40px 0;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.6);">
                Hola <strong style="color:#fff;">${safeName}</strong>. Un amigo o compañera que ya estudia en TAG te recomendó para actuar acá.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:36px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td width="4" style="background:#FFBE00;"></td>
                  <td style="padding:0 0 0 20px;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:0.2em;color:rgba(255,255,255,0.35);text-transform:uppercase;">Tu beneficio</p>
                    <p style="margin:0;font-family:'Arial Black','Impact',sans-serif;font-size:22px;font-weight:900;color:#FFBE00;text-transform:uppercase;letter-spacing:-0.01em;">Entras sin pagar matrícula</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:28px 40px 0;">
              <p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.5);">
                Nos pondremos en contacto en menos de 48 horas para contarte más sobre los cursos y coordinar tu inscripción. El beneficio se acredita en el momento de inscribirte.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:36px 40px 48px;">
              <a href="https://theactinggarage.com/cursos"
                 style="display:block;background:#FFBE00;color:#000;text-decoration:none;text-align:center;padding:18px 0;font-family:'Arial Black','Impact',sans-serif;font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:0.12em;">
                VER CURSOS →
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:rgba(255,255,255,0.08);"></div>
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:28px 40px 36px;">
              <p style="margin:0;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.2);">
                The Acting Garage · C/ Còrsega 340, Barcelona<br>
                Recibes este correo porque alguien te recomendó en nuestro programa de referidos.<br>
                <a href="{{UNSUBSCRIBE_URL}}" style="color:rgba(255,255,255,0.3);text-decoration:underline;">Cancelar suscripción</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

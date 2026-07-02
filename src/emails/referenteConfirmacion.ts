import { getReferralRewardLabel } from '../lib/referralRewards';

export const REFERENTE_CONFIRMACION_SUBJECT = 'Referiste a alguien a TAG 🎭 — así reclamas tu regalo';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildReferenteConfirmacionHtml(friendFullName: string, referralReward: string): string {
  const safeFriendName = escapeHtml(friendFullName);
  const rewardLabel = escapeHtml(getReferralRewardLabel(referralReward));
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de referido — TAG</title>
</head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Recibimos los datos de ${safeFriendName}. Guarda este correo para reclamar tu regalo en el mostrador.
  </span>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#000;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <tr>
            <td style="background:#000;padding:40px 40px 0;">
              <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.25em;color:rgba(255,255,255,0.3);text-transform:uppercase;">
                The Acting Garage
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:16px 40px 0;">
              <h1 style="margin:0;font-family:'Arial Black','Impact','Helvetica Neue',sans-serif;font-size:40px;font-weight:900;line-height:1.05;color:#fff;text-transform:uppercase;letter-spacing:-0.02em;">
                GRACIAS POR<br>REFERIR A <span style="color:#FFBE00;">TAG</span>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:24px 40px 0;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.6);">
                Recibimos los datos de <strong style="color:#fff;">${safeFriendName}</strong>. Nos pondremos en contacto en menos de 48 horas.
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
                    <p style="margin:0;font-family:'Arial Black','Impact',sans-serif;font-size:22px;font-weight:900;color:#FFBE00;text-transform:uppercase;letter-spacing:-0.01em;">${rewardLabel}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#000;padding:28px 40px 0;">
              <p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.5);">
                Tu regalo se acredita automáticamente cuando tu amigo/a se inscriba. Si quieres confirmar el estado antes, guarda este correo y muéstralo en el mostrador — ahí lo revisamos contigo.
              </p>
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
                Recibes este correo porque referiste a alguien en nuestro programa de referidos.<br>
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

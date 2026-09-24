import React from 'react';
import { computeAge } from '../utils/age';

/**
 * Piezas legales compartidas por los tres formularios del sitio (FormFlyout,
 * InlineLeadForm y LeadPopup), para que digan exactamente lo mismo.
 *
 * - Casilla de privacidad: sin marcar, obligatoria para enviar, con enlace a la
 *   política (en pestaña nueva: si abre el enlace no pierde lo que escribió).
 *   No se guarda en la base: el envío mismo sólo existe si la casilla estaba
 *   marcada.
 * - Aviso de menores: en los cursos para menores, o si la fecha de nacimiento da
 *   menos de 18, se aclara que el formulario lo completa un adulto responsable.
 */

const CURSOS_MENORES = /mini kids|kids|new generation|j[oó]venes/i;

export function esCursoDeMenores(curso?: string | null): boolean {
  return Boolean(curso && CURSOS_MENORES.test(curso));
}

export function esMenor(curso?: string | null, birthday?: string | null): boolean {
  if (esCursoDeMenores(curso)) return true;
  const age = birthday ? Number(computeAge(birthday)) : NaN;
  return Number.isFinite(age) && age > 0 && age < 18;
}

export const AvisoMenores: React.FC<{ className?: string }> = ({ className = '' }) => (
  <p className={`text-[13px] leading-snug ${className}`}>
    Si el curso es para un menor de edad, este formulario lo rellena su padre, su madre o su
    tutor legal, con sus propios datos de contacto.
  </p>
);

export const CasillaPrivacidad: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  className?: string;
  linkClassName?: string;
  /** Color de la tilde: negro sobre el amarillo del flyout, amarillo sobre fondo negro. */
  accent?: string;
}> = ({ checked, onChange, id, className = '', linkClassName = 'underline', accent = '#000' }) => (
  <label htmlFor={id} className={`flex items-start gap-3 text-[13px] leading-snug cursor-pointer ${className}`}>
    <input
      id={id}
      type="checkbox"
      required
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      className="mt-0.5 h-4 w-4 shrink-0"
      style={{ accentColor: accent }}
    />
    <span>
      He leído y acepto la{' '}
      <a href="/privacidad" target="_blank" rel="noopener noreferrer" className={linkClassName}>
        política de privacidad
      </a>
      . Usaremos tus datos sólo para responder a tu solicitud.
    </span>
  </label>
);

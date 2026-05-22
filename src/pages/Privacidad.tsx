import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="font-druk text-xl font-medium text-black uppercase tracking-tight mb-3">{title}</h2>
    <div className="font-sans text-sm text-[#333] leading-relaxed space-y-2">{children}</div>
  </div>
);

const Privacidad: React.FC = () => (
  <>
    <Helmet>
      <title>Política de Privacidad · The Acting Garage</title>
      <meta name="description" content="Política de privacidad y protección de datos de The Acting Garage, Barcelona." />
      <meta name="robots" content="noindex" />
    </Helmet>

    <Header />

    <main className="bg-[#f4f1ea] min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <p className="font-sans text-xs text-[#888] uppercase tracking-widest mb-2">Legal</p>
          <h1 className="font-druk text-5xl font-medium text-black uppercase tracking-tight leading-tight">
            Política de<br />Privacidad
          </h1>
          <p className="font-sans text-sm text-[#666] mt-3">Última actualización: mayo 2026</p>
        </div>

        <Section title="1. Responsable del tratamiento">
          <p><strong>Razón social:</strong> The Acting Garage</p>
          <p><strong>Dirección:</strong> Carrer de Londres, 9, L'Eixample, 08029 Barcelona, España</p>
          <p><strong>Correo electrónico:</strong>{' '}
            <a href="mailto:hola@theactinggarage.com" className="underline text-black">
              hola@theactinggarage.com
            </a>
          </p>
          <p><strong>Teléfono:</strong> +34 682 56 01 87</p>
        </Section>

        <Section title="2. Datos que recopilamos">
          <p>Recopilamos los siguientes datos personales cuando te pones en contacto con nosotros, rellenas un formulario o te inscribes en alguno de nuestros cursos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nombre y apellidos</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Fecha de nacimiento (cuando es relevante para el curso)</li>
            <li>Curso o programa de interés</li>
            <li>Datos de navegación y atribución (UTM, cookies de análisis)</li>
          </ul>
        </Section>

        <Section title="3. Finalidad del tratamiento">
          <p>Utilizamos tus datos para:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestionar tu solicitud de información o inscripción</li>
            <li>Contactarte para coordinar clases de prueba o facilitar información sobre nuestros programas</li>
            <li>Enviarte comunicaciones relacionadas con nuestros cursos, si has dado tu consentimiento</li>
            <li>Mejorar nuestros servicios y analizar el rendimiento de nuestra comunicación digital</li>
            <li>Cumplir con nuestras obligaciones legales y contractuales</li>
          </ul>
        </Section>

        <Section title="4. Base legal">
          <p>El tratamiento de tus datos se basa en:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Tu consentimiento</strong>, otorgado al rellenar nuestros formularios de contacto</li>
            <li><strong>La ejecución de un contrato</strong>, cuando te inscribes en uno de nuestros programas</li>
            <li><strong>Nuestro interés legítimo</strong>, para gestionar nuestras actividades y mejorar nuestros servicios</li>
          </ul>
        </Section>

        <Section title="5. Conservación de los datos">
          <p>Conservamos tus datos durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos y, en todo caso, durante los plazos legalmente establecidos. Si no llegamos a formalizar ninguna relación contractual, tus datos se eliminan a los 24 meses desde el último contacto.</p>
        </Section>

        <Section title="6. Terceros y transferencias internacionales">
          <p>Podemos compartir tus datos con proveedores de servicios que nos ayudan a operar nuestra plataforma:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase</strong> — almacenamiento de base de datos (UE)</li>
            <li><strong>Meta Platforms (Facebook/Instagram)</strong> — publicidad y análisis (puede implicar transferencia fuera de la UE bajo cláusulas contractuales tipo)</li>
            <li><strong>Google Analytics / Google Ads</strong> — análisis web y seguimiento de conversiones</li>
            <li><strong>Resend</strong> — envío de comunicaciones por email</li>
          </ul>
          <p>En ningún caso vendemos tus datos a terceros.</p>
        </Section>

        <Section title="7. Tus derechos">
          <p>En virtud del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos (LOPDGDD), tienes derecho a:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Acceso</strong> — conocer qué datos tenemos sobre ti</li>
            <li><strong>Rectificación</strong> — corregir datos inexactos</li>
            <li><strong>Supresión</strong> — solicitar la eliminación de tus datos</li>
            <li><strong>Oposición</strong> — oponerte al tratamiento de tus datos</li>
            <li><strong>Portabilidad</strong> — recibir tus datos en formato estructurado</li>
            <li><strong>Limitación</strong> — solicitar la restricción del tratamiento</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, envía un email a{' '}
            <a href="mailto:hola@theactinggarage.com" className="underline text-black">
              hola@theactinggarage.com
            </a>{' '}
            indicando el derecho que deseas ejercer. Responderemos en un plazo máximo de 30 días. También puedes presentar una reclamación ante la{' '}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="underline text-black">
              Agencia Española de Protección de Datos (AEPD)
            </a>.
          </p>
        </Section>

        <Section title="8. Cookies">
          <p>Nuestra web utiliza cookies técnicas necesarias para su funcionamiento y cookies analíticas para medir el rendimiento. También utilizamos el píxel de Meta y el seguimiento de Google Ads para medir el retorno de nuestra inversión publicitaria.</p>
          <p>Al seguir navegando en nuestra web, aceptas el uso de estas cookies conforme a esta política.</p>
        </Section>

        <Section title="9. Seguridad">
          <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos contra el acceso no autorizado, la pérdida o la alteración, incluyendo cifrado en tránsito (HTTPS) y en reposo.</p>
        </Section>

        <Section title="10. Cambios en esta política">
          <p>Podemos actualizar esta política ocasionalmente. La fecha de "última actualización" en la parte superior de esta página refleja cuándo se realizó el último cambio. Te recomendamos revisarla periódicamente.</p>
        </Section>

        <div className="mt-12 pt-8 border-t border-[#ccc]">
          <Link to="/" className="font-sans text-sm text-[#666] underline hover:text-black">
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </main>
  </>
);

export default Privacidad;

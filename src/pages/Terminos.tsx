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

const Terminos: React.FC = () => (
  <>
    <Helmet>
      <title>Términos y Condiciones · The Acting Garage</title>
      <meta name="description" content="Términos y condiciones de uso de los servicios de The Acting Garage, Barcelona." />
      <meta name="robots" content="noindex" />
    </Helmet>

    <Header />

    <main className="bg-[#f4f1ea] min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <p className="font-sans text-xs text-[#888] uppercase tracking-widest mb-2">Legal</p>
          <h1 className="font-druk text-5xl font-medium text-black uppercase tracking-tight leading-tight">
            Términos y<br />Condiciones
          </h1>
          <p className="font-sans text-sm text-[#666] mt-3">Última actualización: mayo 2026</p>
        </div>

        <Section title="1. Identificación">
          <p><strong>Razón social:</strong> The Acting Garage</p>
          <p><strong>Dirección:</strong> Carrer de Londres, 9, L'Eixample, 08029 Barcelona, España</p>
          <p><strong>Correo electrónico:</strong>{' '}
            <a href="mailto:hola@theactinggarage.com" className="underline text-black">hola@theactinggarage.com</a>
          </p>
          <p><strong>Teléfono:</strong> +34 682 56 01 87</p>
        </Section>

        <Section title="2. Objeto">
          <p>The Acting Garage ofrece formación en interpretación y artes escénicas en Barcelona. Estos términos regulan el acceso a nuestra web, la contratación de cursos, talleres y masterclasses, y cualquier otra prestación de servicios ofrecida por The Acting Garage.</p>
        </Section>

        <Section title="3. Inscripción y contratación">
          <ul className="list-disc pl-5 space-y-1">
            <li>La inscripción en un curso se formaliza mediante el pago de la matrícula o cuota correspondiente y la aceptación del contrato de inscripción enviado por email.</li>
            <li>La plaza queda reservada únicamente cuando se ha completado el pago.</li>
            <li>The Acting Garage se reserva el derecho de rechazar una inscripción si el grupo ya está completo o si el perfil del alumno no se ajusta al nivel del curso.</li>
          </ul>
        </Section>

        <Section title="4. Precios y pagos">
          <ul className="list-disc pl-5 space-y-1">
            <li>Los precios indicados en nuestra web incluyen el IVA aplicable.</li>
            <li>El pago puede realizarse mediante transferencia bancaria, tarjeta de crédito/débito u otros métodos indicados en el proceso de inscripción.</li>
            <li>En cursos de larga duración, puede acordarse un plan de pagos fraccionados según lo indicado en el contrato individual.</li>
          </ul>
        </Section>

        <Section title="5. Política de cancelación y devoluciones">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cancelación por el alumno con más de 14 días de antelación:</strong> devolución del 100% del importe pagado.</li>
            <li><strong>Cancelación con entre 7 y 14 días de antelación:</strong> devolución del 50% del importe pagado.</li>
            <li><strong>Cancelación con menos de 7 días de antelación o una vez iniciado el curso:</strong> no se realizará devolución, salvo causa de fuerza mayor debidamente acreditada.</li>
            <li><strong>Cancelación por parte de The Acting Garage:</strong> devolución íntegra del importe pagado o, si el alumno lo prefiere, crédito para otro curso.</li>
          </ul>
        </Section>

        <Section title="6. Clases de prueba">
          <p>Las clases de prueba gratuitas ofrecidas como parte de nuestras acciones de marketing no generan ninguna obligación de inscripción. The Acting Garage se reserva el derecho de limitar la disponibilidad de clases de prueba.</p>
        </Section>

        <Section title="7. Obligaciones del alumno">
          <ul className="list-disc pl-5 space-y-1">
            <li>Asistir con puntualidad y regularidad a las sesiones contratadas.</li>
            <li>Mantener un comportamiento respetuoso con el equipo docente y el resto de alumnos.</li>
            <li>No grabar, fotografiar ni difundir contenido de las clases sin consentimiento expreso de The Acting Garage y de los demás participantes.</li>
          </ul>
        </Section>

        <Section title="8. Propiedad intelectual">
          <p>Todos los contenidos de esta web — textos, imágenes, vídeos, metodologías y materiales didácticos — son propiedad de The Acting Garage o de sus colaboradores y están protegidos por la legislación española e internacional de propiedad intelectual. Queda prohibida su reproducción, distribución o uso sin autorización expresa.</p>
        </Section>

        <Section title="9. Limitación de responsabilidad">
          <p>The Acting Garage no se hace responsable de los daños o pérdidas derivados del mal uso de la web, interrupciones técnicas o circunstancias ajenas a su control. La responsabilidad máxima de The Acting Garage frente al alumno se limita al importe efectivamente pagado por los servicios contratados.</p>
        </Section>

        <Section title="10. Protección de datos">
          <p>
            El tratamiento de datos personales se rige por nuestra{' '}
            <Link to="/privacidad" className="underline text-black">Política de Privacidad</Link>,
            que forma parte integral de estos términos.
          </p>
        </Section>

        <Section title="11. Modificaciones">
          <p>The Acting Garage se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en esta página. El uso continuado de nuestros servicios tras la publicación de cambios implica la aceptación de los nuevos términos.</p>
        </Section>

        <Section title="12. Legislación aplicable y jurisdicción">
          <p>Estos términos se rigen por la legislación española. Para cualquier controversia derivada de su interpretación o cumplimiento, las partes se someten a los juzgados y tribunales de Barcelona, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
        </Section>

        <div className="mt-12 pt-8 border-t border-[#ccc] flex gap-6">
          <Link to="/" className="font-sans text-sm text-[#666] underline hover:text-black">
            ← Volver al inicio
          </Link>
          <Link to="/privacidad" className="font-sans text-sm text-[#666] underline hover:text-black">
            Política de privacidad
          </Link>
        </div>

      </div>
    </main>
  </>
);

export default Terminos;

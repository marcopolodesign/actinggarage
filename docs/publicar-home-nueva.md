# Publicar la home nueva en `/`

Hoy `/nueva` está en revisión: `noindex`, bloqueada en `robots.txt` y fuera del
sitemap. Cuando la escuela dé el OK, son estos pasos — **todos en el mismo
commit**, para que no quede un momento con la home nueva indexable a medias o
con la vieja desindexada.

1. **`src/App.tsx`** — la ruta `/` pasa a `<HomeNueva />`. `/nueva` redirige a `/`
   (con `<Navigate to="/" replace />`, conservando `location.search`, igual que
   `CourseLandingRedirect`), para no romper los enlaces ya repartidos.
   También cambiar `isHomeNueva` para que mire `location.pathname === '/'`.
2. **`src/pages/HomeNueva.tsx`** — borrar el `<meta name="robots" content="noindex" />`.
   La canonical ya apunta a `https://www.theactinggarage.com/`.
3. **`public/robots.txt`** — borrar la línea `Disallow: /nueva` y su comentario.
4. **`scripts/prerender.mjs`** — sacar `'/nueva'` de `ROUTES` y de `CANONICAL_OF`.
   La `/` ya se prerenderiza, y con el paso 1 va a salir con la home nueva.
5. **`index.html`** — no hay que tocar nada: desde el 24/09/2026 no tiene meta
   robots estático (cada página pone el suyo) y la descripción para IA ya dice
   Barcelona.

## Antes de mergear, comprobar

```bash
npm run build                                   # el prerender corta el build si algo sale mal
grep -o '<meta[^>]*robots[^>]*>' dist/index.html   # no debe decir noindex
grep -c 'El actor' dist/index.html              # la home nueva, en el HTML servido
```

## Después del deploy

```bash
node scripts/check-consent.mjs https://www.theactinggarage.com/
```

Y la regla de atribución de siempre (`CLAUDE.md` de TAG, regla 4): un envío real
del formulario con `?utm_source=meta&…` y un email con «prueba», comprobar la fila
en `prospects` y borrarla.

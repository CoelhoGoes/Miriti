/**
 * Filtros SVG aplicados via CSS (filter: url('#cb-...')) para simular daltonismos
 * e aumentar a separação de cores no app. Os valores são padrão de visão.
 */
export default function ColorblindFilters() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      focusable="false"
    >
      <defs>
        <filter id="cb-deuter">
          <feColorMatrix
            type="matrix"
            values="0.367  0.861 -0.228 0 0
                    0.280  0.673  0.047 0 0
                   -0.012  0.043  0.969 0 0
                    0      0      0     1 0"
          />
        </filter>
        <filter id="cb-protan">
          <feColorMatrix
            type="matrix"
            values="0.152  1.053 -0.205 0 0
                    0.115  0.786  0.099 0 0
                   -0.004 -0.048  1.052 0 0
                    0      0      0     1 0"
          />
        </filter>
        <filter id="cb-tritan">
          <feColorMatrix
            type="matrix"
            values="1.255 -0.077 -0.178 0 0
                   -0.078  0.931  0.148 0 0
                    0.005  0.691  0.304 0 0
                    0      0      0     1 0"
          />
        </filter>
      </defs>
    </svg>
  )
}

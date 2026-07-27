import { ImageResponse } from "next/og";

/**
 * Genera el icono de SnowLog en el tamaño pedido.
 * Se usa tanto para los iconos del manifest como para el apple-touch-icon.
 */
export function createSnowLogIcon(size: number) {
  const markSize = Math.round(size * 0.62);
  const titleSize = Math.max(18, Math.round(size * 0.075));

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #060b12 0%, #0a1622 58%, #0d2a39 100%)",
          color: "#f0f6fc",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -size * 0.18,
            right: -size * 0.14,
            display: "flex",
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: size,
            background:
              "radial-gradient(circle, rgba(125, 211, 252, 0.25) 0%, rgba(125, 211, 252, 0) 72%)",
          }}
        />

        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(size * 0.035),
          }}
        >
          <svg
            width={markSize}
            height={markSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 72L34 33L48 52L64 20L93 72H8Z"
              fill="rgba(240, 246, 252, 0.08)"
              stroke="#F0F6FC"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M26 45L34 33L48 52L64 20L75 40"
              stroke="#7DD3FC"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M69 36C57 43 63 51 50 57C38 63 34 68 31 78"
              stroke="#7DD3FC"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M17 83H84"
              stroke="rgba(240, 246, 252, 0.42)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: Math.round(size * 0.012),
              lineHeight: 1,
            }}
          >
            SNOWLOG
          </div>
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
    },
  );
}

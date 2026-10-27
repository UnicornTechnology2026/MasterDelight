import bottle from "../assets/bottle.jpg";

const SHAPE =
  "M110 8H228Q238 8 238 20V340C238 390 335 400 335 470V1085Q335 1128 292 1128H45Q2 1128 2 1085V470C2 400 100 390 100 340V20Q100 8 110 8Z";
// Bottle photo that fills with colour from the bottom as `fill` goes 0 -> 1.
export default function Bottle({
  fill = 1,
  grey = false,
  glow = false,
  onDrop,
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 337 1132"
      className={`${className} transition ${glow ? "drop-shadow-[0_0_14px_rgba(245,184,46,0.9)]" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <defs>
        <clipPath id="md-shape">
          <path d={SHAPE} />
        </clipPath>
        <clipPath id="md-fill">
          <rect
            x="0"
            width="337"
            y={1132 - 1132 * fill}
            height={1132 * fill}
            style={{ transition: "all .5s" }}
          />
        </clipPath>
      </defs>
      {grey && (
        <g clipPath="url(#md-shape)">
          <image
            href={bottle}
            width="337"
            height="1132"
            opacity=".6"
            style={{ filter: "grayscale(1) brightness(.45)" }}
          />
        </g>
      )}
      <g clipPath="url(#md-shape)">
        <g clipPath="url(#md-fill)">
          <image href={bottle} width="337" height="1132" />
        </g>
      </g>
    </svg>
  );
}

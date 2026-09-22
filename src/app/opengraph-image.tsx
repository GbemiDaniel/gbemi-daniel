import { ImageResponse } from "next/og";

export const alt = "Gbemi Daniel — Frontend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Kept to satori's default font rather than fetching a webfont at build
// time — the layout, color, and corner-bracket motif carry the brand here,
// not an exact typography match, and it avoids a network dependency for a
// file that's baked once at build.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1c1522 0%, #120e17 60%)",
          color: "#f2efe9",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 56,
            width: 36,
            height: 36,
            borderTop: "3px solid #c9f31d",
            borderLeft: "3px solid #c9f31d",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 56,
            width: 36,
            height: 36,
            borderTop: "3px solid #c9f31d",
            borderRight: "3px solid #c9f31d",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 56,
            width: 36,
            height: 36,
            borderBottom: "3px solid #c9f31d",
            borderLeft: "3px solid #c9f31d",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 56,
            width: 36,
            height: 36,
            borderBottom: "3px solid #c9f31d",
            borderRight: "3px solid #c9f31d",
          }}
        />

        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#c9f31d" }}>
          GBEMIDANIEL.DEV
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 700,
            marginTop: 24,
            lineHeight: 1.05,
          }}
        >
          Gbemi Daniel
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "rgba(242,239,233,0.65)",
            marginTop: 20,
          }}
        >
          From ideas to products — built to standard, built for real users.
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: 48,
            fontSize: 22,
            letterSpacing: 3,
            color: "rgba(242,239,233,0.45)",
          }}
        >
          <div style={{ display: "flex" }}>CREATIVE DEVELOPER</div>
          <div style={{ display: "flex", color: "#c9f31d" }}>/</div>
          <div style={{ display: "flex" }}>FRONTEND ENGINEER</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const alt = "My Carport Guy — Eagle Carports dealer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #09283f 0%, #164d68 70%, #d45d28 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontWeight: 700, letterSpacing: 3 }}>
          MY CARPORT GUY
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 930 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3 }}>
            Room for what matters.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 29, color: "#dcebf0" }}>
            Carports · Garages · Barns · RV Covers
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#f4cab7" }}>
          Your friendly Eagle Carports dealer · (828) 839-1730
        </div>
      </div>
    ),
    size,
  );
}

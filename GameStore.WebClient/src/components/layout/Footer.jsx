// GameStore.WebClient/src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid #222",
        padding: "40px 0",
        marginTop: 60,
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
          fontSize: 13,
          color: "#777",
        }}
      >
        <div>
          <h4
            style={{
              color: "#aaa",
              marginBottom: 12,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Resources
          </h4>
          <p style={{ marginBottom: 6 }}>Support</p>
          <p style={{ marginBottom: 6 }}>FAQ</p>
          <p style={{ marginBottom: 6 }}>Community Rules</p>
        </div>
        <div>
          <h4
            style={{
              color: "#aaa",
              marginBottom: 12,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Company
          </h4>
          <p style={{ marginBottom: 6 }}>About</p>
          <p style={{ marginBottom: 6 }}>Careers</p>
          <p style={{ marginBottom: 6 }}>Newsroom</p>
        </div>
        <div>
          <h4
            style={{
              color: "#aaa",
              marginBottom: 12,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Legal
          </h4>
          <p style={{ marginBottom: 6 }}>Terms of Service</p>
          <p style={{ marginBottom: 6 }}>Privacy Policy</p>
          <p style={{ marginBottom: 6 }}>Cookie Policy</p>
        </div>
        <div>
          <h4
            style={{
              color: "#aaa",
              marginBottom: 12,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Follow Us
          </h4>
          <p style={{ marginBottom: 6 }}>Twitter</p>
          <p style={{ marginBottom: 6 }}>Facebook</p>
          <p style={{ marginBottom: 6 }}>YouTube</p>
        </div>
      </div>
      <div
        className="container"
        style={{
          marginTop: 40,
          paddingTop: 20,
          borderTop: "1px solid #222",
          textAlign: "center",
          fontSize: 11,
          color: "#555",
        }}
      >
        © {new Date().getFullYear()} GameStore. All rights reserved.
      </div>
    </footer>
  );
}

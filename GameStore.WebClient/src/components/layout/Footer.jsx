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
            TÀI NGUYÊN
          </h4>
          <p style={{ marginBottom: 6 }}>Hỗ Trợ</p>
          <p style={{ marginBottom: 6 }}>FAQ</p>
          <p style={{ marginBottom: 6 }}>Quy định cộng đồng</p>
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
            Công ty
          </h4>
          <p style={{ marginBottom: 6 }}>Giới thiệu</p>
          <p style={{ marginBottom: 6 }}>Tuyển dụng</p>
          <p style={{ marginBottom: 6 }}>Tin tức</p>
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
            Pháp lý
          </h4>
          <p style={{ marginBottom: 6 }}>Điều khoản dịch vụ</p>
          <p style={{ marginBottom: 6 }}>Chính sách bảo mật</p>
          <p style={{ marginBottom: 6 }}>Chính sách sử dụng Cookie</p>
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
            Theo dõi chúng tôi
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
        © {new Date().getFullYear()} GameStore. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
}

import { Heart } from 'lucide-react'
import { FaGithub, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer style={{ background: '#0a0a15', borderTop: '1px solid #2a2a4a', padding: '30px 0', marginTop: 40 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ color: '#6b6b8e', fontSize: 13 }}>
          © 2025 <span className="gradient-text" style={{ fontWeight: 700 }}>GameStore</span>. Built with <Heart size={12} fill="#e94560" color="#e94560" style={{ verticalAlign: 'middle' }} /> + React + .NET 10
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="https://github.com" target="_blank" style={{ color: '#6b6b8e', transition: 'color 0.3s' }} title="GitHub">
            <FaGithub size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" style={{ color: '#6b6b8e', transition: 'color 0.3s' }} title="Twitter">
            <FaTwitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}

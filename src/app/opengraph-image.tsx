import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'OrbiraMind - Psikologlar İçin Danışan Analiz Platformu'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FAFAF8 0%, #F5F5F3 100%)',
          position: 'relative',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(91, 123, 106, 0.1)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(212, 133, 106, 0.15)',
            filter: 'blur(60px)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #5B7B6A 0%, #3D5A4C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
              boxShadow: '0 8px 32px rgba(91, 123, 106, 0.3)',
            }}
          >
            <span
              style={{
                color: 'white',
                fontSize: 48,
                fontWeight: 700,
              }}
            >
              O
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#1a1a1a',
                letterSpacing: -1,
              }}
            >
              OrbiraMind
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: '#5B7B6A',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Wellness Platform
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: 16,
            maxWidth: 800,
          }}
        >
          Danışanlarınızın İç Dünyasını Keşfedin
        </div>
        
        <div
          style={{
            fontSize: 20,
            color: '#666',
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          HAE & AQE motorları ile bilimsel kişilik analizi
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'white',
              borderRadius: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <span style={{ fontSize: 14, color: '#666' }}>KVKK Uyumlu</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'white',
              borderRadius: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <span style={{ fontSize: 14, color: '#666' }}>256-bit Şifreleme</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'rgba(212, 133, 106, 0.1)',
              borderRadius: 24,
            }}
          >
            <span style={{ fontSize: 14, color: '#D4856A', fontWeight: 500 }}>
              İlk analiz hediye!
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

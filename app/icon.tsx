import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #05050f 0%, #170d33 100%)',
          borderRadius: '25%',
          border: '2px solid rgba(139, 92, 246, 0.5)',
          color: '#a78bfa',
          fontWeight: 900,
          fontSize: 20,
          fontFamily: 'sans-serif',
          boxShadow: 'inset 0 0 10px rgba(139, 92, 246, 0.5)',
        }}
      >
        <span style={{ transform: 'translateY(-1px)' }}>V</span>
      </div>
    ),
    {
      ...size,
    }
  )
}

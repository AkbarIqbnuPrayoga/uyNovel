import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #101221 0%, #242447 50%, #6659F5 100%)',
          borderRadius: '120px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 160,
            fontWeight: 800,
            color: '#FFFFFF',
            fontFamily: 'sans-serif',
            letterSpacing: '-6px',
            textShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          UY
        </div>
        <div
          style={{
            width: '80px',
            height: '8px',
            borderRadius: '4px',
            background: '#C5BEFF',
            marginTop: '8px',
          }}
        />
      </div>
    ),
    { ...size }
  );
}

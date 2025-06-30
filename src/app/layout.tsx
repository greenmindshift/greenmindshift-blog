export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, sans-serif; }
          .min-h-screen { min-height: 100vh; }
          .bg-black { background-color: #000000; }
          .bg-white { background-color: #ffffff; }
          .p-8 { padding: 2rem; }
          .rounded-lg { border-radius: 0.5rem; }
          .overflow-hidden { overflow: hidden; }
          
          .bento-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, 200px);
            grid-template-rows: repeat(auto-fit, 200px);
            gap: 1rem;
            max-width: 1200px;
            margin: 0 auto;
            justify-content: center;
          }
          
          .bento-item {
            min-width: 200px;
            min-height: 200px;
          }
          
          .bento-small {
            width: 200px;
            height: 200px;
          }
          
          .bento-wide {
            width: 416px;
            height: 200px;
          }
          
          .bento-tall {
            width: 200px;
            height: 416px;
          }
          
          @media (max-width: 1280px) {
            .bento-grid {
              max-width: 1000px;
            }
          }
          
          @media (max-width: 1080px) {
            .bento-grid {
              max-width: 800px;
            }
          }
          
          @media (max-width: 880px) {
            .bento-grid {
              max-width: 600px;
            }
          }
          
          @media (max-width: 680px) {
            .bento-grid {
              max-width: 400px;
            }
          }
          
          @media (max-width: 480px) {
            .bento-grid {
              grid-template-columns: 200px;
              max-width: 200px;
            }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
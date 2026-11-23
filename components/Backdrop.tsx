/* Fixed full-viewport layers behind the sections. lib/scene.js drives them. */
export default function Backdrop() {
  return (
    <>
      <img className="wall" src="/assets/images/wall.jpg" alt="" aria-hidden="true" />
      <canvas id="orb" aria-hidden="true" />
      <div className="fog" />
      <div id="adam" className="adamfx"><div className="vp plate"><img src="/assets/images/adam_cut.webp" alt="The Creation of Adam, cropped to its figures" />
<svg viewBox="0 0 1800 824" aria-hidden="true">
<g fill="none" stroke="#0B0B0B" strokeWidth="1.2">
<circle cx="688" cy="380" r="250"/><circle cx="688" cy="380" r="330" strokeDasharray="2 7"/><circle cx="688" cy="380" r="410" opacity=".35"/>
<path d="M-260 380H1800M688 -90V910" strokeDasharray="14 5 2 5" opacity=".7"/>
<g strokeWidth="1"><path d="M688.0 130.0L688.0 116.0"/><path d="M709.8 131.0L710.3 125.0"/><path d="M731.4 133.8L732.5 127.9"/><path d="M752.7 138.5L754.3 132.7"/><path d="M773.5 145.1L775.6 139.4"/><path d="M793.7 153.4L796.2 148.0"/><path d="M813.0 163.5L820.0 151.4"/><path d="M831.4 175.2L834.8 170.3"/><path d="M848.7 188.5L852.6 183.9"/><path d="M864.8 203.2L869.0 199.0"/><path d="M879.5 219.3L884.1 215.4"/><path d="M892.8 236.6L897.7 233.2"/><path d="M904.5 255.0L916.6 248.0"/><path d="M914.6 274.3L920.0 271.8"/><path d="M922.9 294.5L928.6 292.4"/><path d="M929.5 315.3L935.3 313.7"/><path d="M934.2 336.6L940.1 335.5"/><path d="M937.0 358.2L943.0 357.7"/><path d="M938.0 380.0L952.0 380.0"/><path d="M937.0 401.8L943.0 402.3"/><path d="M934.2 423.4L940.1 424.5"/><path d="M929.5 444.7L935.3 446.3"/><path d="M922.9 465.5L928.6 467.6"/><path d="M914.6 485.7L920.0 488.2"/><path d="M904.5 505.0L916.6 512.0"/><path d="M892.8 523.4L897.7 526.8"/><path d="M879.5 540.7L884.1 544.6"/><path d="M864.8 556.8L869.0 561.0"/><path d="M848.7 571.5L852.6 576.1"/><path d="M831.4 584.8L834.8 589.7"/><path d="M813.0 596.5L820.0 608.6"/><path d="M793.7 606.6L796.2 612.0"/><path d="M773.5 614.9L775.6 620.6"/><path d="M752.7 621.5L754.3 627.3"/><path d="M731.4 626.2L732.5 632.1"/><path d="M709.8 629.0L710.3 635.0"/><path d="M688.0 630.0L688.0 644.0"/><path d="M666.2 629.0L665.7 635.0"/><path d="M644.6 626.2L643.5 632.1"/><path d="M623.3 621.5L621.7 627.3"/><path d="M602.5 614.9L600.4 620.6"/><path d="M582.3 606.6L579.8 612.0"/><path d="M563.0 596.5L556.0 608.6"/><path d="M544.6 584.8L541.2 589.7"/><path d="M527.3 571.5L523.4 576.1"/><path d="M511.2 556.8L507.0 561.0"/><path d="M496.5 540.7L491.9 544.6"/><path d="M483.2 523.4L478.3 526.8"/><path d="M471.5 505.0L459.4 512.0"/><path d="M461.4 485.7L456.0 488.2"/><path d="M453.1 465.5L447.4 467.6"/><path d="M446.5 444.7L440.7 446.3"/><path d="M441.8 423.4L435.9 424.5"/><path d="M439.0 401.8L433.0 402.3"/><path d="M438.0 380.0L424.0 380.0"/><path d="M439.0 358.2L433.0 357.7"/><path d="M441.8 336.6L435.9 335.5"/><path d="M446.5 315.3L440.7 313.7"/><path d="M453.1 294.5L447.4 292.4"/><path d="M461.4 274.3L456.0 271.8"/><path d="M471.5 255.0L459.4 248.0"/><path d="M483.2 236.6L478.3 233.2"/><path d="M496.5 219.3L491.9 215.4"/><path d="M511.2 203.2L507.0 199.0"/><path d="M527.3 188.5L523.4 183.9"/><path d="M544.6 175.2L541.2 170.3"/><path d="M563.0 163.5L556.0 151.4"/><path d="M582.3 153.4L579.8 148.0"/><path d="M602.5 145.1L600.4 139.4"/><path d="M623.3 138.5L621.7 132.7"/><path d="M644.6 133.8L643.5 127.9"/><path d="M666.2 131.0L665.7 125.0"/></g>
<path d="M660 440V484M717 440V484M660 470H717" strokeWidth="1.4"/>
<path d="M664 380L560 318M717 398L770 520" opacity=".8"/>
<path d="M10 70V10H70M1790 70V10H1730M10 754V814H70M1790 754V814H1730" strokeWidth="3"/>
<path d="M300 800H1500" strokeDasharray="3 9" opacity=".7"/>
<rect x="1480" y="690" width="26" height="26" strokeWidth="1.4"/><rect x="1514" y="724" width="26" height="26" strokeWidth="1.4"/><rect x="1548" y="758" width="26" height="26" strokeWidth="1.4"/>
</g>
<rect x="1180" y="-24" width="130" height="18" fill="#0B0B0B"/><path d="M1310 -15H1500" stroke="#0B0B0B" strokeWidth="1.4"/><circle cx="1500" cy="-15" r="5" fill="#0B0B0B"/>
<circle cx="560" cy="318" r="5" fill="#0B0B0B"/><circle cx="770" cy="520" r="5" fill="#0B0B0B"/>
<circle cx="688" cy="380" r="9" fill="#C4161C"/><circle cx="688" cy="380" r="20" fill="none" stroke="#C4161C" strokeWidth="1.2"/>
<g fontFamily="IBM Plex Mono,monospace" fontSize="24" letterSpacing="3" fill="#0B0B0B" stroke="#E8E5DE" strokeWidth="7" paintOrder="stroke" strokeLinejoin="round">
<text x="380" y="300">x · human</text><text x="790" y="560">ŷ · model</text>
<text x="688" y="522" textAnchor="middle" fill="#C4161C" fontSize="28">ε → 0</text>
<text transform="translate(1838 120) rotate(90)" fontSize="20" letterSpacing="9">PREDICTION ERROR → TOUCH</text></g>
</svg></div><div className="vp hands"><div className="hcrop"></div>
<svg viewBox="0 0 440 160" aria-hidden="true">
<g fill="none" stroke="#0B0B0B" strokeWidth="1.2">
<circle cx="268" cy="90" r="66"/><circle cx="268" cy="90" r="98" strokeDasharray="2 7"/><circle cx="268" cy="90" r="150" opacity=".4"/>
<path d="M-400 90H900M268 -260V420" strokeDasharray="14 5 2 5" opacity=".7"/>
<g strokeWidth="1"><path d="M268.0 24.0L268.0 18.5"/><path d="M273.8 24.3L274.0 21.8"/><path d="M279.5 25.0L279.9 22.5"/><path d="M285.1 26.2L285.7 23.8"/><path d="M290.6 28.0L291.4 25.6"/><path d="M295.9 30.2L296.9 27.9"/><path d="M301.0 32.8L303.8 28.1"/><path d="M305.9 35.9L307.3 33.9"/><path d="M310.4 39.4L312.0 37.5"/><path d="M314.7 43.3L316.4 41.6"/><path d="M318.6 47.6L320.5 46.0"/><path d="M322.1 52.1L324.1 50.7"/><path d="M325.2 57.0L329.9 54.2"/><path d="M327.8 62.1L330.1 61.1"/><path d="M330.0 67.4L332.4 66.6"/><path d="M331.8 72.9L334.2 72.3"/><path d="M333.0 78.5L335.5 78.1"/><path d="M333.7 84.2L336.2 84.0"/><path d="M334.0 90.0L339.5 90.0"/><path d="M333.7 95.8L336.2 96.0"/><path d="M333.0 101.5L335.5 101.9"/><path d="M331.8 107.1L334.2 107.7"/><path d="M330.0 112.6L332.4 113.4"/><path d="M327.8 117.9L330.1 118.9"/><path d="M325.2 123.0L329.9 125.7"/><path d="M322.1 127.9L324.1 129.3"/><path d="M318.6 132.4L320.5 134.0"/><path d="M314.7 136.7L316.4 138.4"/><path d="M310.4 140.6L312.0 142.5"/><path d="M305.9 144.1L307.3 146.1"/><path d="M301.0 147.2L303.8 151.9"/><path d="M295.9 149.8L296.9 152.1"/><path d="M290.6 152.0L291.4 154.4"/><path d="M285.1 153.8L285.7 156.2"/><path d="M279.5 155.0L279.9 157.5"/><path d="M273.8 155.7L274.0 158.2"/><path d="M268.0 156.0L268.0 161.5"/><path d="M262.2 155.7L262.0 158.2"/><path d="M256.5 155.0L256.1 157.5"/><path d="M250.9 153.8L250.3 156.2"/><path d="M245.4 152.0L244.6 154.4"/><path d="M240.1 149.8L239.1 152.1"/><path d="M235.0 147.2L232.2 151.9"/><path d="M230.1 144.1L228.7 146.1"/><path d="M225.6 140.6L224.0 142.5"/><path d="M221.3 136.7L219.6 138.4"/><path d="M217.4 132.4L215.5 134.0"/><path d="M213.9 127.9L211.9 129.3"/><path d="M210.8 123.0L206.1 125.8"/><path d="M208.2 117.9L205.9 118.9"/><path d="M206.0 112.6L203.6 113.4"/><path d="M204.2 107.1L201.8 107.7"/><path d="M203.0 101.5L200.5 101.9"/><path d="M202.3 95.8L199.8 96.0"/><path d="M202.0 90.0L196.5 90.0"/><path d="M202.3 84.2L199.8 84.0"/><path d="M203.0 78.5L200.5 78.1"/><path d="M204.2 72.9L201.8 72.3"/><path d="M206.0 67.4L203.6 66.6"/><path d="M208.2 62.1L205.9 61.1"/><path d="M210.8 57.0L206.1 54.2"/><path d="M213.9 52.1L211.9 50.7"/><path d="M217.4 47.6L215.5 46.0"/><path d="M221.3 43.3L219.6 41.6"/><path d="M225.6 39.4L224.0 37.5"/><path d="M230.1 35.9L228.7 33.9"/><path d="M235.0 32.8L232.2 28.1"/><path d="M240.1 30.2L239.1 27.9"/><path d="M245.4 28.0L244.6 25.6"/><path d="M250.9 26.2L250.3 23.8"/><path d="M256.5 25.0L256.1 22.5"/><path d="M262.2 24.3L262.0 21.8"/></g>
<path d="M240 128V142M297 128V142M240 135H297" strokeWidth="1.4"/>
<path d="M-24 12V-4H-8M-24 148V164H-8" strokeWidth="3"/>
<path d="M-300 160H-40" strokeDasharray="3 9" opacity=".7"/>
</g>
<rect x="380" y="-12" width="30" height="5" fill="#0B0B0B"/><path d="M410 -9.5H470" stroke="#0B0B0B" strokeWidth="1.4"/>
<circle cx="268" cy="90" r="2.6" fill="#C4161C"/><circle cx="268" cy="90" r="6" fill="none" stroke="#C4161C" strokeWidth="1.2"/>
<g fontFamily="IBM Plex Mono,monospace" fontSize="5" letterSpacing=".8" fill="#0B0B0B" stroke="#E8E5DE" strokeWidth="2.4" paintOrder="stroke" strokeLinejoin="round">
<text x="268" y="154" textAnchor="middle" fill="#C4161C" fontSize="6.5">ε → 0</text>
<text x="160" y="52">x · human</text><text x="304" y="124">ŷ · model</text>
<text transform="translate(-8 40) rotate(-90)" fontSize="4.2" letterSpacing="2.6">HUMAN</text>
<text transform="translate(448 20) rotate(90)" fontSize="4.2" letterSpacing="2.6">MODEL</text></g>
</svg></div></div>
      <canvas id="orb2" aria-hidden="true" />
      <div className="col-blk" aria-label="Mottos"><span>SEMPER · FIDELIS</span></div>
      <div className="ruler" aria-hidden="true"><i className="rfill" /><b className="rmark" /></div>
      <div id="lab"><b /><span /></div>
    </>
  );
}

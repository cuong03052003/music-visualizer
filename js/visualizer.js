// ========================================
// MUSIC FLOW - BEAUTIFUL VISUALIZER
// ========================================

const canvas = document.getElementById("visualizerCanvas");

if (!canvas) {
    console.error("Không tìm thấy visualizerCanvas");
} else {

    const ctx = canvas.getContext("2d");

    let width = 1000;
    let height = 450;

    let time = 0;


    // ========================================
    // RESIZE
    // ========================================

    function resizeCanvas() {

        const rect = canvas.getBoundingClientRect();

        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);

        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    window.addEventListener(
        "resize",
        resizeCanvas
    );

    resizeCanvas();


    // ========================================
    // DRAW
    // ========================================

    function draw() {

        time += 0.015;


        // ------------------------------------
        // BACKGROUND
        // ------------------------------------

        ctx.fillStyle = "#111111";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        const centerX = width / 2;
        const centerY = height / 2;


        // ------------------------------------
        // GLOW
        // ------------------------------------

        const glow = ctx.createRadialGradient(
            centerX,
            centerY,
            20,
            centerX,
            centerY,
            Math.min(width, height) * 0.35
        );

        glow.addColorStop(
            0,
            "rgba(255,255,255,0.10)"
        );

        glow.addColorStop(
            0.5,
            "rgba(255,255,255,0.035)"
        );

        glow.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        ctx.fillStyle = glow;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        // ------------------------------------
        // MAIN CIRCLE
        // ------------------------------------

        const baseRadius =
            Math.min(width, height) * 0.18;


        // nhịp thở nhẹ
        const pulse =
            Math.sin(time * 2.5) * 4;


        const radius =
            baseRadius + pulse;


        // ------------------------------------
        // OUTER RINGS
        // ------------------------------------

        for (let ring = 0; ring < 3; ring++) {

            const ringRadius =
                radius +
                12 +
                ring * 15 +
                Math.sin(
                    time * 2 +
                    ring
                ) * 3;


            ctx.beginPath();

            ctx.arc(
                centerX,
                centerY,
                ringRadius,
                0,
                Math.PI * 2
            );


            ctx.strokeStyle =
                `rgba(255,255,255,${0.10 - ring * 0.025})`;

            ctx.lineWidth = 1;

            ctx.stroke();
        }


        // ------------------------------------
        // AUDIO BARS GIẢ LẬP
        // ------------------------------------

        const bars = 120;


        for (let i = 0; i < bars; i++) {

            const angle =
                (Math.PI * 2 / bars) * i;


            const wave =
                Math.sin(
                    time * 4 +
                    i * 0.35
                );


            const wave2 =
                Math.sin(
                    time * 2 +
                    i * 0.12
                );


            const barLength =
                10 +
                Math.abs(wave) * 18 +
                Math.max(0, wave2) * 12;


            const innerRadius =
                radius + 25;


            const outerRadius =
                innerRadius + barLength;


            const x1 =
                centerX +
                Math.cos(angle) *
                innerRadius;


            const y1 =
                centerY +
                Math.sin(angle) *
                innerRadius;


            const x2 =
                centerX +
                Math.cos(angle) *
                outerRadius;


            const y2 =
                centerY +
                Math.sin(angle) *
                outerRadius;


            ctx.beginPath();

            ctx.moveTo(
                x1,
                y1
            );

            ctx.lineTo(
                x2,
                y2
            );


            ctx.strokeStyle =
                `rgba(255,255,255,${0.35 + Math.abs(wave) * 0.5})`;

            ctx.lineWidth = 2;

            ctx.lineCap = "round";

            ctx.stroke();
        }


        // ------------------------------------
        // MAIN CIRCLE GLOW
        // ------------------------------------

        ctx.shadowBlur = 25;

        ctx.shadowColor =
            "rgba(255,255,255,0.7)";


        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius,
            0,
            Math.PI * 2
        );


        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 4;

        ctx.stroke();


        ctx.shadowBlur = 0;


        // ------------------------------------
        // INNER CIRCLE
        // ------------------------------------

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius - 10,
            0,
            Math.PI * 2
        );


        ctx.strokeStyle =
            "rgba(255,255,255,0.18)";

        ctx.lineWidth = 1;

        ctx.stroke();


        // ------------------------------------
        // CENTER DOT
        // ------------------------------------

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            5,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.fill();


        // ------------------------------------
        // LOOP
        // ------------------------------------

        requestAnimationFrame(draw);
    }


    draw();
}
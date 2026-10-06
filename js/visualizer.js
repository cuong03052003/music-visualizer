// ========================================
// MUSIC FLOW - AUDIO VISUALIZER
// ========================================

const canvas = document.getElementById("visualizerCanvas");

if (!canvas) {
    console.error("Không tìm thấy visualizerCanvas");
} else {

    const ctx = canvas.getContext("2d");

    let width = 1000;
    let height = 450;

    let time = 0;

    // Dữ liệu âm thanh
    let analyser = null;
    let frequencyData = null;


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
    // LẤY AUDIO ANALYSER
    // ========================================

    function updateAnalyser() {

        if (
            window.musicAnalyser &&
            window.musicAnalyser !== analyser
        ) {

            analyser = window.musicAnalyser;

            analyser.fftSize = 256;

            analyser.smoothingTimeConstant = 0.82;

            frequencyData =
                new Uint8Array(
                    analyser.frequencyBinCount
                );

            console.log(
                "Visualizer đã kết nối với âm thanh."
            );
        }
    }


    // ========================================
    // DRAW
    // ========================================

    function draw() {

        requestAnimationFrame(draw);

        time += 0.015;

        updateAnalyser();


        // ====================================
        // LẤY DỮ LIỆU NHẠC
        // ====================================

        let bass = 0;
        let average = 0;

        if (analyser && frequencyData) {

            analyser.getByteFrequencyData(
                frequencyData
            );


            // Bass
            let bassTotal = 0;

            const bassCount =
                Math.floor(
                    frequencyData.length * 0.12
                );

            for (
                let i = 0;
                i < bassCount;
                i++
            ) {

                bassTotal +=
                    frequencyData[i];
            }

            bass =
                bassTotal /
                bassCount /
                255;


            // Tổng năng lượng
            let total = 0;

            for (
                let i = 0;
                i < frequencyData.length;
                i++
            ) {

                total +=
                    frequencyData[i];
            }

            average =
                total /
                frequencyData.length /
                255;
        }


        // ====================================
        // BACKGROUND
        // ====================================

        ctx.fillStyle = "#111111";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        const centerX =
            width / 2;

        const centerY =
            height / 2;


        // ====================================
        // GLOW
        // ====================================

        const glowSize =
            Math.min(width, height) *
            (
                0.30 +
                average * 0.12 +
                bass * 0.08
            );


        const glow =
            ctx.createRadialGradient(
                centerX,
                centerY,
                10,
                centerX,
                centerY,
                glowSize
            );


        glow.addColorStop(
            0,
            `rgba(255,255,255,${0.12 + bass * 0.18})`
        );

        glow.addColorStop(
            0.45,
            `rgba(255,255,255,${0.04 + average * 0.06})`
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


        // ====================================
        // MAIN CIRCLE
        // ====================================

        const baseRadius =
            Math.min(width, height) *
            0.18;


        const breathing =
            Math.sin(time * 2.5) * 3;


        const radius =
            baseRadius +
            breathing +
            bass * 35;


        // ====================================
        // OUTER WAVES
        // ====================================

        for (
            let ring = 0;
            ring < 3;
            ring++
        ) {

            const ringRadius =
                radius +
                12 +
                ring * 15 +
                bass * (18 - ring * 4) +
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
                `rgba(255,255,255,${
                    0.10 -
                    ring * 0.025 +
                    bass * 0.08
                })`;


            ctx.lineWidth = 1;

            ctx.stroke();
        }


        // ====================================
        // AUDIO BARS
        // ====================================

        const bars = 120;


        for (
            let i = 0;
            i < bars;
            i++
        ) {

            const angle =
                (Math.PI * 2 / bars) * i;


            let value = 0;


            if (
                analyser &&
                frequencyData
            ) {

                const index =
                    Math.floor(
                        (i / bars) *
                        frequencyData.length
                    );

                value =
                    frequencyData[index] /
                    255;
            }


            // Khi chưa phát nhạc
            // vẫn có chuyển động rất nhẹ
            const idleWave =
                Math.sin(
                    time * 3 +
                    i * 0.35
                ) * 0.08;


            const audioValue =
                Math.max(
                    0,
                    value + idleWave
                );


            const barLength =
                8 +
                audioValue * 65;


            const innerRadius =
                radius + 25;


            const outerRadius =
                innerRadius +
                barLength;


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
                `rgba(255,255,255,${
                    0.30 +
                    audioValue * 0.7
                })`;


            ctx.lineWidth = 2;

            ctx.lineCap = "round";

            ctx.stroke();
        }


        // ====================================
        // MAIN CIRCLE GLOW
        // ====================================

        ctx.shadowBlur =
            20 +
            bass * 30;

        ctx.shadowColor =
            "rgba(255,255,255,0.8)";


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

        ctx.lineWidth =
            4 +
            bass * 4;

        ctx.stroke();


        ctx.shadowBlur = 0;


        // ====================================
        // INNER CIRCLE
        // ====================================

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius - 10,
            0,
            Math.PI * 2
        );


        ctx.strokeStyle =
            `rgba(255,255,255,${
                0.15 +
                average * 0.3
            })`;


        ctx.lineWidth = 1;

        ctx.stroke();


        // ====================================
        // CENTER DOT
        // ====================================

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            5 +
            bass * 5,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.fill();
    }


    // ========================================
    // START
    // ========================================

    draw();
}
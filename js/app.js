// ===============================
// MUSIC FLOW - APP.JS
// ===============================

const loadButton = document.getElementById("loadButton");
const youtubeUrl = document.getElementById("youtubeUrl");

const musicTitle = document.getElementById("musicTitle");
const musicArtist = document.getElementById("musicArtist");

const audioFile = document.getElementById("audioFile");
const audioPlayer = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");

// ===============================
// AUDIO VISUALIZER
// ===============================

let audioContext = null;
let analyser = null;
let audioSource = null;

window.musicAnalyser = null;

function setupAudioVisualizer() {
    // Không tạo lại AudioContext nhiều lần
    if (audioContext) {
        return;
    }

    try {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

        analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        audioSource = audioContext.createMediaElementSource(audioPlayer);

        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);

        // Cho visualizer.js sử dụng
        window.musicAnalyser = analyser;

        console.log("Audio visualizer đã kết nối.");

    } catch (error) {
        console.error("Không thể tạo Audio Visualizer:", error);
    }
}

// ===============================
// WAKE LOCK
// ===============================

let wakeLock = null;

async function requestWakeLock() {
    try {
        if ("wakeLock" in navigator) {
            wakeLock = await navigator.wakeLock.request("screen");

            console.log("Wake Lock đang hoạt động.");
        }
    } catch (error) {
        console.log("Wake Lock không khả dụng:", error);
    }
}

async function releaseWakeLock() {
    if (wakeLock) {
        try {
            await wakeLock.release();
        } catch (error) {
            console.log(error);
        }

        wakeLock = null;
    }
}

// ===============================
// CHỌN FILE NHẠC
// ===============================

if (audioFile) {

    audioFile.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        // Tạo URL cho file nhạc trên thiết bị hiện tại
        const fileURL = URL.createObjectURL(file);

        audioPlayer.src = fileURL;

        // Hiển thị tên file
        if (musicTitle) {
            musicTitle.textContent = file.name;
        }

        if (musicArtist) {
            musicArtist.textContent = "Local Music";
        }

        if (playButton) {
            playButton.textContent = "▶";
        }

        console.log("Đã tải:", file.name);
    });
}

// ===============================
// NÚT PLAY / PAUSE
// ===============================

if (playButton) {

    playButton.addEventListener("click", async function () {

        if (!audioPlayer.src) {
            alert("Hãy chọn một file nhạc trước.");
            return;
        }

        try {

            // Tạo AudioContext sau thao tác của người dùng
            setupAudioVisualizer();

            // Một số trình duyệt yêu cầu resume AudioContext
            if (
                audioContext &&
                audioContext.state === "suspended"
            ) {
                await audioContext.resume();
            }

            if (audioPlayer.paused) {

                await audioPlayer.play();

                playButton.textContent = "❚❚";

                await requestWakeLock();

            } else {

                audioPlayer.pause();

                playButton.textContent = "▶";

                await releaseWakeLock();
            }

        } catch (error) {

            console.error("Lỗi phát nhạc:", error);

            alert(
                "Không thể phát nhạc. Hãy thử chọn lại file."
            );
        }
    });
}

// ===============================
// KHI NHẠC KẾT THÚC
// ===============================

audioPlayer.addEventListener("ended", async function () {

    if (playButton) {
        playButton.textContent = "▶";
    }

    await releaseWakeLock();
});

// ===============================
// KHI QUAY LẠI TRANG
// ===============================

document.addEventListener(
    "visibilitychange",
    async function () {

        if (
            document.visibilityState === "visible" &&
            !audioPlayer.paused
        ) {

            if (
                audioContext &&
                audioContext.state === "suspended"
            ) {
                try {
                    await audioContext.resume();
                } catch (error) {
                    console.log(error);
                }
            }

            await requestWakeLock();
        }
    }
);

// ===============================
// YOUTUBE
// ===============================

if (loadButton) {

    loadButton.addEventListener("click", function () {

        const url = youtubeUrl.value.trim();

        if (!url) {
            alert("Hãy dán link YouTube.");
            return;
        }

        console.log("YouTube URL:", url);

        if (musicTitle) {
            musicTitle.textContent = "YouTube Music";
        }

        if (musicArtist) {
            musicArtist.textContent = url;
        }

        alert(
            "Phần phát nhạc YouTube trực tiếp sẽ được xử lý riêng. Hiện tại hãy thử bằng file nhạc trước."
        );
    });
}
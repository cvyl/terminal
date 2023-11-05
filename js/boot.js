$(document).ready(function() {
    $(".command").hide();
    // Boot-up sequence
    const bootUpSequence = [
        "WINDOSE BIOS @ " + new Date().toLocaleString() + "<br><br><br>Booting up the system...",
        "Initializing hardware...",
        "Checking memory...",
        "Checking disks...",
        "Mounting file systems...",
        "Loading drivers...",
        "Starting services...",
        "Booting complete."
    ];

    // Display boot-up sequence
    function displayBootUpSequence(index) {
        if (index < bootUpSequence.length - 1) {
            let outputText = "<div class='output'>" + bootUpSequence[index] + "<span class='loading'>/-</span></div>";
            let outputElement = $(outputText).appendTo(".terminal");
            animateLoading(outputElement.find(".loading"));
            setTimeout(function() {
                displayBootUpSequence(index + 1);
            }, 2000);
        } else {
            // Handle click outside of prompt box
            $(".terminal").click(function() {
                $(".command").focus();
            });
            $(".command").show();
            const script = document.createElement('script');
            script.src = './js/script.js';
            document.head.appendChild(script);
            // Remove boot-up sequence
            $(".output").remove();
        }
    }
    // Animate loading element
    function animateLoading(element) {
        let animationIndex = 0;
        let animationFrames = ["/", "-", "\\", "|"];
        let intervalId = setInterval(function() {
            element.text(animationFrames[animationIndex]);
            animationIndex = (animationIndex + 1) % animationFrames.length;
        }, 100);
        setTimeout(function() {
            clearInterval(intervalId);
            element.text("OK");
        }, 2000);
    }

    displayBootUpSequence(0);


    // Hide mouse cursor
    $(".terminal").css("cursor", "none");
    $(".terminal").css("overflow", "hidden");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";


});

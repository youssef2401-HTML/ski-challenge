const skiChallenges = [
  "Hockey Stop",
  "Parallel Turns",
  "Carve Left → Right",
  "Carve Right → Left",
  "Switch Skiing",
  "Ollie",
  "Nollie",
  "Nose Press",
  "Tail Press",
  "One-Ski Glide",
  "Side Slip",
  "Small Kicker — Straight Air",
  "Small Kicker — Straight Air + Grab",
  "Small Kicker — Switch Landing",
  "Small Kicker — Ollie",
  "Small Kicker — Style Grab",
  "Box — 50/50",
  "Box — Boardslide",
  "Box — Nose Press",
  "Box — Tail Press",
  "Box — Switch 50/50",
  "Big Kicker — Straight Air",
  "Big Kicker — Straight Air + Grab",
  "Big Kicker — Basic Jump",
  "Big Kicker — Clean Landing",
  "Pizza Stop",
];

// Reserved for the future snowboard spinner.
const snowboardChallenges = [
  "Falling Leaf",
  "J-Turn",
  "Linked Turns",
  "Switch Riding",
  "Ollie",
  "Nollie",
  "Nose Press",
  "Tail Press",
  "Butter",
  "Nose Butter",
  "Tail Butter",
  "Ollie Over a Small Marker",

  "Small Kicker — Straight Air",
  "Small Kicker — Straight Air + Grab",
  "Small Kicker — Ollie Off",
  "Small Kicker — Tail Grab",
  "Small Kicker — Indy Grab",
  "Small Kicker — Nose Grab",
  "Small Kicker — Method-Style Grab",

  "Box — 50/50",
  "Box — Boardslide",
  "Box — Nose Press",
  "Box — Tail Press",
  "Box — Switch 50/50",

  "Big Kicker — Straight Air",
  "Big Kicker — Straight Air + Grab",
  "Big Kicker — Basic Jump",
  "Big Kicker — Clean Landing"
];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const snowboardCanvas = document.getElementById("snowboardWheel");
const snowboardCtx = snowboardCanvas ? snowboardCanvas.getContext("2d") : null;
const challengeText = document.getElementById("challengeText");
const result = document.getElementById("result");
const spinButton = document.getElementById("spinButton");
const decisionButtons = document.getElementById("decisionButtons");

let rotation = 0;
let spinning = false;

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const center = canvas.width / 2;
  const distance = Math.hypot(x - center, y - center);

  if (distance <= 62 && !spinning) {
    spinWheel();
  }
});

function drawWheel() {
  const size = canvas.width;
  const center = size / 2;
  const radius = size / 2 - 8;
  const count = skiChallenges.length;
  const slice = (Math.PI * 2) / count;

  ctx.clearRect(0, 0, size, size);

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  for (let i = 0; i < count; i++) {
    const start = i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? "#0b5cff" : "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#07111f";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#07111f";
    ctx.font = `900 ${Math.max(10, Math.min(17, 410 / count))}px Arial`;

    let label = skiChallenges[i];
    const maxChars = 22;
    if (label.length > maxChars) {
      const parts = label.split(" — ");
      if (parts.length > 1) {
        label = parts[0] + "\n" + parts.slice(1).join(" — ");
      }
    }

    const lines = label.split("\n");
    const lineHeight = 17;
    lines.forEach((line, index) => {
      ctx.fillText(line, radius - 20, (index - (lines.length - 1) / 2) * lineHeight);
    });

    ctx.restore();
  }

  ctx.restore();

  ctx.beginPath();
  ctx.arc(center, center, 62, 0, Math.PI * 2);
  ctx.fillStyle = "#07111f";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SKI", center, center);
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 5);
}

function spinWheel() {
  if (spinning) return;

  spinning = true;
  decisionButtons.classList.remove("show");
  document.getElementById("skiFailedOptions").classList.remove("show");
  challengeText.textContent = "SPINNING...";

  const count = skiChallenges.length;
  const slice = (Math.PI * 2) / count;
  const chosen = Math.floor(Math.random() * count);

  const targetCenter = chosen * slice + slice / 2;
  const pointerAngle = -Math.PI / 2;
  const twoPi = Math.PI * 2;
  const desiredRotation = pointerAngle - targetCenter;
  const extraTurns = 7 + Math.floor(Math.random() * 3);

  let finalRotation = desiredRotation + extraTurns * twoPi;
  const currentOffset = ((rotation - desiredRotation) % twoPi + twoPi) % twoPi;
  finalRotation += Math.floor((rotation - finalRotation) / twoPi + 1) * twoPi;

  const startRotation = rotation;
  const change = finalRotation - startRotation;
  const duration = 3000 + Math.random() * 500;
  const startTime = performance.now();

  function animate(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    rotation = startRotation + change * easeOut(progress);
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      rotation = finalRotation;
      drawWheel();
      challengeText.textContent = skiChallenges[chosen];
      result.animate(
        [
          { transform: "scale(.94)", opacity: .4 },
          { transform: "scale(1.04)", opacity: 1 },
          { transform: "scale(1)", opacity: 1 }
        ],
        { duration: 450, easing: "ease-out" }
      );
      spinning = false;
      decisionButtons.classList.add("show");
    }
  }

  requestAnimationFrame(animate);
}

function openSki() {
  showScreen("ski");
  challengeText.textContent = "SPIN THE WHEEL";
  decisionButtons.classList.remove("show");
  document.getElementById("skiFailedOptions").classList.remove("show");
}

function openSnowboard() {
  showScreen("snowboard");
}

function finishChallenge() {
  goHome();
}

function showFailedOptions(type) {
  if (type === "ski") {
    document.getElementById("decisionButtons").classList.remove("show");
    document.getElementById("skiFailedOptions").classList.add("show");
  } else {
    document.getElementById("snowboardDecisionButtons").classList.remove("show");
    document.getElementById("snowboardFailedOptions").classList.add("show");
  }
}

function retryChallenge(type) {
  if (type === "ski") {
    document.getElementById("skiFailedOptions").classList.remove("show");
    spinWheel();
  } else {
    document.getElementById("snowboardFailedOptions").classList.remove("show");
    spinSnowboardWheel();
  }
}

function goHome() {
  showScreen("home");
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

drawWheel();


let snowboardRotation = 0;
let snowboardSpinning = false;

function drawSnowboardWheel() {
  if (!snowboardCanvas) return;
  const size = snowboardCanvas.width;
  const center = size / 2;
  const radius = size / 2 - 8;
  const count = snowboardChallenges.length;
  const slice = (Math.PI * 2) / count;

  snowboardCtx.clearRect(0, 0, size, size);
  snowboardCtx.save();
  snowboardCtx.translate(center, center);
  snowboardCtx.rotate(snowboardRotation);

  for (let i = 0; i < count; i++) {
    const start = i * slice;
    const end = start + slice;

    snowboardCtx.beginPath();
    snowboardCtx.moveTo(0, 0);
    snowboardCtx.arc(0, 0, radius, start, end);
    snowboardCtx.closePath();
    snowboardCtx.fillStyle = i % 2 === 0 ? "#172033" : "#ffffff";
    snowboardCtx.fill();
    snowboardCtx.strokeStyle = "#07111f";
    snowboardCtx.lineWidth = 2;
    snowboardCtx.stroke();

    snowboardCtx.save();
    snowboardCtx.rotate(start + slice / 2);
    snowboardCtx.textAlign = "right";
    snowboardCtx.textBaseline = "middle";
    snowboardCtx.fillStyle = i % 2 === 0 ? "#ffffff" : "#07111f";
    snowboardCtx.font = `900 ${Math.max(10, Math.min(17, 410 / count))}px Arial`;

    let label = snowboardChallenges[i];
    if (label.length > 22) {
      const parts = label.split(" — ");
      if (parts.length > 1) label = parts[0] + "\n" + parts.slice(1).join(" — ");
    }

    const lines = label.split("\n");
    lines.forEach((line, index) => {
      snowboardCtx.fillText(
        line,
        radius - 20,
        (index - (lines.length - 1) / 2) * 17
      );
    });
    snowboardCtx.restore();
  }

  snowboardCtx.restore();

  snowboardCtx.beginPath();
  snowboardCtx.arc(center, center, 62, 0, Math.PI * 2);
  snowboardCtx.fillStyle = "#07111f";
  snowboardCtx.fill();
  snowboardCtx.fillStyle = "#ffffff";
  snowboardCtx.font = "900 18px Arial";
  snowboardCtx.textAlign = "center";
  snowboardCtx.textBaseline = "middle";
  snowboardCtx.fillText("SNOW", center, center - 10);
  snowboardCtx.fillText("BOARD", center, center + 12);
}

function spinSnowboardWheel() {
  if (snowboardSpinning || snowboardChallenges.length === 0) return;

  snowboardSpinning = true;
  document.getElementById("snowboardDecisionButtons").classList.remove("show");
  document.getElementById("snowboardFailedOptions").classList.remove("show");
  document.getElementById("snowboardChallengeText").textContent = "SPINNING...";

  const count = snowboardChallenges.length;
  const slice = (Math.PI * 2) / count;
  const chosen = Math.floor(Math.random() * count);
  const targetCenter = chosen * slice + slice / 2;
  const twoPi = Math.PI * 2;
  const desiredRotation = -targetCenter;
  const startRotation = snowboardRotation;
  const extraTurns = 7 + Math.floor(Math.random() * 3);

  let finalRotation = desiredRotation + extraTurns * twoPi;
  finalRotation += Math.floor((startRotation - finalRotation) / twoPi + 1) * twoPi;

  const change = finalRotation - startRotation;
  const duration = 3000 + Math.random() * 500;
  const startTime = performance.now();

  function animate(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    snowboardRotation = startRotation + change * easeOut(progress);
    drawSnowboardWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      snowboardRotation = finalRotation;
      drawSnowboardWheel();
      document.getElementById("snowboardChallengeText").textContent = snowboardChallenges[chosen];
      document.getElementById("snowboardDecisionButtons").classList.add("show");
      snowboardSpinning = false;
    }
  }
  requestAnimationFrame(animate);
}

if (snowboardCanvas) {
  snowboardCanvas.addEventListener("click", (event) => {
    const rect = snowboardCanvas.getBoundingClientRect();
    const scaleX = snowboardCanvas.width / rect.width;
    const scaleY = snowboardCanvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const center = snowboardCanvas.width / 2;
    if (Math.hypot(x - center, y - center) <= 62 && !snowboardSpinning) {
      spinSnowboardWheel();
    }
  });
}

drawSnowboardWheel();

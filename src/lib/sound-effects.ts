// -----------------------------------------------------------------------------
// Audio feature removed per configuration
// -----------------------------------------------------------------------------

export function playTactileClick() {
  // Silent no-op
}

export function playChimeSuccess() {
  // Silent no-op
}

export const ambientSoundscape = {
  startRain() {},
  stop() {},
  setVolume(_vol: number) {},
  isActive() {
    return false;
  },
};

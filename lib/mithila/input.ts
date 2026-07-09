/** Mutable stick/jump input — written by VirtualStick, read in the R3F game loop. */
export const mithilaInput = {
  /** -1..1 left/right */
  x: 0,
  /** -1..1 forward/back (screen-relative; World maps to camera) */
  y: 0,
  jumpPressed: false,
  /** player world XZ — written by World Controller each frame */
  playerX: 0,
  playerZ: 0,
};

export function consumeJump(): boolean {
  if (!mithilaInput.jumpPressed) return false;
  mithilaInput.jumpPressed = false;
  return true;
}

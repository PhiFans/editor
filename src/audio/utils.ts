
/**
 * Resume an AudioContext.
 * @link https://github.com/bemusic/bemuse/blob/master/bemuse/src/sampling-master/index.js#L276
 * @param audioCtx
 * @returns {Promise<boolean>} Return false if resume failed
 */
export const resumeAudioCtx = (audioCtx: AudioContext): Promise<boolean> => {
  if (audioCtx.state === 'running') return new Promise((res) => res(true));

  console.info('[Audio]', 'Try resuming audio...');

  const gain = audioCtx.createGain();
  const osc = audioCtx.createOscillator();

  osc.frequency.value = 440;

  osc.start(audioCtx.currentTime + 0.1);
  osc.stop(audioCtx.currentTime + 0.1);

  gain.connect(audioCtx.destination);
  gain.disconnect();

  return new Promise((res) => {
    audioCtx.resume()
      .then(() => res(true))
      .catch((e) => {
        res(false);
        console.error('[Audio]', 'Failed to resume audio');
        console.error(e);
      });
  });
};

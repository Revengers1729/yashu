// Romantic Ambient Audio Synthesizer using Web Audio API
class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: any = null;
  private gainNode: GainNode | null = null;
  private step: number = 0;

  // Romantic acoustic chord progression (Cmaj7 -> Am7 -> Fmaj7 -> Gsus4)
  private melodyNotes: number[][] = [
    [261.63, 329.63, 392.00, 493.88], // C, E, G, B
    [220.00, 261.63, 329.63, 392.00], // A, C, E, G
    [174.61, 220.00, 261.63, 329.63], // F, A, C, E
    [196.00, 246.94, 293.66, 392.00], // G, B, D, G
  ];

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.init();
    if (this.isPlaying || !this.ctx || !this.gainNode) return;
    this.isPlaying = true;
    this.scheduleNextNote();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public setVolume(val: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, val * 0.2)), this.ctx.currentTime);
    }
  }

  public playSparkle() {
    this.init();
    if (!this.ctx || !this.gainNode) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        noteGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        osc.connect(noteGain);
        noteGain.connect(this.gainNode);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.65);
      }, i * 90);
    });
  }

  private scheduleNextNote() {
    if (!this.isPlaying || !this.ctx || !this.gainNode) return;

    const chordIndex = Math.floor(this.step / 4) % this.melodyNotes.length;
    const noteIndex = this.step % 4;
    const chord = this.melodyNotes[chordIndex];
    const freq = chord[noteIndex];

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'triangle'; // Warm romantic rhodes/piano tone
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Soft gentle attack and long decay
    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.08, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + 1.5);

    this.step++;

    // Randomize slightly for human organic romantic touch
    const delay = 480 + (this.step % 2 === 0 ? 80 : 0);
    this.timerId = setTimeout(() => {
      this.scheduleNextNote();
    }, delay);
  }
}

export const romanticAudio = new RomanticAudioEngine();

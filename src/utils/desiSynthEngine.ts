// Desi Folk & Heavy Bass Audio Synthesizer Engine
// Provides 100% reliable offline/in-browser musical playback using Web Audio API

class DesiSynthEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private timerId: any = null;
  private step: number = 0;
  private volume: number = 0.8;
  private masterGain: GainNode | null = null;
  private onBeatCallback: ((step: number) => void) | null = null;

  // Scale frequencies for catchy Desi & Haryanvi folk hooks (D Minor / Bhairavi flavor)
  private readonly notes = [
    293.66, // D4 (Sa)
    329.63, // E4 (Re)
    349.23, // F4 (Ga komal)
    392.00, // G4 (Ma)
    440.00, // A4 (Pa)
    466.16, // Bb4 (Dha komal)
    523.25, // C5 (Ni)
    587.33  // D5 (High Sa)
  ];

  // 16-step melody pattern (Tumbi & Harmonium style riff)
  private readonly melodyPattern = [
    0, 2, 4, 7,  4, 2, 0, 4,
    5, 4, 2, 4,  2, 0, 7, 0
  ];

  // 16-step Dholak / Bass pattern
  // 1 = heavy 808 bass, 2 = treble slap, 3 = dholak roll, 0 = rest
  private readonly rhythmPattern = [
    1, 0, 2, 0,  1, 3, 2, 0,
    1, 0, 2, 3,  1, 1, 2, 3
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setOnBeat(cb: (step: number) => void) {
    this.onBeatCallback = cb;
  }

  // 1. Heavy 808 Sub-bass kick (Dha)
  private playDholakBass(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Pitch drop for heavy acoustic punch
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.18);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.36);
  }

  // 2. High Dholak / Tabla Treble Slap (Ta/Tin)
  private playTrebleSlap(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, time);
    osc.frequency.exponentialRampToValueAtTime(140, time + 0.08);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.11);
  }

  // 3. Khartal / Manjira / Hi-hat metallic sizzle
  private playCymbal(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, time);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  // 4. Tumbi / Desi Folk Riff pluck
  private playTumbiPluck(noteIndex: number, time: number) {
    if (!this.ctx || !this.masterGain) return;
    const freq = this.notes[noteIndex % this.notes.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sawtooth has that sharp acoustic string vibration of a tumbi/sarangi
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.005, time + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.23);
  }

  private tick = () => {
    if (!this.isRunning || !this.ctx) return;

    const now = this.ctx.currentTime;
    const currentStep = this.step % 16;

    // Rhythm track
    const hit = this.rhythmPattern[currentStep];
    if (hit === 1) {
      this.playDholakBass(now);
      this.playCymbal(now);
    } else if (hit === 2) {
      this.playTrebleSlap(now);
      this.playCymbal(now);
    } else if (hit === 3) {
      this.playTrebleSlap(now);
    } else {
      if (currentStep % 2 === 0) {
        this.playCymbal(now);
      }
    }

    // Melodic Tumbi hook
    const noteIdx = this.melodyPattern[currentStep];
    if (noteIdx !== undefined) {
      this.playTumbiPluck(noteIdx, now);
    }

    if (this.onBeatCallback) {
      this.onBeatCallback(currentStep);
    }

    this.step++;
  };

  public start(tempoBpm: number = 132) {
    this.initContext();
    if (this.isRunning) return;

    this.isRunning = true;
    this.step = 0;
    // 16th notes: interval = (60 / tempoBpm) / 4 seconds = (15000 / tempoBpm) ms
    const intervalMs = Math.round(15000 / tempoBpm);
    this.timerId = setInterval(this.tick, intervalMs);
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.step = 0;
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }
}

export const desiSynth = new DesiSynthEngine();

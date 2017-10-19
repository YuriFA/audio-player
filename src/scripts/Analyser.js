export default class Analyser {
  constructor(context, fftSize = 2048) {
    this.analyser = null;
    this.fFrequencyData = null;
    this.bFrequencyData = null;
    this.bTimeData = null;
    this.fftSize = fftSize;
    this._context = context;
    this._create();
    this.updateData();
  }

  _create() {
    this.analyser = this._context.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.fFrequencyData = new Float32Array(this.analyser.frequencyBinCount);
    this.bFrequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.bTimeData = new Uint8Array(this.analyser.frequencyBinCount);

    return this;
  }

  updateData() {
    this.analyser.getFloatFrequencyData(this.fFrequencyData);
    this.analyser.getByteFrequencyData(this.bFrequencyData);
    this.analyser.getByteTimeDomainData(this.bTimeData);

    return this;
  }

}

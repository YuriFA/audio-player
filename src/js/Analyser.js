export default class Analyser {
  constructor(context) {
    this.analyser = null;
    this.fFrequencyData = null;
    this.bFrequencyData = null;
    this.bTimeData = null;

    this._context = context;
    this._create();
    this.updateData();
  }

  _create() {
    this.analyser = this._context.createAnalyser();
    // Размерность преобразования Фурье
    // Если не понимаете, что это такое - ставьте 512, 1024 или 2048 ;)
    this.analyser.fftSize = 2048;
    // Создаем массивы для хранения данных
    this.fFrequencyData = new Float32Array(this.analyser.frequencyBinCount);
    this.bFrequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.bTimeData = new Uint8Array(this.analyser.frequencyBinCount);

    return this;
  }

  updateData() {
    this.analyser.getFloatFrequencyData(this.fFrequencyData);
    this.analyser.getByteFrequencyData(this.bFrequencyData);
    this.analyser.getByteTimeDomainData(this.bTimeData);
    console.log(this.fFrequencyData);
    console.log(this.bFrequencyData);
    console.log(this.bTimeData);

    return this;
  }

}

var canvas = document.getElementById('random-process');
var ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, canvas.width, canvas.height);

function gauss(mean, standard_deviation) {
  var u = 0, v = 0, s = 0;
  do {
    var u = Math.random() * 2 - 1;
    var v = Math.random() * 2 - 1;
    s = u * u + v * v;
  } while (s <= 0 || 1 <= s);
  return mean + standard_deviation * u * Math.sqrt(-2 * Math.log(s) / s);
};

var GaussianChainRandomProcess = function(mean, standard_deviation) {
  this.mean = mean;
  this.standard_deviation = standard_deviation;

  this.value = {};
};

GaussianChainRandomProcess.prototype.get = function(t) {
  var lower = Math.floor(t);
  var upper = lower + 1;
  if (this.value[lower] === undefined) {
    this.value[lower] = gauss(this.mean, this.standard_deviation);
  }
  if (this.value[upper] === undefined) {
    this.value[upper] = gauss(this.mean, this.standard_deviation);
  }
  var rest = upper - t;
  return this.value[lower] * rest + this.value[upper] * (1 - rest);
}

var HarmonicRandomProcess = function(amplitudes) {
  this.processes = [];
  for (var i = 0; i < amplitudes.length; ++i) {
    this.processes.push(new GaussianChainRandomProcess(0, amplitudes[i]));
  }
};

HarmonicRandomProcess.prototype.get = function(t) {
  var value = 0;
  for (var i = 0; i < this.processes.length; ++i) {
    value += this.processes[i].get(t * (i + 1));
  }
  return value;
};

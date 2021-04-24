window.onload = function() {
 let countEl = document.getElementById('count');
 let boxHeaderRow = document.getElementById('box-header-row');
 let boxContainerRow = document.getElementById('box-container-row');
 let infoboxRow = document.getElementById('infobox-row');
 let theoreticalBiasRow = document.getElementById('theoretical-bias-row');

 let boxes = [];
 [2,3,4,5,6,7,8,9,10,30,100].forEach(function(x) {
   boxes.push(new Box(x));
 });

 
 for (let i = 0; i < boxes.length; i++) {
  let td_0 = document.createElement('td');
  td_0.innerHTML = '<div> n = ' + boxes[i].sampleSize + '</div>';
  boxHeaderRow.appendChild(td_0); 
   
  let td_1 = document.createElement('td');
  td_1.appendChild(boxes[i].el1);
  td_1.appendChild(boxes[i].el2);
  boxContainerRow.appendChild(td_1);
  
  let td_2 = document.createElement('td');
  td_2.appendChild(boxes[i].infobox);
  td_2.appendChild(boxes[i].infobox2);
  infoboxRow.appendChild(td_2);
  
  let td_4 = document.createElement('td');
  td_4.innerHTML = '<div>' + Math.floor(((boxes[i].sampleSize-1) / boxes[i].sampleSize)*1000)/1000 + '</div>';
  theoreticalBiasRow.appendChild(td_4);
 }
 
 let count = 0;
 let x = setInterval(function() {
  count++;
  countEl.innerHTML = count;
  for (let i = 0; i < boxes.length; i++) {
   let b = boxes[i];
   b.drawSample();
   b.increaseNumberOfSamples();
   b.calculateSampleMean();
   b.calculateSampleVariance();
   b.calculateSumOfSampleVariances();
   b.calculateAverageVariance();
   b.displayAverageVariance();
  }
  if (count >= 10000) {
   clearInterval(x);
  }
 }, 50);

}


function rnorm() {
 var u = 0, v = 0;
 while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
 while(v === 0) v = Math.random();
 return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function Box(sampleSize) {
 this.sampleSize = sampleSize;
 this.bias = (this.sampleSize-1)/this.sampleSize;
 this.numberOfSamples = 0;
 this.sampleMean = 0;
 this.sampleVariance = 0;
 this.sumOfSampleVariances = 0;
 this.averageVariance = 0;
 this.averageVarianceUnbiased = 0;
 this.el1 = document.createElement('div');
 this.el1.id = 'box_' + this.sampleSize + '_biased';
 this.el1.style.display = 'inline-block';
 this.el1.classList.add('box');
 this.el1.classList.add('biased');
 this.el2 = document.createElement('div');
 this.el2.id = 'box_' + this.sampleSize;
 this.el2.style.display = 'inline-block';
 this.el2.classList.add('box');
 this.el2.classList.add('unbiased');
 this.infobox = document.createElement('div');
 this.infobox.id = 'infobox_' + this.sampleSize;
 this.infobox2 = document.createElement('div');
 this.drawSample = function() {
  this.sample = [];
  for (let i = 0; i < this.sampleSize; i++) {
   this.sample.push(rnorm());   
  }
 };
 this.increaseNumberOfSamples = function() {
  this.numberOfSamples++;
 }
 this.calculateSampleMean = function() {
  this.sampleMean = 0;
  for (let i = 0; i < this.sample.length; i++) {
   this.sampleMean += this.sample[i]/this.sampleSize;   
  }
 };
 this.calculateSampleVariance = function() {
  this.sampleVariance = 0;
  for (let i = 0; i < this.sample.length; i++) {
   this.sampleVariance += ((this.sample[i]-this.sampleMean)**2)/this.sampleSize;   
  }
 };
 this.calculateSumOfSampleVariances = function() {
  this.sumOfSampleVariances += this.sampleVariance;
 };
 this.calculateAverageVariance = function() {
  this.averageVariance = this.sumOfSampleVariances / this.numberOfSamples;
  this.averageVarianceUnbiased = (1/this.bias)*this.sumOfSampleVariances / this.numberOfSamples;
 };
 this.displayAverageVariance = function() {
  let maxHeight = 22;
  let maxPct = 0.85;
  
  let h1 = maxPct*this.averageVariance * maxHeight;
  let h2 = maxPct*(1/this.bias)*(this.averageVariance * maxHeight);
  
  if (h1 > maxHeight) {
    h1 = maxHeight;
  }
  if (h2 > maxHeight) {
    h2 = maxHeight;
  }
  this.el1.style.height = h1 + 'vh';
  this.el2.style.height = h2 + 'vh';

  this.infobox.innerHTML = Math.floor(this.averageVariance*1000)/1000;
  this.infobox2.innerHTML = Math.floor(this.averageVarianceUnbiased*1000)/1000;
 };
}



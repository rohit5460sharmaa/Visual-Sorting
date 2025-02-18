const n=40;
const array=[];

let audioCtx=null;

init();

function init(){
    for(let i=0;i<n;i++){
        array[i]=(Math.random());
    }
    showBars();
}


/* *************************************** Bubble Sort ******************************      */ 

function BS(){
    const swaps=bubbleSort([...array]);
    animate(swaps);
}

function bubbleSort(array){
    const swaps=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
            if(array[i-1]>array[i]){
                swaps.push([i-1,i]);
                swapped=true;
                [array[i-1],array[i]]=[array[i],array[i-1]];
            }
        }
    }while(swapped);
    return swaps;
}




/* *************************************** Insertion Sort ******************************      */ 


function IS(){
    const swaps=insertionSort([...array]);
    animate(swaps);
}

function insertionSort(array) {
    const swaps = [];
    for (let i = 1; i < array.length; i++) {
        let current = array[i];
        let j = i - 1;
        // Shift elements of the sorted segment to the right to make space for the current element
        while (j >= 0 && array[j] > current) {
            swaps.push([j, j + 1]);
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = current;
    }
    return swaps;
}




/* *************************************** Quick Sort ******************************      */ 


function QS(){
    const swaps=quickSort([...array]);
    animate(swaps);
}

function quickSort(array) {
    const swaps = [];
    quickSortHelper(array, 0, array.length - 1, swaps);
    return swaps;
}

function quickSortHelper(array, low, high, swaps) {
    if (low < high) {
        const pivotIndex = partition(array, low, high, swaps);
        quickSortHelper(array, low, pivotIndex - 1, swaps);
        quickSortHelper(array, pivotIndex + 1, high, swaps);
    }
}

function partition(array, low, high, swaps) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            if (i !== j) {
                swaps.push([i, j]);
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    }

    if (i + 1 !== high) {
        swaps.push([i + 1, high]);
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
    }

    return i + 1;
}



/* *************************************** Selection Sort ******************************      */ 

function SS(){
    const swaps=selectionSort([...array]);
    animate(swaps);
}

function selectionSort(array) {
    const swaps = [];
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swaps.push([i, minIndex]);
            [array[i], array[minIndex]] = [array[minIndex], array[i]]; // Swap the elements
        }
    }
    return swaps;
}





/* *************************************** Merge Sort ******************************      */ 

function MS() {
    const swaps = mergeSort([...array]);
    animateMS(swaps);
}

function animateMS(swaps) {
    if (swaps.length === 0) {
        showBars();
        return;
    }
    const [i, newHeight] = swaps.shift();
    array[i] = newHeight;
    showBars([i]);
    playNote(200 + array[i] * 500);

    setTimeout(function () {
        animateMS(swaps);
    }, 100);
}

function mergeSort(array) {
    const swaps = [];
    function mergeSortRecursive(start, end) {
        if (end - start <= 1) return;
        const mid = Math.floor((start + end) / 2);
        mergeSortRecursive(start, mid);
        mergeSortRecursive(mid, end);
        merge(start, mid, end);
    }

    function merge(start, mid, end) {
        let left = array.slice(start, mid);
        let right = array.slice(mid, end);
        let i = start;
        let l = 0;
        let r = 0;
        while (l < left.length && r < right.length) {
            if (left[l] < right[r]) {
                array[i] = left[l];
                swaps.push([i, left[l]]);
                l++;
            } else {
                array[i] = right[r];
                swaps.push([i, right[r]]);
                r++;
            }
            i++;
        }
        while (l < left.length) {
            array[i] = left[l];
            swaps.push([i, left[l]]);
            l++;
            i++;
        }
        while (r < right.length) {
            array[i] = right[r];
            swaps.push([i, right[r]]);
            r++;
            i++;
        }
    }

    mergeSortRecursive(0, array.length);
    return swaps;
}



/* *********************************************  Animation logic ******************************************* */

function animate(swaps){
    if(swaps.length==0){
        showBars();
        return;
    }
    const [i,j]=swaps.shift(0);
    [array[i],array[j]]=[array[j],array[i]];
    showBars([i,j]);
    playNote(200+array[i]*500);
    playNote(200+array[j]*500);

    setTimeout(function(){
        animate(swaps);
    },100);
}




function showBars(indices){
    container.innerHTML="";
    for(let i=0;i<array.length;i++){
        const bar=document.createElement("div");
        bar.style.height=array[i]*100+"%";
        bar.classList.add("bar");
        if(indices && indices.includes(i)){
            bar.style.backgroundColor="red";
        }
        container.appendChild(bar);
    }   
}


/* ************************** Sound Logic ***************************   */

function playNote(freq){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext || 
            webkitAudioContext || 
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}